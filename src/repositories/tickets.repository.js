import { Tickets } from '../dao/factory.js';

export default class TicketsRepository {
    constructor() {
        this.dao = new Tickets();
    }
    getAll = async () => {
        const tickets = await this.dao.getAll();
        return tickets;
    }
    getAllByPage = async(query, { page, limit }) => {
        const tickets = await this.dao.getAllByPage(query, { page, limit });
        return tickets;
    }
    getById = async (id) => {
        const ticket = await this.dao.getById(id);
        return ticket;
    }
    save = async (ticket) => {
        const ticketSaved = await this.dao.save(ticket);
        return ticketSaved;
    }
}