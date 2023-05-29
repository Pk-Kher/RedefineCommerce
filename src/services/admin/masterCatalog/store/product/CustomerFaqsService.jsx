import { API } from "helpers/API";

class CustomerFaqsService {

    getCustomerFaqs(CustomerFaqsObj) {
        return API.post(`/StoreProductCustomerFAQ/list.json`, CustomerFaqsObj);
    }
    createCustomerFaqs(CustomerFaqsObj) {
        return API.post(`StoreProductCustomerFAQ/create.json`, CustomerFaqsObj);
    }

    updateCustomerFaqs(CustomerFaqsObj) {
        return API.post(`StoreProductCustomerFAQ/update.json`, CustomerFaqsObj);
    }

    updateStatus(CustomerFaqsObj) {
        return API.post(`/StoreProductCustomerFAQ/multipleupdatestatusstoreproductcustomerfaq.json`, CustomerFaqsObj);
    }
}

export default new CustomerFaqsService();
