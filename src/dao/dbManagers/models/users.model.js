import mongoose from 'mongoose';

const usersCollection = 'users';

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
