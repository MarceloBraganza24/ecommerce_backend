import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { createPreferencePurchase,webhookPayment } from '../controllers/payments.controller.js'

export default class PaymentsRouter extends Router {
    init() {
        this.post('/create-preference-purchase', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, createPreferencePurchase);
        this.post('/webhook-payment', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, webhookPayment);
    }
}