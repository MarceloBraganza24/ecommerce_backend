import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import {  getAll,getAdmins, mailToResetPass, resetPass, uploadFiles, update,updateUser, updateProp,updateProps,updateSelectedAddress, eliminateOne } from '../controllers/users.controller.js'
import { uploader } from "../utils/utils.js";

export default class UsersRouter extends Router {
    init() {
        this.get('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getAll);
        this.get('/getAdmins', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getAdmins);
        this.delete('/delete-one/:uid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, eliminateOne);
        this.put('/:uid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, update);
        this.put('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, updateProp);
        this.put('/address-selected/:uid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, updateSelectedAddress);
        this.patch('/:uid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, updateUser);
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