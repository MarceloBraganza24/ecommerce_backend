import { ticketsModel } from '../dbManagers/models/tickets.model.js'

export default class TicketsDao {
    getAll = async() => {
        const tickets = await ticketsModel.find().lean();
        return tickets;
    }
    getById = async(id) => {
        const ticket = await ticketsModel.findById(id).lean();
        return ticket;
    }
    getAllByPage = async (query, { page, limit }) => {
        const tickets = await ticketsModel.paginate(query, { page, limit });
        return tickets; 
    }
    save = async(ticket) => {
        const ticketSaved = await ticketsModel.create(ticket);
        return ticketSaved;
    }
}