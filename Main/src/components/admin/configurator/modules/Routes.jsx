import React from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";
import List from "./list/List";
import AddExtension from "./create/Extension";
import AddNavigation from "./create/Navigation";
const InternalRouting = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/Extension/create" element={<AddExtension />} />
        <Route path="/Extension/edit/:id" element={<AddExtension />} />
        <Route path="/Navigation/create" element={<AddNavigation />} />
        <Route path="/Navigation/edit/:id" element={<AddNavigation />} />
      </Routes>
    </>
  );
};

export default InternalRouting;
