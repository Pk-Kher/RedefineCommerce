import { PHPAPI, API } from "helpers/API";

class ComponentService {
    getComponents(id = 0) {
        return API.post(`/CmsComponents/list`)
    }

    // createTemplates(TemplateObj){
    //     return PHPAPI().post(`/template/create`,TemplateObj)
    // }
    // updateTemplates(TemplateObj,id){
    //     return PHPAPI().post(`/template/update/${id}`,TemplateObj)
    // }

}

export default new ComponentService();