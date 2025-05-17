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
        console.log(req.body)
        // const updatedConfig = await settingsService.updateConfig(req.body);
        // res.json(updatedConfig);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
