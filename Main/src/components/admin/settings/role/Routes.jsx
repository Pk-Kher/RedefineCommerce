import React from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";
import List from "components/admin/settings/role/list/List";
import CreateRole from "components/admin/settings/role/create/Create";

const InternalRouting = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/create" element={<CreateRole />} />
        <Route path="/edit/:id" element={<CreateRole />} />
      </Routes>
    </>
  );
};

export default InternalRouting;
