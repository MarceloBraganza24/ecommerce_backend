import { cartsModel } from '../dbManagers/models/carts.model.js'

export default class Carts {
    constructor() {
        console.log('Working carts with DB...');
    }
    getAll = async () => {
        const carts = await cartsModel.find().lean();
        return carts;
    }
    getById = async (cid) => {
        const cart = await cartsModel.findOne({ _id: cid }).lean();
        return cart;
    }
    save = async (cart) => {
        const result = await cartsModel.create(cart);
        return result;
    }
    update = async (cid, cartToReplace) => {
        const cartUpdated = await cartsModel.updateOne({ _id: cid }, cartToReplace);
        return cartUpdated;
    }
    eliminate = async (cid) => {
        const cartEliminated = await cartsModel.deleteOne({ _id: cid });
        return cartEliminated;
    }
}