import React from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";
import TemplateCreate from "./create/Create";
import TemplateList from "./list/List";

const InternalRouting = () => {
  return (
    <>
      <Routes>

        <Route path="/" element={<TemplateList />} />
        <Route path="/edit/:id" element={<TemplateCreate />} />

      </Routes>
    </>
  );
};

export default InternalRouting;
