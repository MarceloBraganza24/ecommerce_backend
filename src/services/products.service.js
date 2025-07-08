import ProductsRepository from '../repositories/products.repository.js';
import { Products } from '../dao/factory.js';
import { ProductExists } from '../utils/custom.exceptions.js';

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
const getDeleted = async() => {
    const products = await productsRepository.getDeleted();
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
/* const getAllBy = async (filters, page, limit) => {
    const { minPrice, maxPrice, sort, ...rest } = filters;
    const query = {};
    // Agregamos filtros como category, title, etc.
    Object.keys(rest).forEach((key) => {
        query[key] = { $regex: rest[key], $options: "i" };
    });
    // Filtro por rango de precios
    if (minPrice && maxPrice) {
        query.price = {
            $gte: Number(minPrice),
            $lte: Number(maxPrice)
        };
    }
    // Ordenamiento
    const sortOption = sort === "asc" ? { price: 1 } :
                       sort === "desc" ? { price: -1 } :
                       {}; // sin orden

    const result = await productsRepository.getAllBy(query, { page, limit, sort: sortOption });

    return result;
}; */
const getAvailableFiltersByCategory = async (category) => {
    const query = { deleted: false, category };
    const allProducts = await productsRepository.getAllByRaw(query);
    return extractAvailableFilters(allProducts);
};
const getAllBy = async (filters, page, limit) => {
    const { minPrice, maxPrice, sort, ...rest } = filters;

    const baseQuery = { deleted: false };
    const andConditions = [];

    // Filtros clásicos como categoría, título, estado
    for (const key of Object.keys(rest)) {
        const value = rest[key];
        if (['category', 'title', 'state'].includes(key)) {
            andConditions.push({ [key]: { $regex: value, $options: 'i' } });
        }
    }

    // Filtros dinámicos (camposExtras y variantes.campos)
    const dynamicQueryOR = [];

    for (const key of Object.keys(rest)) {
        const value = rest[key];

        // Saltar los filtros clásicos
        if (['category', 'title', 'state'].includes(key)) continue;

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

    // Rango de precios
    if (minPrice && maxPrice) {
        const min = Number(minPrice);
        const max = Number(maxPrice);

        andConditions.push({
            $or: [
                { price: { $gte: min, $lte: max } }, // Siempre que tenga price
                {
                variantes: {
                    $elemMatch: {
                    price: { $gte: min, $lte: max }
                    }
                }
                }
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

    products.forEach(product => {
        // camposExtras
        if (product.camposExtras) {
            for (const [key, value] of Object.entries(product.camposExtras)) {
                if (!filters[key]) filters[key] = new Set();
                value.split(',').map(v => v.trim()).forEach(val => filters[key].add(val));
            }
        }

        // variantes.campos
        product.variantes?.forEach(variant => {
            if (variant.campos) {
                for (const [key, value] of Object.entries(variant.campos)) {
                    if (!filters[key]) filters[key] = new Set();
                    filters[key].add(value);
                }
            }
        });
    });

    // Convertir sets a arrays
    const finalFilters = {};
    for (const [key, set] of Object.entries(filters)) {
        finalFilters[key] = Array.from(set);
    }

    return finalFilters;
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

    // console.log('🧪 Buscando variante para:', product.title);
    // console.log('Campos seleccionados:', camposSeleccionados);
    // console.log('Variantes del producto:', product.variantes.map(v => v.campos));

    const varianteIndex = product.variantes.findIndex(v =>
        Object.entries(camposSeleccionados).every(
            ([key, val]) => {
                const valorVariante = v.campos instanceof Map ? v.campos.get(key) : v.campos?.[key];
                return valorVariante?.trim?.().toLowerCase?.() === val.trim().toLowerCase();
            }
        )
    );

    /* const varianteIndex = product.variantes.findIndex(v =>
        Object.entries(camposSeleccionados).every(
            ([key, val]) => v.campos?.[key] === val
        )
    ); */

    if (varianteIndex === -1) {
        throw new Error(`Variante no encontrada para el producto ${product.title}`);
    }

    const variante = product.variantes[varianteIndex];

    if (variante.stock < quantity) {
        throw new Error(`Stock insuficiente para la variante de ${product.title}`);
    }

    // Descontar el stock de la variante
    //product.variantes[varianteIndex].stock -= quantity;
    //console.log('Stock antes:', product.variantes[varianteIndex].stock);
    product.variantes[varianteIndex].stock -= quantity;
    //console.log('Stock después:', product.variantes[varianteIndex].stock);

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