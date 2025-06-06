import * as sellerAddressService from '../services/sellerAddress.service.js';
import { SellerAddressExists } from '../utils/custom.exceptions.js';

const getAll = async (req, res) => {
    try {
        const sellerAddress = await sellerAddressService.getAll();
        res.sendSuccess(sellerAddress);
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}
const getById = async (req, res) => {
    try {
        const { sAId } = req.params;            
        const sellerAddress = await sellerAddressService.getById(sAId);
        res.sendSuccess(sellerAddress);
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}
const save = async (req, res) => {
    try {
        const { street,street_number,locality,province,postal_code, sellerAddress_datetime  } = req.body;
        const sellerAddress = {
            street,
            street_number,
            locality,
            province,
            postal_code,
            sellerAddress_datetime
        }
        const sellerAddressSaved = await sellerAddressService.save(sellerAddress);
        res.sendSuccessNewResourse(sellerAddressSaved);
    } catch (error) {
        if(error instanceof SellerAddressExists) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}
const eliminate = async (req, res) => {
    try {
        const { sAId } = req.params;
        const deletedSellerAddress = await sellerAddressService.eliminate(sAId);
        res.sendSuccessNewResourse(deletedSellerAddress);

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