import * as ticketsService from '../services/tickets.service.js';
import * as cartsService from '../services/carts.service.js';
import * as productsService from '../services/products.service.js';

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

/* const getAllByPageAndEmail = async (req, res) => {
    try {
        const { page = 1, limit = 25, email, search = "" } = req.query;
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        const query = {};
        if (email) {
            query.payer_email = email;
        }

        let matchingProductIds = null;
        if (search) {
            const matchingProducts = await productsService.getIdsByTitle(search);
            matchingProductIds = matchingProducts;
        }

        // Buscamos tickets paginados
        const rawTickets = await ticketsModel.find(query)
            .sort({ purchase_datetime: -1 })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        // Filtramos por productos que coincidan si hay search
        let filteredTickets = rawTickets;
        if (matchingProductIds) {
            filteredTickets = rawTickets.filter(ticket =>
                ticket.items.some(item => matchingProductIds.includes(item._id.toString()))
            );
        }

        // Extraemos los IDs de productos de los tickets
        const allProductIds = new Set();
        filteredTickets.forEach(ticket => {
            ticket.items.forEach(item => allProductIds.add(item._id.toString()));
        });

        // Buscamos títulos de esos productos
        const products = await productsModel.find(
            { _id: { $in: Array.from(allProductIds) } },
            { _id: 1, title: 1 }
        );
        const productMap = new Map(products.map(p => [p._id.toString(), p.title]));

        // Enriquecemos los tickets con los títulos
        const enrichedTickets = filteredTickets.map(ticket => {
            const itemsWithTitles = ticket.items.map(item => ({
                ...item.toObject(),
                title: productMap.get(item._id.toString()) || 'Producto no encontrado'
            }));
            return {
                ...ticket.toObject(),
                items: itemsWithTitles
            };
        });

        const totalTickets = enrichedTickets.length;
        const totalPages = Math.ceil(totalTickets / limitNumber);
        const paginatedTickets = enrichedTickets.slice(0, limitNumber); // ya están paginados por Mongo, esto solo si se filtró más

        res.sendSuccess({
            data: paginatedTickets,
            totalTickets,
            totalPages,
            currentPage: pageNumber,
            hasPrevPage: pageNumber > 1,
            hasNextPage: pageNumber < totalPages,
            prevPage: pageNumber > 1 ? pageNumber - 1 : null,
            nextPage: pageNumber < totalPages ? pageNumber + 1 : null
        });

    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}; */

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
        const { amount,payer_email,items,deliveryMethod,purchase_datetime,user_cart_id } = req.body;
        const itemsFiltered = items.map(item => ({
            product: item.product._id, // _id del producto
            quantity: item.quantity // Cantidad del producto
        }));
        const newTicket = {
            amount,
            payer_email,
            items: itemsFiltered,
            deliveryMethod,
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

export {
    getAll,
    getById,
    saveSale,
    save,
    eliminate,
    getAllByPageAndEmail,
    getAllByPage
}