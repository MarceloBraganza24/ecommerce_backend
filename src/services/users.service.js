import UsersRepository from '../repositories/users.repository.js';
//import * as ticketsService from '../services/tickets.service.js';
import { Users } from '../dao/factory.js';
import { InvalidCredentials, UserAlreadyExists, ExpiredToken, UserByEmailExists } from '../utils/custom.exceptions.js';
import { createHash, generateToken, isValidPassword } from '../utils/utils.js';
import { htmlLoginInvalidCredentials, htmlNewRegister } from '../utils/custom.html.js';
import { sendEmail } from './mail.service.js';
import mongoose from 'mongoose';

const usersDao = new Users();
const usersRepository = new UsersRepository(usersDao);

const getAll = async() => {
    const usersDto = await usersRepository.getAll();
    return usersDto;
}
const getAdmins = async() => {
    const usersDto = await usersRepository.getAdmins();
    return usersDto;
}
const getById = async(uid) => {
    const userById = await usersRepository.getById(uid);
    return userById;
}
const getByEmail = async(email) => {
    const userByEmail = await usersRepository.getByEmail(email);
    if(!userByEmail) {
        throw new InvalidCredentials('user not found');
    }
    return userByEmail; 
}
const getCurrent = async(user) => {
    const current = await usersRepository.getCurrent(user);
    return current;
}
const sendMailToResetPass = async(user) => {
    const userToken = {
        email: user.email
    }
    const accessToken = generateToken(userToken);
    const emailToResetPass = {
        to: user.email,
        subject: 'Link para generar nueva contraseña',
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <h1>Recuperación de contraseña</h1>
            <h2>Accede al siguiente link para ingresar la nueva contraseña</h2>
            <a href="https://google.com">¡has click aquí!</a>
        </body>
        </html>`
    }
    await sendEmail(emailToResetPass);
    return accessToken;
}
const register = async(user) => {
    const userByEmail = await usersRepository.getByEmail(user.email);
    if(userByEmail) {
        throw new UserByEmailExists('There is already a user with that email');
    }
    const hashedPassword = createHash(user.password);
    const newUser = {
        ...user
    }
    newUser.password = hashedPassword;
    /* const emailNewRegister = {
        to: user.email,
        subject: 'Registro exitoso',
        html: htmlNewRegister
    }
    await sendEmail(emailNewRegister); */
    const result = await usersRepository.save(newUser);
    return result;
}
const login = async(password, email,last_connection) => {
    const user = await usersRepository.getByEmail(email);
    if(!user) {
        throw new InvalidCredentials('incorrect credentials');
    }
    const comparePassword = isValidPassword(password, user.password);
    if(!comparePassword) {
        // const emailInvalidCredentials = {
        //     to: user.email,
        //     subject: 'Login fallido',
        //     html: htmlLoginInvalidCredentials
        // }
        // await sendEmail(emailInvalidCredentials);
        throw new InvalidCredentials('incorrect credentials');
    } else {
        user.last_connection = last_connection;
        user.isLoggedIn = true;
        await usersRepository.update(user._id, user);
        const accessToken = generateToken(user);
        return accessToken;
    }
}
const changePass = async(pass, user) => {
    const hashedPassword = createHash(pass);
    const comparePassword = isValidPassword(pass, user.password);
    if(comparePassword) throw new InvalidCredentials('do not enter the same password');
    const userToUpdate = {
        ...user
    }
    userToUpdate.password = hashedPassword;
    await usersRepository.update(user._id, userToUpdate);
    return userToUpdate;
}
const update = async(id, user) => {
    const users = await usersRepository.getAll();
    const userById = await usersRepository.getById(id);
    const userByEmailExists = users.find(item => item.email === user.email)
    if(userById.first_name === user.first_name && userById.last_name === user.last_name && userById.email === user.email && userById.role === user.role) {
        throw new UserAlreadyExists('There is already a user with that data');
    }
    if(userById.first_name !== user.first_name || userById.last_name !== user.last_name || userById.email !== user.email || userById.role !== user.role) {
        if(userByEmailExists && (userByEmailExists._id.toString() !== userById._id.toString())) {
            throw new UserByEmailExists('There is already a user with that email');
        }   
        const userUpdated = await usersRepository.update(id, user);
        return userUpdated;
    }
}
const updateProp = async(email,prop,prop_value) => {
    const userByEmail = await usersRepository.getByEmail(email)
    userByEmail[prop] = prop_value;
    const userUpdated = await usersRepository.update(userByEmail._id, userByEmail);
    return userUpdated;
}
const updateProps = async(uid,first_name,last_name) => {
    const userById = await usersRepository.getById(uid);
    const propsUserUpdated = {
        ...userById,
        first_name:first_name,
        last_name:last_name,
    }
    const userUpdated = await usersRepository.update(uid, propsUserUpdated);
    return userUpdated;
}
const updateSelectedAddress = async(user_id,selected_addresses) => {
    const userById = await usersRepository.getById(user_id);
    
    const propsUserUpdated = {
        ...userById,
        selected_addresses: selected_addresses.selected_addresses,
    }
    const userUpdated = await usersRepository.update(user_id, propsUserUpdated);
    return userUpdated;
}
const logOut = async(user,last_connection) => {
    const newUser = {
        ...user,
        last_connection: last_connection
    }
    if(newUser.isLoggedIn) {
        newUser.isLoggedIn = false;
        const userUpdated = await usersRepository.update(user._id, newUser);
        return userUpdated;
    }
}
const eliminateOne = async(id) => {
    const userDeleted = await usersRepository.eliminate(id);
    return userDeleted;
}

let amount = 0;
const outStock = [];
const purchase = async(uid) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const user = await usersRepository.getById(uid);
        const cart = user.carts;
        cart.forEach(async ({ product, quantity }) => {
            if(product.stock >= quantity) {
                amount += product.price * quantity;
                product.stock -= quantity;
                await productsRepository.update(product._id, product)
            } else {
                outStock.push({ product, quantity });
            }
            return outStock;
        })
        const purchaser = user.email;
        const ticket = await ticketsService.save(purchaser, amount);
        user.carts = outStock.map(item => ({...item}));
        await usersRepository.update(uid, user);
        await session.commitTransaction();
        return ticket;
    } catch (error) {
        await session.abortTransaction();
    } finally {
        session.endSession();
    }
}

export {
    getAll,
    getAdmins,
    getById,
    getCurrent,
    getByEmail,
    sendMailToResetPass,
    register,
    login,
    changePass,
    update,
    updateProp,
    updateSelectedAddress,
    updateProps,
    logOut,
    eliminateOne,
    purchase
}