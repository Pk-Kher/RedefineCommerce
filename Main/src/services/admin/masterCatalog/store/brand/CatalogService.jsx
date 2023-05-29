import { API } from "helpers/API";

class CatalogService {
  getCatalog(catalogObj) {
    return API.post(`/StoreProductCatalog/list.json`, catalogObj);
  }

  getCatalogById(id) {
    return API.get(`/StoreProductCatalog/get/${id}.json`);
  }


  createCatalog(catalogObj) {
    return API.post(`/StoreProductCatalog/create.json`, {
      storeProductCatalogModel: catalogObj,
    });
  }
  updateCatalog(catalogObj) {
    return API.post(`/StoreProductCatalog/update.json`, {
      storeProductCatalogModel: catalogObj,
    });
  }

  updateStatus(catalogObj) {
    return API.post(`/StoreProductCatalog/multipleupdatestatusattributesbyids.json`, catalogObj);
  }
}

export default new CatalogService();
