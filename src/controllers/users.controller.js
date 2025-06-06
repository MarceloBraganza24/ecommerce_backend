import config from '../config/config.js';
import * as usersService from '../services/users.service.js';
import { InvalidCredentials, ExpiredToken, UserAlreadyExists, UserByEmailExists } from "../utils/custom.exceptions.js";
import { __mainDirname } from '../utils/utils.js';
import jwt from 'jsonwebtoken';

const getAll = async (req, res) => {
    try {
        const users = await usersService.getAll();
        res.sendSuccess(users);
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }   
}
const finalizePurchase = async (req, res) => {
    try {
        const uid = req.user._id;
        const purchase = await usersService.purchase(uid);
        res.sendSuccess({ status: 'success', purchase: purchase });
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }   
}
const mailToResetPass = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await usersService.getByEmail(email);
        const accessToken = await usersService.sendMailToResetPass(user);
        res.sendSuccess(accessToken);
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}
const resetPass = async (req, res) => {
    try {
        const cookie = req.query.cookie;
        const pass = req.query.password;
        const userVerified = jwt.verify(cookie, config.privateKeyJWT);
        if(!userVerified) {
            throw new ExpiredToken('no token provide');
        } else {
            const userByEmail = await usersService.getByEmail(userVerified.user.email);
            const userUpdated = await usersService.changePass(pass, userByEmail);
            return res.sendSuccess(userUpdated);
        }
    } catch (error) {
        if(error instanceof InvalidCredentials || error instanceof ExpiredToken) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}
const changeRole = async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await usersService.getById(uid);
        if(user.role === 'user') {
            user.documents.forEach(async (document) => {
                if(document.name === 'Identificación' || document.name === 'Comprobante de domicilio' || document.name === 'Comprobante de estado de cuenta') {
                    user.role = 'premium';
                }
            });
            await usersService.update(uid, user);
            res.sendSuccess({ message: 'El rol del usuario fue modificado exitosamente' });
        } else {
            res.sendClientError({ message: 'Solo se puede cambiar a los usuarios con rol "user"' });
        }
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}
const uploadFiles = async (req, res) => {
    try {
        const { uid } = req.params;
        const files = req.files;
        const user = await usersService.getById(uid)
        if(files.profiles){
            files.profiles.forEach(async (properties) => {
                user.documents.push({ name: 'Profiles', reference: `${__mainDirname}/src/public/img/products/${properties.filename}` })
            });
            await usersService.update(uid, user);
        }
        if(files.products) {
            files.products.forEach(async (properties) => {
                user.documents.push({ name: 'Products', reference: `${__mainDirname}/src/public/img/products/${properties.filename}` })
            });
            await usersService.update(uid, user);
        }
        if(files.documents) {
            files.documents.forEach(async (properties) => {
                user.documents.push({ name: 'Documents', reference: `${__mainDirname}/src/public/documents/${properties.filename}` })
            });
            await usersService.update(uid, user);
        }
        if(files.identificacion) {
            files.identificacion.forEach(async (properties) => {
                user.documents.push({ name: 'Identificación', reference: `${__mainDirname}/src/public/documents/${properties.filename}` })
            });
            await usersService.update(uid, user);
        }
        if(files.comprobanteDeDomicilio) {
            files.comprobanteDeDomicilio.forEach(async (properties) => {
                user.documents.push({ name: 'Comprobante de domicilio', reference: `${__mainDirname}/src/public/documents/${properties.filename}` })
            });
            await usersService.update(uid, user);
        }
        if(files.comprobanteDeEstadoDeCuenta) {
            files.comprobanteDeEstadoDeCuenta.forEach(async (properties) => {
                user.documents.push({ name: 'Comprobante de estado de cuenta', reference: `${__mainDirname}/src/public/documents/${properties.filename}` })
            });
            await usersService.update(uid, user);
        }
        res.sendSuccess({ message: 'El almacenamiento se hizo de manera correcta'}); 
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
    
}
const update = async (req, res) => {
    try {
        const uid = req.params.uid;
        const user = req.body;
        const userUpdated = await usersService.update(uid, user)
        res.sendSuccess(userUpdated);
    } catch (error) {
        if(error instanceof UserAlreadyExists || error instanceof UserByEmailExists) {
            return res.sendClientError(error.message);
        } else {
            res.sendServerError(error.message);
            req.logger.error(error.message);
        }
    }
}
const updateProp = async (req, res) => {
    try {
        const {email,prop,prop_value} = req.body;
        const userUpdated = await usersService.updateProp(email,prop,prop_value)
        res.sendSuccess(userUpdated);
    } catch (error) {
        if(error instanceof UserAlreadyExists || error instanceof UserByEmailExists) {
            return res.sendClientError(error.message);
        } else {
            res.sendServerError(error.message);
            req.logger.error(error.message);
        }
    }
}
const updateProps = async (req, res) => {
    try {
        const {first_name,last_name} = req.body;
        const uid = req.params.uid;
        const userUpdated = await usersService.updateProps(uid,first_name,last_name)
        res.sendSuccess(userUpdated);
    } catch (error) {
        if(error instanceof UserAlreadyExists || error instanceof UserByEmailExists) {
            return res.sendClientError(error.message);
        } else {
            res.sendServerError(error.message);
            req.logger.error(error.message);
        }
    }
}
const updateSelectedAddress = async (req, res) => {
    try {
        const { uid } = req.params;
        const { selected_addresses } = req.body;

        console.log(selected_addresses)


        if (!selected_addresses) {
            return res.status(400).json({ message: "No se proporcionó una dirección seleccionada." });
        }

        const updatedUser = await usersService.updateSelectedAddress(uid,{ selected_addresses: selected_addresses },
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        res.json({ message: "Domicilio actualizado correctamente.", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el domicilio.", error: error.message });
    }
};
const eliminateOne = async (req, res) => {
    try {
        const { uid } = req.params;
        const userDeleted = await usersService.eliminateOne(uid);
        res.sendSuccess({message: 'El usuario ha sido eliminado correctamente', data: userDeleted});
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}
const eliminateCartUser = async (req, res) => {
    try {
        const { uid } = req.body;
        const user = await usersService.getById(uid);
        user.carts = [];
        await usersService.update(uid, user);
        res.sendSuccess({message: 'El carrito del usuario ha sido eliminado correctamente'});
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}

export {
    getAll,
    finalizePurchase,
    mailToResetPass,
    resetPass,
    changeRole,
    uploadFiles,
    update,
    updateProp,
    updateSelectedAddress,
    updateProps,
    eliminateOne,
    eliminateCartUser,
}