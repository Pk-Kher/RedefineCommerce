import { API } from "helpers/API";

class VendorSKUMapping {
    getVendorSKUMappingData(SKUMapObject) {
        return API.post(`/StoreProductVendorSKUMapping/list.json`, SKUMapObject);
    }
    addVendorSKU(SKUMapObject) {
        return API.post(`/StoreProductVendorSKUMapping/create.json`, SKUMapObject);
    }
    createUpdateVendorSKU(SKUMapObject) {
        return API.post(`/StoreProductVendorSKUMapping/multiplecreateandupdatevendorskumapping.json`, SKUMapObject);
    }
    getVendorListByProductId(productId) {
        return API.get(`/StoreProductVendorSKUMapping/getvendorbyproductid/${productId}.json`);
    }
}

export default new VendorSKUMapping();
