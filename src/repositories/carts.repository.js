export default class CartsRepository {
    constructor(dao) {
        this.dao = dao;
    }
    getAll = async() => {
        const carts = await this.dao.getAll();
        return carts;
    }
    getById = async(cid) => {
        const cart = await this.dao.getById(cid);
        return cart;
    }
    save = async(cart) => {
        const cartSaved = await this.dao.save(cart);
        return cartSaved;
    }
    update = async(cid, cartToReplace) => {
        const cartUpdated = await this.dao.update(cid, cartToReplace);
        return cartUpdated;
    }
    eliminate = async(cid) => {
        const cartEliminated = await this.dao.eliminate(cid);
        return cartEliminated;
    }
}