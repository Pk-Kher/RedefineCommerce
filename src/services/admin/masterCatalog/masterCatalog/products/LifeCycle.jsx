import { API } from "helpers/API";

class LifeCycleService {

    getLifecycleData(LifeCycleObj) {
        return API.post(`/MasterProduct/getmasterproductlifecyclelist.json`, LifeCycleObj);
    }

}

export default new LifeCycleService();
