import React from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";
import Content from "components/admin/content/Routes";

const ContentLayout = () => {
  return (
    <>
      <main className="bg-white">
        <Routes>
          <Route exact path="/Template/*" element={<Content />} />
        </Routes>
      </main>
    </>
  );
};
export default ContentLayout;
