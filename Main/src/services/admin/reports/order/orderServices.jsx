import { API } from "helpers/API";

class OrderService {
  getOrderStateTaxReport(Obj) {
    return API.post(`/OrderReports/getorderstatetaxreportbystore.json`, Obj);
  }
  ExportOrderStateTaxReport(Obj) {
    return API.post(`/OrderReports/exportorderstatetax.json`, Obj);
  }
  getOrderStatisticsReport(Obj) {
    return API.post(`/OrderReports/orderstatisticsbystore.json`, Obj);
  }
  ExportOrderStatisticsReport(Obj) {
    return API.post(`/OrderReports/exportorderstatisticsbystore.json`, Obj);
  }
  getOrderBeneficialReport(Obj) {
    return API.post(`/OrderReports/orderbeneficialbystore.json`, Obj);
  }
  ExportOrderBenificialReport(Obj) {
    return API.post(`/OrderReports/exportorderbeneficialbystore.json`, Obj);
  }
}

export default new OrderService();
