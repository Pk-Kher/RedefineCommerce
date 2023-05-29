import { API } from "helpers/API";
class GiftCardService {
  getGiftCards(giftObj) {
    return API.post(`/GiftCard/list.json`, giftObj);
  }
  createGiftCard(giftObj) {
    return API.post(`/GiftCard/create.json`, giftObj);
  }
  updateStatus(giftObj) {
    return API.post(`/StoreProduct/updatestatusbyid.json`, giftObj);
  }
  getGiftCardById(id) {
    return API.post(`/GiftCard/getbyid/${id}.json`);
  }
  updateGiftCard(giftObj) {
    return API.post(`/GiftCard/update.json`, giftObj);
  }
  updateMultipleStatus(giftObj) {
    return API.post(`/StoreProduct/multipleupdatestatusbyids.json`, giftObj);
  }
}

export default new GiftCardService();
