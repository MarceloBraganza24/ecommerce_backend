import * as cartsService from '../services/carts.service.js';

const getAll = async (req, res) => {
    try {
        const carts = await cartsService.getAll();
        res.sendSuccess(carts);
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}

const getById = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartsService.getById(cid);
        res.sendSuccess(cart);
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}

const save = async (req, res) => {
    try {
        const { products } = req.body;
        if(!products) {
            return res.sendClientError('incomplete values');
        }
        const cartSaved = await cartsService.save({products})
        res.sendSuccessNewResourse(cartSaved);
    } catch (error) {
        res.sendServerError(error.message); 
        req.logger.error(error.message);
    }
}

const update = async (req, res) => {
    try {
        const { cid } = req.params;
        const cartToReplace = req.body;
        if(!cartToReplace.products) {
            return res.status(400).send({ status: 'error', message: 'Incomplete values' });
        }
        const updatedCart = await cartsService.update(cid, cartToReplace);
        res.send({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}

const eliminate = async (req, res) => {
    try {
        const { cid } = req.params;
        const deletedCart = await cartsService.eliminate(cid);
        res.send({ status: 'success', payload: deletedCart });
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}

const finalizePurchase = async (req, res) => {
    try {
        const { cid } = req.params;
        const purchaser = req.user.email;
        const purchase = await cartsService.purchase(cid, purchaser);
        res.status(201).send({ status: 'success', purchase: purchase });
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}

export {
    getAll,
    getById,
    save,
    update,
    eliminate,
    finalizePurchase
}