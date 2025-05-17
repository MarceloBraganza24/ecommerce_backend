import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { emailFromUserToAdmin } from '../controllers/contact.controller.js';

export default class ContactRouter extends Router {
    init() {
        this.post('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, emailFromUserToAdmin);
    }
}