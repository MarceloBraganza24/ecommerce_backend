import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { getAll, getById, save,getAllByPage,getAllByPageAndEmail,saveSale,hiddenVisibility,eliminate,getDeleted,massRestore,updateSoftDelete,updateRestoreProduct,massDelete,massDeletePermanent } from '../controllers/tickets.controller.js';
import { ticketsModel } from '../dao/dbManagers/models/tickets.model.js'

export default class TicketsRouter extends Router {
    init() {
        /* this.get('/init-add-deleted-flag', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, async (req, res) => {
            const result = await ticketsModel.updateMany(
                { deleted: { $exists: false } },
                { $set: { deleted: false, deletedAt: null } }
            );
            res.json(result);
        }); */
        this.get('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getAll);
        this.get('/deleted', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getDeleted);
        this.get('/byPage', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getAllByPage);
        this.get('/byPageAndEmail', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getAllByPageAndEmail);
        this.get('/:tid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getById);
        this.post('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, save);
        this.post('/saveSale', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, saveSale);
        this.put('/mass-restore', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, massRestore);
        this.put('/:tid/soft-delete', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, updateSoftDelete);
        this.put('/:tid/restore', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, updateRestoreProduct);
        this.put('/:tid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, hiddenVisibility);
        this.delete('/mass-delete', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, massDelete);
        this.delete('/mass-delete-permanent', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, massDeletePermanent);
        this.delete('/:tid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, eliminate);
    }
}