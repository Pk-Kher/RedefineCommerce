import { API } from "helpers/API";

class CategoryMasterService {
  getCategories(categoryObj) {
    return API.post(`/StoreProductCategory/list.json`, categoryObj);
  }

  getCategoriesWithTreeview(categoryObj) {
    return API.post(`/StoreProductCategory/getcategorytreeviewlist.json`, categoryObj);
  }

  getCategoryById(id) {
    return API.get(`/StoreProductCategory/get/${id}.json`);
  }

  updateCategory(categoryObj) {
    return API.post(`/StoreProductCategory/update.json`, categoryObj);
  }

  updateStatus(categoryObj) {
    return API.post(`/StoreProductCategory/updatestatusbyid.json`, categoryObj);
  }

  updateMultipleStatus(categoryObj) {
    return API.post(
      `/StoreProductCategory/multipleupdatestatuscategorybyids.json`,
      categoryObj
    );
  }

  updateCategoryParent(categoryObj) {
    return API.post("/StoreProductCategory/updatecategoryparentcategoryrequest.json", { "categoryParentCategoryModel": categoryObj });
  }

  getCategoryDropdownOptions(CategoryId, storeId) {
    return API.get(`/StoreProductCategory/getcategory/${CategoryId}/${storeId}.json`);
  }

  getCategoryByBrandDropdownOptions(brandId, storeId) {
    return API.get(`/StoreProductCategory/getcategorybybrandid/${brandId}/${storeId}.json`);
  }

}

export default new CategoryMasterService();
