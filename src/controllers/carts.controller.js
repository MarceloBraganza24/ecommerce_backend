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

        // Función segura para obtener el ID
        const getProductId = p => (p.product._id || p.product).toString();

        // Función robusta para comparar variantes
        const variantsAreEqual = (v1, v2) => {
            if (v1 == null && v2 == null) return true;
            if (v1 == null || v2 == null) return false;
            return _.isEqual(v1.campos, v2.campos);
        };

        // ⚖️ Test rápido del comparador
        // console.log("⚖️ Test rápido de variantsAreEqual:");
        // console.log("undefined vs undefined:", variantsAreEqual(undefined, undefined));
        // console.log("null vs undefined:", variantsAreEqual(null, undefined));
        // console.log("{} vs undefined:", variantsAreEqual({}, undefined));
        // console.log("undefined vs {}:", variantsAreEqual(undefined, {}));

        if (!cart) {
            // ✅ Carrito nuevo
            //console.log("🆕 No existía carrito, lo creamos...");
            const cartSaved = await cartsService.save(user_id, products);
            return res.sendSuccessNewResourse(cartSaved);
        }

        /* console.log("🛒 Carrito existente. Contenido actual:");
        cart.products.forEach((p, i) => {
            console.log(`- Producto ${i}:`, {
                id: getProductId(p),
                quantity: p.quantity,
                selectedVariant: p.selectedVariant
            });
        }); */

        products.forEach(({ product, quantity, selectedVariant }) => {
            const productId = new mongoose.Types.ObjectId(product);

            /* console.log("\n📦 Producto nuevo a agregar:");
            console.log({
                product: productId.toString(),
                quantity,
                selectedVariant
            }); */

            const existingProductIndex = cart.products.findIndex(p => {
                const existingProductId = getProductId(p);
                const variantsMatch = variantsAreEqual(p.selectedVariant, selectedVariant);

                // console.log("🔍 Comparando con producto en carrito:");
                // console.log("  ID existente:", existingProductId);
                // console.log("  ID nuevo:    ", productId.toString());
                // console.log("  Variante existente:", p.selectedVariant);
                // console.log("  Variante nueva:    ", selectedVariant);
                // console.log("  Coinciden variantes:", variantsMatch);

                return existingProductId === productId.toString() && variantsMatch;
            });

            if (existingProductIndex !== -1) {
                //console.log("✅ Producto ya existe, sumando cantidad...");
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                //console.log("➕ Producto no existe en carrito, agregando nuevo...");
                cart.products.push({ product: productId, quantity, selectedVariant });
            }
        });

        await cartsService.update(cart._id, { products: cart.products });
        //console.log("💾 Carrito actualizado correctamente");

        return res.sendSuccessNewResourse(cart);

    } catch (error) {
        //console.error("❌ Error en save cart:", error.message);
        res.sendServerError(error.message);
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
const removeProductFromCart = async (req, res) => {
    try {
        const { user_id, product_id } = req.params;
        const { selectedVariant } = req.body;

        const normalizeVariantCampos = (campos = {}) => {
            const result = {};
            for (const [key, val] of Object.entries(campos)) {
                result[String(key).toLowerCase()] = String(val).toLowerCase().trim();
            }
            return result;
        };

        const variantsAreEqual = (v1, v2) => {
            // Si ambos están ausentes (null o undefined), consideralos iguales
            if (!v1 && !v2) return true;

            // Si solo uno está presente, no son iguales
            if (!v1 || !v2) return false;

            // Comparación por campos
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
                p.product._id?.toString() === product_id &&
                variantsAreEqual(p.selectedVariant, selectedVariant);
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