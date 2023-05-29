import { API } from "helpers/API";

class DimensionService {
  getDimensions(dimensionObj) {
    return API.post(`/Dimension/list.json`, dimensionObj);
  }
  createDimension(dimensionObj) {
    return API.post(`/Dimension/create.json`, dimensionObj);
  }
  getDimensionById(id) {
    return API.get(`/Dimension/get/${id}.json`);
  }
  updateDimension(dimensionObj) {
    return API.post(`/Dimension/update.json`, dimensionObj);
  }
  updateStatus(dimensionObj) {
    return API.post(`/Dimension/updatestatusbyid.json`, dimensionObj);
  }
  updateMultipleStatus(dimensionObj) {

    return API.post(`/Dimension/multipleupdatestatusdimensionbyids.json`, dimensionObj);

  }
}

export default new DimensionService();
