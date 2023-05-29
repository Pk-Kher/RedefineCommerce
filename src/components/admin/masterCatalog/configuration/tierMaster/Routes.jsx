import React from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";
import TierListing from "./list/List";
import TierCreate from "./create/Create";
 
const InternalRouting = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<TierListing />} />
        <Route path="/create" element={<TierCreate />} />
        <Route path="/store/:storeId" element={<TierCreate />} />
      </Routes>
    </>
  );
};

export default InternalRouting;
