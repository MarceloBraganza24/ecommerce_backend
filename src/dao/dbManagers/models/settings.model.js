import mongoose from 'mongoose';

const settingsCollection = 'settings';

const settingsSchema = new mongoose.Schema({
    storeName: {
        type: String,
        default: ''
    },
    contactEmail: {
        type: [{
            email: { type: String, required: true },
            label: { type: String, default: 'General' },
            selected: { type: Boolean, default: false }
        }],
        default: []
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
        type: [
            {
                number: {
                    type: String,
                    required: true
                },
                selected: {
                    type: Boolean,
                    default: false
                }
            }
        ],
        default: []
    },
    sliderLogos: {
        type: [String], // Arreglo de imagenes sliders como strings
        default: []
    },
    offersSlider: {
        type: [
            {
                image: { type: String, required: true }, // ruta al archivo
                link: { type: String, default: '' },     // opcional: a dónde lleva la oferta
                title: { type: String, default: '' },    // opcional: texto
                order: { type: Number, default: 0 }      // 👈 para ordenar en el front
            }
        ],
        default: []
    },
    siteImages: {
        type: new mongoose.Schema({
            favicon: { type: String, default: '' },
            logoStore: { type: String, default: '' },
            homeImage: { type: String, default: '' },
            aboutImage: { type: String, default: '' },
            contactImage: { type: String, default: '' }
        }, { _id: false }),
        default: () => ({})
    },
    aboutText: {
        type: String,
        default: ''
    },
    footerLogoText: {
        type: String,
        default: ''
    },
    copyrightText: {
        type: String,
        default: ''
    },
    socialNetworks: {
        type: [{
            name: { type: String, required: true },   // Nombre de la red (ej: "Facebook")
            url: { type: String, required: true },    // Enlace (ej: "https://facebook.com/tu_pagina")
            logo: { type: String, required: true }    // Ruta al logo (ej: "uploads/facebook.png")
        }],
        default: []
    }
}, {
    timestamps: true // Crea automáticamente createdAt y updatedAt
});

export const settingsModel = mongoose.model(settingsCollection, settingsSchema);