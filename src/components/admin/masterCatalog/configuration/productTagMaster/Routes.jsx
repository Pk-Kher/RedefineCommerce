import React from "react";
import { Route, Routes } from "react-router-dom";

import AddTagModal from "./create/AddTagModal";
import List from "./list/List";

const InternalRouting = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/create" element={<AddTagModal />} />
        {/* <Route path="/edit/:id" element={<AddTagModal />} /> */}
      </Routes>
    </>
  );
};

export default InternalRouting;
