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
        const parsedData = JSON.parse(req.body.data);
        const files = req.files;

        // Traer config actual de BD
        const config = await settingsService.getConfig();

        // === STORE INFO BOXES ===
        const oldInfoBoxes = config.storeInfoBoxes || [];
        const incomingInfoBoxes = parsedData.storeInfoBoxes || [];
        const iconFiles = files['storeInfoIcons'] || [];

        let updatedInfoBoxes = incomingInfoBoxes.map((box, index) => {
            let iconPath = '';

            if (typeof box.icon === 'string' && box.icon.startsWith('__upload__')) {
                // Caso: archivo nuevo subido
                const fileIndex = box.iconFileIndex ?? parseInt(box.icon.replace('__upload__', ''), 10);
                const file = iconFiles[fileIndex];

                if (file) {
                    iconPath = path.join('uploads', file.filename).replace(/\\/g, '/');

                    // Borrar ícono anterior si existía
                    const oldPath = oldInfoBoxes[index]?.icon;
                    if (oldPath && fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath);
                    }
                }
            } else if (typeof box.icon === 'string' && box.icon.trim() !== '') {
                // Mantener string válido
                iconPath = box.icon;
            } else if (oldInfoBoxes[index]?.icon) {
                // Mantener el ícono viejo si no se envió nada
                iconPath = oldInfoBoxes[index].icon;
            }

            return {
                title: box.title || oldInfoBoxes[index]?.title || '',
                description: box.description || oldInfoBoxes[index]?.description || '',
                icon: iconPath
            };
        });

        updatedInfoBoxes = updatedInfoBoxes.slice(0, 3);

        // 🔴 Detectar boxes eliminados
        const deletedBoxes = oldInfoBoxes.filter(
            oldBox => !updatedInfoBoxes.some(newBox => newBox.icon === oldBox.icon)
        );

        // Borrar los archivos de los boxes eliminados
        for (const box of deletedBoxes) {
            if (box.icon && fs.existsSync(box.icon)) {
                fs.unlinkSync(box.icon);
            }
        }

        // === SITE IMAGES ===
        const siteImageKeys = ['favicon', 'logoStore', 'homeImage', 'aboutImage', 'contactImage'];
        const updatedSiteImages = { ...config.siteImages };
        const oldOffers = config.offersSlider || [];

        for (const key of siteImageKeys) {
            if (files[key]) {
                const filePath = path.join('uploads', files[key][0].filename).replace(/\\/g, '/');
                if (updatedSiteImages[key] && fs.existsSync(updatedSiteImages[key])) {
                    fs.unlinkSync(updatedSiteImages[key]);
                }
                updatedSiteImages[key] = filePath;
            }
        }

        const incomingOffers = parsedData.offersSlider || [];
        const newOfferFiles = files["offersSlider"] || [];

        const updatedOffers = incomingOffers.map((offer,index) => {
            
            let imagePath = "";

            if (typeof offer.image === "string" && offer.image.startsWith("__upload__")) {
                const file = newOfferFiles[offer.uploadIndex]; // 🟢 usar uploadIndex
                if (file) {
                imagePath = path.join("uploads", file.filename).replace(/\\/g, "/");
                }
            } else if (typeof offer.image === "string") {
                imagePath = offer.image;
            }

            let filtersObj = {};
            if (Array.isArray(offer.filters)) {
                filtersObj = offer.filters.reduce((acc, cond) => {
                    if (cond.key?.trim() && cond.value != null) {
                        if (cond.key === "category") {
                            // cond.value ya debe ser el objeto de categoría completo
                            acc[cond.key.trim()] = cond.value;
                        } else {
                            acc[cond.key.trim()] = String(cond.value).trim();
                        }
                    }
                    return acc;
                }, {});
            } else if (offer.filters && typeof offer.filters === "object") {
                filtersObj = offer.filters;
            }

            return {
                ...offer,
                image: imagePath,
                filters: filtersObj,
            };
            }).filter(o => o.image && Object.keys(o.filters).length > 0);

        const deletedOffers = oldOffers.filter(
            oldOffer => !updatedOffers.some(o => o.image === oldOffer.image)
        );

        for (const offer of deletedOffers) {
            if (offer.image && fs.existsSync(offer.image)) {
                fs.unlinkSync(offer.image);
            }
        }
        
        // === SLIDER LOGOS ===
        const oldSliderLogos = config.sliderLogos || [];
        const incomingSliderLogos = parsedData.sliderLogos || [];
        const newSliderFiles = files['sliderLogos'] || [];
        const newSliderPaths = newSliderFiles.map(file => path.join('uploads', file.filename).replace(/\\/g, '/'));
        const updatedSliderLogos = [...incomingSliderLogos.filter(Boolean), ...newSliderPaths];

        // Eliminar logos borrados
        const deletedSliderLogos = oldSliderLogos.filter(oldPath => !updatedSliderLogos.includes(oldPath));
        for (const oldLogo of deletedSliderLogos) if (fs.existsSync(oldLogo)) fs.unlinkSync(oldLogo);

        // === SOCIAL NETWORKS ===
        const oldSocialNetworks = config.socialNetworks || [];
        const incomingSocials = parsedData.socialNetworks || [];
        const socialFiles = files['socialNetworkLogos'] || [];

        const updatedSocialNetworks = incomingSocials.map((network, index) => {
            if (network.logoFileIndex != null && socialFiles[network.logoFileIndex]) {
                const logoPath = path.join('uploads', socialFiles[network.logoFileIndex].filename).replace(/\\/g, '/');
                // Eliminar logo antiguo
                const oldPath = oldSocialNetworks[index]?.logo;
                if (oldPath && fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                return { name: network.name, url: network.url, logo: logoPath };
            }
            // Mantener logo existente
            return { name: network.name, url: network.url, logo: oldSocialNetworks[index]?.logo || '' };
        });

        // === GUARDAR EN BD ===
        const newSettings = {
            ...parsedData,
            siteImages: updatedSiteImages,
            offersSlider: updatedOffers,
            sliderLogos: updatedSliderLogos,
            socialNetworks: updatedSocialNetworks,
            storeInfoBoxes: updatedInfoBoxes
        };

        const updatedConfig = await settingsService.updateConfig(newSettings);
        res.json(updatedConfig);

    } catch (error) {
        console.error('Error actualizando configuración del sitio:', error);
        res.status(500).json({ message: 'Error actualizando configuración del sitio' });
    }
};








