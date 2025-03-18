import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { getAll, getById, save, update, eliminate, finalizePurchase } from '../controllers/carts.controller.js'

export default class CartsRouter extends Router {
    init() {
        this.get('/', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, getAll);
        this.get('/:cid', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, getById);
        this.post('/', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, save);
        this.put('/:cid', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, update);
        this.delete('/:cid', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, eliminate);
        this.post('/:cid/purchase', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, finalizePurchase);
    }
}