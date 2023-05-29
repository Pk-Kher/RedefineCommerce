import React from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";
import Inquirieslist from "./reports/CustomReport/Inquirieslist";
import MailLog from "./reports/CustomReport/MailLog";
import SearchLog from "./reports/CustomReport/SearchLog";
import Reports from "./reports/Reports";
import BusinessIntelligence from "./reports/ReportTileBusinessAccountingReportsPage/BusinessIntelligence";
import RevenueSummary from "./reports/ReportTileBusinessAccountingReportsPage/RevenueSummary";
import SalesSummaryByStore from "./reports/ReportTileBusinessAccountingReportsPage/SalesSummaryByStore";
import SalesSummaryByStoreShippedDate from "./reports/ReportTileBusinessAccountingReportsPage/SalesSummaryByStore(Shipped Date)";
import OrderBeneficialReport from "./reports/ReportTileOrderPage/OrderBeneficialReport";
import OrderNumberSaleTtaxReport from "./reports/ReportTileOrderPage/OrderNumberSaleTtaxReport";
import OrderStateTaxReport from "./reports/ReportTileOrderPage/OrderStateTaxReport";
import OrderStatistics from "./reports/ReportTileOrderPage/OrderStatistics";
import ComparativeSalesByTimePeriod from "./reports/ReportTileProductPage/ComparativeSalesByTimePeriod";
import ItemSaleByMarket from "./reports/ReportTileProductPage/ItemSaleByMarket";
import LowInventory from "./reports/ReportTileProductPage/LowInventory";
import ProductSummary from "./reports/ReportTileProductPage/ProductSummary";
import Top100SellingProducts from "./reports/ReportTileProductPage/Top100SellingProducts";
const InternalRouting = () => {
  return (
    <>
      {/* <Main/> */}
      <Routes>
        <Route path="/" element={<Reports />} />
        <Route path="/ItemSaleByMarket" element={<ItemSaleByMarket />} />
        <Route path="/ProductSummary" element={<ProductSummary />} />
        <Route
          path="/ComparativeSalesByTimePeriod"
          element={<ComparativeSalesByTimePeriod />}
        />
        <Route
          path="/Top100SellingProducts"
          element={<Top100SellingProducts />}
        />
        <Route path="/LowInventory" element={<LowInventory />} />
        <Route
          path="/OrderBeneficialReport"
          element={<OrderBeneficialReport />}
        />
        <Route path="/OrderStateTaxReport" element={<OrderStateTaxReport />} />
        <Route
          path="/OrderNumberSaleTtaxReport"
          element={<OrderNumberSaleTtaxReport />}
        />
        <Route path="/OrderStatistics" element={<OrderStatistics />} />
        <Route path="/SalesSummaryByStore" element={<SalesSummaryByStore />} />
        <Route path="/RevenueSummary" element={<RevenueSummary />} />
        <Route
          path="/SalesSummaryByStoreShippedDate"
          element={<SalesSummaryByStoreShippedDate />}
        />
        <Route
          path="/BusinessIntelligence"
          element={<BusinessIntelligence />}
        />
        <Route path="/MailLog" element={<MailLog />} />
        <Route path="/SearchLog" element={<SearchLog />} />
        <Route path="/Inquirieslist" element={<Inquirieslist />} />
      </Routes>
    </>
  );
};

export default InternalRouting;
