import { API } from "helpers/API";

class AttributeCombinationService {

    getAttributeCombinationByID(productId) {
        return API.post(`/MasterProductAttributeCombination/list.json?productId=${productId}`);
    }

    createAttributeCombination(AttributesObj) {
        return API.post(`/MasterProductAttributeCombination/addupdate.json`, AttributesObj);
    }

    updateAttributeCombination(AttributesObj) {
        return API.post(`/MasterProductAttributeCombination/update.json`, AttributesObj);
    }

    updateAttributeCombinationStatus(AttributesObj) {
        return API.post(`/MasterProductAttributeCombination/updatestatusbyid.json`, AttributesObj);
    }
}

export default new AttributeCombinationService();
