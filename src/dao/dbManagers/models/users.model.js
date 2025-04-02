import mongoose from 'mongoose';

const usersCollection = 'users';

const AddressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    street_number: { type: String, required: true },
    locality: { type: String, required: true },
    province: { type: String, required: true },
    country: { type: String, required: true },
    postal_code: { type: String, required: true },
    dpto: { type: String, required: true },
    indications: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: Number, required: true },
});

const usersSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'user'
    },
    carts: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products',
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
        default: []
    },
    documents: {
        type: [
            {
                name: {
                    type: String
                },
                reference: {
                    type: String
                }
            }
        ],
        default: []
    },
    addresses: [AddressSchema], // Lista de domicilios
    selected_addresses: { 
        type: AddressSchema, // Objeto con la misma estructura que `domicilios`
        default: null 
    },
    last_connection: {
        type: String,
    },
    isLoggedIn: {
        type: Boolean,
        default: false
    },
    user_datetime: {
        type: String,
        required: true
    }
});

export const usersModel = mongoose.model(usersCollection, usersSchema);
