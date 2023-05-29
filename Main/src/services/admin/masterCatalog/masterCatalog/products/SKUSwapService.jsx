import { API } from "helpers/API";

class SKUServices {

    getOurSKUList(productid) {
        return API.get(`MasterProduct/getlistoursku/${productid}.json`);
    }

}

export default new SKUServices();
