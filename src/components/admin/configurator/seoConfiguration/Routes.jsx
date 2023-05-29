import React from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";

import SeoConfiguration from "./SeoConfiguration";

const InternalRouting = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<SeoConfiguration />} />
      </Routes>
    </>
  );
};

export default InternalRouting;
