import FavoritesRepository from '../repository/favorites.repository.js';
import FavoritesManager from '../dao/managers/favoritesManager.js';

const favoritesRepository = new FavoritesRepository(new FavoritesManager());

const getById = async (id) => await favoritesRepository.getById(id);

const getByUserId = async (userId) => await favoritesRepository.getByUserId(userId);

const create = async (data) => await favoritesRepository.create(data);

const addProduct = async (userId, productId) => {
    let favorite = await favoritesRepository.getByUserId(userId);

    if (!favorite) {
        // Si el usuario no tiene favoritos aún, crear uno
        favorite = await favoritesRepository.create({
            user: userId,
            products: [productId]
        });
        return favorite;
    }

    // Si ya está agregado, no lo dupliques
    if (favorite.products.includes(productId)) {
        return favorite;
    }

    // Agregar el producto
    favorite.products.push(productId);
    const updated = await favoritesRepository.update(favorite._id, { products: favorite.products });
    return updated;
};

export default {
    getById,
    getByUserId,
    create,
    addProduct
};
