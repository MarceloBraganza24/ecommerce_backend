import SettingsRepository from '../repositories/settings.repository.js';

const settingsManager = new SettingsRepository();

const getConfig = async () => {
    const settings = await settingsManager.getConfig();
    return settings;
}
const updateConfig = async (data) => {
    const configurationUpdated = await settingsManager.updateConfig(data);
    return configurationUpdated;
}

export {
    updateConfig,
    getConfig,
}