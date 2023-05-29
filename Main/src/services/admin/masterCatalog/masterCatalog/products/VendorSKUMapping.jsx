import { API } from "helpers/API";

class VendorSKUMappingService {
    getVendorSKUMappingData(SKUMapObject) {
        return API.post(`/MasterProductVendorSKUMapping/list.json`, SKUMapObject);
    }
    addVendorSKU(SKUMapObject) {
        return API.post(`/MasterProductVendorSKUMapping/create.json`, SKUMapObject);
    }
    createUpdateVendorSKU(SKUMapObject) {
        return API.post(`/MasterProductVendorSKUMapping/multiplecreateandupdatevendorskumapping.json`, SKUMapObject);
    }
}

export default new VendorSKUMappingService();
