import { API } from "helpers/API";

class ShippingService {
  getShippingService(SSObj) {
    return API.post(`/ShippingServices/list.json`, SSObj);
  }
  getShippingServiceById(id) {
    return API.get(`/ShippingServices/get/${id}.json`);
  }
  updateMultipleStatus(SSObj) {
    return API.post(`/ShippingServices/multipleupdatestatusbyids.json`, SSObj);
  }
  updateStatus(SSObj) {
    return API.post(`/ShippingServices/updatestatusbyid.json`, SSObj);
  }
  updateShippingService(SSObj) {
    return API.post(`/ShippingServices/update.json`, SSObj);
  }
  createShippingService(SSObj) {
    return API.post(`/ShippingServices/create.json`, SSObj);
  }
}
export default new ShippingService();
