import { API } from "helpers/API";

class AttributesService {

    getAttributesByID(productId) {
        return API.get(`/StoreProductAttribute/getattribute/${productId}.json`);
    }

    createAttributes(AttributesObj) {
        return API.post(`/StoreProductAttribute/createattribute.json`, AttributesObj);
    }

    updateAttributes(AttributesObj) {
        return API.post(`/StoreProductAttribute/updateattribute.json`, AttributesObj);
    }

    syncWithStore(AttributesObj) {
        return API.post(`/StoreProductAttribute/storeproductattributelink.json`, AttributesObj);
    }
}

export default new AttributesService();
