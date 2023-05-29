/*Component Name: Routes
Component Functional Details: User can create or update Routes of main customer module details from here.
Created By: Happy
Created Date: 01/06/22
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";
import Template from "./template/Routes";
import List from "./page/list/List";
import AssetsLibrary from "./assetsLibrary/list/List";
const InternalRouting = () => {
  return (
    <>
      <Routes>
        <Route path="Template/*" element={<Template />} />
        <Route path="Page" element={<List />} />
        <Route path="library" element={<AssetsLibrary />} />
      </Routes>
    </>
  );
};

export default InternalRouting;
