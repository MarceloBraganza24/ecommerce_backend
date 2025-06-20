import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productsCollection = 'products';

const productsSchema = new mongoose.Schema({
    images: {
        type: [String],
        default: [],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    originalPrice: {
        type: Number,
        required: false
    },
    stock: {
        type: Number,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    number_sales: {
        type: Number,
        default: 0,
    },
    camposExtras: {
        type: Map,       // Almacena clave-valor dinámicamente
        of: String
    },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
});

productsSchema.plugin(mongoosePaginate);

export const productsModel = mongoose.model(productsCollection, productsSchema);
