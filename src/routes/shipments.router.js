import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { save } from '../controllers/shipments.controller.js'

export default class ShipmentsRouter extends Router {
    init() {
        this.post('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, save);
    }
}