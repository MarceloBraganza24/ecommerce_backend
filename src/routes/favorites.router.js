import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { getById, getByUserId,addProduct,removeProduct} from '../controllers/favorites.controller.js';

export default class FavoritesRouter extends Router {
    init() {
        this.get('/:fid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getById);
        this.get('/user/:uid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getByUserId);
        this.post('/add', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, addProduct);
        this.post('/remove', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, removeProduct);

    }
}