import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { getAll, getById, save, update, eliminate } from '../controllers/products.controller.js'
import uploader from "../utils/upload.js";

export default class ProductsRouter extends Router {
    init() {
        this.get('/', [accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM,accessRolesEnum.USER], passportStrategiesEnum.JWT, getAll);
        this.get('/:pid', [accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM,accessRolesEnum.USER], passportStrategiesEnum.JWT, getById);
        this.post('/', [accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM,accessRolesEnum.USER], passportStrategiesEnum.JWT, uploader.array('images', 6), save);
        this.put('/:pid', [accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM,accessRolesEnum.USER], passportStrategiesEnum.JWT, update);
        this.delete('/:pid', [accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM,accessRolesEnum.USER], passportStrategiesEnum.JWT, eliminate);
    }
}