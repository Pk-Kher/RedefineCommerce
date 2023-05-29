import { API } from "helpers/API";

class SEOService {

    getSEOById(productId) {
        return API.get(`/StoreProductSeo/getseobyproductid/${productId}.json`);
    }

    createSEO(SEOobj) {
        return API.post(`/StoreProductSeo/create.json`, SEOobj);
    }

    updateSEO(SEOobj) {
        return API.post(`/StoreProductSeo/update.json`, SEOobj);
    }

}

export default new SEOService();
