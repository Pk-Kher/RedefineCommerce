/*Component Name: Routes
Component Functional Details: User can create or update Routes Company details from here.
Created By: chandan
Created Date: 06/06/22
Modified By: chandan
Modified Date: 06/06/22 */

import React from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";
import Company from "./list/List";
import CompanyCreate from "./create/Create";
import Edit from "./edit/Edit";

const InternalRouting = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Company />} />
        <Route path="/create" element={<CompanyCreate />} />
        <Route path="/edit/:id" element={<Edit />} />
      </Routes>
    </>
  );
};

export default InternalRouting;
