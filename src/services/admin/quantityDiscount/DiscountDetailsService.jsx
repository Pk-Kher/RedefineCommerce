import { API } from "helpers/API";

class DiscountDeatilsService {
  getDiscountsDetail(id, discountDetailObj) {
    return API.post(
      `/QuantityDiscountDetail/list/${id}.json`,
      discountDetailObj
    );
  }
  createDiscountsDetail(discountDetailObj) {
    return API.post(`/QuantityDiscountDetail/create.json`, discountDetailObj);
  }
  getDiscountsDetailById(id) {
    return API.get(`/QuantityDiscountDetail/get/${id}.json`);
  }
  updateDiscountsDetail(discountDetailObj) {
    return API.post(`/QuantityDiscountDetail/update.json`, discountDetailObj);
  }
  updateStatus(discountDetailObj) {
    return API.post(
      `/QuantityDiscountDetail/updatestatusbyid.json`,
      discountDetailObj
    );
  }

  updateMultipleStatus(discountDetailObj) {
    return API.post(
      `/QuantityDiscountDetail/multipleupdatestatusquantitydiscountdetailbyids.json`,
      discountDetailObj
    );
  }
}

export default new DiscountDeatilsService();
