import React from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";

import List from "./list/List";
import LogoLocationCreate from "./create/Create";

const InternalRouting = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/create" element={<LogoLocationCreate />} />
        <Route path="/edit/:id" element={<LogoLocationCreate />} />
      </Routes>
    </>
  );
};

export default InternalRouting;
