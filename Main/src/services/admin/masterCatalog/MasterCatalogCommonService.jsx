import { API } from "helpers/API";

class MasterCatalogCommonService {
    validateProduct(productId, productType) {
        return API.post(`/ValidateProduct/GetValidateTabMissing/${productId}/${productType}.json`);
    }
}

export default new MasterCatalogCommonService();