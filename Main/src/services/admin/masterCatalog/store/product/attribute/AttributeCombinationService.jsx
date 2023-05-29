import { API } from "helpers/API";

class AttributeCombinationService {

    getAttributeCombinationByID(productId) {
        return API.post(`/StoreProductAttributeCombination/list.json?productId=${productId}`);
    }

    createAttributeCombination(AttributesObj) {
        return API.post(`/StoreProductAttributeCombination/addupdate.json`, AttributesObj);
    }

    updateAttributeCombination(AttributesObj) {
        return API.post(`/StoreProductAttributeCombination/update.json`, AttributesObj);
    }

    updateAttributeCombinationStatus(AttributesObj) {
        return API.post(`/StoreProductAttributeCombination/updatestatusbyid.json`, AttributesObj);
    }
}

export default new AttributeCombinationService();
