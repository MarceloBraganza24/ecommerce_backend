export default class ProductsRepository {
    constructor(dao) {
        this.dao = dao;
    }
    getById = async(pid) => {
        const product = await this.dao.getById(pid);
        return product;
    }
    getAll = async() => {
        const products = await this.dao.getAll();
        return products;
    }
    getAllByPage = async(query, { page, limit }) => {
        const products = await this.dao.getAllByPage(query, { page, limit });
        return products;
    }
    getIdsByTitle = async(title) => {
        const products = await this.dao.getIdsByTitle(title);
        return products;
    }
    save = async(product) => {
        const productSaved = await this.dao.save(product);
        return productSaved;
    }
    update = async(pid, productToReplace) => {
        const productUpdated = await this.dao.update(pid, productToReplace);
        return productUpdated;
    }
    updatePricesByCategories = async(categories, percentage) => {
        const productsUpdated = await this.dao.updatePricesByCategories(categories, percentage);
        return productsUpdated;
    }
    restorePricesByCategories = async(categories) => {
        const productsUpdated = await this.dao.restorePricesByCategories(categories);
        return productsUpdated;
    }
    eliminate = async(pid) => {
        const productEliminated = await this.dao.eliminate(pid);
        return productEliminated;
    }
}