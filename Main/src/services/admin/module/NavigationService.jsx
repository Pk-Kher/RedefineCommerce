import { API } from "helpers/API";

class NavigationService {
  getNavigations(navigationObj) {
    return API.post(`/ModuleNavigation/list.json`, navigationObj);
  }

  getNavigationsById(id) {
    return API.get(`/ModuleNavigation/get/${id}.json`);
  }

  createNavigation(navigationObj) {
    return API.post("/ModuleNavigation/create.json", navigationObj);
  }

  updateNavigation(navigationObj) {
    return API.post("/ModuleNavigation/update.json", navigationObj);
  }
  updateMultipleStatus(navigationObj) {
    return API.post(`/ModuleNavigation/multipleupdateAcsessRightmodulestatusbyids.json`, navigationObj);
  }
  getDropdownValues(navigationObj) {
    return API.get(`/ModuleNavigation/getmodule/${navigationObj}.json`);
  }
}

export default new NavigationService();
