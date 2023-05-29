import { PHPAPI } from "helpers/API";

class TemplateService {
    getTemplates(id) {
        return PHPAPI().post(`/templates/${id}`)
    }

    createTemplates(TemplateObj) {
        return PHPAPI().post(`/template/create`, TemplateObj)
    }
    updateTemplates(TemplateObj, id) {
        return PHPAPI().post(`/template/update/${id}`, TemplateObj)
    }
    updateTemplateComponents(TemplateObj, id) {
        return PHPAPI().post(`/template/component/update/${id}`, TemplateObj)
    }
    getTemplateComponents(id) {
        return PHPAPI().get(`/template/component/get/${id}`)
    }
}

export default new TemplateService();