import { API } from "helpers/API";

class MessageServices {
    getEmailTemplate(emailTemplateObj) {
        return API.post(`/emailtemplate/getlistemailtemplate.json`, emailTemplateObj);
    }
    getEmailTemplateById(emailTemplateId) {
        return API.get(`/emailtemplate/get/${emailTemplateId}.json`)
    }
    getEmailTemplateByStoreId(storeId) {
        return API.get(`/emailtemplate/getemailtemplatebystoreid/${storeId}.json`)
    }
    updateMultipleStatus(emailTemplateObj) {
        return API.post(
            `/emailtemplate/multipleupdatestatusemailtemplate.json`,
            emailTemplateObj
        );
    }
    updateStatus(emailTemplateObj) {
        return API.post(`/emailtemplate/updatestatusemailtemplate.json`, emailTemplateObj);
    }
    updateEmailTemplate(emailTemplateObj) {
        return API.post(`/emailtemplate/updateemailtemplate.json`, emailTemplateObj);
    }
    createEmailTemplate(emailTemplateObj) {
        return API.post(`/emailtemplate/createemailtemplate.json`, emailTemplateObj);
    }
}
export default new MessageServices();