import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { getConfig,updateConfig} from '../controllers/settings.controller.js';

export default class SettingsRouter extends Router {
    init() {
        this.get('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getConfig);
        this.put('/:sid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, updateConfig);
    }
}