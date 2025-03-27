import { deliveryFormModel } from '../dbManagers/models/deliveryForm.model.js'

export default class deliveryFormDao {
    getAll = async() => {
        const deliveryForm = await deliveryFormModel.find().lean();
        return deliveryForm;
    }
    getById = async(id) => {
        const deliveryForm = await deliveryFormModel.findById(id).lean();
        return deliveryForm;
    }
    save = async(deliveryForm) => {
        const deliveryFormSaved = await deliveryFormModel.create(deliveryForm);
        return deliveryFormSaved;
    }
    update = async (id, deliveryForm) => {
        const deliveryFormUpdated = await deliveryFormModel.updateOne({ _id: id }, deliveryForm);
        return deliveryFormUpdated;
    }
    eliminate = async (cid) => {
        const deliveryFormEliminated = await deliveryFormModel.deleteOne({ _id: cid });
        return deliveryFormEliminated;
    }
}