import { API } from "helpers/API";

class SKUServices {

    getOurSKUList(productid) {
        return API.get(`StoreProduct/getlistoursku/${productid}.json`);
    }

}

export default new SKUServices();
