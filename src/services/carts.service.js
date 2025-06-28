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
                //product.number_sales = product.number_sales + quantity // aquí que debo acomodar?
                product.number_sales = Number(product.number_sales || 0) + quantity;
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
}; */
const purchase = async (cid) => {
    const session = await mongoose.startSession();
    const outStock = [];
    let amount = 0;

    try {
        session.startTransaction();
        const cart = await cartsRepository.getById(cid);

        for (const item of cart.products) {
            const { product, quantity, selectedVariant } = item;

            if (selectedVariant) {
                // Si el producto tiene variante seleccionada
                const variantIndex = product.variantes.findIndex(v => v._id.toString() === selectedVariant._id.toString());

                if (variantIndex !== -1) {
                    const variant = product.variantes[variantIndex];

                    if (variant.stock >= quantity) {
                        amount += variant.price * quantity;
                        variant.stock -= quantity;
                        variant.number_sales = Number(variant.number_sales || 0) + quantity;

                        product.variantes[variantIndex] = variant;
                        await productsRepository.update(product._id, product);
                    } else {
                        outStock.push({ product, quantity, selectedVariant });
                    }
                } else {
                    // Variante no encontrada, se considera como sin stock
                    outStock.push({ product, quantity, selectedVariant });
                }

            } else {
                // Producto sin variantes
                if (product.stock >= quantity) {
                    amount += product.price * quantity;
                    product.stock -= quantity;
                    product.number_sales = Number(product.number_sales || 0) + quantity;

                    await productsRepository.update(product._id, product);
                } else {
                    outStock.push({ product, quantity });
                }
            }
        }

        // Actualizar carrito
        if (outStock.length > 0) {
            await cartsRepository.update(cid, {
                products: outStock.map(({ product, quantity, selectedVariant }) => ({
                    product: product._id,
                    quantity,
                    ...(selectedVariant && { selectedVariant })
                }))
            });
        } else {
            await cartsRepository.update(cid, { products: [] });
        }

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