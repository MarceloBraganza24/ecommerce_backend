import CategoriesRepository from '../repositories/categories.repository.js';
import { Categories } from '../dao/factory.js';
import { CategoryExists } from '../utils/custom.exceptions.js';

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
const save = async (name, category_datetime, parent = null) => {
    const categories = await categoriesRepository.getAll();
    const exist = categories.find(category => category.name == name)
    if(exist) {
        throw new CategoryExists('There is already a category with that name');
    }
    const categorySaved = await categoriesRepository.save(name, category_datetime,parent);
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