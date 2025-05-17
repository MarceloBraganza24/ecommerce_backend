import mongoose from 'mongoose';

const settingsCollection = 'settings';

const settingsSchema = new mongoose.Schema({
    storeName: {
        type: String,
        default: ''
    },
    contactEmail: {
        type: String,
        default: ''
    },
    logoUrl: {
        type: String,
        default: ''
    },
    primaryColor: {
        type: String,
        default: '#000000'
    },
    secondaryColor: {
        type: String,
        default: '#ffffff'
    }
}, {
    timestamps: true // Crea automáticamente createdAt y updatedAt
});

export const settingsModel = mongoose.model(settingsCollection, settingsSchema);
