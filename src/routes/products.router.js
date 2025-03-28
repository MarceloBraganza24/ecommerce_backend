import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { getAll,getAllByPage,getAllBy, getById, save, update, eliminate } from '../controllers/products.controller.js'
import uploader from "../utils/upload.js";

export default class ProductsRouter extends Router {
    init() {
        this.get('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getAll);
        this.get('/byPage', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getAllByPage);
        this.get('/by', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getAllBy);
        this.get('/:pid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getById);
        this.post('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, uploader.array('images', 6), save);
        this.put('/:pid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, uploader.array('images', 6), update);
        this.delete('/:pid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, eliminate);
    }
}