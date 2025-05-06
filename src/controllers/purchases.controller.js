import * as purchasesService from '../services/purchases.service.js';
import { PurchaseExists } from '../utils/custom.exceptions.js';

const getAll = async (req, res) => {
    try {
        const purchases = await purchasesService.getAll();
        res.sendSuccess(purchases);
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}

const getById = async (req, res) => {
    try {
        const { pid } = req.params;            
        const purchase = await purchasesService.getById(pid);
        res.sendSuccess(purchase);
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}

const save = async (req, res) => {
    try {
        const { mp_payment_id,status,amount,payer_email,shippingAddress,deliveryMethod,items,purchase_datetime } = req.body;
        const newPurchase = {
            mp_payment_id,
            status,
            amount,
            payer_email,
            shippingAddress,
            deliveryMethod,
            items,
            purchase_datetime
        }
        const purchaseSaved = await purchasesService.save(newPurchase);
        res.sendSuccessNewResourse(purchaseSaved);
    } catch (error) {
        if(error instanceof PurchaseExists) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}

const eliminate = async (req, res) => {
    try {
        const { pid } = req.params;
        //const purchase = await purchasesService.getById(pid);
        /* if (!purchases) {
            return res.status(404).json({ message: 'Domicilio no encontrado' });
        } */
        const deletedPurchase = await purchasesService.eliminate(pid);
        res.sendSuccessNewResourse(deletedPurchase);

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