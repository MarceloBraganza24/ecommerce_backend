import * as ticketsService from '../services/tickets.service.js';
import * as cartsService from '../services/carts.service.js';

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
const getAllByPageAndEmail = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "", email } = req.query;

        const query = {};

        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        if (email) {
            query.payer_email  = email;
        }

        const tickets = await ticketsService.getAllByPageAndEmail(query, { page, limit });
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

const saveSale = async (req, res) => {
    try {
        const { amount,payer_email,items,deliveryMethod,purchase_datetime,user_cart_id,user_role } = req.body;
        const itemsFiltered = items.map(item => ({
            product: item.product._id, // _id del producto
            quantity: item.quantity, // Cantidad del producto
            snapshot: {
                title: item.product.title,
                price: item.product.price,
                image: item.product.images[0],
            }
        }));
        const newTicket = {
            amount,
            payer_email,
            items: itemsFiltered,
            deliveryMethod,
            user_role,
            purchase_datetime
        }
        const ticket = await ticketsService.save(newTicket);
        await cartsService.purchase(user_cart_id);
        res.sendSuccessNewResourse(ticket);
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}
const hiddenVisibility = async (req, res) => {
    try {
        const { tid } = req.params;
        const ticket = await ticketsService.getById(tid);
        const updatedTicket = await ticketsService.update(tid, ticket);
        res.sendSuccessNewResourse(updatedTicket);

    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}
const eliminate = async (req, res) => {
    try {
        const { tid } = req.params;
        const deletedTicket = await ticketsService.eliminate(tid);
        res.sendSuccessNewResourse(deletedTicket);

    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}

        
const massDelete = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'IDs inválidos' });
    }

    await ticketsService.massDelete(ids); // asumimos que tu service tiene esta función
    res.sendSuccess('Tickets eliminados');

  } catch (error) {
    req.logger.error(error.message);
    res.sendServerError(error.message);
  }
};
const massDeletePermanent = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'IDs inválidos' });
    }

    await ticketsService.massDeletePermanent(ids); // asumimos que tu service tiene esta función
    res.sendSuccess('Tickets eliminados permanentemente');

  } catch (error) {
    req.logger.error(error.message);
    res.sendServerError(error.message);
  }
};
const massRestore = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'IDs inválidos' });
        }

        await ticketsService.massRestore(ids); // asumimos que tu service tiene esta función
        res.sendSuccess('Tickets restaurados');

    } catch (error) {
        req.logger.error(error.message);
        res.sendServerError(error.message);
    }
};

const updateSoftDelete = async (req, res) => {
    try {
        const { tid } = req.params;
        const updatedTicket = await ticketsService.updateSoftDelete(tid)
        res.status(200).json({ message: 'Ticket eliminado (soft delete)', product: updatedTicket });
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
} 
const updateRestoreProduct = async (req, res) => {
    try {
        const { tid } = req.params;
        const updatedTicket = await ticketsService.updateRestoreProduct(tid)
        res.status(200).json({ message: 'Ticket eliminado (soft delete)', product: updatedTicket });
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
} 

const getDeleted = async (req, res) => {
    try {
        const deletedTickets = await ticketsService.getDeleted();
        res.status(200).json({ status: 'success', payload: deletedTickets });
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
} 

export {
    getAll,
    getById,
    saveSale,
    save,
    hiddenVisibility,
    eliminate,
    getAllByPageAndEmail,
    getAllByPage,
    getDeleted,
    updateRestoreProduct,
    updateSoftDelete,
    massRestore,
    massDelete,
    massDeletePermanent
}