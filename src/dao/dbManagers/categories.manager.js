import { categoriesModel } from '../dbManagers/models/categories.model.js'

export default class CategoriesDao {
    getAll = async() => {
        const categories = await categoriesModel.find().lean();
        return categories;
    }
    getById = async(id) => {
        const category = await categoriesModel.findById(id).lean();
        return category;
    }
    save = async(name, category_datetime) => {
        const categorySaved = await categoriesModel.create({ name: name, category_datetime: category_datetime });
        return categorySaved;
    }
    eliminate = async (cid) => {
        const categoryEliminated = await categoriesModel.deleteOne({ _id: cid });
        return categoryEliminated;
    }
}