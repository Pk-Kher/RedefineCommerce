import { API } from "helpers/API";

class AttributesService {

    getAttributesByID(productId) {
        return API.get(`/StoreProductAttribute/getattribute/${productId}.json`);
    }

    createAttributes(AttributesObj) {
        return API.post(`/StoreProductAttribute/createattribute.json`, AttributesObj);
    }
}

export default new AttributesService();
