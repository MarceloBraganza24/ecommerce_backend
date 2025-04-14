import mongoose from 'mongoose';

const sellerAddressCollection = 'sellerAddresses';

const sellerAddressSchema = new mongoose.Schema({
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
    sellerAddress_datetime: {
        type: String,
        required: true
    },
});

export const sellerAddressModel = mongoose.model(sellerAddressCollection, sellerAddressSchema);
