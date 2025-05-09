import * as ticketsService from '../services/tickets.service.js';

const getAll = async (req, res) => {
    try {
        const tickets = await ticketsService.getAll();
        res.sendSuccess(tickets);
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}
const getAllByPage = async (req, res) => {
    try {
        const { page = 1, limit = 25, search = "" } = req.query;      
        const query = search ? { title: { $regex: search, $options: "i" } } : {};

        const tickets = await ticketsService.getAllByPage(query, { page, limit });
        res.sendSuccess(tickets);
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
} 
const getById = async (req, res) => {
    try {
        const { tid } = req.params;            
        const ticket = await ticketsService.getById(tid);
        res.sendSuccess(ticket);
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}

const save = async (req, res) => {
    try {
        const { payment,items,shippingAddress,deliveryMethod } = req.body;
        const newTicket = {
            mp_payment_id: payment.id,
            status: payment.status,
            amount: payment.transaction_amount,
            payer_email: payment.payer.email,
            items,
            shippingAddress,
            deliveryMethod,
            purchase_datetime: payment.date_created
        }
        const ticket = await ticketsService.save(newTicket);
        res.sendSuccessNewResourse(ticket);
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}

export {
    getAll,
    getById,
    save,
    getAllByPage
}