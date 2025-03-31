export default class CouponsRepository {
    constructor(dao) {
        this.dao = dao;
    }
    getAll = async() => {
        const coupons = await this.dao.getAll();
        return coupons;
    }
    getById = async(id) => {
        const coupon = await this.dao.getById(id);
        return coupon;
    }
    getByCode = async(codeCoupon) => {
        const coupon = await this.dao.getByCode(codeCoupon);
        return coupon;
    }
    save = async(coupon) => {
        const couponSaved = await this.dao.save(coupon);
        return couponSaved;
    }
    eliminate = async(id) => {
        const couponEliminated = await this.dao.eliminate(id);
        return couponEliminated;
    }
}