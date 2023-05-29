import React from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";
import Dashboard from "./dashboard/Dashboard";
import Create from "./storeBuilder/create/Create";
import List from "./storeBuilder/list/List";
import Organizations from "./organizations/Routes";
import Sports from "./sports/Routes";
import Teams from "./teams/Routes";
import PaymentGateways from "./paymentGateways/Routes";
import Bundles from "./storeBuilder/create/products/bundles/Routes";
import Products from "./storeBuilder/create/products/Routes";
import Categories from "./storeBuilder/create/categories/Routes";
import Edit from "./storeBuilder/edit/Edit";
import TrashList from "./storeBuilder/list/TrashList";

const InternalRouting = () => {
  return (
    <>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/store/create" element={<Create />} />
        <Route path="/create/:id" element={<Create mode={"create"} />} />
        <Route path="/store/edit/:id" element={<Edit mode={"edit"} />} />
        <Route path="/store" element={<List />} />
        <Route path="/store/trash" element={<TrashList />} />
        <Route path="/organizations/*" element={<Organizations />} />
        <Route path="/sports/*" element={<Sports />} />
        <Route path="/teams/*" element={<Teams />} />
        <Route path="/paymentGateways/*" element={<PaymentGateways />} />
        <Route path="/store/:storeId/bundle/*" element={<Bundles />} />
        <Route path="/:storeId/products/*" element={<Products />} />
        <Route path="/:storeId/categories/*" element={<Categories />} />
      </Routes>
    </>
  );
};

export default InternalRouting;
