import { productsModel } from '../dbManagers/models/products.model.js'

export default class Products {
    constructor() {
        console.log('Working with products DB');
    }
    getById = async (pid) => {
        const product = await productsModel.findById({ _id: pid, deleted: false });
        return product; 
    }
    getDeleted = async () => {
        const deletedProducts = await productsModel.find({ deleted: true }).lean();
        return deletedProducts;
    };
    getAll = async () => {
        const products = await productsModel.find({ deleted: false }).lean();
        return products; 
    }
    updateSoftDelete = async (pid) => {
        const products = await productsModel.findByIdAndUpdate(pid, { 
            deleted: true, 
            deletedAt: new Date() 
        }, { new: true });
        return products; 
    }
    updateRestoreProduct = async (pid) => {
        const product = await productsModel.findByIdAndUpdate(
            pid,
            { 
                deleted: false, 
                deletedAt: null 
            },
            { new: true }
        );
        return product;
    };
    getAllBy = async (query = {}, { page, limit, sort }) => {
        const fullQuery = { ...query, deleted: false };
        const result = await productsModel.paginate(fullQuery, {
            page,
            limit,
            sort,
        });
        return result;
    };
    getAllByPage = async (query = {}, { page, limit }) => {
        const fullQuery = { ...query, deleted: false };

        const products = await productsModel.paginate(fullQuery, { page, limit });
        return products; 
    }
    getIdsByTitle = async (title) => {
        const products = await productsModel.find(
            { title: { $regex: title, $options: "i" }, deleted: false },
            { _id: 1 }
        );
        return products.map(p => p._id.toString());
    }
    save = async (product) => {
        const productSaved = await productsModel.create(product);
        return productSaved;
    }
    update = async (pid, productToReplace) => {
        const productUpdated = await productsModel.updateOne({ _id: pid }, productToReplace);
        return productUpdated;
    }
    updatePricesByCategories = async (categories, percentage) => {
        const factor = 1 + (percentage / 100);

        const result = await productsModel.updateMany(
            { category: { $in: categories } },
            [
                {
                    $set: {
                        originalPrice: {
                            $cond: [
                                { $ifNull: ["$originalPrice", false] },
                                "$originalPrice",
                                "$price"
                            ]
                        },
                        price: { $round: [{ $multiply: ["$price", factor] }, 0] } // 🎯 redondea sin decimales
                    }
                }
            ]
        );

        return result;
    };
    restorePricesByCategories = async (categories) => {
        const result = await productsModel.updateMany(
            {
                category: { $in: categories },
                originalPrice: { $exists: true, $ne: null }
            },
            [
                {
                    $set: {
                        price: { $round: ["$originalPrice", 0] }
                    }
                },
                {
                    $unset: "originalPrice"
                }
            ]
        );
        console.log(`Se restauraron precios en ${result.modifiedCount} productos.`);
        return result;
    };
    eliminate = async (pid) => {
        const productEliminated = await productsModel.deleteOne({ _id: pid });
        return productEliminated;
    }
    massDelete = async (ids) => {
        const productsEliminated = await productsModel.updateMany(
            { _id: { $in: ids } },
            { $set: { deleted: true, deletedAt: new Date() } }
        );
        return productsEliminated;
    }
    massDeletePermanent = async (ids) => {
        const productsEliminated = await productsModel.deleteMany({ _id: { $in: ids } });
        return productsEliminated;
    }
    massRestore = async (ids) => {
        const productsEliminated = await productsModel.updateMany(
            { _id: { $in: ids } },
            { $set: { deleted: false, deletedAt: null } }
        );
        return productsEliminated;
    }
    restoreProducts = async (ids) => {
        const restored = await productsModel.updateMany(
            { _id: { $in: ids }, deleted: true },
            { $set: { deleted: false, deletedAt: null } }
        );
        return restored;
    }

}