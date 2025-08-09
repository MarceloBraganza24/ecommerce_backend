import * as usersService from '../services/users.service.js';
import { UserByEmailExists, InvalidCredentials,ExpiredToken } from "../utils/custom.exceptions.js";
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { generateToken } from '../utils/utils.js';

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
const refreshToken = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ status: 'error', error: 'No token provided' });
        }
        let decoded;
        try {
            decoded = jwt.verify(token, config.privateKeyJWT);
        } catch (err) {
            return res.status(403).json({ status: 'error', error: 'Invalid or expired token' });
        }
        const user = decoded.user;
        if (!user || !user.email) {
            return res.status(400).json({ status: 'error', error: 'Invalid token payload' });
        }
        const userByEmail = await usersService.getByEmail(user.email);
        // Opcional: podrías volver a buscar el usuario en la DB si querés un token más actualizado
        const newAccessToken = generateToken(userByEmail);
        return res.sendSuccess({ token: newAccessToken });

    } catch (error) {
        req.logger?.error(error.message);
        res.sendServerError('Error al renovar el token');
    }
};
/* const login = async (req, res) => {
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
} */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const last_connection = new Date();
        if( !email || !password) return res.sendClientError('incomplete values');
        const accessToken = await usersService.login(password, email,last_connection);
        res.sendSuccess({ token: accessToken });
    } catch (error) {
        if(error instanceof InvalidCredentials) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}
/* const logout = async (req, res) => {
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
}; */
const logout = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1];
        const last_connection = new Date();

        if (!token) {
            return res.status(401).json({ status: 'error', error: 'No token provided' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, config.privateKeyJWT);
        } catch (err) {
            return res.status(403).json({ status: 'error', error: 'Invalid or expired token' });
        }

        const user = decoded.user;
        if (!user || !user.email) {
            return res.status(400).json({ status: 'error', error: 'Invalid token payload' });
        }

        const userUpdated = await usersService.logOut(user, last_connection);

        res.sendSuccess({ userUpdated });
    } catch (error) {
        req.logger?.error(error.message);
        res.sendServerError('Error al cerrar sesión');
    }
};
/* const current = async(req,res) =>{
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
} */
const current = async(req,res) =>{
    try {
        const userFromToken = req.user; // lo inyectó el middleware
        const userByEmail = await usersService.getByEmail(userFromToken.email);
        const user = await usersService.getCurrent(userByEmail);
        if (user) return res.sendSuccess(user);
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
    refreshToken,
    signInAdmin,
    login,
    logout,
    emailUsercookie,
    current
}
