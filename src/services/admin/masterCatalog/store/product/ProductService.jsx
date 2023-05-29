import { API } from "helpers/API";

class ProductService {

    getStoreProducts(productObj) {
        return API.post('/StoreProduct/list.json', productObj)
    }

    getStoreProductsWithoutSubrows(ProductObj) {
        return API.post(`/StoreProduct/listwithoutsubrows.json`, ProductObj);
    }

    getStoreProductsVarientData(ProductId) {
        return API.post(`/StoreProductAttributeCombination/getcombinationbyproductid.json?Productid=${ProductId}`,);
    }

    getStoreProductById(productId) {
        return API.post(`/StoreProduct/getbyid/${productId}.json`);
    }

    getProductRedinessById(productId, storeId) {
        return API.post(`/StoreProduct/checkproductreadines/${productId}/${storeId}.json`);
    }

    getSEORedinessById(productId, storeId) {
        return API.post(`/StoreProduct/checkseoreadiness/${productId}/${storeId}.json`);
    }

    updateStoreProduct(ProductObj) {
        return API.post(`/StoreProduct/updatebasicinfo.json`, ProductObj);
    }

    updateStoreProductPricing(ProductObj) {
        return API.post(`/StoreProduct/updatepricing.json`, ProductObj);
    }

    updateProductOtherFields(Id, ProductObj) {
        return API.patch(`StoreProduct/update/${Id}.json`, ProductObj);
    }

    getSKUList(productId) {
        return API.get(`/StoreProduct/getlistoursku/${productId}.json`);
    }
    updateProduct(ProductObj) {
        return API.post(`/StoreProduct/updatebasicinfo.json`, ProductObj);
    }

    updateProductPricing(ProductObj) {
        return API.post(`/StoreProduct/updatepricing.json`, ProductObj);
    }
    updateProductStatus(ProductObj) {
        return API.post(`/StoreProduct/updatestatusbyid.json`, ProductObj);
    }
    getCategoryByBrand(brandId) {
        return API.post(`/StoreProduct/getcategorylistbybrandid.json?brandid=${brandId}`);
    }
    getStoreProductsForStoreBuilder(productObj) {
        return API.post('/StoreProduct/listforstorebuilder.json', productObj)
    }
    createProductCloneForStoreBuilder(productObj) {
        return API.post(`/StoreProduct/cloneproductstoretostore.json`, productObj);
    }
    getProductRemainingAttributes(productId, storeId) {
        return API.post(`/StoreProduct/getnotcloneattributeoption/${productId}/${storeId}.json`);
    }
    appendSelectedAttributes(productObj) {
        return API.post(`/StoreProduct/cloneexistingproductstoretostore.json`, productObj);
    }
    getOrderHistory(productObj) {
        return API.post('/StoreProduct/getorderhistory.json', productObj)
    }
    StatusUpdateCustomerReview(productObj) {
        return API.post(`/StoreProduct/updatereviewstatus.json`, productObj);
    }
    publishProduct(productObj) {
        return API.post(`/StoreProduct/updatepublishproduct.json`, productObj);
    }
}

export default new ProductService();
