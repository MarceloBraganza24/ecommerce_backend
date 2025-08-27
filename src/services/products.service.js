import ProductsRepository from '../repositories/products.repository.js';
import { Products } from '../dao/factory.js';
import { ProductExists } from '../utils/custom.exceptions.js';
import { getCategoryAndChildrenIds } from "../utils/getCategoryAndChildren.js";
import { productsModel } from '../dao/dbManagers/models/products.model.js'

const productsDao = new Products();
const productsRepository = new ProductsRepository(productsDao);

const getById = async (pid, session = null) => {
    const product = await productsRepository.getById(pid, session);
    return product;
};
const getByIdIncludeDeleted = async (pid, session = null) => {
    const product = await productsRepository.getByIdIncludeDeleted(pid, session);
    return product;
};
const updateSoftDelete = async(pid) => {
    const productUpdated = await productsRepository.updateSoftDelete(pid);
    return productUpdated;
}
const updateRestoreProduct = async(pid) => {
    const productUpdated = await productsRepository.updateRestoreProduct(pid);
    return productUpdated;
}
const getDeleted = async(query) => {
    const products = await productsRepository.getDeleted(query);
    return products;
}
const getAll = async() => {
    const products = await productsRepository.getAll();
    return products;
}
const getAllByPage = async(query, { page, limit }) => {
    const products = await productsRepository.getAllByPage(query, { page, limit });
    return products;
}
const navbarSearch = async(query) => {
    const products = await productsRepository.navbarSearch(query);
    return products;
}
const groupedByCategory = async(limit) => {
    const products = await productsRepository.groupedByCategory(limit);
    return products;
}
const getAvailableFiltersByCategory = async (category) => {
    const query = { deleted: false, category };
    const allProducts = await productsRepository.getAllByRaw(query);
    return extractAvailableFilters(allProducts);
};
/* const searchProducts = async ({ category, minPrice, maxPrice, filters, sort, page, limit }) => {
    return await getAllBy(
        { category, minPrice, maxPrice, ...filters, sort },
        page,
        limit
    );
};
const getAllBy = async (filters, page, limit) => {
    const { minPrice, maxPrice, sort, category, ...rest } = filters;

    const baseQuery = { deleted: false };
    const andConditions = [];

    // 📌 Filtro por categoría (con subcategorías)
    if (category) {
        const allCategoryIds = await getCategoryAndChildrenIds(category);
        andConditions.push({ category: { $in: allCategoryIds } });
    }

    // Filtros clásicos como categoría, título, estado
    for (const key of Object.keys(rest)) {
        const value = rest[key];
        if (['title', 'state'].includes(key)) {
            andConditions.push({ [key]: { $regex: value, $options: 'i' } });
        }
    }

    // Filtros dinámicos (camposExtras y variantes.campos)
    const dynamicQueryOR = [];

    for (const key of Object.keys(rest)) {
        const value = rest[key];

        // Saltar los filtros clásicos
        if (['title', 'state'].includes(key)) continue;

        // 🔍 Si el valor es un array (ej: talle: ['38', '40'])
        if (Array.isArray(value)) {
            dynamicQueryOR.push({ [`camposExtras.${key}`]: { $in: value } });
            dynamicQueryOR.push({ [`variantes.campos.${key}`]: { $in: value } });
        } else {
            // 🔍 Si es string único (ej: Material: 'cargo')
            dynamicQueryOR.push({ [`camposExtras.${key}`]: value });
            dynamicQueryOR.push({ [`variantes.campos.${key}`]: value });
        }
    }

    if (dynamicQueryOR.length > 0) {
        andConditions.push({ $or: dynamicQueryOR });
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        const min = minPrice !== undefined ? Number(minPrice) : 0;
        const max = maxPrice !== undefined ? Number(maxPrice) : Number.MAX_SAFE_INTEGER;

        andConditions.push({
            $or: [
                { price: { $gte: min, $lte: max } },
                { variantes: { $elemMatch: { price: { $gte: min, $lte: max } } } }
            ]
        });
    }

    // Componer query final
    const finalQuery = andConditions.length > 0
        ? { ...baseQuery, $and: andConditions }
        : baseQuery;

    const sortOption = sort === "asc" ? { price: 1 }
                     : sort === "desc" ? { price: -1 }
                     : {};

    // 🔍 Para extraer filtros dinámicos actuales (aunque estén paginados)
    const allFiltered = await productsRepository.getAllByRaw(finalQuery);
    const availableFilters = extractAvailableFilters(allFiltered);

    // Paginado
    const paginatedResult = await productsRepository.getAllBy(finalQuery, { page, limit, sort: sortOption });

    return {
        ...paginatedResult,
        availableFilters
    };
};
const extractAvailableFilters = (products) => {
    const filters = {};

    for (const product of products) {
        const countedKeys = new Set(); // para evitar duplicados por producto

        // CamposExtras
        if (product.camposExtras) {
            for (const [key, value] of Object.entries(product.camposExtras)) {
                const values = value.split(",").map(v => v.trim());
                for (const val of values) {
                    if (!filters[key]) filters[key] = {};
                    // solo contar 1 vez por producto
                    if (!filters[key][val]) filters[key][val] = 0;
                    const uniqueKey = `${product._id}_${key}_${val}`;
                    if (!countedKeys.has(uniqueKey)) {
                        filters[key][val] += 1;
                        countedKeys.add(uniqueKey);
                    }
                }
            }
        }

        // Variantes
        if (product.variantes && Array.isArray(product.variantes)) {
            for (const variante of product.variantes) {
                if (variante.campos) {
                    for (const [key, value] of Object.entries(variante.campos)) {
                        const values = value.split(",").map(v => v.trim());
                        for (const val of values) {
                            if (!filters[key]) filters[key] = {};
                            if (!filters[key][val]) filters[key][val] = 0;
                            const uniqueKey = `${product._id}_${key}_${val}`;
                            if (!countedKeys.has(uniqueKey)) {
                                filters[key][val] += 1;
                                countedKeys.add(uniqueKey);
                            }
                        }
                    }
                }
            }
        }
    }

    return filters;
}; */
// SERVICE
const searchProducts = async ({ category, minPrice, maxPrice, filters, sort, page, limit }) => {
    return await getAllBy(
        { category, minPrice, maxPrice, ...filters, sort },
        page,
        limit
    );
};

/* const getAllBy = async (filters, page = 1, limit = 8) => {
    const { minPrice, maxPrice, sort, category, ...rest } = filters;

    const matchConditions = { deleted: false };
    const andConditions = [];

    // 📌 Filtros clásicos y dinámicos
    for (const key of Object.keys(rest)) {
        const value = rest[key];
        if (['title', 'state'].includes(key)) {
            andConditions.push({ [key]: { $regex: value, $options: 'i' } });
        } else {
            if (Array.isArray(value)) {
                andConditions.push({
                    $or: [
                        { [`camposExtras.${key}`]: { $in: value } },
                        { [`variantes.campos.${key}`]: { $in: value } }
                    ]
                });
            } else {
                andConditions.push({
                    $or: [
                        { [`camposExtras.${key}`]: value },
                        { [`variantes.campos.${key}`]: value }
                    ]
                });
            }
        }
    }

    // 📌 Filtro por categoría
    if (category) {
        const allCategoryIds = await getCategoryAndChildrenIds(category);
        matchConditions.category = { $in: allCategoryIds };
    }

    // 🔹 Aggregate pipeline
    const pipeline = [
        { $match: { ...matchConditions, $and: andConditions } },

        // Agregamos effectivePrice dinámico (precio más barato)
        {
            $addFields: {
                effectivePrice: {
                    $cond: [
                        { $gt: [{ $size: "$variantes" }, 0] },
                        {
                            $min: {
                                $concatArrays: [
                                    ["$price"],
                                    { $map: { input: "$variantes", as: "v", in: "$$v.price" } }
                                ]
                            }
                        },
                        "$price"
                    ]
                }
            }
        },

        // Filtrar por rango de precio
        {
            $match: {
                effectivePrice: { 
                    $gte: minPrice !== undefined ? Number(minPrice) : 0,
                    $lte: maxPrice !== undefined ? Number(maxPrice) : Number.MAX_SAFE_INTEGER
                }
            }
        },

        // Ordenar
        {
            $sort: sort === "asc" ? { effectivePrice: 1 } : { effectivePrice: -1 }
        }
    ];

    // 🔹 Paginación con aggregatePaginate
    const options = {
        page,
        limit,
        populate: { path: "category", select: "name parent" },
    };

    const result = await productsModel.aggregatePaginate(pipeline, options);

    // 🔹 Para extraer filtros dinámicos (camposExtras y variantes.campos)
    const allFiltered = await productsRepository.getAllByRaw({ deleted: false }); // sin filtro para contar todos
    const availableFilters = extractAvailableFilters(allFiltered);

    console.log("result: ", result)
    console.log("allFiltered: ", allFiltered)
    console.log("availableFilters: ", availableFilters)

    return {
        ...result,
        availableFilters
    };
}; */
const getAllBy = async (filters, page, limit) => {
    const { minPrice, maxPrice, sort, category, ...rest } = filters;

    const baseQuery = { deleted: false };
    const andConditions = [];

    // Filtro por categoría
    if (category) {
        const allCategoryIds = await getCategoryAndChildrenIds(category);
        andConditions.push({ category: { $in: allCategoryIds } });
    }

    // Filtros clásicos
    for (const key of Object.keys(rest)) {
        const value = rest[key];
        if (['title', 'state'].includes(key)) {
            andConditions.push({ [key]: { $regex: value, $options: 'i' } });
        }
    }

    // Filtros dinámicos
    const dynamicQueryOR = [];
    for (const key of Object.keys(rest)) {
        const value = rest[key];
        if (['title', 'state'].includes(key)) continue;
        if (Array.isArray(value)) {
            dynamicQueryOR.push({ [`camposExtras.${key}`]: { $in: value } });
            dynamicQueryOR.push({ [`variantes.campos.${key}`]: { $in: value } });
        } else {
            dynamicQueryOR.push({ [`camposExtras.${key}`]: value });
            dynamicQueryOR.push({ [`variantes.campos.${key}`]: value });
        }
    }
    if (dynamicQueryOR.length > 0) andConditions.push({ $or: dynamicQueryOR });

    // Rango de precios
    const min = minPrice != null ? Number(minPrice) : 0;
    const max = maxPrice != null ? Number(maxPrice) : Number.MAX_SAFE_INTEGER;
    if (!isNaN(min) && !isNaN(max)) {
        andConditions.push({
            $or: [
                { price: { $gte: min, $lte: max } },
                { variantes: { $elemMatch: { price: { $gte: min, $lte: max } } } }
            ]
        });
    }

    const finalQuery = andConditions.length > 0 ? { ...baseQuery, $and: andConditions } : baseQuery;

    // 🔹 Ordenar por precio más barato entre producto y variantes
    const allFiltered = await productsRepository.getAllByRaw(finalQuery);

    // Agregar un campo virtual "minPriceForSort"
    const docsWithMinPrice = allFiltered.map(p => {
        const variantPrices = p.variantes?.map(v => v.price) || [];
        const allPrices = p.price != null ? [p.price, ...variantPrices] : variantPrices;
        return { ...p, minPriceForSort: Math.min(...allPrices) };
    });

    // Sort real
    docsWithMinPrice.sort((a, b) => {
        if (sort === "asc") return a.minPriceForSort - b.minPriceForSort;
        if (sort === "desc") return b.minPriceForSort - a.minPriceForSort;
        return 0;
    });

    // Paginado manual
    const totalDocs = docsWithMinPrice.length;
    const totalPages = Math.ceil(totalDocs / limit);
    const currentPage = page || 1;
    const start = (currentPage - 1) * limit;
    const end = start + limit;
    const paginatedDocs = docsWithMinPrice.slice(start, end);

    // Filtros dinámicos
    const availableFilters = extractAvailableFilters(allFiltered);

    return {
        docs: paginatedDocs,
        totalDocs,
        totalPages,
        page: currentPage,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
        prevPage: currentPage > 1 ? currentPage - 1 : null,
        availableFilters
    };
};


const extractAvailableFilters = (products) => {
    const filters = {};

    for (const product of products) {
        const countedKeys = new Set();

        // CamposExtras
        if (product.camposExtras) {
            for (const [key, value] of Object.entries(product.camposExtras)) {
                const values = value.split(",").map(v => v.trim());
                for (const val of values) {
                    if (!filters[key]) filters[key] = {};
                    if (!filters[key][val]) filters[key][val] = 0;
                    const uniqueKey = `${product._id}_${key}_${val}`;
                    if (!countedKeys.has(uniqueKey)) {
                        filters[key][val] += 1;
                        countedKeys.add(uniqueKey);
                    }
                }
            }
        }

        // Variantes
        if (product.variantes && Array.isArray(product.variantes)) {
            for (const variante of product.variantes) {
                if (variante.campos) {
                    for (const [key, value] of Object.entries(variante.campos)) {
                        const values = value.split(",").map(v => v.trim());
                        for (const val of values) {
                            if (!filters[key]) filters[key] = {};
                            if (!filters[key][val]) filters[key][val] = 0;
                            const uniqueKey = `${product._id}_${key}_${val}`;
                            if (!countedKeys.has(uniqueKey)) {
                                filters[key][val] += 1;
                                countedKeys.add(uniqueKey);
                            }
                        }
                    }
                }
            }
        }
    }

    return filters;
};
const getIdsByTitle = async (title) => {
    // Llamamos a un repositorio para obtener los productos que coinciden con el título
    const products = await productsRepository.getIdsByTitle(title);
    return products; // Extraemos los _id y los devolvemos como strings
}
const save = async(product) => {
    const products = await productsRepository.getAll();
    const exist = products.find(item => item.title == product.title)
    if(exist) {
        throw new ProductExists('There is already a product with that title');
    }
    const productSaved = await productsRepository.save(product);
    return productSaved;
}
const decreaseStock = async (productId, quantity, session = null) => {
    const product = await productsRepository.getById(productId, session);
    if (!product) throw new Error('Producto no encontrado');

    if (product.stock < quantity) {
        throw new Error(`Stock insuficiente para el producto ${product.title}`);
    }
    product.stock -= quantity;
    await productsRepository.update(productId, product, session);
};
const decreaseVariantStock = async (productId, camposSeleccionados, quantity, session = null) => {
    const product = await productsRepository.getById(productId, session);
    if (!product) throw new Error('Producto no encontrado');

    const varianteIndex = product.variantes.findIndex(v =>
        Object.entries(camposSeleccionados).every(
            ([key, val]) => {
                const valorVariante = v.campos instanceof Map ? v.campos.get(key) : v.campos?.[key];
                return valorVariante?.trim?.().toLowerCase?.() === val.trim().toLowerCase();
            }
        )
    );

    if (varianteIndex === -1) {
        throw new Error(`Variante no encontrada para el producto ${product.title}`);
    }

    const variante = product.variantes[varianteIndex];

    if (variante.stock < quantity) {
        throw new Error(`Stock insuficiente para la variante de ${product.title}`);
    }

    product.variantes[varianteIndex].stock -= quantity;

    await productsRepository.update(productId, product, session);
};

const update = async(pid, productToReplace) => {
    const productUpdated = await productsRepository.update(pid, productToReplace);
    return productUpdated;
}
const updatePricesByCategories = async(categories, percentage) => {
    const productsUpdated = await productsRepository.updatePricesByCategories(categories, percentage);
    return productsUpdated;
}
const restorePricesByCategories = async(categories) => {
    const productsUpdated = await productsRepository.restorePricesByCategories(categories);
    return productsUpdated;
}
const eliminate = async(pid) => {
    const productEliminated = await productsRepository.eliminate(pid);
    return productEliminated;
}
const massDelete = async(ids) => {
    const productsEliminated = await productsRepository.massDelete(ids);
    return productsEliminated;
}
const massDeletePermanent = async(ids) => {
    const productsEliminated = await productsRepository.massDeletePermanent(ids);
    return productsEliminated;
}
const massRestore = async(ids) => {
    const productsEliminated = await productsRepository.massRestore(ids);
    return productsEliminated;
}

export {
    getById,
    getAll,
    navbarSearch,
    getByIdIncludeDeleted,
    updateSoftDelete,
    getDeleted,
    getAllByPage,
    searchProducts,
    getAvailableFiltersByCategory,
    groupedByCategory,
    getAllBy,
    getIdsByTitle,
    save,
    updateRestoreProduct,
    decreaseStock,
    decreaseVariantStock,
    update,
    updatePricesByCategories,
    restorePricesByCategories,
    eliminate,
    massRestore,
    massDeletePermanent,
    massDelete
}