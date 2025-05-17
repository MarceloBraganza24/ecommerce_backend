import { settingsModel } from '../dbManagers/models/settings.model.js'

export default class SettingsManager {
    async getConfig() {
        return await settingsModel.findOne();
    }
    async updateConfig(data) {
        let config = await settingsModel.findOne();
        if (!config) {
            return await settingsModel.create(data);
        }
        Object.assign(config, data);
        return await config.save();
    }
}
