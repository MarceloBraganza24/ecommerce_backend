import * as cartsService from '../services/carts.service.js';
import mongoose from "mongoose"; 

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

const save = async (req, res) => {
    try {
        const { user_id, products } = req.body;
        let cart = await cartsService.getByUserId(user_id);

        if (!cart) {
            // ✅ Si no hay carrito, lo creamos y salimos de la función
            const cartSaved = await cartsService.save(user_id, products);
            return res.sendSuccessNewResourse(cartSaved);
        }

         // ✅ Convertimos `product` a ObjectId antes de comparar
         products.forEach(({ product, quantity }) => {
            const productId = new mongoose.Types.ObjectId(product); // 👈 Convertimos a ObjectId

            // 🔹 Buscamos el producto en el carrito asegurándonos de que los tipos coincidan
            const existingProductIndex = cart.products.findIndex(p => p.product._id.toString() === productId.toString());

            if (existingProductIndex !== -1) {
                // ✅ Si el producto ya está en el carrito, aumentamos la cantidad
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                // ✅ Agregamos el producto si no existe en el carrito
                cart.products.push({ product: productId, quantity });
            }
        });

        // ✅ Guardamos los cambios en MongoDB
        await cartsService.update(cart._id, { products: cart.products });

        return res.sendSuccessNewResourse(cart);

    } catch (error) {
        res.sendServerError(error.message); 
        req.logger.error(error.message);
    }
};
    
    
    
    

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

const updateProductQuantity = async (req, res) => {
    try {
        const { uid } = req.params;
        const { product, quantity } = req.body;

        let cart = await cartsService.getByUserId(uid);
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        const item = cart.products.find(p => p.product._id.toString() === product);
        if (!item) {
            return res.status(404).json({ message: "Producto no encontrado en el carrito" });
        }

        item.quantity = quantity; // Actualiza la cantidad
        await cartsService.update(cart._id, { products: cart.products });

        res.json({ message: "Cantidad actualizada", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

const removeProductFromCart = async (req, res) => {
    try {
        const { user_id, product_id } = req.params;
        // Buscar el carrito del usuario
        let cart = await cartsService.getByUserId(user_id);
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        
        // Filtrar productos, dejando solo los que NO sean el que queremos eliminar
        cart.products = cart.products.filter(p => p.product._id.toString() !== product_id);

        if (cart.products.length == 0) {
            // Si no quedan productos, eliminar el carrito completamente
            await cartsService.eliminate(cart.user_id);
            return res.json({ message: "Carrito eliminado porque no tenía más productos" });
        }

        // Guardar cambios
        await cartsService.update(cart._id, { products: cart.products });

        return res.json({ message: "Producto eliminado del carrito", cart });
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
};


const eliminate = async (req, res) => {
    try {
        const { user_id } = req.params;
        const deletedCart = await cartsService.eliminate(user_id);
        res.status(200).send({ status: 'success', payload: deletedCart });
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}

const finalizePurchase = async (req, res) => {
    try {
        const { cid } = req.params;
        const purchase = await cartsService.purchase(cid);
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
    removeProductFromCart,
    updateProductQuantity,
    eliminate,
    finalizePurchase
}