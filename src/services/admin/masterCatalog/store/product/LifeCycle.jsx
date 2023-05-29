import { API } from "helpers/API";

class LifeCycleService {

    getLifecycleData(LifeCycleObj) {
        return API.post(`/StoreProduct/getstoreproductlifecyclelist.json`, LifeCycleObj);
    }

}

export default new LifeCycleService();
