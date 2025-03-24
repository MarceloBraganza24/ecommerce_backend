export default class CategoriesRepository {
    constructor(dao) {
        this.dao = dao;
    }
    getAll = async() => {
        const categories = await this.dao.getAll();
        return categories;
    }
    getById = async(cid) => {
        const category = await this.dao.getById(cid);
        return category;
    }
    save = async(name, category_datetime) => {
        const categorySaved = await this.dao.save(name, category_datetime);
        return categorySaved;
    }
    eliminate = async(cid) => {
        const categoryEliminated = await this.dao.eliminate(cid);
        return categoryEliminated;
    }
}