import { API } from "helpers/API";

class ShippingCharges {
  getShippingCharges(SCObj) {
    return API.post(`/ShippingCharges/list`, SCObj);
  }
  getShippingChargesById(id) {
    return API.get(`/ShippingCharges/get/${id}.json`);
  }
  createShippingCharges(SCObj) {
    return API.post(`/ShippingCharges/create.json`, SCObj);
  }
  updateShippingCharges(SCObj) {
    return API.post(`/ShippingCharges/update.json`, SCObj);
  }
  updateStatus(SCObj) {
    return API.post(`/ShippingCharges/updatestatusbyid.json`, SCObj);
  }
  updateMultipleStatus(SCObj) {
    return API.post(
      `/ShippingCharges/multipleupdatestatusshippingchargesbyids.json`,
      SCObj
    );
  }
}

export default new ShippingCharges();
