import * as productsService from '../services/products.service.js';
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
        const deletedProducts = await productsService.getDeleted();
        res.status(200).json({ status: 'success', payload: deletedProducts });
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
} 
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
        const { title,description,price,stock,state,category } = req.body;
        const images = req.files;
        let propiedades = {};
        if (req.body.propiedades) {
            propiedades = JSON.parse(req.body.propiedades);
        }
        if (!title || !description || !price || !stock || !state || !category || !images || images.length === 0) {
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
            camposExtras: propiedades
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
        const { title, description, price, stock, state, category, propiedades, imagenesAnteriores } = req.body;
        const propiedadesParsed = JSON.parse(propiedades);
        const imagenesAnterioresParsed = JSON.parse(imagenesAnteriores);
        const imagenesAnterioresConPrefijo = imagenesAnterioresParsed.map(img => img.startsWith('uploads/') ? img : `uploads/${img}`);
        const nuevasImagenes = req.files.map(file => `uploads/${file.filename}`);
        const imagenesFinales = [...imagenesAnterioresConPrefijo, ...nuevasImagenes];
        const updatedProduct = await productsService.update(pid, {
            title,
            description,
            price,
            stock,
            state,
            category,
            camposExtras: propiedadesParsed,
            images: imagenesFinales
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
        const product = await productsService.getById(pid);

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

    await productsService.massDelete(ids); // asumimos que tu service tiene esta función
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
    getDeleted,
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
    massDeletePermanent
}