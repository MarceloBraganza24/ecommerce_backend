export default class SellerAddressRepository {
    constructor(dao) {
        this.dao = dao;
    }
    getAll = async() => {
        const sellerAddress = await this.dao.getAll();
        return sellerAddress;
    }
    getById = async(id) => {
        const sellerAddress = await this.dao.getById(id);
        return sellerAddress;
    }
    save = async(sellerAddress) => {
        const sellerAddressSaved = await this.dao.save(sellerAddress);
        return sellerAddressSaved;
    }
    eliminate = async(id) => {
        const sellerAddressEliminated = await this.dao.eliminate(id);
        return sellerAddressEliminated;
    }
}