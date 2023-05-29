import { API } from "helpers/API";

class MessageKeyServices {
  getMessageKeys(messageKeyObj) {
    return API.post(`/StoreMessageKey/getliststoremessagekey.json`, messageKeyObj);
  }
  getMessageKeyById(messageId) {
    return API.get(`/StoreMessageKey/get/${messageId}.json`)
  }
  updateMultipleStatus(messageKeyObj) {
    return API.post(
      `/StoreMessageKey/multipleupdatestatusstoremessagekey.json`,
      messageKeyObj
    );
  }
  updateStatus(messageKeyObj) {
    return API.post(`/StoreMessageKey/updatestatusstoremessagekey.json`, messageKeyObj);
  }
  updateMessageKey(messageKeyObj) {
    return API.post(`/StoreMessageKey/updatestoremessagekey.json`, messageKeyObj);
  }
  createMessageKey(messageKeyObj) {
    return API.post(`/StoreMessageKey/createstoremessagekey.json`, messageKeyObj);
  }
}
export default new MessageKeyServices();