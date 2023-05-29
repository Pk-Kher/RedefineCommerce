import React from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";
import Create from "./create/Create";
import Export from "./export/Export";
import Import from "./import/Import";
import List from "./list/List";

const InternalRouting = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/create" element={<Create />} />
        <Route path="/edit/:id" element={<Create />} />
        <Route path="/export" element={<Export />} />
        <Route path="/import" element={<Import />} />
      </Routes>
    </>
  );
};

export default InternalRouting;
