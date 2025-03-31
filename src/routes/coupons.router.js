import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { getAll, getById,getByCode, save,eliminate } from '../controllers/coupons.controller.js';

export default class CouponsRouter extends Router {
    init() {
        this.get('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getAll);
        this.get('/:cid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getById);
        this.post('/validate-coupon', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getByCode);
        this.post('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, save);
        this.delete('/:cid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, eliminate);
    }
}