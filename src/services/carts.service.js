import ProductsRepository from '../repositories/products.repository.js';
import CartsRepository from '../repositories/carts.repository.js';
import { Carts, Products } from '../dao/factory.js';
import * as ticketsService from '../services/tickets.service.js';
import mongoose from 'mongoose';

const cartsDao = new Carts();
const cartsRepository = new CartsRepository(cartsDao);
const productsDao = new Products();
const productsRepository = new ProductsRepository(productsDao);

const getAll = async() => {
    const carts = await cartsRepository.getAll();
    return carts;
}
const getById = async(cid) => {
    const cartById = await cartsRepository.getById(cid);
    return cartById;
}
const save = async(cart) => {
    const cartSaved = await cartsRepository.save(cart);
    return cartSaved;
}
const update = async(cid, cartToReplace) => {
    const cartUpdated = await cartsRepository.update(cid, cartToReplace);
    return cartUpdated;
}
const eliminate = async(cid) => {
    const cartEliminated = await cartsRepository.eliminate(cid);
    return cartEliminated;
}

let amount = 0;
const outStock = [];

const purchase = async (cid, purchaser) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const cart = await cartsRepository.getById(cid);
        cart.products.forEach(async ({ product, quantity }) => {
            if(product.stock >= quantity) {
                amount += product.price * quantity;
                product.stock -= quantity;
                await productsRepository.update(product._id, product)
            } else {
                outStock.push({ product, quantity });
            }
            return outStock;
        })
        const ticket = await ticketsService.save(purchaser, amount);
        await cartsRepository.update(cid, outStock);
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
    getById,
    save,
    update,
    eliminate,
    purchase
}