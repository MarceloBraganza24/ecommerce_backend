import TicketsRepository from '../repositories/tickets.repository.js';

const ticketsManager = new TicketsRepository();

const getAll = async () => {
    const tickets = await ticketsManager.getAll();
    return tickets;
}
const getAllByPage = async(query, { page, limit }) => {
    const tickets = await ticketsManager.getAllByPage(query, { page, limit });
    return tickets;
}
const getAllByPageAndEmail = async(query, { page, limit }) => {
    const tickets = await ticketsManager.getAllByPageAndEmail(query, { page, limit });
    return tickets;
}
const getById = async (id) => {
    const ticket = await ticketsManager.getById(id);
    return ticket;
}
const save = async (ticket) => {
    const code = Date.now() + Math.floor(Math.random() * 100000 + 1);
    const newTicket = {
        ...ticket,
        code,
    }
    const ticketSaved = await ticketsManager.save(newTicket);
    return ticketSaved;
}
const eliminate = async(id) => {
    const ticketEliminated = await ticketsManager.eliminate(id);
    return ticketEliminated;
}
export {
    getAll,
    getById,
    save,
    eliminate,
    getAllByPageAndEmail,
    getAllByPage
}