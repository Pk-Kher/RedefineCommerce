import { API } from "helpers/API";

class BundleService {

    getBundleProducts(bundleObj) {
        return API.post(`MasterProduct/getbundleproductsbyid.json`, bundleObj);
    }

}

export default new BundleService();