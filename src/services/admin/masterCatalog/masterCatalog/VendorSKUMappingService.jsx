import { API } from "helpers/API";

class VendorSKUMappingService {

    getVendorSKUMappingData(SKUMapObject) {
        return API.post(`/MasterProductVendorSKUMapping/list.json`, SKUMapObject);
    }

    createAttributes(AttributesObj) {
        return API.post(`/MasterProductAttribute/createattribute.json`, AttributesObj);
    }

    updateAttributes(AttributesObj) {
        return API.post(`/MasterProductAttribute/updateattribute.json`, AttributesObj);
    }

    getVendorListByProductId(productId) {
        return API.get(`/MasterProductVendorSKUMapping/getvendorbyproductid/${productId}.json`);
    }
}

export default new VendorSKUMappingService();
