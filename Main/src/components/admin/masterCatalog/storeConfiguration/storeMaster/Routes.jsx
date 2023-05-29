import React from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";
import Create from "./create/Create";
import CustomCSS from "./CustomCss";
import List from "./list/List";
import Menu from "./menuConfig/Menu";
import General from "./generalConfig/General";
import SEO from "./seoConfig/SEOConfig";
const InternalRouting = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/create" element={<Create path="/create" />} />
        <Route path="/edit/:id" element={<Create path="/edit/:id" />} />
        <Route path="/SEO/:id" element={<SEO />} />
        <Route path="/CustomCSS/:storeid" element={<CustomCSS />} />
        <Route path="/:storeId/Menu" element={<Menu />} />
        <Route path="/:storeId/General" element={<General />} />
      </Routes>
    </>
  );
};

export default InternalRouting;
