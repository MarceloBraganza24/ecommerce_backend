import { MercadoPagoConfig, Preference,Payment  } from 'mercadopago'; // Asegurate de tener esta importación
import config from '../config/config.js';
import * as ticketsService from '../services/tickets.service.js';
import * as cartsService from '../services/carts.service.js';
import * as productsService from '../services/products.service.js';

const client = new MercadoPagoConfig({ accessToken: config.access_token_mp });

const createPreferencePurchase = async (req, res) => {
    try {
        const { items,user,shippingAddress,deliveryMethod,discount,user_cart_id } = req.body;

        const itemsToSave = items.map(item => ({
            id: item.product._id,
            title: item.product.title,
            unit_price: Number(item.selectedVariant?.price ?? item.product.price),
            quantity: item.quantity,
            currency_id: "ARS",
            images: item.product.images,
            variantes: item.selectedVariant?.campos || null,
        }));

        const itemsFormateados = items.map(item => ({
            id: item.product._id,
            title: item.product.title,
            unit_price: Number(item.selectedVariant?.price ?? item.product.price),
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
                items_to_save: itemsToSave,
                user_role: user.role
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
                const items = payment.metadata?.items_to_save;
                const shippingAddress = payment.metadata?.shipping_address;
                const deliveryMethod = payment.metadata?.delivery_method;
                const user_cart_id = payment.metadata?.user_cart_id;
                const user_role = payment.metadata?.user_role;

                /* const itemsFiltered = await Promise.all(items.map(async item => {
                    const productData = await productsService.getById(item.id); // Buscamos el producto completo
                    const variant = item.selectedVariant;

                    return {
                        product: productData.id,
                        quantity: parseInt(item.quantity, 10),
                        selectedVariant: variant ?? undefined,
                        snapshot: {
                            title: productData.title,
                            price: variant?.price ?? productData.price,
                            image: productData.images?.[0] ?? null,
                        }
                    };
                })); */
                const itemsFiltered = await Promise.all(items.map(async item => {
                    const productData = await productsService.getById(item.id);
                    const variant = item.selectedVariant;

                    const snapshot = {
                        title: productData.title,
                        price: variant?.price ?? productData.price,
                        image: productData.images?.[0] ?? null,
                    };

                    if (variant) {
                        snapshot.variant = {
                            campos: variant.campos || {},
                            price: variant.price,
                            stock: variant.stock
                        };
                    }

                    return {
                        product: productData.id,
                        quantity: parseInt(item.quantity, 10),
                        selectedVariant: variant ?? undefined,
                        snapshot
                    };
                }));


                const newTicket = {
                    mp_payment_id: payment.id,
                    status: payment.status,
                    amount: payment.transaction_amount,
                    payer_email: payment.payer.email,
                    items: itemsFiltered,
                    shippingAddress,
                    deliveryMethod,
                    purchase_datetime: payment.date_created,
                    user_role: user_role ?? 'user'
                };

                const ticketSaved = await ticketsService.save(newTicket);
                await cartsService.purchase(user_cart_id);
                console.log(`✅ Pago aprobado y ticket generado: ${payment.id}`);

                return res.sendSuccessNewResourse(ticketSaved);
            }
        }

        res.sendStatus(200); // Mercado Pago requiere 200 OK
    } catch (error) {
        console.error('❌ Error en webhook:', error);
        res.sendStatus(500);
    }
};


export {
    createPreferencePurchase,
    webhookPayment
}
