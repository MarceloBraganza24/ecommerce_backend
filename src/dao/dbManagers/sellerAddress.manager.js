import { sellerAddressModel } from '../dbManagers/models/sellerAddress.model.js'

export default class SellerAddressDao {
    getAll = async() => {
        const sellerAddress = await sellerAddressModel.find().lean();
        return sellerAddress;
    }
    getById = async(id) => {
        const sellerAddress = await sellerAddressModel.findById(id).lean();
        return sellerAddress;
    }
    save = async(sellerAddress) => {
        const sellerAddressSaved = await sellerAddressModel.create(sellerAddress);
        return sellerAddressSaved;
    }
    eliminate = async (id) => {
        const sellerAddressEliminated = await sellerAddressModel.deleteOne({ _id: id });
        return sellerAddressEliminated;
    }
}