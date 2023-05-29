/*Component Name: Routes
Component Functional Details: User can create or update Routes of main customer module details from here.
Created By: Happy
Created Date: 01/06/22
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";
import Customer from "./customer/Routes";
import Company from "./company/Routes";
const InternalRouting = () => {
  return (
    <>
      <Routes>
        <Route path="Customer/*" element={<Customer />} />
        <Route path="Company/*" element={<Company />} />
      </Routes>
    </>
  );
};

export default InternalRouting;
