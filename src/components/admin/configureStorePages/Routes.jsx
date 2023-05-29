/*Component Name: Routes
Component Functional Details: User can create or update Routes of main customer module details from here.
Created By: Happy
Created Date: 01/06/22
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";

import ProductDetails from "./PreviewStore"

const InternalRouting = () => {

  return (
    <>
      <Routes>
        <Route path="ProductDetail" element={<ProductDetails />} />
      </Routes>
    </>
  );
};

export default InternalRouting;
