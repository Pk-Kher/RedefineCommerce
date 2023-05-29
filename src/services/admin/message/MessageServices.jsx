import { API } from "helpers/API";

class MessageServices {
  getMessages(messageObj) {
    return API.post(`/storemessage/list.json`, messageObj);
  }
  getMessageById(messageId) {
    return API.get(`/storemessage/get/${messageId}.json`)
  }
  updateMultipleStatus(messageObj) {
    return API.post(
      `/storemessage/multipleupdatestatusstoremessagebyids.json`,
      messageObj
    );
  }
  updateStatus(messageObj) {
    return API.post(`/storemessage/updatestatusbyid.json`, messageObj);
  }
  updateMessage(messageObj) {
    return API.post(`/storemessage/update.json`, messageObj);
  }
  createMessage(messageObj) {
    return API.post(`/storemessage/create.json`, messageObj);
  }
}
export default new MessageServices();