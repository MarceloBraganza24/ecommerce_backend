import * as productsService from '../services/products.service.js';
import * as categoriesService from '../services/categories.service.js';
import { ProductExists } from '../utils/custom.exceptions.js';

const getAll = async (req, res) => {
    try {
        const products = await productsService.getAll();
        res.sendSuccess(products);
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
} 
const getDeleted = async (req, res) => {
    try {
        const { search = "" } = req.query;
        let query = { deleted: true };

        if (search) {
            query['title'] = { $regex: search, $options: 'i' };
        }

        const deletedProducts = await productsService.getDeleted(query);
        res.status(200).json({ status: 'success', payload: deletedProducts });
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
};

// Helper recursivo para encontrar la raíz de una categoría
async function getRootCategory(categoryId) {
  let category = await categoriesService.getById(categoryId);
  while (category && category.parent) {
    category = await categoriesService.getById(category.parent);
  }
  return category;
}

const getFeatured = async (req, res) => {
    try {
        const featuredProducts = await productsService.getFeatured();

        // Agrupar por categoría raíz
        const grouped = {};
        for (const product of featuredProducts) {
            const rootCat = await getRootCategory(product.category._id);
            const rootName = rootCat?.name || product.category.name;

            if (!grouped[rootName]) {
                grouped[rootName] = [];
            }
            grouped[rootName].push(product);
        }

        res.status(200).json({ status: 'success', payload: grouped });
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
};

const searchProducts = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, filters, sort, page, limit } = req.body;

        //console.log(req.body)

        const result = await productsService.searchProducts({
            category,
            minPrice,
            maxPrice,
            filters,
            sort,
            page,
            limit
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllBy = async (req, res) => {
    try {
        const { page = 1, limit = 8, sort, minPrice, maxPrice, ...filters } = req.query;

        const result = await productsService.getAllBy(
            { ...filters, minPrice, maxPrice, sort },
            page,
            limit
        );

        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
};
const getAvailableFilters = async (req, res) => {
    try {
        const { category } = req.query;

        if (!category) return res.sendUserError("Falta categoría");

        const filters = await productsService.getAvailableFiltersByCategory(category);
        res.sendSuccess(filters);
    } catch (error) {
        res.sendServerError(error.message);
    }
};
const groupedByCategory = async (req, res) => {
    try {
        const limit = 10;
        const groupedProducts = await productsService.groupedByCategory(limit);
        res.sendSuccess(groupedProducts);
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
};
const navbarSearch = async (req, res) => {
    try {
        const { search = "" } = req.query;

        // Si no hay término de búsqueda, no devuelvas nada (opcional)
        if (!search.trim()) {
            return res.sendSuccess([]);
        }

        const query = {
            deleted: false,
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ].filter(Boolean)
        };

        //const products = await productsService.getAllByPage(query).limit(50); // límite de seguridad
        const products = await productsService.navbarSearch(query);
        res.sendSuccess(products);
    } catch (error) {
        req.logger.error(error.message);
        res.sendServerError(error.message);
    }
};


const getAllByPage = async (req, res) => {
    try {
        const { page = 1, limit = 25, search = "", field = "" } = req.query;

        let query = {};
        if (search) {
            if (field === 'all') {
                query = {
                    $or: [
                        { title: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } },
                        { category: { $regex: search, $options: 'i' } },
                        { state: { $regex: search, $options: 'i' } },
                        { price: isNaN(search) ? undefined : Number(search) },
                        { stock: isNaN(search) ? undefined : Number(search) },
                    ].filter(Boolean) // elimina los undefined
                };
            } else if (['price', 'stock'].includes(field)) {
                query[field] = isNaN(search) ? undefined : Number(search);
            } else {
                query[field] = { $regex: search, $options: "i" };
            }
        }
        const products = await productsService.getAllByPage(query, { page, limit });
        res.sendSuccess(products);
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
};
const getById = async (req, res) => {
    try {
        const { pid } = req.params;            
        const product = await productsService.getById(pid);
        res.sendSuccess(product);
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
} 
const updateSoftDelete = async (req, res) => {
    try {
        const { pid } = req.params;
        const updatedProduct = await productsService.updateSoftDelete(pid)
        res.status(200).json({ message: 'Producto eliminado (soft delete)', product: updatedProduct });
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
} 
const updateRestoreProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const updatedProduct = await productsService.updateRestoreProduct(pid)
        res.status(200).json({ message: 'Producto eliminado (soft delete)', product: updatedProduct });
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
} 

const save = async (req, res) => {
    try {
        const { title,description,price,stock,state,category,isFeatured  } = req.body;
        const images = req.files;
        let propiedades = {};
        if (req.body.propiedades) {
            propiedades = JSON.parse(req.body.propiedades);
        }
        let variantes = [];
        if (req.body.variantes) {
            variantes = JSON.parse(req.body.variantes);
        }
        if (!title || !description || !state || !category || !images || images.length === 0) {
            return res.status(400).json({ message: 'Faltan campos requeridos.' });
        }
        const imagePaths = images.map(file => file.path);

        const registeredProduct = await productsService.save({
            images: imagePaths,
            title,
            description,
            price,
            stock,
            state,
            category,
            camposExtras: propiedades,
            variantes,
            isFeatured: isFeatured === 'true'
        });
        res.sendSuccessNewResourse(registeredProduct);
    } catch (error) {
        res.sendServerError(error.message);  
        req.logger.error(error.message);
    }
};
const update = async (req, res) => {
    try {
        const { pid } = req.params;
        const { title, description, price, stock, state, category,isFeatured, propiedades, imagenesAnteriores } = req.body;
        const propiedadesParsed = JSON.parse(propiedades);
        const imagenesAnterioresParsed = JSON.parse(imagenesAnteriores);
        const imagenesAnterioresConPrefijo = imagenesAnterioresParsed.map(img => img.startsWith('uploads/') ? img : `uploads/${img}`);
        const nuevasImagenes = req.files.map(file => `uploads/${file.filename}`);
        const imagenesFinales = [...imagenesAnterioresConPrefijo, ...nuevasImagenes];
        let variantes = [];
        if (req.body.variantes) {
            variantes = JSON.parse(req.body.variantes);
        }

        const updatedProduct = await productsService.update(pid, {
            title,
            description,
            price,
            stock,
            state,
            category,
            isFeatured: isFeatured === 'true',
            camposExtras: propiedadesParsed,
            images: imagenesFinales,
            variantes
            //...(variantes.length > 0 && { variantes }) // Solo si hay variantes
        });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.sendSuccessNewResourse(updatedProduct);
    } catch (error) {
        if(error instanceof ProductExists) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}
const updatePricesByCategories = async (req, res) => {
    try {
        const { categories, percentage } = req.body;
        const result = await productsService.updatePricesByCategories(categories, percentage);
        res.json({
            message: 'Precios actualizados correctamente.',
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}
const restorePricesByCategories = async (req, res) => {
    try {
        const { categories } = req.body;

        if (!categories || !Array.isArray(categories) || categories.length === 0) {
            return res.status(400).json({ error: 'Debes seleccionar al menos una categoría' });
        }

        const result = await productsService.restorePricesByCategories(categories);

        return res.status(200).json({ 
            message: 'Precios restaurados correctamente', 
            modifiedCount: result.modifiedCount 
        });
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}
const eliminate = async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productsService.getByIdIncludeDeleted(pid);

        if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
        }
        const deletedProduct = await productsService.eliminate(pid);
        res.sendSuccessNewResourse(deletedProduct);


    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}
const massDelete = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'IDs inválidos' });
    }

    await productsService.massDelete(ids);
    res.sendSuccess('Productos eliminados');

  } catch (error) {
    req.logger.error(error.message);
    res.sendServerError(error.message);
  }
};
const massDeletePermanent = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'IDs inválidos' });
    }

    await productsService.massDeletePermanent(ids); // asumimos que tu service tiene esta función
    res.sendSuccess('Productos eliminados permanentemente');

  } catch (error) {
    req.logger.error(error.message);
    res.sendServerError(error.message);
  }
};
const massRestore = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'IDs inválidos' });
        }

        await productsService.massRestore(ids); // asumimos que tu service tiene esta función
        res.sendSuccess('Productos restaurados');

    } catch (error) {
        req.logger.error(error.message);
        res.sendServerError(error.message);
    }
};

export {
    getAll,
    searchProducts,
    getDeleted,
    getFeatured,
    navbarSearch,
    getAllBy,
    updateRestoreProduct,
    getAllByPage,
    getById,
    updateSoftDelete,
    save,
    update,
    updatePricesByCategories,
    restorePricesByCategories,
    eliminate,
    massRestore,
    massDelete,
    groupedByCategory,
    getAvailableFilters,
    massDeletePermanent
}