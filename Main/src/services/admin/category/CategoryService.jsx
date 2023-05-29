import { API } from "helpers/API";

class CategoryService {
  getCategories(categoryObj) {
    return API.post(`/Category/list.json`, categoryObj);
  }
  getCategoriesWithTreeview(categoryObj) {
    return API.post(`/Category/getcategorytreeviewlist.json`, categoryObj);
  }
  createCategory(categoryObj) {
    return API.post(`/Category/create.json`, categoryObj);
  }
  getCategoryById(id) {
    return API.get(`/Category/get/${id}.json`);
  }
  updateCategory(categoryObj) {
    return API.post(`/Category/update.json`, categoryObj);
  }
  updateStatus(categoryObj) {
    return API.post(`/Category/updatestatusbyid.json`, categoryObj);
  }
  updateMultipleStatus(categoryObj) {
    return API.post(
      `/Category/multipleupdatestatuscategorybyids.json`,
      categoryObj
    );
  }
  updateCategoryParent(categoryObj) {
    return API.post("/Category/updatecategoryparentcategoryrequest.json", { "categoryParentCategoryModel": categoryObj });
  }
  getCategoryDropdownOptions(categoryId, storeId) {
    return API.get(`/Category/getcategory/${categoryId}.json`);
  }
  getStoreCategoryDropdownOptions(categoryId = -1, storeId) {
    return API.get(`/StoreProductCategory/getcategory/${categoryId}/${storeId}.json`);
  }
  getsaleschannelstoresforcategoryId(id) {
    return API.get(`/Category/getsaleschannelstoresforcategory/${id}.json`);
  }
  GetAllCategoryXIdByCategoryId(id) {
    return API.get(`/Category/GetAllCategoryXIdByCategoryId/${id}.json`);
  }
  getAllParentCategory(id) {
    return API.get(`Category/GetAllParentCategory.json`);
  }


}

export default new CategoryService();
