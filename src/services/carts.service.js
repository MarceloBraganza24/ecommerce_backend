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
const getByUserId = async(uid) => {
    const cartById = await cartsRepository.getByUserId(uid);
    return cartById;
}
const save = async(user_id,products) => {
    const cartSaved = await cartsRepository.save(user_id,products);
    return cartSaved;
}
const update = async(cid, cartToReplace) => {
    const cartUpdated = await cartsRepository.update(cid, cartToReplace);
    return cartUpdated;
}
const eliminate = async(user_id) => {
    const cartEliminated = await cartsRepository.eliminate(user_id);
    return cartEliminated;
}

/* let amount = 0;
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
        //const ticket = await ticketsService.save(purchaser, amount);
        await cartsRepository.update(cid, outStock);
        await session.commitTransaction();
        //return ticket;
    } catch (error) {
        await session.abortTransaction();
    } finally {
        session.endSession();
    }
} */
let amount = 0;

const purchase = async (cid) => {
    const session = await mongoose.startSession();
    const outStock = [];
    try {
        session.startTransaction();

        const cart = await cartsRepository.getById(cid);

        for (const { product, quantity } of cart.products) {
            if (product.stock >= quantity) {
                amount += product.price * quantity;
                product.stock -= quantity;
                await productsRepository.update(product._id, product);
            } else {
                outStock.push({ product, quantity });
            }
        }

        // Actualizar carrito: vaciar si todo fue comprado, o dejar los que quedaron sin stock
        if (outStock.length > 0) {
            await cartsRepository.update(cid, {
                products: outStock.map(({ product, quantity }) => ({
                    product: product._id,
                    quantity
                }))
            });
        } else {
            await cartsRepository.update(cid, { products: [] });
        }

        // const ticket = await ticketsService.save(purchaser, amount);
        await session.commitTransaction();
        return outStock;

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};
    

export {
    getAll,
    getById,
    getByUserId,
    save,
    update,
    eliminate,
    purchase
}