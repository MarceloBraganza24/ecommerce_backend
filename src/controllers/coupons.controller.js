import * as couponsService from '../services/coupons.service.js';
import { CouponExists,ExpiredCoupon } from '../utils/custom.exceptions.js';

const getAll = async (req, res) => {
    try {
        const coupons = await couponsService.getAll();
        res.sendSuccess(coupons);
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}
const getById = async (req, res) => {
    try {
        const { cid } = req.params;            
        const coupon = await couponsService.getById(cid);
        res.sendSuccess(coupon);
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}
const getByCode = async (req, res) => {
    try {
        const { codeCoupon } = req.body;

        if (!codeCoupon) {
            return res.status(400).json({ mensaje: "Código de cupón requerido." });
        }

        const coupon = await couponsService.getByCode(codeCoupon);

        if (!coupon) {
            return res.status(400).json({ mensaje: "Código de cupón no existe." });
        }

        const now = new Date();
        if (coupon.expiration_date < now) {
            throw new ExpiredCoupon('coupon has expired');
        }

        res.sendSuccess(coupon);

    } catch (error) {
        if(error instanceof ExpiredCoupon) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
};
const save = async (req, res) => {
    try {
        const { code,discount,expiration_date } = req.body;
        const coupon = {
            code,
            discount,
            expiration_date,
            coupon_datetime: req.body.coupon_datetime
        }
        const couponSaved = await couponsService.save(coupon);
        res.sendSuccessNewResourse(couponSaved);
    } catch (error) {
        if(error instanceof CouponExists) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}
const eliminate = async (req, res) => {
    try {
        const { cid } = req.params;
        const deletedCoupon = await couponsService.eliminate(cid);
        res.sendSuccessNewResourse(deletedCoupon);

    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}

export {
    getAll,
    getById,
    getByCode,
    save,
    eliminate
}