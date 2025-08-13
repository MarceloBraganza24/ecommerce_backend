import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { signIn,signInAdmin, login, logout, current,refreshToken } from '../controllers/sessions.controller.js';
import { authenticateToken } from '../utils/authenticateToken.js';

export default class SessionsRouter extends Router {
    init() {
        this.post('/refresh', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, refreshToken);
        this.post('/signIn', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, signIn);
        this.post('/signInAdmin', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, signInAdmin);
        this.post('/login', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, login);
        this.post('/logout', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, logout);
        this.get('/current', authenticateToken, [accessRolesEnum.USER,accessRolesEnum.ADMIN,accessRolesEnum.PREMIUM], passportStrategiesEnum.NOTHING, current);
    }
}