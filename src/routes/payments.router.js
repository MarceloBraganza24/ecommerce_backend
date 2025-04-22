import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { generatePurchase } from '../controllers/payments.controller.js'

export default class PaymentsRouter extends Router {
    init() {
        this.post('/generate-purchase', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, generatePurchase);
    }
}