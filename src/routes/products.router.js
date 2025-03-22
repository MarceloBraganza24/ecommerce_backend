import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { getAll, getById, save, update, eliminate } from '../controllers/products.controller.js'
import uploader from "../utils/upload.js";

export default class ProductsRouter extends Router {
    init() {
        this.get('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getAll);
        this.get('/:pid', [accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM,accessRolesEnum.USER], passportStrategiesEnum.JWT, getById);
        /* this.post('/', [accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM,accessRolesEnum.USER], passportStrategiesEnum.JWT, uploader.array('images', 6), save); */
        this.post('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, uploader.array('images', 6), save);
        this.put('/:pid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, uploader.array('images', 6), update);
        this.delete('/:pid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, eliminate);
    }
}