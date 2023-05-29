const { API } = require("helpers/API");

class MailServices {
    sendEmail(mailObj) {
        return API.post('/Mail/sendmail.json', mailObj);
    }
    getEmailByCustomerId(mailObj) {
        return API.post(`/Mail/getemailloglist.json`, mailObj);
    }
    getEmailByDetailsId(mailObj) {
        return API.post('/Mail/getemaillogdetaillist.json', mailObj);
    }
    // reSendEmail(mailObj) {
    //     return API.post('/Mail/resendmail.json', mailObj);
    // }
    getEmailByDetailsById(id) {
        return API.get(`/Mail/getemaillogdetailsbyemaillog/${id}.json`);
    }
    reSendEmail(mailObj) {
        return API.post('/Mail/customerresendmail.json', mailObj);
    }
}
export default new MailServices();