import { settingsModel } from '../dbManagers/models/settings.model.js'

export default class SettingsManager {
    /* async getConfig() {
        return await settingsModel.findOne();
    }
    async updateConfig(data) {
        const config = await settingsModel.findOne();

        if (!config) {
            return await settingsModel.create(data);
        }

        const updated = await settingsModel.findOneAndUpdate(
            { _id: config._id },
            { $set: data },
            { new: true } // Devuelve el documento actualizado
        );

        return updated;
    } */
   async getConfig() {
        return await settingsModel.findOne();
    }

    async updateConfig(data) {
        const config = await settingsModel.findOne();
        if (!config) return await settingsModel.create(data);
        return await settingsModel.findOneAndUpdate({ _id: config._id }, { $set: data }, { new: true });
    }
}
