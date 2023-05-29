import { API } from "helpers/API";

class DashboardService {
  getOrderReport(id) {
    return API.get(`/OrderReports/getorderreportbystore/${id}.json`);
  }
  getCustomerOrderReport(id) {
    return API.get(`/OrderReports/getcustomerorderreportbystore/${id}.json`);
  }
  getProductStatusReport(id) {
    return API.post(`/Reports/GetProductStatusReport/${id}`);
  }
  getProductNavSyncStatusReport(id) {
    return API.post(`/Reports/GetProductNAVSyncStatusReport/${id}`);
  }
  getTopTenBrand(Obj) {
    return API.post(`/Reports/GetTopTenBrandStatusReport`, Obj);
  }
  getProductReadyScoreReport(id) {
    return API.get(`/Reports/getproductreadyscorebystore/${id}.json`);
  }
}

export default new DashboardService();
