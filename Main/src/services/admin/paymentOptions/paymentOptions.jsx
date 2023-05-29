import { API } from "helpers/API";

class PaymentOptions {
  getPaymentOptions(POObj) {
    return API.post(`/PaymentOptionServices/list.json`, POObj);
  }
  getPaymentOptionsById(id){
    return API.get(`/PaymentOptionServices/getpaymentoptionsbyid/${id}.json`)
  }
  updateMultipleStatus(POObj) {
    return API.post(
      `/PaymentOptionServices/multipleupdatestatusbyids.json`,
      POObj
    );
  }
  updateStatus(POObj) {
    return API.post(`/PaymentOptionServices/updatestatusbyid.json`, POObj);
  }
  updatePaymentOptions(POObj) {
    return API.post(`/PaymentOptionServices/update.json`, POObj);
  }
  createPaymentOptions(POObj) {
    return API.post(`/PaymentOptionServices/create.json`, POObj);
  }
}

export default new PaymentOptions();
