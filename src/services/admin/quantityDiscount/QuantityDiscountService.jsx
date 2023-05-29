import { API } from "helpers/API";

class QuantityDiscountService {
  getQuantityDiscounts(quantityDiscountObj) {
    return API.post(`/QuantityDiscount/list.json`, quantityDiscountObj);
  }
  createQuantityDiscount(quantityDiscountObj) {
    return API.post(`QuantityDiscount/create.json`, quantityDiscountObj);
  }
  getQuantityDiscountById(id) {
    return API.get(`QuantityDiscount/get/${id}.json`);
  }
  updateQuantityDiscount(quantityDiscountObj) {
    return API.post(`QuantityDiscount/update.json`, quantityDiscountObj);
  }
  updateStatus(quantityDiscountObj) {
    return API.post(
      `QuantityDiscount/updatestatusbyid.json`,
      quantityDiscountObj
    );
  }
  cloneQuantityDiscount(cloneObj) {
    return API.post(
      `/QuantityDiscount/clonequantitydiscount.json`,
      cloneObj
    );
  }
  updateMultipleStatus(quantityDiscountObj) {
    return API.post(
      `/QuantityDiscount/multipleupdatestatusquantitydiscountbyids.json`,
      quantityDiscountObj
    );
  }
}

export default new QuantityDiscountService();
