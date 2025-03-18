import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import {  getAll, mailToResetPass, resetPass, uploadFiles, update, updateProp,updateProps, eliminateOne } from '../controllers/users.controller.js'
import { uploader } from "../utils/utils.js";

export default class UsersRouter extends Router {
    init() {
        this.get('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getAll);
        this.delete('/delete-one/:uid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, eliminateOne);
        this.put('/:uid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, update);
        this.put('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, updateProp);
        this.patch('/props/:uid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, updateProps);
        this.post('/password-link', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, mailToResetPass);
        this.post('/reset-pass', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, resetPass);
        this.post('/:uid/documents', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, uploader.fields(
            [
                {name: 'profiles', maxCount: 1},
                {name: 'products', maxCount: 1},
                {name: 'documents', maxCount: 3},
                {name: 'identificacion', maxCount: 1},
                {name: 'comprobanteDeDomicilio', maxCount: 1},
                {name: 'comprobanteDeEstadoDeCuenta', maxCount: 1}
            ]), uploadFiles);
    }
}