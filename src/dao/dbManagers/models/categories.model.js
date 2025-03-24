import mongoose from 'mongoose';

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

export const categoriesModel = mongoose.model(categoriesCollection, categoriesSchema);
