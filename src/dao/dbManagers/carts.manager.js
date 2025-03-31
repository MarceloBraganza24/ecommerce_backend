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
    getByUserId = async (id) => {
        const cart = await cartsModel.findOne({ user_id: id }).lean();
        return cart;
    }
    save = async (user_id,products) => {
        const result = await cartsModel.create({user_id,products});
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