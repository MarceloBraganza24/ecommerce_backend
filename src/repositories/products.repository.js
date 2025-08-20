export default class ProductsRepository {
    constructor(dao) {
        this.dao = dao;
    }
    getById = async (pid, session = null) => {
        return await this.dao.getById(pid, session);
    };
    getByIdIncludeDeleted = async (pid, session = null) => {
        return await this.dao.getByIdIncludeDeleted(pid, session);
    };
    updateSoftDelete = async(pid) => {
        const productsUpdated = await this.dao.updateSoftDelete(pid);
        return productsUpdated;
    }
    updateRestoreProduct = async(pid) => {
        const productsUpdated = await this.dao.updateRestoreProduct(pid);
        return productsUpdated;
    }
    getAll = async() => {
        const products = await this.dao.getAll();
        return products;
    }
    getDeleted = async(query) => {
        const products = await this.dao.getDeleted(query);
        return products;
    }
    getAllByPage = async(query, { page, limit }) => {
        const products = await this.dao.getAllByPage(query, { page, limit });
        return products;
    }
    navbarSearch = async(query) => {
        const products = await this.dao.navbarSearch(query);
        return products;
    }
    groupedByCategory = async(limit) => {
        const products = await this.dao.groupedByCategory(limit);
        return products;
    }
    getAllBy = async (query, { page, limit, sort }) => {
        return await this.dao.getAllBy(query, { page, limit, sort });
    };
    getAllByRaw = async (query) => {
        return await this.dao.getAllByRaw(query);
    };
    getIdsByTitle = async(title) => {
        const products = await this.dao.getIdsByTitle(title);
        return products;
    }
    save = async(product) => {
        const productSaved = await this.dao.save(product);
        return productSaved;
    }
    update = async (pid, productToReplace, session = null) => {
        return await this.dao.update(pid, productToReplace, session);
    };
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
    massDelete = async(ids) => {
        const productsEliminated = await this.dao.massDelete(ids);
        return productsEliminated;
    }
    massDeletePermanent = async(ids) => {
        const productsEliminated = await this.dao.massDeletePermanent(ids);
        return productsEliminated;
    }
    massRestore = async(ids) => {
        const productsEliminated = await this.dao.massRestore(ids);
        return productsEliminated;
    }
}