import { API } from "helpers/API";

class CompanyFeedbackServices {

  getCompanyFeedbackId(companyId) {
    return API.get(`/CustomerFeedBack/getlistbycompanyid/${companyId}.json`);
  }

}

export default new CompanyFeedbackServices();
