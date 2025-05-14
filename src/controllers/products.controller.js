import * as productsService from '../services/products.service.js';
import { ProductExists } from '../utils/custom.exceptions.js';
import {productsModel} from '../dao/dbManagers/models/products.model.js';

const getAll = async (req, res) => {
    try {
        const products = await productsService.getAll();
        res.sendSuccess(products);
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
} 

const getAllBy = async (req, res) => {
    try {
        const { page = 1, limit, ...filters } = req.query;

        // Convertimos `page` y `limit` a números
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit);

        // Construimos el filtro dinámico
        const query = {};
        Object.keys(filters).forEach((key) => {
            query[key] = { $regex: filters[key], $options: "i" };
        });

        // Contamos el total de productos que cumplen con el filtro
        const totalProducts = await productsModel.countDocuments(query);

        // Calculamos el total de páginas
        const totalPages = Math.ceil(totalProducts / limitNumber);

        // Determinamos si hay páginas anteriores o siguientes
        const hasPrevPage = pageNumber > 1;
        const hasNextPage = pageNumber < totalPages;

        // Definimos las páginas anterior y siguiente
        const prevPage = hasPrevPage ? pageNumber - 1 : null;
        const nextPage = hasNextPage ? pageNumber + 1 : null;

        // Obtenemos los productos de la página actual
        const products = await productsModel.find(query)
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        // Devolvemos la respuesta con la paginación
        res.json({
            data: products,
            totalProducts,
            totalPages,
            currentPage: pageNumber,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
        });
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
} 
const getAllByPage = async (req, res) => {
    try {
        const { page = 1, limit = 25, search = "" } = req.query;      
        const query = search ? { title: { $regex: search, $options: "i" } } : {};

        const products = await productsService.getAllByPage(query, { page, limit });
        res.sendSuccess(products);
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
} 

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

export {
    getAll,
    getAllBy,
    getAllByPage,
    getById,
    save,
    update,
    eliminate
}