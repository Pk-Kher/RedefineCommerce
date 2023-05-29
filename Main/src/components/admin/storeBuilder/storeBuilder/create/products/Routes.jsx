import React from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";

import Create from "./create/Create";

const InternalRouting = () => {
  
  return (
    <>
      <Routes>
        <Route path="/create" element={<Create />} />
        <Route path="/edit/:id" element={<Create />} />
      </Routes>
    </>
  );
};

export default InternalRouting;
