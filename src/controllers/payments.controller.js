import { MercadoPagoConfig, Preference,Payment  } from 'mercadopago'; // Asegurate de tener esta importación
import config from '../config/config.js';
import * as ticketsService from '../services/tickets.service.js';
import * as cartsService from '../services/carts.service.js';

const client = new MercadoPagoConfig({ accessToken: config.access_token_mp });

const createPreferencePurchase = async (req, res) => {
    try {
        const { items,user,shippingAddress,deliveryMethod,discount,user_cart_id } = req.body;

        const itemsFormateados = items.map(item => ({
            id: item.product._id,
            title: item.product.title,
            unit_price: Number(item.product.price),
            quantity: item.quantity,
            currency_id: "ARS"
        }));
          
        if(discount) {

            const subtotal = itemsFormateados.reduce((acc, item) => {
                return acc + (item.unit_price * item.quantity);
            }, 0);
            const montoDescuento = Number(((subtotal * discount) / 100).toFixed(2));

            if (montoDescuento > 0) {
                itemsFormateados.push({
                    title: `Descuento ${discount}%`,
                    unit_price: -montoDescuento,
                    quantity: 1,
                    currency_id: 'ARS'
                });
            }
            
        }
          
        const preferenceData = {
            items: itemsFormateados,
            payer: { email: user.email },
            metadata: {
                shippingAddress,
                deliveryMethod,
                user_cart_id,
                user_id: user._id,
            },
            back_urls: {
                success: 'https://google.com',
                failure: 'https://google.com',
                pending: 'https://google.com'
            },
            auto_return: "approved"
        };

        const preference = new Preference(client);
        const response = await preference.create({ body: preferenceData });

        res.status(200).json({ init_point: response.init_point });
    } catch (error) {
        console.error("Error al crear preferencia:", error);
        res.status(500).json({ error: "No se pudo crear la preferencia" });
    }
};

const webhookPayment = async (req, res) => {
    try {
        const { type, 'data.id': paymentId } = req.query;
  
        if (type === 'payment' && paymentId) {
            const paymentClient = new Payment(client);
            const payment = await paymentClient.get({ id: paymentId });
  
            if (payment.status === 'approved') {
                const items = payment.additional_info?.items || [];
                const shippingAddress = payment.metadata?.shipping_address;
                const deliveryMethod = payment.metadata?.delivery_method;
                const user_cart_id = payment.metadata?.user_cart_id;
                const user_id = payment.metadata?.user_id;

                const newTicket = {
                    mp_payment_id: payment.id,
                    status: payment.status,
                    amount: payment.transaction_amount,
                    payer_email: payment.payer.email,
                    items,
                    shippingAddress,
                    deliveryMethod,
                    purchase_datetime: payment.date_created
                }
                const ticketSaved = await ticketsService.save(newTicket);
                await cartsService.purchase(user_cart_id,user_id);
                //await cartsService.eliminate(user_id);
                //console.log(`Pago aprobado y guardado: ${payment.id}`);
                return res.sendSuccessNewResourse(ticketSaved);
            }
        }
  
        res.sendStatus(200); // Mercado Pago necesita un 200 OK
    } catch (error) {
        console.error('Error en webhook:', error);
        res.sendStatus(500);
    }
};

export {
    createPreferencePurchase,
    webhookPayment
}
