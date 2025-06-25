import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { getAll, getById,getByUserId, save, update,updateProductQuantity,removeProductFromCart, eliminate, finalizePurchase } from '../controllers/carts.controller.js'

export default class CartsRouter extends Router {
    init() {
        this.get('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getAll);
        this.get('/:cid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getById);
        this.get('/byUserId/:uid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getByUserId);
        this.post('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, save);
        this.put('/:cid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, update);
        this.put('/update-quantity/:uid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, updateProductQuantity);
        this.delete('/:user_id', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, eliminate);
        this.post("/remove-product/:user_id/:product_id", [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, removeProductFromCart);
        this.post('/:cid/purchase', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, finalizePurchase);
    }
}