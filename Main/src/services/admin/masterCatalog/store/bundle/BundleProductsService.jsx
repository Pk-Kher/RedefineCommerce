import { API } from "helpers/API";

class BundleProductsService {

    getBundleProducts(productId) {
        return API.get(`/Bundle/getbundleproducts/${productId}.json`);
    }
    createProduct(BundleProductObj) {
        return API.post(`Bundle/createupdatebundleproducts.json`, BundleProductObj);
    }

    updateCustomerFaqs(BundleProductObj) {
        return API.post(`StoreProductCustomerFAQ/update.json`, BundleProductObj);
    }

    updateStatus(BundleProductObj) {
        return API.post(`/Bundle/updatestatusbundleproductbyid.json`, BundleProductObj);
    }

    updateProductQuantity(Id, BundleObj) {
        return API.patch(`/Bundle/updatebundleproductspatch/${Id}.json`, BundleObj);
    }
}

export default new BundleProductsService();
