import { couponsModel } from '../dbManagers/models/coupons.model.js'

export default class CouponsDao {
    getAll = async() => {
        const coupons = await couponsModel.find().lean();
        return coupons;
    }
    getById = async(id) => {
        const coupon = await couponsModel.findById(id).lean();
        return coupon;
    }
    getByCode = async (codeCoupon) => {
        const coupon = await couponsModel.findOne({ code: codeCoupon }).lean();
        return coupon;
    };
    save = async(coupon) => {
        const couponSaved = await couponsModel.create(coupon);
        return couponSaved;
    }
    eliminate = async (id) => {
        const couponEliminated = await couponsModel.deleteOne({ _id: id });
        return couponEliminated;
    }
}