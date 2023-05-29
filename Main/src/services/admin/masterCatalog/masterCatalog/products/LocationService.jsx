import { API } from "helpers/API";

class LocationService {

    getLogoLocations(logoLocationObj) {
        return API.post(`/MasterProductlocation/list.json`, logoLocationObj);
    }
    create(logoLocationObj) {
        return API.post(`/MasterProductlocation/create.json`, logoLocationObj);
    }
    update(logoLocationObj) {
        return API.post(`/MasterProductlocation/update.json`, logoLocationObj);
    }

}

export default new LocationService();
