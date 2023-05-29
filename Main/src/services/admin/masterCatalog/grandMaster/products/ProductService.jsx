import { API } from "helpers/API";

class ProductService {

    getGrandMasterProductById(productId) {
        return API.post(`/GrandMasterProduct/getbyid/${productId}.json`);
    }

    getGrandMasterProductsWithoutSubrows(ProductObj) {
        return API.post(`/GrandMasterProduct/listwithoutsubrows.json`, ProductObj);
    }

    getGrandMasterProductsVarientData(ProductId) {
        return API.post(`/GrandMasterProductAttributeCombination/getcombinationbyproductid.json?Productid=${ProductId}`,);
    }

    createGrandMasterProduct(ProductObj) {
        return API.post(`/GrandMasterProduct/create.json`, ProductObj);
    }

    updateGrandMasterProduct(ProductObj) {
        return API.post(`/GrandMasterProduct/updatebasicinfo.json`, ProductObj);
    }
    createProduct(ProductObj) {
        return API.post(`/GrandMasterProduct/create.json`, ProductObj);
    }

    updateProduct(ProductObj) {
        return API.post(`/GrandMasterProduct/updatebasicinfo.json`, ProductObj);
    }

    cloneProduct(CloneObj) {
        return API.post(`/GrandMasterProduct/cloneproduct.json`, CloneObj);
    }

    getSKUList(productId) {
        return API.get(`/GrandMasterProduct/getlistoursku/${productId}.json`);
    }

    updateGrandMasterProductPricing(ProductObj) {
        return API.post(`/GrandMasterProduct/updatepricing.json`, ProductObj);
    }

    updateProductPricing(ProductObj) {
        return API.post(`/GrandMasterProduct/updatepricing.json`, ProductObj);
    }

    getAllProducts(paginationArgs) {
        return API.post(`/GrandMasterProduct/list.json`, paginationArgs);
    }

    updateProductStatus(ProductStatusObj) {
        return API.post(`/GrandMasterProduct/updatestatusbyid.json`, ProductStatusObj);
    }
}

export default new ProductService();
