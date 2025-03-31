import CouponsRepository from '../repositories/coupons.repository.js';
import { Coupons } from '../dao/factory.js';
import { CouponExists } from '../utils/custom.exceptions.js';

const couponsDao = new Coupons();
const couponsRepository = new CouponsRepository(couponsDao);

const getAll = async () => {
    const coupons = await couponsRepository.getAll();
    return coupons;
}
const getById = async (id) => {
    const coupon = await couponsRepository.getById(id);
    return coupon;
}
const getByCode = async (codeCoupon) => {
    const coupon = await couponsRepository.getByCode(codeCoupon);
    return coupon;
}
const save = async (coupon) => {
    const coupons = await couponsRepository.getAll();
    const exist = coupons.find(item => item.code == coupon.code)
    if(exist) {
        throw new CouponExists('There is already a coupon with that code');
    }
    const couponSaved = await couponsRepository.save(coupon);
    return couponSaved;
}
const eliminate = async(id) => {
    const couponEliminated = await couponsRepository.eliminate(id);
    return couponEliminated;
}

export {
    getAll,
    getById,
    getByCode,
    save,
    eliminate
}