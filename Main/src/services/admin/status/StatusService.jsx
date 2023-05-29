import { API } from "helpers/API";

class StatusService {
    getAllStatus(statusObj) {
        return API.post(`/Status/list.json`, statusObj);
    }
}

export default new StatusService();