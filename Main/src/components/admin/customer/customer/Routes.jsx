/*Component Name: Routes
Component Functional Details: User can create or update Routes master details from here.
Created By: Happy
Created Date: 01/06/22
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";
import Create from "./create/Create";
import Edit from "./edit/Edit";
import Customer from "./list/List";

const InternalRouting = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Customer />} />
        <Route path="create" element={<Create />} />
        <Route path="edit/:id" element={<Edit />} />
      </Routes>
    </>
  );
};

export default InternalRouting;
