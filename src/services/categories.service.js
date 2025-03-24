import CategoriesRepository from '../repositories/categories.repository.js';
import { Categories } from '../dao/factory.js';

const categoriesDao = new Categories();
const categoriesRepository = new CategoriesRepository(categoriesDao);

const getAll = async () => {
    const categories = await categoriesRepository.getAll();
    return categories;
}
const getById = async (id) => {
    const category = await categoriesRepository.getById(id);
    return category;
}
const save = async (name, category_datetime) => {
    const categorySaved = await categoriesRepository.save(name, category_datetime);
    return categorySaved;
}
const eliminate = async(cid) => {
    const categoryEliminated = await categoriesRepository.eliminate(cid);
    return categoryEliminated;
}

export {
    getAll,
    getById,
    save,
    eliminate
}