import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { getAll, getById,getByUserId, save, update,updateCartQuantity, eliminate, finalizePurchase } from '../controllers/carts.controller.js'

export default class CartsRouter extends Router {
    init() {
        this.get('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getAll);
        this.get('/:cid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getById);
        this.get('/byUserId/:uid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getByUserId);
        this.post('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, save);
        this.put('/:cid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, update);
        this.patch('/update-quantity', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, updateCartQuantity);
        this.delete('/:cid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, eliminate);
        this.post('/:cid/purchase', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, finalizePurchase);
    }
}