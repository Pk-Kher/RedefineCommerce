import { API } from "helpers/API";

class AppConfigService {
    getAppConfig(obj) {
        return API.post(`/AppConfig/list.json`, obj);
    }
    updateStatus(obj) {
        return API.post(`/AppConfig/updatestatusbyid.json`, obj);
    }
    createUpdateAppConfig(obj) {
        if (obj?.id) {
            return API.post(`/AppConfig/update.json`, { appConfigModel: obj });
        }
        return API.post(`/AppConfig/create.json`, { appConfigModel: obj });
    }
    getAppConfigById(id) {
        return API.get(`/AppConfig/get.json?id=${id}`);
    }
}
export default new AppConfigService();