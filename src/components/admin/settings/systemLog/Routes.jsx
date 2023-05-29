import React from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";
import List from "components/admin/settings/systemLog/list/List"


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
