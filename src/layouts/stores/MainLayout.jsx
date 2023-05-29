import React from "react";

import { Route } from "react-router-dom";
import Routes from "routes/Routes";

import EditStore from "components/admin/configureStorePages/EditStore"
import PreviewStore from "components/admin/configureStorePages/PreviewStore"
import ThemeSetting from "components/admin/content/themeSetting/ThemeSetting";

const MainLayout = () => {
  return (
    <>
      <Routes>
        <Route path="/:id" element={<EditStore />} />
        <Route path="Theme/:storeid" element={<ThemeSetting />} />
        <Route path="/preview/:previewStoreName" element={<PreviewStore />} />
      </Routes>
    </>
  );
};
export default MainLayout;
