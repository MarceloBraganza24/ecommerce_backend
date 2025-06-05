export default class ProductsRepository {
    constructor(dao) {
        this.dao = dao;
    }
    /* getById = async(pid) => {
        const product = await this.dao.getById(pid);
        return product;
    } */
    /* getById = async(pid, session = null) => {
        const query = await this.dao.getById(pid);
        if (session) query.session(session);
        const product = await query;
        return product;
    } */
    /* getById = async (pid, session = null) => {
        let query = this.dao.getById(pid); // 🔄 sin await
        if (session) query = query.session(session); // ✅ aplicar session a la query
        const product = await query; // ahora sí ejecutás la query
        return product;
    }; */
    getById = async (pid, session = null) => {
        return await this.dao.getById(pid, session);
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
    getDeleted = async() => {
        const products = await this.dao.getDeleted();
        return products;
    }
    getAllByPage = async(query, { page, limit }) => {
        const products = await this.dao.getAllByPage(query, { page, limit });
        return products;
    }
    getAllBy = async (query, { page, limit, sort }) => {
        return await this.dao.getAllBy(query, { page, limit, sort });
    };
    getIdsByTitle = async(title) => {
        const products = await this.dao.getIdsByTitle(title);
        return products;
    }
    save = async(product) => {
        const productSaved = await this.dao.save(product);
        return productSaved;
    }
    /* update = async(pid, productToReplace) => {
        const productUpdated = await this.dao.update(pid, productToReplace);
        return productUpdated;
    } */
    /* update = async(pid, productToReplace, session = null) => {
        const query = await this.dao.update(pid, productToReplace);
        //const query = productsModel.updateOne({ _id: pid }, productToReplace);
        if (session) query.session(session);
        const productUpdated = await query;
        return productUpdated;
    } */
    /* update = async(pid, productToReplace, session = null) => {
        let query = this.dao.update(pid, productToReplace);
        if (session) query = query.session(session);
        const productUpdated = await query;
        return productUpdated;
    }; */
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