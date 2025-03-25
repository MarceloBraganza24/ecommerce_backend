import { productsModel } from '../dbManagers/models/products.model.js'

export default class Products {
    constructor() {
        console.log('Working with products DB');
    }
    getById = async (pid) => {
        const product = await productsModel.findById(pid);
        return product; 
    }
    getAll = async () => {
        const products = await productsModel.find().lean();
        return products; 
    }
    getAllByPage = async (query, { page, limit }) => {
        const products = await productsModel.paginate(query, { page, limit });
        return products; 
    }
    /* getAllByPage = async (page) => {
        const products = await productsModel.paginate({}, {limit: 25, page, lean: true});
        return products; 
    } */
    save = async (product) => {
        const productSaved = await productsModel.create(product);
        return productSaved;
    }
    update = async (pid, productToReplace) => {
        const productUpdated = await productsModel.updateOne({ _id: pid }, productToReplace);
        return productUpdated;
    }
    eliminate = async (pid) => {
        const productEliminated = await productsModel.deleteOne({ _id: pid });
        return productEliminated;
    }
}