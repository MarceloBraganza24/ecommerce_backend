import * as couponsService from '../services/coupons.service.js';
import { CouponExists } from '../utils/custom.exceptions.js';

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

const save = async (req, res) => {
    try {
        const { code  } = req.body;
        const coupon = {
            code,
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
        const coupon = await couponsService.getById(cid);
        /* if (!coupons) {
            return res.status(404).json({ message: 'Domicilio no encontrado' });
        } */
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
    save,
    eliminate
}