import mongoose from 'mongoose';

const couponsCollection = 'coupons';

const couponsSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    coupon_datetime: {
        type: String,
        required: true
    },
});

export const couponsModel = mongoose.model(couponsCollection, couponsSchema);
