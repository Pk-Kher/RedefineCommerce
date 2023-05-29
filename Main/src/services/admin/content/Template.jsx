import { API } from "helpers/API";

class TemplateService {
  getComponents(templateObj) {
    return API.post(`/Category/list.json`, categoryObj);
  }

}

export default new TemplateService();
