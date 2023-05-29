/*Component Name: List
Component Functional Details: User can create or update Create master details from here.
Created By: Shrey Patel
Created Date: 
Modified By: Shrey Patel
Modified Date: 06/01/2022 */

import React from "react";

import { Route } from "react-router-dom";
import Routes from "routes/Routes";

import Create from "./create/Create";
import List from "./list/List";

const InternalRouting = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/create" element={<Create />} />
        <Route path="/edit/:id" element={<Create />} />
      </Routes>
    </>
  );
};

export default InternalRouting;
