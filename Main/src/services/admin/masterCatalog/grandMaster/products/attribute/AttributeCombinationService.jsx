import { API } from "helpers/API";

class AttributeCombinationService {
    getAttributeCombinationByID(productId) {
        return API.post(`/GrandMasterProductAttributeCombination/list.json?productId=${productId}`);
    }

    createAttributeCombination(AttributesObj) {
        return API.post(`/GrandMasterProductAttributeCombination/addupdate.json`, AttributesObj);
    }

    updateAttributeCombinationStatus(AttributesObj) {
        return API.post(`/GrandMasterProductAttributeCombination/updatestatusbyid.json`, AttributesObj);
    }

}

export default new AttributeCombinationService();
