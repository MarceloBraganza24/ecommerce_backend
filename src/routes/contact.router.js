import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { save } from '../controllers/contact.controller.js';

export default class ContactRouter extends Router {
    init() {
        this.post('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, save);
    }
}