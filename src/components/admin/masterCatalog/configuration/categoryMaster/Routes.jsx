import React from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";

import CategoryListing from "./list/List";
import CategoryCreate from "./create/Create";

const InternalRouting = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<CategoryListing />} />
        <Route path="/create" element={<CategoryCreate />} />
        <Route path="/edit/:id" element={<CategoryCreate />} />
      </Routes>
    </>
  );
};

export default InternalRouting;
