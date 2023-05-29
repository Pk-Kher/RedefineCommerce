import { API } from "helpers/API";

class NewsLetterServices {
  getSubscribeList(subscribeObj) {
    return API.post(`/Subscribe/GetSubscribeList.json`, subscribeObj);
  
}

updateStatus(subscribeObj) {
    return API.post(`/Subscribe/UnSubscribe.json`, subscribeObj);
  }
}
export default new NewsLetterServices();