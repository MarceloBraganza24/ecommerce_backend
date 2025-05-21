import * as settingsService from '../services/settings.service.js';

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
        const images = req.files;
        
        // Construí el objeto de imágenes del sitio
        const siteImages = {
        favicon: images?.favicon?.[0]?.filename ? `uploads/${images.favicon[0].filename}` : '',
        logoStore: images?.logoStore?.[0]?.filename ? `uploads/${images.logoStore[0].filename}` : '',
        homeImage: images?.homeImage?.[0]?.filename ? `uploads/${images.homeImage[0].filename}` : '',
        aboutImage: images?.aboutImage?.[0]?.filename ? `uploads/${images.aboutImage[0].filename}` : '',
        contactImage: images?.contactImage?.[0]?.filename ? `uploads/${images.contactImage[0].filename}` : ''
        };

        const sliderLogos = images?.sliderLogos?.map(file => `uploads/${file.filename}`) || [];

        const newSettings = {
            ...parsedData,
            siteImages,
            sliderLogos
        };
        //console.log(newSettings)
        const updatedConfig = await settingsService.updateConfig(newSettings);
        res.json(updatedConfig);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
