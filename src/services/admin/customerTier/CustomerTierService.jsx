/*Component Name: CustomerService
Component Functional Details: User can create or update CustomerService master details from here.
Created By: Pradip
Created Date: 01/06/22
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import { API } from "helpers/API";

class CustomerTierService {
    getCustomerTiers(customerId) {
        return API.get(`/CustomerTier/getcustomertierbycustomerid/${customerId}.json`);
    }
    createCustomerTier(customerTierObj) {
        return API.post(`/CustomerTier/create.json`, customerTierObj);
    }
    getCustomerTierById(id) {
        return API.get(`/CustomerTier/get/${id}.json`);
    }
    updateCustomerTier(customerTierObj) {
        return API.post(`/CustomerTier/update.json`, customerTierObj);
    }
    deleteCustomerTier(customerTierObj) {
        return API.post(`/CustomerTier/delete.json`, customerTierObj);
    }
}
export default new CustomerTierService();
