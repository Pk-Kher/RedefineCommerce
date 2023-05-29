import { API } from "helpers/API";

class ProductService {
  lowInventory(lowInventoryObj) {
    return API.post(
      `/Reports/GetLowInventoryStatusReport.json`,
      lowInventoryObj
    );
  }
  exportLowInventory(Obj) {
    return API.post(`/Reports/exportlowinventoryproduct.json`, Obj);
  }
  productSummary(storeID) {
    return API.post(`/Reports/GetProductSummaryReport.json?storeId=${storeID}`);
  }
  exportProductSummary(storeID) {
    return API.post(`/Reports/exportproductsummary.json?storeId=${storeID}`);
  }
  getTop100SellingProducts(Obj) {
    return API.post(`/Reports/GetTopHundredProductReport`, Obj);
  }
  exportTop100SellingProducts(Obj) {
    return API.post(`/Reports/ExportTopHundrdedSellingProduct.json`, Obj);
  }
  getItemSalesByMarket(Obj) {
    return API.post(`/Reports/GetItemsSalesByMarket`, Obj);
  }
  exportItemSalesByMarket(Obj) {
    return API.post(`/Reports/ExportSalesItemsByMarket.json`, Obj);
  }
  getComparativeSalesByTimePeriod(Obj) {
    return API.post(`/Reports/comparativesalesbytimeperiod.json`, Obj);
  }
  ExportComparativeSalesByTimePeriod(Obj) {
    return API.post(`/Reports/exportcomparativesalesbytimeperiod.json`, Obj);
  }
}

export default new ProductService();
