import React from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";
import Brand from "./brandMaster/Routes";
import Color from "./colorMaster/Routes";
import Dimension from "./dimensionMaster/Routes";
import SizeMaster from "./sizeMaster/Routes";
import SizeChart from "./sizeChart/Routes";
import Vendor from "./vendorMaster/Routes";
import Tier from "./tierMaster/Routes";
import Category from "./categoryMaster/Routes";
import LogoLocationMaster from "./logoLocationMaster/Routes";
import Attributes from "./attributes/Routes";
import QuantityDiscount from "./quantityDiscount/Routes";
import ProductTagMaster from "./productTagMaster/Routes";
import ProductReadiness from "./readiness/product/Routes";
import SEOReadiness from "./readiness/SEO/Routes";
import PaymentOption from "./paymentOptions/Routes";
import ShippingService from "./shippingService/Routes";
import ShippingMethod from "./shippingMethod/Routes";
import ShippingCharges from "./shippingCharges/Routes";
import FixCharges from "./fixCharges/Routes"
import Newsletter from "./newsLatter/Routes";
import MessageKey from "./messageKey/Routes";
import Message from "./message/Routes";
import EmailTemplate from "./emailTemplates/Routes";
const InternalRouting = () => {
  return (
    <>
      <Routes>
        <Route path="/color/*" element={<Color />} />
        <Route path="/vendor/*" element={<Vendor />} />
        <Route path="/tier/*" element={<Tier />} />
        <Route path="/brand/*" element={<Brand />} />
        <Route path="/category/*" element={<Category />} />
        <Route path="/sizeMaster/*" element={<SizeMaster />} />
        <Route path="/sizeChart/*" element={<SizeChart />} />
        <Route path="/dimension/*" element={<Dimension />} />
        <Route path="/logolocation/*" element={<LogoLocationMaster />} />
        <Route path="/attributes/*" element={<Attributes />} />
        <Route path="/quantityDiscount/*" element={<QuantityDiscount />} />
        <Route path="/productTagMaster/*" element={<ProductTagMaster />} />
        <Route path="/productReady/*" element={<ProductReadiness />} />
        <Route path="/SEOReady/*" element={<SEOReadiness />} />
        <Route path="/paymentOptions/*" element={<PaymentOption />} />
        <Route path="/messageKey/*" element={<MessageKey />} />
        <Route path="/messages/*" element={<Message />} />
        <Route path="/emailTemplate/*" element={<EmailTemplate />} />
        <Route path="/shippingService/*" element={<ShippingService />} />
        <Route path="/shippingMethod/*" element={<ShippingMethod />} />
        <Route path="shippingCharges/*" element={<ShippingCharges />} />
        <Route path="newsLetter/" element={<Newsletter />} />
        <Route path="fixCharges/" element={<FixCharges />} />
      </Routes>
    </>
  );
};

export default InternalRouting;
