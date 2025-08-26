import * as settingsService from '../services/settings.service.js';
import fs from 'fs';
import path from 'path';

export const getConfig = async (req, res) => {
    try {
        const config = await settingsService.getConfig();
        res.json(config);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const updateConfig = async (req, res) => {
    try {
        const parsedData = JSON.parse(req.body.data); // viene como string
        const images = req.files; // multer procesa esto

         // === OFFERS SLIDER ===
        const oldOffers = parsedData.offersSlider || [];
        const incomingOffers = parsedData.offersSlider || []; 
        const newOfferFiles = images['offersSlider'] || [];

        // Procesar nuevos uploads
        let newOffersFromFiles = newOfferFiles.map((file, index) => ({
            image: path.join('uploads', file.filename).replace(/\\/g, '/'),
            link: '',  // podrías permitir que admin envíe un link
            title: '', // idem para título
            order: oldOffers.length + index // continúa orden
        }));

        // Actualizamos lista combinada
        const updatedOffersSlider = [
            ...incomingOffers.filter(o => o && o.image), // los que quedaron
            ...newOffersFromFiles                        // los nuevos
        ];

        // Detectar eliminados (estaban antes pero no están ahora)
        const deletedOffers = oldOffers.filter(
            oldOffer => !updatedOffersSlider.some(o => o.image === oldOffer.image)
        );

        for (const offer of deletedOffers) {
            if (fs.existsSync(offer.image)) {
                fs.unlinkSync(offer.image);
            }
        }

        // === 1. SITE IMAGES ===
        const siteImageKeys = ['favicon', 'logoStore', 'homeImage', 'aboutImage', 'contactImage'];
        const updatedSiteImages = { ...parsedData.siteImages };

        for (const key of siteImageKeys) {
        if (images[key]) {
            const newFile = images[key][0];
            const newPath = path.join('uploads', newFile.filename).replace(/\\/g, '/');

            // Si había una imagen anterior, eliminarla
            if (parsedData.siteImages[key] && fs.existsSync(parsedData.siteImages[key])) {
            fs.unlinkSync(parsedData.siteImages[key]);
            }

            updatedSiteImages[key] = newPath;
        } else {
            // Si no se actualizó esta imagen, conservar la actual
            updatedSiteImages[key] = parsedData.siteImages[key];
        }
        }

        // === 2. SLIDER LOGOS ===
        const oldSliderLogos = parsedData.sliderLogos || [];
        const incomingSliderLogos = parsedData.sliderLogos || [];

        // Nuevas imágenes desde frontend (agregadas con input type="file")
        const newSliderFiles = images['sliderLogos'] || [];
        const newSliderPaths = newSliderFiles.map((file) =>
        path.join('uploads', file.filename).replace(/\\/g, '/')
        );

        // Nueva lista total (las que quedaron + las nuevas)
        const updatedSliderLogos = [...incomingSliderLogos.filter(Boolean), ...newSliderPaths];

        // Ver cuáles fueron eliminadas (estaban antes pero no están más)
        const deletedSliderLogos = oldSliderLogos.filter(
        (oldPath) => !updatedSliderLogos.includes(oldPath)
        );

        // Borramos del disco las imágenes eliminadas
        for (const oldLogo of deletedSliderLogos) {
        if (fs.existsSync(oldLogo)) {
            fs.unlinkSync(oldLogo);
        }
        }

        // === 3. SOCIAL NETWORK LOGOS ===
        const socialNetworkLogos = images['socialNetworkLogos'] || [];
        
        const updatedSocialNetworks = (parsedData.socialNetworks || []).map((network, index) => {
            if (network.logo && typeof network.logo === 'string' && network.logo.startsWith('__upload__')) {
                const logoFile = socialNetworkLogos.shift(); // Tomamos en orden
                const logoPath = path.join('uploads', logoFile.filename).replace(/\\/g, '/');

                // Borrar logo anterior si se especificó
                const oldPath = network.prevLogoPath;
                if (oldPath && fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }

                return {
                ...network,
                logo: logoPath
                };
            }

            // No se subió nuevo logo → mantener el anterior
            return {
                ...network,
                logo: network.prevLogoPath // asegurate de que esto venga desde el frontend
            };
        });

        // === 3. ACTUALIZACIÓN EN BD ===

        const newSettings = {
            ...parsedData,
            siteImages: updatedSiteImages,
            sliderLogos: updatedSliderLogos,
            socialNetworks: updatedSocialNetworks,
            offersSlider: updatedOffersSlider 
        };
        const updatedConfig = await settingsService.updateConfig(newSettings);
        res.json(updatedConfig);
    } catch (error) {
        console.error('Error actualizando configuración del sitio:', error);
        res.status(500).json({ message: 'Error actualizando configuración del sitio' });
    }
};







