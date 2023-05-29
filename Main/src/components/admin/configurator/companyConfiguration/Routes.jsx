/*Component Name: company configuration
Component Functional Details: Here we are listing company configuration data .
Created By: Chandan
Created Date: 06/09/2022 
Modified By: pradip kher
Modified Date: 06/09/2022 */

import React from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";
import List from "./list/List";
import Create from "./create/Create";
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
