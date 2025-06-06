import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { getAll,getDeleted,getAllByPage,getAllBy, getById, save,massRestore,groupedByCategory,massDeletePermanent, update,updateSoftDelete,updateRestoreProduct,updatePricesByCategories,restorePricesByCategories, eliminate,massDelete } from '../controllers/products.controller.js'
import uploader from "../utils/upload.js";

export default class ProductsRouter extends Router {
    init() {
        this.get('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getAll);
        this.get('/deleted', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getDeleted);
        this.get('/grouped-by-category', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, groupedByCategory);
        this.get('/byPage', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getAllByPage);
        this.get('/by', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getAllBy);
        this.get('/:pid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getById);
        this.post('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, uploader.array('images', 6), save);
        this.post('/update-prices-category', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, updatePricesByCategories);
        this.post('/restore-prices-category', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, restorePricesByCategories);
        this.put('/mass-restore', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, massRestore);
        this.put('/:pid/soft-delete', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, updateSoftDelete);
        this.put('/:pid/restore', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, updateRestoreProduct);
        this.put('/:pid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, uploader.array('images', 6), update);
        this.delete('/mass-delete', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, massDelete);
        this.delete('/mass-delete-permanent', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, massDeletePermanent);
        this.delete('/:pid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, eliminate);
    }
}