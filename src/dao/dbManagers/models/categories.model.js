/* import mongoose from 'mongoose';

const categoriesCollection = 'categories';

const categoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category_datetime: {
        type: String,
        required: true
    },
});

export const categoriesModel = mongoose.model(categoriesCollection, categoriesSchema); */
import mongoose from 'mongoose';

const categoriesCollection = 'categories';

const categoriesSchema = new mongoose.Schema({
    name: { type: String, required: true },
    parent: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories',
        default: null // null si es categoría raíz
    },
    description: { type: String },
});

export const categoriesModel = mongoose.model(categoriesCollection, categoriesSchema);

