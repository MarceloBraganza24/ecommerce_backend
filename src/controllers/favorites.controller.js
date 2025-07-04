import * as favoritesService from '../services/favorites.service.js';
import { ProductExists } from '../utils/custom.exceptions.js';

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
        //console.log(uid)
        const favorite = await favoritesService.getByUserId(uid);
        res.sendSuccess(favorite);
    } catch (error) {
        req.logger.error(error.message);
        res.sendServerError(error.message);
    }
};

/* const addProduct = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const favorites = await favoritesService.getByUserId(userId);
        const alreadyExists = favorites.products.some(p => p.toString() === productId);
        if (alreadyExists) {
            throw new ProductExists(`El producto ya existe en favoritos!`);
        }
        const updatedFavorites = await favoritesService.addProduct(userId, productId);
        res.sendSuccess(updatedFavorites);
    } catch (error) {
        if(error instanceof ProductExists) {
            return res.sendClientError(error.message);
        }
        req.logger.error(error.message);
        res.sendServerError(error.message);
    }
}; */
const addProduct = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const updatedFavorites = await favoritesService.addProduct(userId, productId);
        res.sendSuccess(updatedFavorites);
    } catch (error) {
        if (error instanceof ProductExists) {
            return res.sendClientError(error.message);
        }
        req.logger.error(error.message);
        res.sendServerError(error.message);
    }
};
const removeProduct = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const updatedFavorites = await favoritesService.removeProduct(userId, productId);
        res.sendSuccess(updatedFavorites);
    } catch (error) {
        req.logger.error(error.message);
        res.sendServerError(error.message);
    }
};
const clearFavorites = async (req, res) => {
    try {
        const { userId } = req.body;
        const updatedFavorites = await favoritesService.clearFavorites(userId);
        res.sendSuccess(updatedFavorites);
    } catch (error) {
        req.logger.error(error.message);
        res.sendServerError(error.message);
    }
};
export {
    getById,
    getByUserId,
    removeProduct,
    clearFavorites,
    addProduct
};
