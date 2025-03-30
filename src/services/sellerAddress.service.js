import SellerAddressRepository from '../repositories/sellerAddress.repository.js';
import { SellerAddress } from '../dao/factory.js';
import { SellerAddressExists } from '../utils/custom.exceptions.js';

const sellerAddressDao = new SellerAddress();
const sellerAddressRepository = new SellerAddressRepository(sellerAddressDao);

const getAll = async () => {
    const sellerAddress = await sellerAddressRepository.getAll();
    return sellerAddress;
}
const getById = async (id) => {
    const category = await sellerAddressRepository.getById(id);
    return category;
}
const save = async (sellerAddress) => {
    const sellerAddressAll = await sellerAddressRepository.getAll();
    const exist = sellerAddressAll.find(item => item.street == sellerAddress.street)
    if(exist) {
        throw new SellerAddressExists('There is already an address with that street');
    }
    const sellerAddressSaved = await sellerAddressRepository.save(sellerAddress);
    return sellerAddressSaved;
}
const eliminate = async(id) => {
    const sellerAddressEliminated = await sellerAddressRepository.eliminate(id);
    return sellerAddressEliminated;
}

export {
    getAll,
    getById,
    save,
    eliminate
}