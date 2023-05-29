import { API } from "helpers/API";

class AttributesService {
  getAttributes(AttributesObj) {
    return API.post(`/AttributesType/list.json`, AttributesObj);
  }
  createAttributes(AttributesObj) {
    return API.post(`AttributesType/create.json`, AttributesObj);
  }

  getAttributesByID(id) {
    return API.get(`AttributesType/get/${id}.json`);
  }

  updateAttributes(AttributesObj) {
    return API.post(`AttributesType/update.json`, AttributesObj);
  }

  updateStatus(AttributesObj) {
    return API.post(`/AttributesType/updatestatusbyid.json`, AttributesObj);
  }
}

export default new AttributesService();
