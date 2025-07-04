import FavoritesRepository from '../repositories/favorites.repository.js';
import FavoritesManager from '../dao/dbManagers/favorites.manager.js';

const favoritesRepository = new FavoritesRepository(new FavoritesManager());

const getById = async (id) => await favoritesRepository.getById(id);

const getByUserId = async (userId) => await favoritesRepository.getByUserId(userId);

const create = async (data) => await favoritesRepository.create(data);

/* const addProduct = async (userId, productId) => {
    let favorite = await favoritesRepository.getByUserId(userId);

    if (!favorite) {
        // Crear nuevo documento de favoritos
        const created = await favoritesRepository.create({
            user: userId,
            products: [productId]
        });

        // Verificá que se haya creado bien
        if (!created) throw new Error('No se pudo crear el documento de favoritos');

        return created;
    }

    // Si no tiene campo products (defensivo)
    if (!Array.isArray(favorite.products)) {
        favorite.products = [];
    }

    const alreadyExists = favorite.products.some(p => p.toString() === productId.toString());
    if (alreadyExists) return favorite;

    favorite.products.push(productId);

    const updated = await favoritesRepository.update(favorite._id, {
        products: favorite.products
    });

    return updated;
}; */
const addProduct = async (userId, productId) => {
    let favorite = await favoritesRepository.getByUserId(userId);

    if (!favorite) {
        const created = await favoritesRepository.create({
            user: userId,
            products: [productId]
        });

        if (!created) throw new Error('No se pudo crear el documento de favoritos');

        return created;
    }

    if (!Array.isArray(favorite.products)) {
        favorite.products = [];
    }

    const alreadyExists = favorite.products.some(p => p.toString() === productId.toString());
    if (alreadyExists) throw new ProductExists('El producto ya existe en favoritos!');

    favorite.products.push(productId);

    const updated = await favoritesRepository.update(favorite._id, {
        products: favorite.products
    });

    return updated;
};

const removeProduct = async (userId, productId) => {
    return await favoritesRepository.removeProduct(userId, productId);
};
const clearFavorites = async (userId) => {
    let favorite = await favoritesRepository.getByUserId(userId);

    favorite.products = [];
    const updated = await favoritesRepository.update(favorite._id, { products: [] });
    return updated;
};

export {
    getById,
    getByUserId,
    addProduct,
    create,
    clearFavorites,
    removeProduct
};
