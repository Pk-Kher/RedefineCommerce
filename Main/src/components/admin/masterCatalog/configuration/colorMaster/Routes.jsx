import React from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";

import ColorListing from "./list/List";

const InternalRouting = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<ColorListing />} />
      </Routes>
    </>
  );
};

export default InternalRouting;
