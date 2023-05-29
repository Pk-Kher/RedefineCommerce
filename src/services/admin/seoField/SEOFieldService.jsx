/*Component Name: SEOFieldService
Component Functional Details: User can create or update SEOFieldService master details from here.
Created By: Happy
Created Date: <Creation Date>
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import { API } from "helpers/API";

class SEOFieldService {
  getProductFieldsByStoreId(seoFieldObj) {
    return API.post(`/SeoProductField/list.json`, seoFieldObj);
  }
  createSeoProductField(seoFieldObj) {
    return API.post(`/SeoProductField/create.json`, seoFieldObj);
  }
  getSeoProductFieldById(id) {
    return API.get(`/SeoProductField/get/${id}.json`);
  }
  updateSeoProductField(seoFieldObj) {
    return API.post(`/SeoProductField/update.json`, seoFieldObj);
  }
  updateStatus(seoFieldObj) {
    return API.post(`/SeoProductField/updatestatusbyid.json`, seoFieldObj);
  }
}

export default new SEOFieldService();
