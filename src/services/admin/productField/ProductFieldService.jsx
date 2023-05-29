/*Component Name: ProductFieldService
Component Functional Details: User can create or update ProductFieldService master details from here.
Created By: Happy
Created Date: <Creation Date>
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import { API } from "helpers/API";

class ProductFieldService {
  getProductFieldsByStoreId(productFieldObj) {
    return API.post(`/ProductField/list.json`, productFieldObj);
  }
  createProductField(productFieldObj) {
    return API.post(`/ProductField/create.json`, productFieldObj);
  }
  getProductFieldById(id) {
    return API.get(`/ProductField/get/${id}.json`);
  }
  updateProductField(productFieldObj) {
    return API.post(`/ProductField/update.json`, productFieldObj);
  }
  updateStatus(productFieldObj) {
    return API.post(`/ProductField/updatestatusbyid.json`, productFieldObj);
  }
}

export default new ProductFieldService();
