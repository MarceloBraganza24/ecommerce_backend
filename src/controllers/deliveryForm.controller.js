import * as deliveryFormService from '../services/deliveryForm.service.js';
import { DeliveryFormExists } from '../utils/custom.exceptions.js';

const getAll = async (req, res) => {
    try {
        const deliveryForm = await deliveryFormService.getAll();
        res.sendSuccess(deliveryForm);
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}

const getById = async (req, res) => {
    try {
        const { dFid } = req.params;            
        const deliveryForm = await deliveryFormService.getById(dFid);
        res.sendSuccess(deliveryForm);
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}

const save = async (req, res) => {
    try {
        const { street,street_number,locality,province,country,postal_code,name,phone} = req.body;
        if (!street || !street_number || !locality || !province || !country || !postal_code || !name || !phone || isNaN(phone)) {
            throw new DeliveryFormExists('You must complete all fields correctly');
        }
        const deliveryForm = await deliveryFormService.save(req.body);
        res.sendSuccessNewResourse(deliveryForm);
    } catch (error) {
        if(error instanceof DeliveryFormExists) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}

const update = async (req, res) => {
    try {
        const { dFid } = req.params;
        const updatedDeliveryForm = await deliveryFormService.update(dFid, req.body);
        if (!updatedDeliveryForm) {
            return res.status(404).json({ message: 'Formulario de entrega no encontrado' });
        }
        res.sendSuccessNewResourse(updatedDeliveryForm);
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}

const eliminate = async (req, res) => {
    try {
        const { dFid } = req.params;
        const deliveryForm = await deliveryFormService.getById(dFid);
        if (!deliveryForm) {
            return res.status(404).json({ message: 'Formulario de entrega no encontrado' });
        }
        const deletedDeliveryForm = await deliveryFormService.eliminate(dFid);
        res.sendSuccessNewResourse(deletedDeliveryForm);

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
    eliminate
}