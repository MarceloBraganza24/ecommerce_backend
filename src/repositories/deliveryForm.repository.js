export default class DeliveryFormRepository {
    constructor(dao) {
        this.dao = dao;
    }
    getAll = async() => {
        const deliveryForm = await this.dao.getAll();
        return deliveryForm;
    }
    getById = async(id) => {
        const deliveryForm = await this.dao.getById(id);
        return deliveryForm;
    }
    save = async(deliveryForm) => {
        const deliveryFormSaved = await this.dao.save(deliveryForm);
        return deliveryFormSaved;
    }
    eliminate = async(id) => {
        const deliveryFormEliminated = await this.dao.eliminate(id);
        return deliveryFormEliminated;
    }
}