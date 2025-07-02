import favoritesService from '../services/favorites.service.js';

const getById = async (req, res) => {
    try {
        const { fid } = req.params;
        const favorite = await favoritesService.getById(fid);
        res.sendSuccess(favorite);
    } catch (error) {
        req.logger.error(error.message);
        res.sendServerError(error.message);
    }
};

const getByUserId = async (req, res) => {
    try {
        const { uid } = req.params;
        const favorite = await favoritesService.getByUserId(uid);
        res.sendSuccess(favorite);
    } catch (error) {
        req.logger.error(error.message);
        res.sendServerError(error.message);
    }
};

const addProduct = async (req, res) => {
    try {
        const { uid } = req.params;
        const { productId } = req.body;

        const updatedFavorites = await favoritesService.addProduct(uid, productId);
        res.sendSuccess(updatedFavorites);
    } catch (error) {
        req.logger.error(error.message);
        res.sendServerError(error.message);
    }
};

export default {
    getById,
    getByUserId,
    addProduct
};
