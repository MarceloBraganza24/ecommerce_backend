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
    getAllByPageAndEmail = async(query, { page, limit }) => {
        const tickets = await this.dao.getAllByPageAndEmail(query, { page, limit });
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
    update = async(id,ticket) => {
        const ticketUpdated = await this.dao.update(id,ticket);
        return ticketUpdated;
    }
    eliminate = async(id) => {
        const ticketEliminated = await this.dao.eliminate(id);
        return ticketEliminated;
    }
    massDelete = async(ids) => {
        const ticketsEliminated = await this.dao.massDelete(ids);
        return ticketsEliminated;
    }
    massDeletePermanent = async(ids) => {
        const ticketsEliminated = await this.dao.massDeletePermanent(ids);
        return ticketsEliminated;
    }
    massRestore = async(ids) => {
        const ticketsEliminated = await this.dao.massRestore(ids);
        return ticketsEliminated;
    }
    getDeleted = async() => {
        const tickets = await this.dao.getDeleted();
        return tickets;
    }
    updateSoftDelete = async(tid) => {
        const ticketsUpdated = await this.dao.updateSoftDelete(tid);
        return ticketsUpdated;
    }
    updateRestoreProduct = async(tid) => {
        const ticketsUpdated = await this.dao.updateRestoreProduct(tid);
        return ticketsUpdated;
    }
}