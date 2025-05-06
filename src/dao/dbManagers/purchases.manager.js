import { purchasesModel } from '../dbManagers/models/purchases.model.js'

export default class PurchasesDao {
    getAll = async() => {
        const purchases = await purchasesModel.find().lean();
        return purchases;
    }
    getById = async(id) => {
        const purchase = await purchasesModel.findById(id).lean();
        return purchase;
    }
    save = async(purchase) => {
        const purchaseSaved = await purchasesModel.create(purchase);
        return purchaseSaved;
    }
    eliminate = async (id) => {
        const purchaseEliminated = await purchasesModel.deleteOne({ _id: id });
        return purchaseEliminated;
    }
}