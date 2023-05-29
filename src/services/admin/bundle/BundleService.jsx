import { API } from "helpers/API";

class BundleService {
  getBundles(bundleObj) {
    return API.post(`Bundle/list.json`, bundleObj);
  }
  createBundles(bundleObj) {
    return API.post(`Bundle/create.json`, bundleObj);
  }

  getBundleByID(id) {
    return API.get(`Bundle/get/${id}.json`);
  }

  updateBundles(bundleObj) {
    return API.post(`Bundle/update.json`, bundleObj);
  }
  updateStatus(bundleObj) {
    return API.post(`/Bundle/updatestatusbyid.json`, bundleObj);
  }
}

export default new BundleService();
