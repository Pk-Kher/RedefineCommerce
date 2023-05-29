import React, { useState } from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";
import Configuration from "./configuration/Routes";
import MasterCatalog from "./masterCatalog/Routes";
import StoreConfiguration from "./storeConfiguration/Routes";
import GrandMasterCatalog from "./grandMasterCatalog/Routes";
import DashBoard from "./dashboard/Dashboard";
import ECommerceStore from "./eCommerceStore/Routes"
import Settings from "./settings/Routes"
const InternalRouting = () => {

  const [changeTab, SetChangeTab] = useState(0);
  return (
    <>
      <Routes>
        <Route path="dashboard/*" element={<DashBoard SetChangeTab={SetChangeTab} />} />
        <Route path="Configuration/*" element={<Configuration />} />
        <Route path="MasterCatalog/*" element={<MasterCatalog changeTab={changeTab} />} />
        <Route path="GrandMasterCatalog/*" element={<GrandMasterCatalog changeTab={changeTab} />} />
        <Route exact path=":storeType/*" element={<ECommerceStore />} />
        <Route path="Store/*" element={<StoreConfiguration />} />
        <Route path="Settings/*" element={<Settings />} />
      </Routes>
    </>
  );
};

export default InternalRouting;
