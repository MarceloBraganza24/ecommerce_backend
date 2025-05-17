import { Settings } from '../dao/factory.js';

export default class SettingsRepository {
    constructor() {
        this.dao = new Settings();
    }
    getConfig = async () => {
        const settings = await this.dao.getConfig();
        return settings;
    }
    updateConfig = async(data) => {
        const configurationUpdated = await this.dao.updateConfig(data);
        return configurationUpdated;
    }
}