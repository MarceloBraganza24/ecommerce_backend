import mongoose from 'mongoose';

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products'
                },
                quantity: {
                    type: Number,
                    default: 1
                },
                selectedVariant: { type: Object, default: {} } 
            }
        ],
        default: []
    }
});

cartsSchema.pre('findOne', function() {
    this.populate('products.product');
});

cartsSchema.pre('find', function() {
    this.populate('products.product');
});

export const cartsModel = mongoose.model(cartsCollection, cartsSchema);
