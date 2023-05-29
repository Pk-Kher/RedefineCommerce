/*Component Name: CustomerService
Component Functional Details: User can create or update CustomerService master details from here.
Created By: Pradip
Created Date: 01/06/22
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import { API } from "helpers/API";

class CustomerTagService {
    getCustomerTags(customerId) {
        return API.get(`/CustomerTag/get/${customerId}.json`);
    }
    createCustomerTag(customerTagObj) {
        return API.post(`/CustomerTag/create.json`, customerTagObj);
    }
    updateCustomerTag(customerTagObj) {
        return API.post(`/CustomerTag/update.json`, customerTagObj);
    }
    updateStatus(customerTagObj) {
        return API.post(`/CustomerTag/updatestatusbyid.json`, customerTagObj);
    }
    getCustomerTagByCompanyId(customerId) {
        return API.get(`/CustomerTag/GetCustomerTagByCompanyid/${customerId}.json`);
    }
}
export default new CustomerTagService();
