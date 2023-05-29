import { API } from "helpers/API";

class SizeMasterService {
  getSizeMaster(sizemasterObj) {
    return API.post(`SizeMaster/list.json`, sizemasterObj);
  }
  createSizeMaster(sizemasterObj) {
    return API.post(`SizeMaster/create.json`, {
      sizeMasterModel: sizemasterObj,
    });
  }

  getSizeMasterByID(id) {
    return API.get(`SizeMaster/get/${id}.json`);
  }

  updateSizeMaster(sizemasterObj) {
    return API.post(`SizeMaster/update.json`, {
      sizeMasterModel: sizemasterObj,
    });
  }

  updateStatus(sizeObj) {
    return API.post(`/SizeMaster/updatestatusbyid.json`, sizeObj);
  }

  deleteSizeMaster(id) {
    return API.post(`SizeMaster/deletesizemasterbyid.json`, id);
  }

  updateMultipleStatus(sizemasterObj) {
    return API.post(
      `/SizeMaster/multipleupdatestatussizemasterbyids.json`,
      sizemasterObj
    );
  }
}

export default new SizeMasterService();
