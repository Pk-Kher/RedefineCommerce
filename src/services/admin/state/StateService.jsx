import { API } from "helpers/API";

class StateService {
    getStateByCountryId(countryId) {
        return API.get(`/StateMaster/getstatebycountryid/${countryId}.json`);
    }
    getStateByCountryName(countryName) {
        return API.get(`/StateMaster/getstatebycountryname/${countryName}.json`);
    }
}

export default new StateService();
