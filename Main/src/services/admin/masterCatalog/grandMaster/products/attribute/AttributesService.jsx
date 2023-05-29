import { API } from "helpers/API";

class AttributesService {

    getAttributesByID(productId) {
        return API.get(`/GrandMasterProductAttribute/getattribute/${productId}.json`);
    }

    createAttributes(AttributesObj) {
        return API.post(`/GrandMasterProductAttribute/createattribute.json`, AttributesObj);
    }

    updateAttributes(AttributesObj) {
        return API.post(`/GrandMasterProductAttribute/updateattribute.json`, AttributesObj);
    }
}

export default new AttributesService();
