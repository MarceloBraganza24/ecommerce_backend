import * as categoriesService from '../services/categories.service.js';
import { CategoryExists } from '../utils/custom.exceptions.js';

const getAll = async (req, res) => {
    try {
        const categories = await categoriesService.getAll();
        res.sendSuccess(categories);
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}
const getById = async (req, res) => {
    try {
        const { tid } = req.params;            
        const category = await categoriesService.getById(tid);
        res.sendSuccess(category);
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}
/* const save = async (req, res) => {
    try {
        const { name, category_datetime  } = req.body;
        const category = await categoriesService.save(name, category_datetime);
        res.sendSuccessNewResourse(category);
    } catch (error) {
        if(error instanceof CategoryExists) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
} */
const save = async (req, res) => {
    try {
        const { name, category_datetime, parent } = req.body; // <-- agregamos parent
        const category = await categoriesService.save(name, category_datetime, parent);
        res.sendSuccessNewResourse(category);
    } catch (error) {
        if(error instanceof CategoryExists) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}
const eliminate = async (req, res) => {
    try {
        const { cid } = req.params;
        const category = await categoriesService.getById(cid);
        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        const deletedCategory = await categoriesService.eliminate(cid);
        res.sendSuccessNewResourse(deletedCategory);

    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}

export {
    getAll,
    getById,
    save,
    eliminate
}