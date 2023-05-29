import { API } from "helpers/API";
class CacheService {
    clearBrandCache(obj) {
        return API.post(`/StoreProductBrand/clearbrandcache.json`, obj);
    }
    clearCategoryCache(obj) {
        return API.post(`/StoreProductCategory/clearcategorycache.json`, obj);
    }
    clearHomeCache(storeId) {
        return API.post(`/StoreProductCategory/clearhomecache/${storeId}.json`);
    }

}
export default new CacheService();