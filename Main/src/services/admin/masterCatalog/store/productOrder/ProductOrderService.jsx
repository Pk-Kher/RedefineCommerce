/*Component Name: ProductOrderService
Component Functional Details: User can create or update ProductOrderService master details from here.
Created By: Happy
Created Date: <Creation Date>
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import { API } from "helpers/API";

class ProductOrderService {

    getProductOrderList(productObj) {
        return API.post(`/StoreProductDisplayOrder/list.json`, productObj);
    }
    getProductOrderUpdate(productObj) {
        return API.post(`/StoreProductDisplayOrder/createupdateproductdisplayorder.json`, productObj);
    }

}

export default new ProductOrderService();
