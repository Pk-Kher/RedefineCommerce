import { API } from "helpers/API";

class VendorService {
  getVendors(vendorObj) {
    return API.post(`/Vendor/list.json`, vendorObj);
  }

  createVendor(vendorObj) {
    return API.post(`/Vendor/create.json`, {
      vendorModel: vendorObj,
    });
  }
  getVendorByID(id) {
    return API.get(`/Vendor/get/${id}.json`);
  }

  updateVendor(vendorObj) {
    return API.post(`/Vendor/update.json`, {
      vendorModel: vendorObj,
    });
  }

  updateVendorById(args) {
    return API.post(`/Vendor/updatestatusbyid.json`, {
      args,
    });
  }
  getStoreVendorByBrand(brandId) {
    return API.get(`/Vendor/GetVendorByBrandIdForStore/${brandId}.json`);
  }
  getVendorByBrand(brandId) {
    return API.get(`/Vendor/GetVendorByBrandIdForMaster/${brandId}.json`);
  }

  GetBrandData(id) {
    return API.get(`/Vendor/GetBrandProductCount/${id}.json`);
  }

  getMultipleVendorsBrandWiseForMaster(vendorObj) {
    return API.post(`Vendor/getmulltiplebrandwisevendorformaster.json`, vendorObj);
  }
  getMultipleVendorsBrandWiseForStore(vendorObj) {
    return API.post(`/Vendor/getmulltiplestoreproductbrandwisevendorforstore.json`, vendorObj);
  }
}

export default new VendorService();
