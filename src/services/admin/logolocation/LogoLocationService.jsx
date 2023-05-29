import { API } from "helpers/API";

class LogoLocationService {
  getLogoLocations(LogoLocationObj) {
    return API.post(`/LogoLocation/list.json`, LogoLocationObj);
  }

  getLogoLocationsDetails(parentid, LogoLocationObj) {
    return API.post(
      `/LogoLocationDetail/list/${parentid}.json`,
      LogoLocationObj
    );
  }

  createLogoLocation(LogoLocationObj) {
    return API.post(`/LogoLocation/create.json`, {
      LogoLocationModel: LogoLocationObj,
    });
  }

  createLogoLocationDetails(logoLocationDetailModel) {
    return API.post(`/LogoLocationDetail/create.json`, {
      logoLocationDetailModel,
    });
  }
  getLogoLocationByID(id) {
    return API.get(`/LogoLocation/get/${id}.json`);
  }

  getLogoLocationDetailsByID(id) {
    return API.get(`/LogoLocationDetail/get/${id}.json`);
  }

  updateLogoLocation(LogoLocationObj) {
    return API.post(`/LogoLocation/update.json`, {
      LogoLocationModel: LogoLocationObj,
    });
  }

  updateLogoLocationDetails(logoLocationDetailModel) {
    return API.post(`/LogoLocationDetail/update.json`, {
      logoLocationDetailModel,
    });
  }

  updateStatus(args) {
    return API.post(`/LogoLocation/updatestatusbyid.json`, {
      args,
    });
  }

  updateLogoLocationDetailStatus(args) {
    return API.post(`/LogoLocationDetail/updatestatusbyid.json`, {
      args,
    });
  }

  updateAndUpdateBrandField(logolocationdetailxbrandlist) {
    return API.post(`LogoLocationDetail/updateandcreatelogolocationbrandfield.json`, {
      logolocationdetailxbrandlist,
    })
  }



}

export default new LogoLocationService();
