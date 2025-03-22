import * as productsService from '../services/products.service.js';
import crypto from 'crypto'

const generateImageHash = (filePath) => {
    const fileBuffer = fs.readFileSync(filePath);
    const hash = crypto.createHash('sha256');
    hash.update(fileBuffer);
    return hash.digest('hex');
};

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
        const { title,description,price,stock,category } = req.body;
        const images = req.files;

        let propiedades = {};
        
        // Si propiedades llegó como string JSON, parsealo
        if (req.body.propiedades) {
            propiedades = JSON.parse(req.body.propiedades);
        }

        // Ahora propiedades es un objeto
        //console.log(propiedades);

        // Validaciones
        if (!title || !description || !price || !stock || !category || !images || images.length === 0) {
            return res.status(400).json({ message: 'Faltan campos requeridos.' });
        }

        const imagePaths = images.map(file => file.path);

        const registeredProduct = await productsService.save({
            images: imagePaths,
            title,
            description,
            price,
            stock,
            category,
            camposExtras: propiedades
        });

        res.sendSuccessNewResourse(registeredProduct);
    } catch (error) {
        res.sendServerError(error.message);  
        req.logger.error(error.message);
    }
};


/* const update = async (req, res) => {
    try {
        const { pid } = req.params;
        const { title, description, price, stock, category, propiedades, imagenesAnteriores } = req.body;

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
            category,
            propiedades: propiedadesParsed,
            images: imagenesFinales
        });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        //await productsService.update(pid, productToReplace);

    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
} */

const update = async (req, res) => {
    try {
        const { pid } = req.params;
    
        // Campos de texto normales
        const { title, description, price, stock, category, propiedades, imagenesAnteriores } = req.body;

        const propiedadesParsed = JSON.parse(propiedades);
        const imagenesAnterioresParsed = JSON.parse(imagenesAnteriores);
        const imagenesAnterioresConPrefijo = imagenesAnterioresParsed.map(img => img.startsWith('uploads/') ? img : `uploads/${img}`);

        // Archivos nuevos subidos
        const nuevasImagenes = req.files.map(file => `uploads/${file.filename}`);
        
        // Concatenar imágenes anteriores y nuevas
        const imagenesFinales = [...imagenesAnterioresConPrefijo, ...nuevasImagenes];
        const updatedProduct = await productsService.update(pid, {
            title,
            description,
            price,
            stock,
            category,
            propiedades: propiedadesParsed,
            images: imagenesFinales
        });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.sendSuccessNewResourse(updatedProduct);

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

export {
    getAll,
    getById,
    save,
    update,
    eliminate
}