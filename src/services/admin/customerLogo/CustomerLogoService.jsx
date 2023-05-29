/*Component Name: CustomerLogoService
Component Functional Details: User can create or update CustomerLogoService master details from here.
Created By: Shrey Patel
Created Date: Current Date
Modified By: Divyesh shah
Modified Date: <Modified Date> */

import { API } from "helpers/API";

class CustomerLogoService {
    getCustomerLogoList(args) {
        return API.post(`/CustomerLogo/list.json`, args);
    }

    SubmitFeedBack(customerObj) {
        return API.post(`/CustomerLogo/submitfeedback.json`, customerObj);
    }

    ApproveLogo(customerObj) {
        return API.post(`/CustomerLogo/approvelogo.json`, customerObj);
    }

    getAllCustomerLogoById(CustomerLogoId) {
        return API.post(`/CustomerLogo/getalllistbycustomerlogoid/${CustomerLogoId}.json`);
    }
};

export default new CustomerLogoService;
