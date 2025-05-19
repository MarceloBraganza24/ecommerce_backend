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
    },
    accentColor: {
        type: String,
        default: '#f39c12'
    },
    phoneNumbers: {
        type: [String], // Arreglo de teléfonos como strings
        default: []
    },
    sliderLogos: {
        type: [String], // Arreglo de teléfonos como strings
        default: []
    },
    siteImages: {
        type: [String], // Arreglo de teléfonos como strings
        default: []
    },
    aboutText: {
        type: String,
        default: ''
    },
    footerLogoText: {
        type: String,
        default: ''
    },
}, {
    timestamps: true // Crea automáticamente createdAt y updatedAt
});

export const settingsModel = mongoose.model(settingsCollection, settingsSchema);