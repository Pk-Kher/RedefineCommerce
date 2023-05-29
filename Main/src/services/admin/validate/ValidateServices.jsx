import { API } from "helpers/API";

class ValidateService {
    getMasterCatalogValidateProductStatus(productId) {
        return API.post(`/ValidateProduct/GetMasterCatalogValidateProductStatus/${productId}.json`);
    }
    getGMasterCatalogValidateProductStatus(productId) {
        return API.post(`/ValidateProduct/GetGrandMasterValidateProductStatus/${productId}.json`);
    }
}

export default new ValidateService();
