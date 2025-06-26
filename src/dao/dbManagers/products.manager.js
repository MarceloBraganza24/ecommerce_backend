import { productsModel } from '../dbManagers/models/products.model.js'

export default class Products {
    constructor() {
        console.log('Working with products DB');
    }
    getById = async (pid, session = null) => {
        const query = session
            ? productsModel.findOne({ _id: pid, deleted: false }).session(session)
            : productsModel.findOne({ _id: pid, deleted: false });
        return await query;
    };
    getByIdIncludeDeleted = async (pid, session = null) => {
        const query = session
            ? productsModel.findOne({ _id: pid }).session(session)  // Sin filtro deleted
            : productsModel.findOne({ _id: pid });
        return await query;
    };
    getDeleted = async () => {
        const deletedProducts = await productsModel.find({ deleted: true }).lean();
        return deletedProducts;
    };
    groupedByCategory = async (limit) => {
        // Obtener las categorías distintas primero
        const categories = await productsModel.distinct('category', { deleted: false });
        const result = {};
        for (const category of categories) {
            // Traer hasta 'limit' productos por categoría, ordenados por ejemplo por número de ventas descendente
            const products = await productsModel.find({ category, deleted: false })
            .sort({ number_sales: -1 }) // Cambiá el criterio de orden si querés
            .limit(limit)
            .lean();

            result[category] = products;
        }
        return result;
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
    navbarSearch = async (query = {}) => {
        const fullQuery = { ...query, deleted: false };
        const products = await productsModel.find(fullQuery);
        return products;
    };
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
    update = async (pid, productToReplace, session = null) => {
        const options = session ? { session } : {};
        return await productsModel.updateOne({ _id: pid }, productToReplace, options);
    }
    /* updatePricesByCategories = async (categories, percentage) => {
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
    }; */
    updatePricesByCategories = async (categories, percentage) => {
        const factor = 1 + (percentage / 100);

        const result = await productsModel.updateMany(
            { category: { $in: categories } },
            [
                {
                    $set: {
                        // Para productos SIN variantes
                        originalPrice: {
                            $cond: [
                                { $ifNull: ["$originalPrice", false] },
                                "$originalPrice",
                                "$price"
                            ]
                        },
                        price: { $round: [{ $multiply: ["$price", factor] }, 0] },

                        // Para productos CON variantes
                        variantes: {
                            $map: {
                                input: "$variantes",
                                as: "v",
                                in: {
                                    $mergeObjects: [
                                        "$$v",
                                        {
                                            originalPrice: {
                                                $cond: [
                                                    { $ifNull: ["$$v.originalPrice", false] },
                                                    "$$v.originalPrice",
                                                    "$$v.price"
                                                ]
                                            },
                                            price: { $round: [{ $multiply: ["$$v.price", factor] }, 0] }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            ]
        );

        return result;
    };

    /* restorePricesByCategories = async (categories) => {
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
    }; */
    restorePricesByCategories = async (categories) => {
        const result = await productsModel.updateMany(
            {
            category: { $in: categories },
            $or: [
                // Producto sin variantes con price distinto a originalPrice
                {
                $and: [
                    { variantes: { $eq: [] } }, 
                    { $expr: { $ne: ["$price", "$originalPrice"] } }
                ]
                },
                // Producto con variantes donde al menos una variante tiene price distinto a originalPrice
                {
                variantes: { 
                    $elemMatch: { 
                    originalPrice: { $exists: true, $ne: null },
                    $expr: { $ne: ["$price", "$originalPrice"] }
                    }
                }
                }
            ]
            },
            [
            {
                $set: {
                // Para productos sin variantes
                price: {
                    $cond: [
                    { $eq: ["$variantes", []] },
                    { $round: ["$originalPrice", 0] },
                    "$price"
                    ]
                },
                // Para productos con variantes: actualiza el price de cada variante solo si es necesario
                variantes: {
                    $cond: [
                    { $gt: [{ $size: "$variantes" }, 0] },
                    {
                        $map: {
                        input: "$variantes",
                        as: "var",
                        in: {
                            $mergeObjects: [
                            "$$var",
                            {
                                price: {
                                $cond: [
                                    { $and: [
                                    { $ifNull: ["$$var.originalPrice", false] },
                                    { $ne: ["$$var.price", "$$var.originalPrice"] }
                                    ]},
                                    { $round: ["$$var.originalPrice", 0] },
                                    "$$var.price"
                                ]
                                }
                            }
                            ]
                        }
                        }
                    },
                    []
                    ]
                }
                }
            },
            // Opcional: quitar originalPrice solo de productos sin variantes (o dejalo si querés)
            {
                $unset: {
                originalPrice: {
                    $cond: [
                    { $eq: ["$variantes", []] },
                    "$originalPrice",
                    "$$REMOVE"
                    ]
                }
                }
            }
            ]
        );
        console.log(`Se restauraron precios en ${result.modifiedCount} productos.`);
        return result;
    };


    /* eliminate = async (pid) => {
        const productEliminated = await productsModel.deleteOne({ _id: pid });
        return productEliminated;
    } */
    eliminate = async (pid) => {
        const productEliminated = await productsModel.deleteOne({ _id: pid, deleted: true });
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