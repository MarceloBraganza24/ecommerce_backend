import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { getById, save,eliminate} from '../controllers/favorites.controller.js';

export default class FavoritesRouter extends Router {
    init() {
        this.get('/:userId', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getById);
        this.post('/:userId', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, save);
        this.delete('/:userId/:productId', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, eliminate);
    }
}