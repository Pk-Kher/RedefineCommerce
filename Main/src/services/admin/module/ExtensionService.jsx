import { API } from "helpers/API";

class ExtensionService {
  createExtension(extensionObj) {
    return API.post(`/ModuleExtension/create.json`, extensionObj);
  }

  getExtensionById(id) {
    return API.get(`/ModuleExtension/get/${id}.json`);
  }

  updateExtension(extensionObj) {
    return API.post(`/ModuleExtension/update.json`, extensionObj);
  }
  updateMultipleStatus(extensionObj) {
    return API.post(`/ModuleExtension/multipleupdateAcsessRightstatusbyids.json`, extensionObj);
  }
}

export default new ExtensionService();
