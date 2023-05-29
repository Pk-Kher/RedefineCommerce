import React from "react";

import { Route } from "react-router-dom";
import Routes from "routes/Routes";
import Store from "./storeMaster/Routes";
import StoreMainLayout from "layouts/stores/MainLayout";

const InternalRouting = () => {

  return (
    <>
      <Routes>
        <Route path="/*" element={<Store />} />

        {/* This is going to serve our stores (client side stores) and its pages */}
        <Route path="/configureStore/*" element={<StoreMainLayout />} />

      </Routes>
    </>
  );
};

export default InternalRouting;
