import { API } from "helpers/API";

class BundleStoreService {

    getBundleProducts(productId) {
        return API.get(`/StoreProduct/getbundledetails/${productId}.json`);
    }

}

export default new BundleStoreService();