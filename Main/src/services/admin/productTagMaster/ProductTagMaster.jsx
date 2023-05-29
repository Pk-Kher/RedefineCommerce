import { API } from "helpers/API";

class ProductTag {
  getProductTag(ProductTagObj) {
    return API.post(`ProductTag/list.json`, ProductTagObj);
  }
  createProductTag(ProductTagObj) {
    return API.post(`ProductTag/create.json`, ProductTagObj);
  }

  getProductTagByID(id) {
    return API.get(`ProductTag/get/${id}.json`);
  }

  updateProductTag(ProductTagObj) {
    return API.post(`ProductTag/update.json`, ProductTagObj);
  }

  updatestatusbyid(ProductTagObj) {
    return API.post(`ProductTag/updatestatusbyid.json`, ProductTagObj);
  }
  updateMultipleStatus(ProductTagObj) {
    return API.post(
      `ProductTag/multipleupdatestatusProductTagbyids.json`,
      ProductTagObj
    );
  }
}

export default new ProductTag();
