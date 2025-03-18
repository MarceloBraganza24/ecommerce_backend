import ProductsRepository from '../repositories/products.repository.js';
import { Products } from '../dao/factory.js';

const productsDao = new Products();
const productsRepository = new ProductsRepository(productsDao);

const getById = async(pid) => {
    const product = await productsRepository.getById(pid);
    return product;
}

const getAll = async(page) => {
    const products = await productsRepository.getAll(page);
    return products;
}
const save = async(product) => {
    const productSaved = await productsRepository.save(product);
    return productSaved;
}
const update = async(pid, productToReplace) => {
    const productUpdated = await productsRepository.update(pid, productToReplace);
    return productUpdated;
}
const eliminate = async(pid) => {
    const productEliminated = await productsRepository.eliminate(pid);
    return productEliminated;
}

export {
    getById,
    getAll,
    save,
    update,
    eliminate
}