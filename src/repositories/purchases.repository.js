export default class PurchasesRepository {
    constructor(dao) {
        this.dao = dao;
    }
    getAll = async() => {
        const purchases = await this.dao.getAll();
        return purchases;
    }
    getById = async(id) => {
        const purchase = await this.dao.getById(id);
        return purchase;
    }
    save = async(purchase) => {
        const purchaseSaved = await this.dao.save(purchase);
        return purchaseSaved;
    }
    eliminate = async(id) => {
        const purchaseEliminated = await this.dao.eliminate(id);
        return purchaseEliminated;
    }
}