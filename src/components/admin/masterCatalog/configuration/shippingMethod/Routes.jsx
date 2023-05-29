import React from "react";
import { Route, Routes } from "react-router-dom";
import List from "./list/List"

const InternalRouting = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<List />} />
      </Routes>
    </>
  );
};

export default InternalRouting;
