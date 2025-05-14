import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const ticketsCollection = 'tickets';

const ticketsSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    mp_payment_id: {
        type: String,
        //required: true
    },
    status: String,
    amount: Number,
    payer_email: String,
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products', // Referencia al modelo de productos
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    shippingAddress: {
        street: String,
        street_number: String,
        locality: String,
        postal_code: String,
        province: String
    },
    deliveryMethod: {
        type: String,
        required: true
    },
    purchase_datetime: {
        type: String,
        required: true
    },
    user_role: {
        type: String,
        required: true
    },
    visibility: {
        user: {
            type: Boolean,
            default: true
        }
    }
});

ticketsSchema.pre('findOne', function() {
    this.populate('items.product'); // Asegura que los productos se "populen" correctamente
});

ticketsSchema.pre('find', function() {
    this.populate('items.product'); // Igualmente para el find
});

ticketsSchema.plugin(mongoosePaginate);

export const ticketsModel = mongoose.model(ticketsCollection, ticketsSchema);
