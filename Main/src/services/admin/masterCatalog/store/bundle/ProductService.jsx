import { API } from "helpers/API";

class ProductService {

    getStoreProducts(BundleObj) {
        return API.post('/Bundle/list.json', BundleObj)
    }

    getBundleProductById(productId) {
        return API.get(`/Bundle/get/${productId}.json`);
    }

    createProduct(BundleObj) {
        return API.post(`/Bundle/create.json`, BundleObj);
    }

    updateBundleProduct(BundleObj) {
        return API.post(`/Bundle/updatebasicinfo.json`, BundleObj);
    }

    updateStoreProductPricing(BundleObj) {
        return API.post(`/Bundle/updatepricing.json`, BundleObj);
    }

    updateProductOtherFields(Id, BundleObj) {
        return API.patch(`Bundle/update/${Id}.json`, BundleObj);
    }

    getSKUList(productId) {
        return API.get(`/Bundle/getlistoursku/${productId}.json`);
    }

    updateProduct(BundleObj) {
        return API.post(`/Bundle/updatebasicinfo.json`, BundleObj);
    }

    updateProductPricing(BundleObj) {
        return API.post(`/Bundle/updatepricing.json`, BundleObj);
    }

    updateStatus(brandObj) {
        return API.post(`/Bundle/updatestatusbyid.json`, brandObj);
    }
}

export default new ProductService();
