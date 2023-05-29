import { API } from "helpers/API";

class ThirdPartyServices {
  getThirdPartyList(thirdPartyObj) {
    return API.post(`/ThirdPartyServices/list.json`, thirdPartyObj);
  }
  createThirdPartyServices(thirdPartyObj) {
    return API.post(`/ThirdPartyServices/create.json`, thirdPartyObj);
  }
  getThirdPartyServicesById(id) {
    return API.get(`/ThirdPartyServices/get/${id}.json`);
  }
  updateThirdPartyServices(thirdPartyObj) {
    return API.post(`/ThirdPartyServices/update.json`, thirdPartyObj);
  }
  updateStatus(thirdPartyObj) {
    return API.post(`/ThirdPartyServices/updatestatusbyid.json`, thirdPartyObj);
  }
  updateMultipleStatus(thirdPartyObj) {
    return API.post(`/ThirdPartyServices/multipleupdatestatusbyids.json`, thirdPartyObj);
  }
}

export default new ThirdPartyServices();
