import { API } from "helpers/API";

class ColorService {
  getColors(colorObj) {
    return API.post(`Color/list.json`, colorObj);
  }
  createColor(colorObj) {
    return API.post(`Color/create.json`, colorObj);
  }

  getColorByID(id) {
    return API.get(`Color/get/${id}.json`);
  }

  updateColor(colorObj) {
    return API.post(`Color/update.json`, colorObj);
  }

  updateStatus(colorObj) {
    return API.post(`/Color/updatestatusbyid.json`, colorObj);
  }
}

export default new ColorService();
