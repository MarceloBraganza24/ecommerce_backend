import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { getAll, getById, save,eliminate } from '../controllers/categories.controller.js';
import { categoriesModel } from '../dao/dbManagers/models/categories.model.js'
import { productsModel } from '../dao/dbManagers/models/products.model.js'
import mongoose from 'mongoose';

function buildTree(categories, parentId = null) {
  return categories
    .filter(cat => String(cat.parent) === String(parentId))
    .map(cat => ({
      ...cat,
      children: buildTree(categories, cat._id)
    }));
}

function getDescendants(categories, parentId) {
  const children = categories.filter(cat => String(cat.parent) === String(parentId));
  return [
    ...children.map(c => c._id.toString()),
    ...children.flatMap(c => getDescendants(categories, c._id))
  ];
}

export default class CategoriesRouter extends Router {
    init() {
        /* this.get('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getAll);
        this.get('/:tid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getById);
        this.post('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, save);
        this.delete('/:cid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, eliminate); */

        this.post("/", [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, async (req, res) => {
            try {
                const { name, parent } = req.body;

                // Convertir parent a ObjectId si existe
                const parentId = parent ? new mongoose.Types.ObjectId(parent) : null;

                const category = new categoriesModel({ name, parent: parentId });
                await category.save();
                res.json(category);
            } catch (error) {
                console.error('Error saving category:', error);
                res.status(500).json({ error: error.message });
            }
        });

        // Obtener árbol completo
        this.get("/", [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, async (req, res) => {
        try {
            const categories = await categoriesModel.find().lean();
            res.json(buildTree(categories));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
        });

        // Obtener lista plana
        this.get("/flat", [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, async (req, res) => {
        try {
            const categories = await categoriesModel.find().lean();
            res.json(categories);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
        });

        // Obtener árbol con deshabilitados (para edición)
        this.get("/tree-for-edit/:id", [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, async (req, res) => {
        try {
            const { id } = req.params;
            const categories = await categoriesModel.find().lean();

            const excludedIds = [id, ...getDescendants(categories, id)];

            const buildTreeWithDisabled = (parentId = null) =>
            categories
                .filter(cat => String(cat.parent) === String(parentId))
                .map(cat => ({
                ...cat,
                disabled: excludedIds.includes(cat._id.toString()),
                children: buildTreeWithDisabled(cat._id)
                }));

            res.json(buildTreeWithDisabled());
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
        });

        // Obtener árbol + lista plana en un solo request
        /* this.get("/combined", [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, async (req, res) => {
        try {
            const categories = await categoriesModel.find().lean();
            const tree = buildTree(categories);
            res.json({ tree, flat: categories });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
        }); */
        /* this.get("/combined", [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, async (req, res) => { 
          try {
            // Traigo todas las categorías y todos los productos
            const categories = await categoriesModel.find().lean();
            const products = await productsModel.find({ deleted: false }).lean();

            // Genero un mapa con la cantidad de productos por categoría
            const counts = {};
            products.forEach(p => {
              const catId = String(p.category);
              counts[catId] = (counts[catId] || 0) + 1;
            });

            // Función para armar el árbol y agregar productCount
            function buildTree(categories, parentId = null) {
              return categories
                .filter(cat => String(cat.parent) === String(parentId))
                .map(cat => ({
                  ...cat,
                  productCount: counts[String(cat._id)] || 0,
                  children: buildTree(categories, cat._id)
                }));
            }

            const tree = buildTree(categories);
            res.json({ tree, flat: categories });
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
        }); */
        this.get("/combined", [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, async (req, res) => { 
          try {
            // Traigo todas las categorías y todos los productos
            const products = await productsModel.find({ deleted: false }).lean();

            // Genero un mapa con la cantidad de productos por categoría
            // Primero construimos un map con la cantidad de productos por categoría
            const countsMap = {};
            products.forEach(prod => {
              if (!prod.category) return;
              const catId = String(prod.category);
              countsMap[catId] = (countsMap[catId] || 0) + 1;
            });

            // Función recursiva
            function buildTree(categories, parentId = null, countsMap) {
              return categories
                .filter(cat => String(cat.parent) === String(parentId))
                .map(cat => {
                  const children = buildTree(categories, cat._id, countsMap);
                  const directCount = countsMap[String(cat._id)] || 0;
                  const childrenCount = children.reduce((sum, child) => sum + child.productCount, 0);

                  return {
                    ...cat,
                    productCount: directCount + childrenCount,
                    children
                  };
                });
            }

            // Ejemplo de uso
            const categories = await categoriesModel.find().lean();
            const tree = buildTree(categories, null, countsMap);
            res.json({ tree });

          } catch (error) {
            res.status(500).json({ error: error.message });
          }
        });

        // Editar categoría
        this.put("/:id", [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, async (req, res) => {
        try {
            const { id } = req.params;
            const { name, parent } = req.body;

            // No se puede ser su propio padre
            if (parent === id) {
            return res.status(400).json({ error: "Una categoría no puede ser su propio padre" });
            }

            // Validar que el padre exista si se pasa
            if (parent) {
            const parentCat = await categoriesModel.findById(parent);
            if (!parentCat) {
                return res.status(404).json({ error: "Categoría padre no encontrada" });
            }
            }

            // Validar que no se mueva dentro de un hijo suyo
            const categories = await categoriesModel.find().lean();
            const descendants = getDescendants(categories, id);
            if (descendants.includes(parent)) {
            return res.status(400).json({ error: "No se puede mover dentro de un descendiente" });
            }

            const updated = await categoriesModel.findByIdAndUpdate(
            id,
            { name, parent: parent || null },
            { new: true }
            );

            if (!updated) {
            return res.status(404).json({ error: "Categoría no encontrada" });
            }

            res.json(updated);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
        });

        // Eliminar categoría (reestructurando hijos al padre de la eliminada)
        this.delete("/:id", [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, async (req, res) => {
        try {
            const { id } = req.params;

            const category = await categoriesModel.findById(id);
            if (!category) {
            return res.status(404).json({ error: "Categoría no encontrada" });
            }

            await categoriesModel.updateMany(
            { parent: id },
            { parent: category.parent || null }
            );

            await categoriesModel.findByIdAndDelete(id);

            res.json({ message: "Categoría eliminada y subcategorías reestructuradas" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
        });
    }
}

// routes/categories.js
// import express from "express";
// import { categoriesModel } from '../dao/dbManagers/models/categories.model.js'

// const router = express.Router();

/* ------------------------------
   Helpers
------------------------------ */


/* ------------------------------
   CRUD Endpoints
------------------------------ */

// Crear categoría
/* router.post("/", async (req, res) => {
  try {
    const { name, parent } = req.body;
    const category = new categoriesModel({ name, parent: parent || null });
    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); */
/* 
// Obtener árbol completo
router.get("/", async (req, res) => {
  try {
    const categories = await categoriesModel.find().lean();
    res.json(buildTree(categories));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener lista plana
router.get("/flat", async (req, res) => {
  try {
    const categories = await categoriesModel.find().lean();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener árbol con deshabilitados (para edición)
router.get("/tree-for-edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const categories = await categoriesModel.find().lean();

    const excludedIds = [id, ...getDescendants(categories, id)];

    const buildTreeWithDisabled = (parentId = null) =>
      categories
        .filter(cat => String(cat.parent) === String(parentId))
        .map(cat => ({
          ...cat,
          disabled: excludedIds.includes(cat._id.toString()),
          children: buildTreeWithDisabled(cat._id)
        }));

    res.json(buildTreeWithDisabled());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener árbol + lista plana en un solo request
router.get("/combined", async (req, res) => {
  try {
    const categories = await categoriesModel.find().lean();
    const tree = buildTree(categories);
    res.json({ tree, flat: categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Editar categoría
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parent } = req.body;

    // No se puede ser su propio padre
    if (parent === id) {
      return res.status(400).json({ error: "Una categoría no puede ser su propio padre" });
    }

    // Validar que el padre exista si se pasa
    if (parent) {
      const parentCat = await categoriesModel.findById(parent);
      if (!parentCat) {
        return res.status(404).json({ error: "Categoría padre no encontrada" });
      }
    }

    // Validar que no se mueva dentro de un hijo suyo
    const categories = await categoriesModel.find().lean();
    const descendants = getDescendants(categories, id);
    if (descendants.includes(parent)) {
      return res.status(400).json({ error: "No se puede mover dentro de un descendiente" });
    }

    const updated = await categoriesModel.findByIdAndUpdate(
      id,
      { name, parent: parent || null },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar categoría (reestructurando hijos al padre de la eliminada)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const category = await categoriesModel.findById(id);
    if (!category) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    await categoriesModel.updateMany(
      { parent: id },
      { parent: category.parent || null }
    );

    await categoriesModel.findByIdAndDelete(id);

    res.json({ message: "Categoría eliminada y subcategorías reestructuradas" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; */
