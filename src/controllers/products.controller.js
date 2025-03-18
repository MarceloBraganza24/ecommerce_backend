import * as productsService from '../services/products.service.js';

const getAll = async (req, res) => {
    try {
        const { page = 1 } = req.query;            
        const products = await productsService.getAll(page);
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
        const { title, description, price, stock, size, color, state, category } = req.body;
        const images = req.files;
    
        // Validaciones
        if (!title || !description || !price || !stock || !size || !color || !state || !category) {
          return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
        }
    
        if (Number(price) <= 0 || Number(stock) < 0) {
          return res.status(400).json({ message: 'Precio o stock inválidos.' });
        }
    
        if (!images || images.length === 0) {
          return res.status(400).json({ message: 'Debes subir al menos una imagen.' });
        }
    
        const imagePaths = images.map(file => file.path);

        const registeredProduct = await productsService.save({
            title,
            description,
            price,
            stock,
            size,
            color,
            state,
            category,
            images: imagePaths
        });
    
        res.sendSuccessNewResourse(registeredProduct);
    } catch (error) {
        res.sendServerError(error.message);  
        req.logger.error(error.message);
    }

    /* try {
        const { title, description, stock, price, thumbnail, category, code, owner } = req.body;
        if(!title || !description || !stock || !price || !category || !code) {
            return res.sendClientError('incomplete values');
        }
        const registeredProduct = await productsService.save({
            title,
            description,
            stock,
            price,
            thumbnail,
            category,
            code,
            owner
        });
        res.sendSuccessNewResourse(registeredProduct);
    } catch (error) {
        res.sendServerError(error.message);  
        req.logger.error(error.message);
    } */
}

const update = async (req, res) => {
    try {
        const { pid } = req.params;
        const productToReplace = req.body;
        if(!productToReplace.title || !productToReplace.stock || !productToReplace.description || !productToReplace.price || !productToReplace.thumbnail || !productToReplace.category || !productToReplace.code ||!productToReplace.owner) {
            return res.status(400).send({ status: 'error', message: 'Incomplete values' });
        }
        if(req.user.role === 'premium') {
            if(productToReplace.owner === req.user.email) {
                await productsService.update(pid, productToReplace);
                res.send({ data: `El producto con ID ${pid} se modificó correctamente` });
            } else {
                res.send({ data: 'Este usuario no tiene permitido modificar productos' });
            }
        } else if(req.user.role === 'admin') {
            await productsService.update(pid, productToReplace);
            res.send({ data: `El producto con ID ${pid} se modificó correctamente` });
        }
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}

const eliminate = async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productsService.getById(pid);
        if(req.user.role === 'premium') {
            if(product.owner === req.user.email) {
                await productsService.eliminate(pid);
                res.send({ data: `El producto con ID ${pid} se eliminó correctamente` });
            } else {
                res.send({ data: 'Este usuario no tiene permitido eliminar productos' });
            }
        } else if(req.user.role === 'admin') {
            await productsService.eliminate(pid);
            res.send({ data: `El producto con ID ${pid} se eliminó correctamente` });
        }
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}

export {
    getAll,
    getById,
    save,
    update,
    eliminate
}