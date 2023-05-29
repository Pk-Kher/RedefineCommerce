import React from "react";
import { Route, Routes } from "react-router-dom";
import Create from "./create/Create";
import List from "./list/List";

const InternalRouting = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/create" element={<Create />} />
        <Route path="/edit/:id" element={<Create />} />
      </Routes>
    </>
  );
};

export default InternalRouting;
