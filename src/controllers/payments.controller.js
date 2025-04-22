import { MercadoPagoConfig,Payment } from 'mercadopago';

const mpClient = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
    options: { timeout: 5000 }, // opcional
});

const generatePurchase = async (req, res) => {
    try {
        const {
          token,
          payment_method_id,
          transaction_amount,
          installments,
          payer,
        } = req.body;
    
        const paymentData = {
          token,
          payment_method_id,
          transaction_amount: Number(transaction_amount),
          installments: Number(installments),
          description: 'Compra en mi tienda',
          payer: {
            email: payer.email,
            identification: {
              type: payer.identification.type,
              number: payer.identification.number,
            },
          },
        };
    
        const payment = await new Payment(mpClient).create(paymentData);
    
        res.status(200).json(payment);
    } catch (error) {
    console.error('Error al procesar el pago:', error);
    res.status(500).json({ error: 'Error al procesar el pago' });
    }
} 

export {
    generatePurchase
}