import React from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";
import Create from "./create/Create";
// import Edit from "./Edit";
import List from "./list/List";

const InternalRouting = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/create" element={<Create path="/create" />} />
        <Route path="/edit/:id" element={<Create path="/edit/:id" />} />
      </Routes>
    </>
  );
};

export default InternalRouting;
