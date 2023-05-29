import { API } from "helpers/API";

class DashboardService {

    getDashboardData(dashBoardObj) {
        return API.post(`/Store/getstorelistbytype.json`, dashBoardObj);
    }

    getGrandMasterProductData(dashBoardObj) {
        return API.post(`/GrandMasterProduct/getactiveinactivecount.json`, dashBoardObj);
    }

    getMasterProductData(dashBoardObj) {
        return API.post(`/MasterProduct/masterdashboardlist.json`, dashBoardObj);
    }

}

export default new DashboardService();
