import { API } from "helpers/API";

class ModuleService {
  getNestedModules() {
    return API.post(`/AdminRole/module.json`);
  }
  getModules(moduleObj) {
    return API.post(`/ModuleNavigation/modulelist.json`, moduleObj);
  }
  changeSequence(moduleObj) {
    return API.post(`/ModuleNavigation/changesequence.json`, moduleObj);
  }
}

export default new ModuleService();
