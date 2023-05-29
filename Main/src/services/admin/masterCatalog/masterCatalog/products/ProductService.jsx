import { API } from "helpers/API";

class ProductService {

    getMasterProducts(ProductObj) {
        return API.post(`/MasterProduct/list.json`, ProductObj);
    }

    getMasterProductsWithoutSubrows(ProductObj) {
        return API.post(`/MasterProduct/listwithoutsubrows.json`, ProductObj);
    }

    getMasterProductsVarientData(ProductId) {
        return API.post(`/MasterProductAttributeCombination/getcombinationbyproductid.json?Productid=${ProductId}`,);
    }

    getMasterProductById(productId) {
        return API.post(`/MasterProduct/getbyid/${productId}.json`);
    }

    getSKUList(productId) {
        return API.get(`/MasterProduct/getlistoursku/${productId}.json`);
    }

    createProduct(ProductObj) {
        return API.post(`/MasterProduct/create.json`, ProductObj);
    }

    updateProduct(ProductObj) {
        return API.post(`/MasterProduct/updatebasicinfo.json`, ProductObj);
    }

    updateProductStatus(ProductObj) {
        return API.post(`/MasterProduct/updatestatusbyid.json`, ProductObj);
    }

    cloneProduct(CloneObj) {
        return API.post(`/MasterProduct/cloneproduct.json`, CloneObj);
    }

    attributeCloneProduct(CloneObj) {
        return API.post(`/MasterProduct/cloneproductwithattribute.json`, CloneObj);
    }

    getAttributeList(productId) {
        return API.post(`/MasterProduct/getattributelistproductbyid.json?productid=${productId}`);
    }

    updateProductPricing(ProductObj) {
        return API.post(`/MasterProduct/updatepricing.json`, ProductObj);
    }

    updateProductOtherFields(Id, ProductObj) {
        return API.patch(`MasterProduct/update/${Id}.json`, ProductObj);
    }
    getCategoryByBrand(brandId) {
        return API.post(`/MasterProduct/getcategorylistbybrandid.json?brandid=${brandId}`);
    }
    getStoreListByProduct(productIds) {
        return API.post(`/StoreProduct/getStoreListforClone.json`, productIds);
    }
    updateNavStatus(ProductObj) {
        return API.post(`/MasterProduct/updatenavsyncstatus.json`, ProductObj);
    }
    discontinueListData(DiscontinueObj) {
        return API.post(`/Discontinue/list.json`, DiscontinueObj);
    }
    createDiscontinue(DiscontinueObj) {
        return API.post(`/Discontinue/createupdate.json`, DiscontinueObj);
    }

    importFile(importObj) {
        return API.post(`/MasterProduct/mastercatlogdataimport.json`, importObj);
    }

    getSalesChannelData(Id) {
        return API.get(`/MasterProduct/getsaleschannelstoresforproduct/${Id}.json`);
    }
    productsyncwithnav(ProductObj) {
        return API.post(`/MasterProduct/productsyncwithnav.json`, ProductObj);
    }
    ColorSplitMasterProduct(params) {
        return API.post(`/ColorSplitMasterProduct/AddUpdate.json`, params);
    }
    getColorSplitMasterProduct(id) {
        return API.get(`ColorSplitMasterProduct/Get/${id}.json`);
    }
}

export default new ProductService();
