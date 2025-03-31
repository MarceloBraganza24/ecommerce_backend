import mongoose from 'mongoose';

const couponsCollection = 'coupons';

const couponsSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    discount: { 
        type: Number, 
        required: true 
    },
    expiration_date: { 
        type: Date, 
        required: false 
    },
    coupon_datetime: {
        type: String,
        required: true
    },
});

export const couponsModel = mongoose.model(couponsCollection, couponsSchema);
