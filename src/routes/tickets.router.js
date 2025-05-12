import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { getAll, getById, save,getAllByPage,getAllByPageAndEmail,saveSale,eliminate } from '../controllers/tickets.controller.js';

export default class TicketsRouter extends Router {
    init() {
        this.get('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getAll);
        this.get('/byPage', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getAllByPage);
        this.get('/byPageAndEmail', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getAllByPageAndEmail);
        this.get('/:tid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getById);
        this.post('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, save);
        this.post('/saveSale', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, saveSale);
        this.delete('/:tid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, eliminate);
    }
}