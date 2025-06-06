import { ticketsModel } from '../dbManagers/models/tickets.model.js'

export default class TicketsDao {
    getAll = async() => {
        const tickets = await ticketsModel.find().lean();
        return tickets;
    }
    getById = async (id, session = null) => {
        const query = ticketsModel.findById(id);
        if (session) query.session(session);
        return await query.lean();
    }
    getDeleted = async () => {
        const deletedTickets = await ticketsModel.find({ deleted: true }).lean();
        return deletedTickets;
    };
    getAllByPage = async (query = {}, { page, limit }) => {
        const fullQuery = { ...query, deleted: false };

        const tickets = await ticketsModel.paginate(fullQuery, { 
            page, 
            limit,
            populate: [
                {
                    path: 'items.product',
                    select: 'title description images'
                }
            ]
        });
        return tickets; 
    }
    getAllByPageAndEmail = async (query, { page, limit }) => {
        const finalQuery = {
            ...query,
            'visibility.user': { $ne: false } // Filtra tickets no visibles
        };
        const tickets = await ticketsModel.paginate(finalQuery, { 
            page, 
            limit,
            populate: [
                {
                    path: 'items.product',
                    select: 'title description images'
                }
            ]
        });
        return tickets; 
    }
    save = async (ticket, session = null) => {
        const [created] = session
            ? await ticketsModel.create([ticket], { session })
            : await ticketsModel.create([ticket]);
        return created;
    }
    update = async(id,ticket) => {
        const ticketUpdated = await ticketsModel.findByIdAndUpdate(id,ticket);
        return ticketUpdated;
    }
    eliminate = async (id) => {
        const ticketEliminated = await ticketsModel.deleteOne({ _id: id });
        return ticketEliminated;
    }
    massDelete = async (ids) => {
        const ticketsEliminated = await ticketsModel.updateMany(
            { _id: { $in: ids } },
            { $set: { deleted: true, deletedAt: new Date() } }
        );
        return ticketsEliminated;
    }
    massDeletePermanent = async (ids) => {
        const ticketsEliminated = await ticketsModel.deleteMany({ _id: { $in: ids } });
        return ticketsEliminated;
    }
    massRestore = async (ids) => {
        const ticketsEliminated = await ticketsModel.updateMany(
            { _id: { $in: ids } },
            { $set: { deleted: false, deletedAt: null } }
        );
        return ticketsEliminated;
    }
    restoreProducts = async (ids) => {
        const restored = await ticketsModel.updateMany(
            { _id: { $in: ids }, deleted: true },
            { $set: { deleted: false, deletedAt: null } }
        );
        return restored;
    }
    updateSoftDelete = async (pid) => {
        const tickets = await ticketsModel.findByIdAndUpdate(pid, { 
            deleted: true, 
            deletedAt: new Date() 
        }, { new: true });
        return tickets; 
    }
    updateRestoreProduct = async (pid) => {
        const tickets = await ticketsModel.findByIdAndUpdate(
            pid,
            { 
                deleted: false, 
                deletedAt: null 
            },
            { new: true }
        );
        return tickets;
    };
}