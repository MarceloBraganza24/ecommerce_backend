import * as cartsService from '../services/carts.service.js';
import mongoose from "mongoose"; 
import _ from 'lodash';

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

        products.forEach(({ product, quantity, selectedVariant }) => {
            const productId = new mongoose.Types.ObjectId(product);

            /* const existingProductIndex = cart.products.findIndex(p => 
                p.product._id.toString() === productId.toString() &&
                JSON.stringify(p.selectedVariant) === JSON.stringify(selectedVariant)
            ); */
            const existingProductIndex = cart.products.findIndex(p => 
                p.product._id.toString() === productId.toString() &&
                _.isEqual(p.selectedVariant, selectedVariant)
            );

            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity, selectedVariant });
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
/* const updateProductQuantity = async (req, res) => {
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
}; */
const updateProductQuantity = async (req, res) => {
    try {
        const { uid } = req.params;
        const { product, quantity, selectedVariant } = req.body;

        let cart = await cartsService.getByUserId(uid);
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        const item = cart.products.find(p => 
            p.product._id.toString() === product &&
            JSON.stringify(p.selectedVariant) === JSON.stringify(selectedVariant)
        );

        if (!item) {
            return res.status(404).json({ message: "Producto no encontrado en el carrito con esa variante" });
        }

        item.quantity = quantity;

        await cartsService.update(cart._id, { products: cart.products });

        res.json({ message: "Cantidad actualizada", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

/* const removeProductFromCart = async (req, res) => {
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
}; */
/* const removeProductFromCart = async (req, res) => {
    try {
        const { user_id, product_id } = req.params;
        const { selectedVariant } = req.body;

        let cart = await cartsService.getByUserId(user_id);
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        cart.products = cart.products.filter(p =>
            !(
                p.product._id.toString() === product_id &&
                JSON.stringify(p.selectedVariant) === JSON.stringify(selectedVariant)
            )
        );

        if (cart.products.length === 0) {
            await cartsService.eliminate(cart.user_id);
            return res.json({ message: "Carrito eliminado porque no tenía más productos" });
        }

        await cartsService.update(cart._id, { products: cart.products });
        return res.json({ message: "Producto eliminado del carrito", cart });
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}; */
const removeProductFromCart = async (req, res) => {
    try {
        const { user_id, product_id } = req.params;
        const { selectedVariant } = req.body;

        console.log("=== Eliminando producto del carrito ===");
        console.log("Producto ID recibido:", product_id);
        console.log("Variante recibida:", selectedVariant);

        const normalizeVariantCampos = (campos = {}) => {
            const result = {};
            for (const [key, val] of Object.entries(campos)) {
                result[String(key).toLowerCase()] = String(val).toLowerCase().trim();
            }
            return result;
        };

        const variantsAreEqual = (v1, v2) => {
            if (!v1 || !v2) return false;

            const campos1 = normalizeVariantCampos(v1.campos);
            const campos2 = normalizeVariantCampos(v2.campos);

            const keys1 = Object.keys(campos1);
            const keys2 = Object.keys(campos2);

            if (keys1.length !== keys2.length) return false;

            return keys1.every(key => campos1[key] === campos2[key]);
        };

        let cart = await cartsService.getByUserId(user_id);
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        const originalLength = cart.products.length;

        cart.products = cart.products.filter(p => {
            const matches =
                p.product._id.toString() === product_id &&
                variantsAreEqual(p.selectedVariant, selectedVariant);

            if (!matches) {
                console.log("⛔ No coincide con:", {
                    product: p.product,
                    selectedVariant: p.selectedVariant,
                });

                console.log("🧪 Comparando:");
                console.log("Product ID en carrito:", p.product._id.toString());
                console.log("Product ID recibido:", product_id);
                console.log("Campos carrito:", normalizeVariantCampos(p.selectedVariant.campos));
                console.log("Campos recibidos:", normalizeVariantCampos(selectedVariant.campos));
            }

            return !matches;
        });

        if (cart.products.length === originalLength) {
            return res.status(404).json({ message: "Producto no encontrado en el carrito" });
        }

        if (cart.products.length === 0) {
            await cartsService.eliminate(cart.user_id);
            return res.json({ message: "Carrito eliminado porque no tenía más productos" });
        }

        await cartsService.update(cart._id, { products: cart.products });
        return res.json({ message: "Producto eliminado del carrito", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
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