import { API } from "helpers/API";

class AttributesService {

    getAttributesByID(productId) {
        return API.get(`/MasterProductAttribute/getattribute/${productId}.json`);
    }

    createAttributes(AttributesObj) {
        return API.post(`/MasterProductAttribute/createattribute.json`, AttributesObj);
    }

    updateAttributes(AttributesObj) {
        return API.post(`/MasterProductAttribute/updateattribute.json`, AttributesObj);
    }
}

export default new AttributesService();
