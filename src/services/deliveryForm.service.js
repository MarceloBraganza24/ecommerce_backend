import DeliveryFormRepository from '../repositories/deliveryForm.repository.js';
import { DeliveryForm } from '../dao/factory.js';
import { DeliveryFormExists } from '../utils/custom.exceptions.js';

const deliveryFormDao = new DeliveryForm();
const deliveryFormRepository = new DeliveryFormRepository(deliveryFormDao);

const getAll = async () => {
    const deliveryForm = await deliveryFormRepository.getAll();
    return deliveryForm;
}
const getById = async (id) => {
    const deliveryForm = await deliveryFormRepository.getById(id);
    return deliveryForm;
}
const save = async (deliveryForm) => {
    const deliveryFormData = await deliveryFormRepository.getAll();
    const exist = deliveryFormData.find(item => item.street == deliveryForm.street)
    if(exist) {
        throw new DeliveryFormExists('There is already a delivery form with that street');
    }
    const deliveryFormSaved = await deliveryFormRepository.save(deliveryForm);
    return deliveryFormSaved;
}
const update = async(id, deliveryForm) => {
    const deliveryFormUpdated = await deliveryFormRepository.update(id, deliveryForm);
    return deliveryFormUpdated;
}
const eliminate = async(id) => {
    const deliveryFormEliminated = await deliveryFormRepository.eliminate(id);
    return deliveryFormEliminated;
}

export {
    getAll,
    getById,
    save,
    update,
    eliminate
}