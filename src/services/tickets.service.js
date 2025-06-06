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
const save = async (ticket, session = null) => {
    const code = Date.now() + Math.floor(Math.random() * 100000 + 1);
    const newTicket = { ...ticket, code };

    if (session) {
        return await ticketsManager.save(newTicket, session);
    } else {
        return await ticketsManager.save(newTicket);
    }
};
const update = async(id,ticket) => {
    ticket.visibility.user = false;
    const ticketUpdated = await ticketsManager.update(id,ticket);
    return ticketUpdated;
}
const eliminate = async(id) => {
    const ticketEliminated = await ticketsManager.eliminate(id);
    return ticketEliminated;
}
const massDelete = async(ids) => {
    const ticketsEliminated = await ticketsManager.massDelete(ids);
    return ticketsEliminated;
}
const massDeletePermanent = async(ids) => {
    const ticketsEliminated = await ticketsManager.massDeletePermanent(ids);
    return ticketsEliminated;
}
const massRestore = async(ids) => {
    const ticketsEliminated = await ticketsManager.massRestore(ids);
    return ticketsEliminated;
}
const updateSoftDelete = async(tid) => {
    const ticketUpdated = await ticketsManager.updateSoftDelete(tid);
    return ticketUpdated;
}
const updateRestoreProduct = async(tid) => {
    const ticketUpdated = await ticketsManager.updateRestoreProduct(tid);
    return ticketUpdated;
}
const getDeleted = async() => {
    const tickets = await ticketsManager.getDeleted();
    return tickets;
}
export {
    getAll,
    getById,
    save,
    eliminate,
    update,
    getAllByPageAndEmail,
    getAllByPage,
    updateSoftDelete,
    getDeleted,
    massRestore,
    massDeletePermanent,
    massDelete,
    updateRestoreProduct
}