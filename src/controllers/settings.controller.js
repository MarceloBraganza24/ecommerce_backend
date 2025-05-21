import * as settingsService from '../services/settings.service.js';

export const getConfig = async (req, res) => {
    try {
        const config = await settingsService.getConfig();
        res.json(config);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* export const updateConfig = async (req, res) => {
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
}; */

/* export const updateConfig = async (req, res) => {
    try {
        const parsedData = JSON.parse(req.body.data); // datos normales + urls anteriores
        const images = req.files;

        // URLs anteriores de slider logos e imágenes individuales
        const previousSliderLogos = parsedData.sliderLogosUrls || []; // Array de strings (URLs)
        const previousSiteImages = parsedData.siteImagesUrls || {}; // { favicon: 'url', logoStore: 'url', ... }

        // Procesar imágenes individuales (favicon, logoStore, etc.)
        const siteImages = {
            favicon: images?.favicon?.[0]?.filename 
                ? `uploads/${images.favicon[0].filename}` 
                : previousSiteImages.favicon || '',

            logoStore: images?.logoStore?.[0]?.filename 
                ? `uploads/${images.logoStore[0].filename}` 
                : previousSiteImages.logoStore || '',

            homeImage: images?.homeImage?.[0]?.filename 
                ? `uploads/${images.homeImage[0].filename}` 
                : previousSiteImages.homeImage || '',

            aboutImage: images?.aboutImage?.[0]?.filename 
                ? `uploads/${images.aboutImage[0].filename}` 
                : previousSiteImages.aboutImage || '',

            contactImage: images?.contactImage?.[0]?.filename 
                ? `uploads/${images.contactImage[0].filename}` 
                : previousSiteImages.contactImage || ''
        };

        // Slider logos: combinar anteriores con los nuevos
        const newSliderLogos = images?.sliderLogos?.map(file => `uploads/${file.filename}`) || [];
        const finalSliderLogos = [...previousSliderLogos, ...newSliderLogos];

        const newSettings = {
            ...parsedData,
            siteImages,
            sliderLogos: finalSliderLogos
        };

        const updatedConfig = await settingsService.updateConfig(newSettings);
        res.json(updatedConfig);
    } catch (error) {
        console.error('Error al actualizar configuración:', error);
        res.status(500).json({ error: error.message });
    }
}; */
/* export const updateConfig = async (req, res) => {
    try {
        const parsedData = JSON.parse(req.body.data); // Viene como string
        const images = req.files;

        // URLs anteriores que vienen en el formData
        const siteImagesUrls = req.body.siteImagesUrls ? JSON.parse(JSON.stringify(req.body.siteImagesUrls)) : {};
        // Por si los nombres vienen como strings (como siteImagesUrls[favicon])
        const getImageUrl = (field) => {
            return siteImagesUrls[field] || '';
        };

        // Construir el objeto de imágenes del sitio
        const siteImages = {
            favicon: images?.favicon?.[0]?.filename ? `uploads/${images.favicon[0].filename}` : getImageUrl('favicon'),
            logoStore: images?.logoStore?.[0]?.filename ? `uploads/${images.logoStore[0].filename}` : getImageUrl('logoStore'),
            homeImage: images?.homeImage?.[0]?.filename ? `uploads/${images.homeImage[0].filename}` : getImageUrl('homeImage'),
            aboutImage: images?.aboutImage?.[0]?.filename ? `uploads/${images.aboutImage[0].filename}` : getImageUrl('aboutImage'),
            contactImage: images?.contactImage?.[0]?.filename ? `uploads/${images.contactImage[0].filename}` : getImageUrl('contactImage')
        };

        // Obtener sliderLogos nuevos
        const sliderLogosNew = images?.sliderLogos?.map(file => `uploads/${file.filename}`) || [];

        // Obtener los sliderLogos anteriores
        const sliderLogosOld = req.body['sliderLogosUrls[]']
            ? Array.isArray(req.body['sliderLogosUrls[]'])
                ? req.body['sliderLogosUrls[]']
                : [req.body['sliderLogosUrls[]']] // puede venir como string si es solo uno
            : [];

        const sliderLogos = [...sliderLogosOld, ...sliderLogosNew];

        const newSettings = {
            ...parsedData,
            siteImages,
            sliderLogos
        };

        const updatedConfig = await settingsService.updateConfig(newSettings);
        res.json(updatedConfig);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}; */
export const updateConfig = async (req, res) => {
    try {
        const parsedData = JSON.parse(req.body.data);
        const images = req.files;

        console.log('📨 Datos recibidos desde el frontend:');
        console.log('parsedData:', JSON.stringify(parsedData, null, 2));
        console.log('siteImagesUrls:', req.body.siteImagesUrls);
        console.log('sliderLogosUrls:', req.body['sliderLogosUrls[]'] || req.body.sliderLogosUrls);
        console.log('files:', images);
        console.log('---- FIN DE DATOS ----');

        /* const siteImagesUrls = req.body.siteImagesUrls ? JSON.parse(JSON.stringify(req.body.siteImagesUrls)) : {};

        const normalizeUrl = (url) => {
            if (!url) return '';
            const match = url.match(/uploads\/.+$/);
            return match ? match[0] : url;
        };

        const getImageUrl = (field) => {
            return normalizeUrl(siteImagesUrls[field] || '');
        };

        const siteImages = {
            favicon: images?.favicon?.[0]?.filename ? `uploads/${images.favicon[0].filename}` : getImageUrl('favicon'),
            logoStore: images?.logoStore?.[0]?.filename ? `uploads/${images.logoStore[0].filename}` : getImageUrl('logoStore'),
            homeImage: images?.homeImage?.[0]?.filename ? `uploads/${images.homeImage[0].filename}` : getImageUrl('homeImage'),
            aboutImage: images?.aboutImage?.[0]?.filename ? `uploads/${images.aboutImage[0].filename}` : getImageUrl('aboutImage'),
            contactImage: images?.contactImage?.[0]?.filename ? `uploads/${images.contactImage[0].filename}` : getImageUrl('contactImage')
        };

        const rawSliderLogosOld = req.body['sliderLogosUrls[]'] || req.body.sliderLogosUrls || [];

        const sliderLogosOld = req.body['sliderLogosUrls[]']
            ? Array.isArray(req.body['sliderLogosUrls[]'])
                ? req.body['sliderLogosUrls[]']
                : [req.body['sliderLogosUrls[]']]
            : [];

        const sanitizedSliderLogosOld = sliderLogosOld.filter(url => typeof url === 'string' && url.startsWith('uploads/'));
        const sliderLogosNew = images?.sliderLogos?.map(file => `uploads/${file.filename}`) || [];

        const sliderLogos = [...sanitizedSliderLogosOld, ...sliderLogosNew];

        const newSettings = {
            ...parsedData,
            siteImages,
            sliderLogos
        }; */

        //console.log(newSettings)

        // const updatedConfig = await settingsService.updateConfig(newSettings);
        // res.json(updatedConfig);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};






