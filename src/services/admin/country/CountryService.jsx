import { API } from "helpers/API";

class CountryService {
    getCountry() {
        return API.post(`/CountryMaster/getcountrylist.json`);
    }
    getCountryWithCode() {
        return API.post(`/CountryMaster/getcountrylistwithcode.json`);
    }
}

export default new CountryService();
