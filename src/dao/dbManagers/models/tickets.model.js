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
            },
            selectedVariant: {
                type: mongoose.Schema.Types.Mixed, // Puede contener { campos, price, stock, etc. }
                default: null
            },
            snapshot: { // <- esta es la copia del producto en el momento de la compra
                title: String,
                price: Number,
                image: String,
                variant: {
                    campos: mongoose.Schema.Types.Mixed,
                    price: Number
                }
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
        type: Date,
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
    },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
});

ticketsSchema.pre('findOne', function() {
    this.populate('items.product'); // Asegura que los productos se "populen" correctamente
});

ticketsSchema.pre('find', function() {
    this.populate('items.product'); // Igualmente para el find
});

ticketsSchema.plugin(mongoosePaginate);

export const ticketsModel = mongoose.model(ticketsCollection, ticketsSchema);
