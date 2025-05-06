import mongoose from 'mongoose';

const purchasesCollection = 'purchases';

const purchasesSchema = new mongoose.Schema({
    mp_payment_id: {
        type: String,
        required: true
    },
    status: String,
    amount: Number,
    payer_email: String,
    items: [
        {
            title: String,
            unit_price: Number,
            quantity: Number
        }
    ],
    shippingAddress: {
        street: String,
        street_number: String,
        locality: String,
        postal_code: String,
        province: String
    },
    deliveryMethod: {
        type: String,
        required: true
    },
    purchase_datetime: {
        type: String,
        required: true
    },
});

export const purchasesModel = mongoose.model(purchasesCollection, purchasesSchema);
