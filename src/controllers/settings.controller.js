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

/* export const updateConfig = async (req, res) => {
    try {
        const parsedData = JSON.parse(req.body.data);
        const images = req.files;

        console.log('📨 Datos recibidos desde el frontend:');
        console.log('parsedData:', JSON.stringify(parsedData, null, 2));
        console.log('siteImagesUrls:', req.body.siteImagesUrls);
        console.log('sliderLogosUrls:', req.body['sliderLogosUrls[]'] || req.body.sliderLogosUrls);
        console.log('files:', images);
        console.log('---- FIN DE DATOS ----');

        const siteImagesUrls = req.body.siteImagesUrls ? JSON.parse(JSON.stringify(req.body.siteImagesUrls)) : {};

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
        };

        //console.log(newSettings)

        // const updatedConfig = await settingsService.updateConfig(newSettings);
        // res.json(updatedConfig);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}; */


/* export const updateConfig = async (req, res) => {
    try {
        const parsedData = JSON.parse(req.body.data); // Viene como string
        const images = req.files;

        console.log('parsedData: ',parsedData)
        console.log(' ')
        console.log('images: ',images)

        const parsedData = JSON.parse(req.body.data);

        // 1. Actualizar imágenes individuales (favicon, logoStore, etc.)
        parsedData.siteImages = parsedData.siteImages || {};

        const singleImageFields = ['favicon', 'logoStore', 'homeImage', 'aboutImage', 'contactImage'];

        singleImageFields.forEach(field => {
        if (req.files[field] && req.files[field][0]) {
            // Si llegó archivo nuevo para este campo, reemplazar URL antigua por la nueva
            parsedData.siteImages[field] = 'uploads/' + req.files[field][0].filename;
        }
        // Si no llegó archivo, mantiene la URL antigua que ya está en parsedData.siteImages[field]
        });

        // 2. Actualizar sliderLogos (es un array de URLs)

        let existingSliderLogos = parsedData.sliderLogos || [];  // URLs antiguas

        // Si llegaron archivos nuevos para sliderLogos, los agregamos como URLs nuevas
        if (req.files.sliderLogos) {
        const newSliderUrls = req.files.sliderLogos.map(file => 'uploads/' + file.filename);
        // Concatenamos las nuevas URLs con las antiguas
        existingSliderLogos = existingSliderLogos.concat(newSliderUrls);
        }

        // Asignamos el array completo actualizado
        parsedData.sliderLogos = existingSliderLogos;

        // const updatedConfig = await settingsService.updateConfig(newSettings);
        // res.json(updatedConfig);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}; */


import fs from 'fs';
import path from 'path';

export const updateConfig = async (req, res) => {
  try {
    const parsedData = JSON.parse(req.body.data); // viene como string
    const images = req.files; // multer procesa esto

    /* const siteId = parsedData._id;
    const site = await SiteModel.findById(siteId);

    if (!site) {
      return res.status(404).json({ message: 'Configuración de sitio no encontrada' });
    } */

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

    // === 3. ACTUALIZACIÓN EN BD ===
    /* const updatedSite = await SiteModel.findByIdAndUpdate(
      siteId,
      {
        ...parsedData,
        siteImages: updatedSiteImages,
        sliderLogos: updatedSliderLogos,
      },
      { new: true }
    );

    res.status(200).json({ message: 'Configuración actualizada', data: updatedSite }); */
    const newSettings = {
        ...parsedData,
        siteImages: updatedSiteImages,
        sliderLogos: updatedSliderLogos,
    };
    const updatedConfig = await settingsService.updateConfig(newSettings);
    res.json(updatedConfig);
  } catch (error) {
    console.error('Error actualizando configuración del sitio:', error);
    res.status(500).json({ message: 'Error actualizando configuración del sitio' });
  }
};







