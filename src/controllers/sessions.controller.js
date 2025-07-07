import * as usersService from '../services/users.service.js';
import { UserByEmailExists, InvalidCredentials,ExpiredToken } from "../utils/custom.exceptions.js";
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

const signIn = async (req, res) => {
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
const signInAdmin = async (req, res) => {
    try {
        const { first_name ,last_name, email, password,role,user_datetime } = req.body;
        if(!first_name || !last_name || !email || !password || !role || !user_datetime) return res.sendClientError('incomplete values');
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
        const { email, password } = req.body;
        const last_connection = new Date();
        if( !email || !password) return res.sendClientError('incomplete values');
        const accessToken = await usersService.login(password, email,last_connection);
        res.cookie('TokenJWT', accessToken, {
            httpOnly: true,       // Oculta cookie al frontend (más seguro)
            secure: false,        // IMPORTANTE: en desarrollo no debe estar en true
            sameSite: 'Lax',
            maxAge: 60 * 60 * 1000,
            path: '/',
        });
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
        const token = req.cookies.TokenJWT;
        const last_connection = new Date();
        const userVerified = jwt.verify(token, config.privateKeyJWT);
        const userUpdated = await usersService.logOut(userVerified.user,last_connection)
        res.clearCookie('TokenJWT', {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            path: '/',
        });
        res.sendSuccess({ userUpdated: userUpdated });
    } catch (error) {
        req.logger?.error(error.message);
        res.sendServerError('Error al cerrar sesión');
    }
};
const current = async(req,res) =>{
    try {
        const token = req.cookies.TokenJWT;
        const userVerified = jwt.verify(token, config.privateKeyJWT);
        const userByEmail = await usersService.getByEmail(userVerified.user.email);
        const user = await usersService.getCurrent(userByEmail);
        if(user)return res.sendSuccess(user)
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}
const emailUsercookie = async(req,res) =>{
    try {
        const token = req.cookies.EmailTokenJWT;
        return res.sendSuccess(token)
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}

export {
    signIn,
    signInAdmin,
    login,
    logout,
    emailUsercookie,
    current
}
