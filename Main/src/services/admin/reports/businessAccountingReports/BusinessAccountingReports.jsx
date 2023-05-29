import { API } from "helpers/API";

class BusinessAccountingReports {
  getSalesSummaryReceivedOrdersByStore(Obj) {
    return API.post(
      `/BusinessAccountingReports/salessummaryreceivedordersbystore.json`,
      Obj
    );
  }
  ExportSalesSummaryReceivedOrdersByStore(Obj) {
    return API.post(
      `/BusinessAccountingReports/exportsalessummaryreceivedordersbystore.json`,
      Obj
    );
  }
  getRevenueSummary(Obj) {
    return API.post(
      `/BusinessAccountingReports/revenuesummarybystore.json`,
      Obj
    );
  }
  ExportRevenueSummary(Obj) {
    return API.post(
      `/BusinessAccountingReports/exportrevenuesummarybystore.json`,
      Obj
    );
  }
}

export default new BusinessAccountingReports();
