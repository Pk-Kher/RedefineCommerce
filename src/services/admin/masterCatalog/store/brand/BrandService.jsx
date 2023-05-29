import { API } from "helpers/API";

class BrandService {
  getBrands(brandObj) {
    return API.post(`/StoreProductBrand/list.json`, brandObj);
  }
  getBrandById(id) {
    return API.get(`/StoreProductBrand/get/${id}.json`);
  }
  updateBrand(brandObj) {
    return API.post(`/StoreProductBrand/update.json`, brandObj);
  }
  updateStatus(brandObj) {
    return API.post(`/StoreProductBrand/updatestatusbyid.json`, brandObj);
  }
  updateMultipleStatus(brandObj) {
    return API.post(`/StoreProductBrand/multipleupdatestatusbyids.json`, brandObj);
  }

  updateandcreatestoreproductbrand(brandObj) {
    return API.post(`/StoreProductBrand/updateandcreatestoreproductbrand.json`, brandObj);
  }

  getBrandsByVendors(brandObj) {
    return API.post(`/StoreProductBrand/getmulltiplevendorwisestoreproductbrand.json`, brandObj);
  }

}

export default new BrandService();
