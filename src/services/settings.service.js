import SettingsRepository from '../repositories/settings.repository.js';

const settingsManager = new SettingsRepository();

const getConfig = async () => {
    const settings = await settingsManager.getConfig();
    return settings;
}
const updateConfig = async () => {
    const configurationUpdated = await settingsManager.updateConfig();
    return configurationUpdated;
}

export {
    updateConfig,
    getConfig,
}