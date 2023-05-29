import { API } from "helpers/API";

class CustomerCreditService {
    getCustomerCreditList(obj) {
        return API.post("/CustomerCredit/list.json", obj);
    }
    createCustomerCredit(obj) {
        return API.post(`/CustomerCredit/create.json`, obj);
    }
    getCustomerCreditById(customerid) {
        return API.post(`/CustomerCredit/getavailablecredit/${customerid}.json`);
    }
    ExportSampleFile() {
        return API.get(`CustomerCredit/downloadsamplefilelink.json`);
    }
    ImportCreditData(ImportData) {
        return API.post(`/CustomerCredit/ImportMaster.json`, ImportData);
    }
}
export default new CustomerCreditService();