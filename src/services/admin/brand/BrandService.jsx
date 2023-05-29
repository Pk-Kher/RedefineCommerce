import { API } from "helpers/API";

class BrandService {
  getBrands(brandObj) {
    return API.post(`/Brand/list.json`, brandObj);
  }
  createBrand(brandObj) {
    return API.post(`/Brand/create.json`, brandObj);
  }
  getBrandById(id) {
    return API.get(`/Brand/get/${id}.json`);
  }
  updateBrand(brandObj) {
    return API.post(`/Brand/update.json`, brandObj);
  }
  updateStatus(brandObj) {
    return API.post(`/Brand/updatestatusbyid.json`, brandObj);
  }
  updateMultipleStatus(brandObj) {
    return API.post(`/Brand/multipleupdatestatusbyids.json`, brandObj);
  }
  createUpdateBrandVendors(brandObj) {
    return API.post(`/Brand/createandupdatevendors.json`, brandObj);
  }
  getactiveinactivecount(id) {
    return API.get(`/Brand/getactiveinactivecount/${id}.json`);
  }
  getsaleschannelstoresId(id) {
    return API.get(`/Brand/getsaleschannelstores/${id}.json`);
  }

  getMultipleVendorsWiseBrandForMaster(brandObj) {
    return API.post(`Brand/getmulltiplevendorwisebrandformaster.json`, brandObj);
  }  
}

export default new BrandService();
