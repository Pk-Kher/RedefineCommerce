/*Component Name: ShippingMethod
Component Functional Details: User can create or update ShippingMethod master details from here.
Created By: Bhargav
Created Date: 16/01/2023
Modified By: <Modified By>
Modified Date: <Modified Date> */

import { API } from "helpers/API";

class ShippingMethod {
  getShippingMethods(SMObj) {
    return API.post(`/ShippingMethods/list.json`, SMObj);
  }
  getShippingMethodsById(id) {
    return API.get(`/ShippingMethods/get/${id}.json`);
  }
  createShippingMethod(SMObj) {
    return API.post(`/ShippingMethods/create.json`, SMObj);
  }
  updateShippingMethod(SMObj) {
    return API.post(`/ShippingMethods/update.json`, SMObj);
  }
  updateStatus(SMObj) {
    return API.post(`/ShippingMethods/updatestatusbyid.json`, SMObj);
  }
  updateMultipleStatus(SMObj) {
    return API.post(`/ShippingMethods/multipleupdatestatusbyids.json`, SMObj);
  }
}

export default new ShippingMethod();
