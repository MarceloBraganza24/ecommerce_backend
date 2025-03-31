import * as cartsService from '../services/carts.service.js';

const getAll = async (req, res) => {
    try {
        const carts = await cartsService.getAll();
        res.sendSuccess(carts);
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}

const getById = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartsService.getById(cid);
        res.sendSuccess(cart);
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}
const getByUserId = async (req, res) => {
    try {
        const { uid } = req.params;
        const cart = await cartsService.getByUserId(uid);
        res.sendSuccess(cart);
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}

/* const save = async (req, res) => {
    try {
        const { user_id, products } = req.body;
        if(!products) {
            return res.sendClientError('incomplete values');
        }
        const cartSaved = await cartsService.save(user_id,products)
        res.sendSuccessNewResourse(cartSaved);
    } catch (error) {
        res.sendServerError(error.message); 
        req.logger.error(error.message);
    }
} */

const save = async (req, res) => {
    try {
        const { user_id, products } = req.body;
        
        let cart = await cartsService.getByUserId(user_id);
        //console.log(cart)
        if (cart) {
            // Actualizar carrito existente
            products.forEach(({ product, quantity }) => {
                const existingProduct = cart.products.find(p => p.product.toString() === product);
                if (existingProduct) {
                    existingProduct.quantity += quantity;
                } else {
                    cart.products.push({ product, quantity });
                }
            });
        } else {
            // Crear un nuevo carrito
            const cartSaved = await cartsService.save(user_id,products)
            res.sendSuccessNewResourse(cartSaved);
        }
    } catch (error) {
        res.sendServerError(error.message); 
        req.logger.error(error.message);
    }
}

const update = async (req, res) => {
    try {
        const { cid } = req.params;
        const cartToReplace = req.body;
        if(!cartToReplace.products) {
            return res.status(400).send({ status: 'error', message: 'Incomplete values' });
        }
        const updatedCart = await cartsService.update(cid, cartToReplace);
        res.send({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}
const updateCartQuantity = async (req, res) => {
    try {
        const { id } = req.params;  // ID del producto que queremos actualizar
        const { user_id,quantity } = req.body;

        
        let cart = await cartsService.getByUserId(user_id);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        
        const product = cart.products.find((item) => item.product.toString() === id);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }
        
        product.quantity = quantity;

        const cartUpdated = await cartsService.update(cart._id, cart.products);
        res.sendSuccessNewResourse(cartUpdated);
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}

const eliminate = async (req, res) => {
    try {
        const { cid } = req.params;
        const deletedCart = await cartsService.eliminate(cid);
        res.send({ status: 'success', payload: deletedCart });
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}

const finalizePurchase = async (req, res) => {
    try {
        const { cid } = req.params;
        const purchaser = req.user.email;
        const purchase = await cartsService.purchase(cid, purchaser);
        res.status(201).send({ status: 'success', purchase: purchase });
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}

export {
    getAll,
    getById,
    getByUserId,
    save,
    update,
    updateCartQuantity,
    eliminate,
    finalizePurchase
}