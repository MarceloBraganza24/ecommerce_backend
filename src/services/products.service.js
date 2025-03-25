import ProductsRepository from '../repositories/products.repository.js';
import { Products } from '../dao/factory.js';
import { ProductExists } from '../utils/custom.exceptions.js';

const productsDao = new Products();
const productsRepository = new ProductsRepository(productsDao);

const getById = async(pid) => {
    const product = await productsRepository.getById(pid);
    return product;
}

const getAll = async() => {
    const products = await productsRepository.getAll();
    return products;
}

const getAllByPage = async(query, { page, limit }) => {
    const products = await productsRepository.getAllByPage(query, { page, limit });
    return products;
}
/* const getAllByPage = async(page) => {
    const products = await productsRepository.getAllByPage(page);
    return products;
} */

const save = async(product) => {
    const products = await productsRepository.getAll();
    const exist = products.find(item => item.title == product.title)
    if(exist) {
        throw new ProductExists('There is already a product with that title');
    }
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
    getAllByPage,
    save,
    update,
    eliminate
}