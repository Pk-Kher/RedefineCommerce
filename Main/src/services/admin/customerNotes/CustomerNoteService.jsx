/*Component Name: CustomerNoteService
Component Functional Details: User can create or update CustomerNoteService master details from here.
Created By: Shrey Patel
Created Date: 12/23/2022 
Modified By: Shrey Patel
Modified Date: 12/23/2022  */

import { API } from "helpers/API";

class CustomerNoteService {
  CreateCustomerNotes(customerObj) {
    return API.post(`/CustomerNotes/create.json`, customerObj);
  }

  getListByCustomerId(id) {
    return API.get(`/CustomerNotes/getlistbycustomerid/${id}.json`);
  }

  getCustomerNoteByCompanyId(companyId) {
    return API.get(`/CustomerNotes/getlistbycompanyid/${companyId}.json`);
  }

}

export default new CustomerNoteService();
