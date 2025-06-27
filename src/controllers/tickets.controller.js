import * as ticketsService from '../services/tickets.service.js';
import * as cartsService from '../services/carts.service.js';
import * as productsService from '../services/products.service.js';
import mongoose from 'mongoose';

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
        const { page = 1, limit = 25, search = "", field = "" } = req.query;

        let query = {};
        if (search) {
            if (field === 'title') {
                query['items.snapshot.title'] = { $regex: search, $options: 'i' };
            } else if (field === 'all') {
                query = {
                    $or: [
                        { 'items.snapshot.title': { $regex: search, $options: 'i' } },
                        { code: { $regex: search, $options: 'i' } },
                        { payer_email: { $regex: search, $options: 'i' } },
                        { user_role: { $regex: search, $options: 'i' } },
                        { amount: isNaN(search) ? undefined : Number(search) },
                    ].filter(Boolean) // elimina los undefined
                };
            } else if (['amount'].includes(field)) {
                query[field] = isNaN(search) ? undefined : Number(search);
            } else {
                query[field] = { $regex: search, $options: "i" };
            }
        }
        const tickets = await ticketsService.getAllByPage(query, { page, limit });
        res.sendSuccess(tickets);
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
};
const getAllByPageAndEmail = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "", email } = req.query;

        const query = {};

        if (search) {
            query['items.snapshot.title'] = { $regex: search, $options: 'i' };
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
const saveAdminSale = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { amount, payer_email, items, deliveryMethod, purchase_datetime, user_role } = req.body;
        // Validar stock usando la sesión
        for (const item of items) {
            // console.log(`🛬 Producto recibido: ${item.title}`);
            // console.log('Campos seleccionados:', item.camposSeleccionados);
            if (item.camposSeleccionados && Object.keys(item.camposSeleccionados).length > 0) {
                await productsService.decreaseVariantStock(item._id, item.camposSeleccionados, item.quantity, session);
            } else {
                await productsService.decreaseStock(item._id, item.quantity, session);
            }
        }   
        // Crear snapshot para el ticket
        const itemsFiltered = items.map(item => ({
            product: item._id,
            quantity: item.quantity,
            snapshot: {
                title: item.title,
                price: item.price,
                image: item.images[0],
            }
        }));

        const newTicket = {
            amount,
            payer_email,
            items: itemsFiltered,
            deliveryMethod,
            user_role,
            purchase_datetime
        };

        // Guardar ticket con sesión
        const ticket = await ticketsService.save(newTicket, session);

        await session.commitTransaction();
        session.endSession();

        res.sendSuccessNewResourse(ticket);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
};
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
    saveAdminSale,
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