import mongoose from 'mongoose';

const deliveryFormCollection = 'deliveryforms';

const deliveryFormSchema = new mongoose.Schema({
    street: {
        type: String,
        required: true,
    },
    street_number: {
        type: String,
        required: true
    },
    locality: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    postal_code: {
        type: String,
        required: true
    },
    dpto: {
        type: String,
        default: ""
    },
    indications: {
        type: String,
        default: ""
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
}, { strict: false });

export const deliveryFormModel = mongoose.model(deliveryFormCollection, deliveryFormSchema);
