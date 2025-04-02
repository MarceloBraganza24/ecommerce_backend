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
    getByUserId = async(id) => {
        const cart = await this.dao.getByUserId(id);
        return cart;
    }
    save = async(user_id,products) => {
        const cartSaved = await this.dao.save(user_id,products);
        return cartSaved;
    }
    update = async(cid, cartToReplace) => {
        const cartUpdated = await this.dao.update(cid, cartToReplace);
        return cartUpdated;
    }
    eliminate = async(user_id) => {
        const cartEliminated = await this.dao.eliminate(user_id);
        return cartEliminated;
    }
}