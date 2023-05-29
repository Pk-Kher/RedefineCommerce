import { API } from "helpers/API";

class SizeDetailsService {
  getProductSizeById(sizemasterid) {
    return API.get(
      `/SizeDetails/getsizeDetailsbymasterid/${sizemasterid}.json`
    );
  }
  getSizeDetails(sizedetailsObj) {
    return API.post(`/SizeDetails/list.json`, sizedetailsObj);
  }

  createSizeDetails(sizedetailsObj) {
    return API.post(`/SizeDetails/create.json`, {
      sizeDetailsModel: sizedetailsObj,
    });
  }
  getSizeDetailsByID(id) {
    return API.get(`/SizeDetails/get/${id}.json`);
  }

  updateSizeDetails(sizedetailsObj) {
    return API.post(`/SizeDetails/update.json`, {
      sizeDetailsModel: sizedetailsObj,
    });
  }

  updateMultipleStatus(catalogObj) {
    return API.post(
      `/SizeDetails/multipleupdatestatusSizeDetailsbyids.json`,
      {
        args: catalogObj,
      }
    );
  }
}

export default new SizeDetailsService();
