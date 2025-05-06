import PurchasesRepository from '../repositories/purchases.repository.js';
import { Purchases } from '../dao/factory.js';
import { PurchaseExists } from '../utils/custom.exceptions.js';

const purchasesDao = new Purchases();
const purchasesRepository = new PurchasesRepository(purchasesDao);

const getAll = async () => {
    const purchases = await purchasesRepository.getAll();
    return purchases;
}
const getById = async (id) => {
    const purchase = await purchasesRepository.getById(id);
    return purchase;
}
const save = async (purchase) => {
    //const purchases = await purchasesRepository.getAll();
    //const exist = purchases.find(item => item.code == purchase.code)

    // const exist = await purchasesRepository.getById(purchase._id);
    // if(exist) {
    //     throw new PurchaseExists('There is already a purchase with that id');
    // }
    const purchaseSaved = await purchasesRepository.save(purchase);
    return purchaseSaved;
}
const eliminate = async(id) => {
    const purchaseEliminated = await purchasesRepository.eliminate(id);
    return purchaseEliminated;
}

export {
    getAll,
    getById,
    save,
    eliminate
}