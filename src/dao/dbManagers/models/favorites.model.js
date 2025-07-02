import mongoose from 'mongoose';

const favoritesCollection = 'favorites';

const favoritesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        unique: true // Un usuario = una sola lista de favoritos
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products'
        }
    ]
});

favoritesSchema.pre('findOne', function () {
    this.populate('user').populate('products');
});

favoritesSchema.pre('find', function () {
    this.populate('user').populate('products');
});

export const favoritesModel = mongoose.model(favoritesCollection, favoritesSchema);
