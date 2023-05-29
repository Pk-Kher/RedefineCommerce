import { API } from "helpers/API";

class VendorSKUMappingService {

    getVendorSKUMappingData(SKUMapObject) {
        return API.post(`/MasterProductVendorSKUMapping/list.json`, SKUMapObject);
    }
    addVendorSKU(AttributesObj) {
        return API.post(`/MasterProductVendorSKUMapping/create.json`, AttributesObj);
    }
    createUpdateVendorSKU(AttributesObj) {
        return API.post(`/MasterProductVendorSKUMapping/multiplecreateandupdatevendorskumapping.json`, AttributesObj);
    }
}

export default new VendorSKUMappingService();
