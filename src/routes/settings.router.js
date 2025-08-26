import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { getConfig,updateConfig} from '../controllers/settings.controller.js';
import uploader from "../utils/upload.js";

export default class SettingsRouter extends Router {
    init() {
        this.get('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getConfig);
        this.put('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, uploader.fields([
                { name: 'favicon', maxCount: 1 },
                { name: 'logoStore', maxCount: 1 },
                { name: 'offersSlider', maxCount: 20 },
                { name: 'homeImage', maxCount: 1 },
                { name: 'aboutImage', maxCount: 1 },
                { name: 'contactImage', maxCount: 1 },
                { name: 'sliderLogos', maxCount: 10 }, // si también estás enviando logos múltiples
                { name: 'socialNetworkLogos', maxCount: 10 } // 👈 añadí esto
            ]),
            updateConfig
        );
    }
}