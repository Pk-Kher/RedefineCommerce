import { API } from "helpers/API";

class CustomerLifeCycleService {
    getCustomerLifecycleMonthWise(customerObj) {
        return API.post("/Customer/getcustomerlifecycleMonthWiselist.json", customerObj);
    }

    getCustomerLifecycleDateWise(customerObj) {
        return API.post(`/Customer/getcustomerlifecycleDateWiselist.json`, customerObj);
    }
}
export default new CustomerLifeCycleService();