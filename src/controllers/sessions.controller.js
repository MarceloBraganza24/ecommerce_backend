import * as usersService from '../services/users.service.js';
import { UserByEmailExists, InvalidCredentials } from "../utils/custom.exceptions.js";
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

const singUp = async (req, res) => {
    try {
        const { first_name ,last_name, email, password,user_datetime } = req.body;
        if(!first_name || !last_name || !email || !password || !user_datetime) return res.sendClientError('incomplete values');
        const registeredUser = await usersService.register({ ...req.body });
        res.sendSuccessNewResourse(registeredUser);
    } catch (error) {
        if(error instanceof UserByEmailExists) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}

const login = async (req, res) => {
    try {
        const { email, password, last_connection } = req.body;
        if( !email || !password) return res.sendClientError('incomplete values');
        const accessToken = await usersService.login(password, email,last_connection);
        res.sendSuccess(accessToken);
    } catch (error) {
        if(error instanceof InvalidCredentials) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}

const logout = async (req, res) => {
    try {
        const cookie = req.query.cookie;
        const { last_connection } = req.body;
        const userVerified = jwt.verify(cookie, config.privateKeyJWT);
        const userUpdated = await usersService.logOut(userVerified.user,last_connection)
        res.sendSuccess({ userUpdated: userUpdated });
    } catch (error) {
        if(error instanceof UserAlreadyExists || error instanceof UserByEmailExists) {
            return res.sendClientError(error.message);
        } else {
            res.sendServerError(error.message);
            req.logger.error(error.message);
        }
    }
}

const current = async(req,res) =>{
    try {
        const cookie = req.query.cookie;
        const userVerified = jwt.verify(cookie, config.privateKeyJWT);
        const userByEmail = await usersService.getByEmail(userVerified.user.email);
        const user = await usersService.getCurrent(userByEmail);
        if(user)return res.sendSuccess(user)
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}

export {
    singUp,
    login,
    logout,
    current
}
