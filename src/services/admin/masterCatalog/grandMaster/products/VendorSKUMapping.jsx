import { API } from "helpers/API";

class VendorSKUMappingService {

    getVendorSKUMappingData(SKUMapObject) {
        return API.post(`/GrandMasterProductVendorSKUMapping/list.json`, SKUMapObject);
    }
    addVendorSKU(SKUMapObject) {
        return API.post(`/GrandMasterProductVendorSKUMapping/create.json`, SKUMapObject);
    }
    createUpdateVendorSKU(SKUMapObject) {
        return API.post(`/GrandMasterProductVendorSKUMapping/multiplecreateandupdatevendorskumapping.json`, SKUMapObject);
    }

    getVendorListByProductId(productId) {
        return API.get(`/GrandMasterProductVendorSKUMapping/getvendorbyproductid/${productId}.json`);
    }
}

export default new VendorSKUMappingService();
