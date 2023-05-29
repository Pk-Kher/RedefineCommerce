import React from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";
import CompanyConfiguration from "./companyConfiguration/Routes";
import ThemeConfiguration from "./ThemeConfiguration";
import Module from "./modules/Routes";
import SeoConfiguration from "./seoConfiguration/Routes";
import ThirdPartyServices from "./thirdPartyServices/Routes";
import AppConfig from "./appConfig/Routes"

const Configurator = () => {
  return (
    <>
      <Routes>
        <Route
          path="/companyconfiguration/*"
          element={<CompanyConfiguration />}
        />
        <Route path="/ThemeConfiguration" element={<ThemeConfiguration />} />
        <Route
          path="/ThemeConfiguration/:id"
          element={<ThemeConfiguration />}
        />
        <Route path="/Modules/*" element={<Module />} />
        <Route path="/seoConfiguration/*" element={<SeoConfiguration />} />
        <Route
          path="/thirdPartyServices/*"
          element={<ThirdPartyServices />}
        />
        <Route path="/appConfig/*" element={<AppConfig />} />
      </Routes>
    </>
  );
};

export default Configurator;
