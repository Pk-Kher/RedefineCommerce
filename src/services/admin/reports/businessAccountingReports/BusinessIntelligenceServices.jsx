import { API } from "helpers/API";

class BusinessIntelligence {
  getAllTimeRevenue(id) {
    return API.get(
      `/BusinessAccountingReports/alltimerevenuebystore/${id}.json`
    );
  }
  AllTimeNumberOfOrdersReport(id) {
    return API.get(
      `/BusinessAccountingReports/alltimenumberofordersbystore/${id}.json`
    );
  }
  AllTimeCustomer(id) {
    return API.get(
      `/BusinessAccountingReports/alltimecustomersbystore/${id}.json`
    );
  }
  AllTimeAverageRevenue(id) {
    return API.get(
      `/BusinessAccountingReports/alltimeaveragerevenuebystore/${id}.json`
    );
  }
  AllTimeAverageOrders(id) {
    return API.get(
      `/BusinessAccountingReports/alltimeaverageofordersbystore/${id}.json`
    );
  }
  AllTimeAverageCustomers(id) {
    return API.get(
      `/BusinessAccountingReports/alltimeaverageofcustomersbystore/${id}.json`
    );
  }
  Top10CategoryByQuantity(id) {
    return API.get(
      `/BusinessAccountingReports/TopTenCategorybyOrderQuantity/${id}.json`
    );
  }
  Top10BrandsByQyantity(id) {
    return API.get(
      `/BusinessAccountingReports/toptenbrandbyorderquantity/${id}.json`
    );
  }
  Top10ProductsByQuantity(id) {
    return API.get(
      `/BusinessAccountingReports/toptenproductsbyorderquantity/${id}.json`
    );
  }
  Top3SellingMonthByRevenue(id) {
    return API.get(
      `/BusinessAccountingReports/topthreesellingmonthbyrevenue/${id}.json`
    );
  }
  Top10SellingDaysByRevenueDate(id) {
    return API.get(
      `/BusinessAccountingReports/toptensellingdaysbyrevenue/${id}.json`
    );
  }
  Top10SellingDaysByRevenueTime(id) {
    return API.get(
      `/BusinessAccountingReports/toptensellingdaysbyrevenueintimeperiod/${id}.json`
    );
  }
  Top3SellingMonthByOrder(id) {
    return API.get(
      `/BusinessAccountingReports/topthreesellingmonthbyorder/${id}.json`
    );
  }
  Top10SellingDaysByOrderDate(id) {
    return API.get(`/BusinessAccountingReports/toptensellingdaysbyorder/${id}.json`);
  }
  Top10SellingDaysByOrderTime(id) {
    return API.get(
      `/BusinessAccountingReports/toptensellingdaysbyOrdereintimeperiod/${id}.json`
    );
  }
  ExportBusinessIntelligence(id) {
    return API.get(
      `/BusinessAccountingReports/exportbusinessintelligence/${id}.json`
    );
  }
}

export default new BusinessIntelligence();
