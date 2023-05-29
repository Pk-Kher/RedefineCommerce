import React from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";
import VendorListing from "./list/List";
import VendorCreate from "./create/Create";

const InternalRouting = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<VendorListing />} />
        <Route path="/create" element={<VendorCreate />} />
        <Route path="/edit/:id" element={<VendorCreate />} />
      </Routes>
    </>
  );
};

export default InternalRouting;
