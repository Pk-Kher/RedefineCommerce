import { FrontAPI } from "helpers/API";

class StoreCustomerService {
    sendResetPasswordLink(storeId, email) {
        return FrontAPI.get(`StoreCustomer/customersendresetpasswordlink/${storeId}/${email}.json`);
    }
}

export default new StoreCustomerService();
