import { API } from "helpers/API";

class CatalogService {
  getCatalog(id, isbrand, catalogObj) {
    return API.post(`/CatalogChange/list/${id}/${isbrand}.json`, catalogObj);
  }

  createCatalog(catalogObj) {
    return API.post(`/CatalogChange/create.json`, {
      catalogChangeModel: catalogObj,
    });
  }

  getCatalogById(id) {
    return API.post(`/CatalogChange/get/${id}.json`);
  }

  updateCatalog(catalogObj) {
    return API.post(`/CatalogChange/update.json`, {
      catalogChangeModel: catalogObj,
    });
  }

  updateStatus(catalogObj) {
    return API.post(`/CatalogChange/updatestatusbyid.json`, {
      args: catalogObj,
    });
  }
}

export default new CatalogService();
