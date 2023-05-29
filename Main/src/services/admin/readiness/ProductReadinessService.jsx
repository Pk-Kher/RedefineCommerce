/*Component Name: ProductReadinessService
Component Functional Details: User can create or update ProductReadinessService master details from here.
Created By: Happy
Created Date: 06/03/22
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import { API } from "helpers/API";

class ProductReadinessService {
  getProductReadiness(PRObj) {
    return API.post(`/ProductReady/list.json`, PRObj);
  }

  createProductReady(PRObj) {
    return API.post(`/ProductReady/create.json`, PRObj);
  }

  getProductReadyById(id) {
    return API.get(`/ProductReady/get/${id}.json`);
  }

  updateProductReady(PRObj) {
    return API.post(`/ProductReady/update.json`, PRObj);
  }

  updateStatus(PRObj) {
    return API.post(`ProductReady/updatestatusbyid.json`, PRObj);
  }

  updateMultipleStatus(PRObj) {
    return API.post(`/ProductReady/multipleupdatestatusproductreadybyids.json`, PRObj);
  }

  createOrUpdateProductReadyDetails(detailsObj) {
    return API.post(`/ProductReady/updateandcreateproductreadyfield.json`, detailsObj);
  }
}
export default new ProductReadinessService();
