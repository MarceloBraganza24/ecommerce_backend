import { favoritesModel } from '../dbManagers/models/favorites.model.js'

export default class FavoritesManager {
    getById = async (id, session = null) => {
        const query = favoritesModel.findById(id).populate('user').populate('products');
        if (session) query.session(session);
        return await query.lean();
    };

    getByUserId = async (userId, session = null) => {
        const query = favoritesModel.findOne({ user: userId }).populate('user').populate('products');
        if (session) query.session(session);
        return await query.lean();
    };

    create = async (data) => {
        return await favoritesModel.create(data);
    };

    update = async (id, data, session = null) => {
        const options = { new: true };
        if (session) options.session = session;
        return await favoritesModel.findByIdAndUpdate(id, data, options).lean();
    };
    removeProduct = async (userId, productId, session = null) => {
        const updateQuery = favoritesModel.updateOne(
            { user: userId },
            { $pull: { products: productId } } // ⬅️ Quita el producto
        );

        if (session) updateQuery.session(session);

        await updateQuery;
        return await favoritesModel.findOne({ user: userId }).populate('products').lean();
    };
}
