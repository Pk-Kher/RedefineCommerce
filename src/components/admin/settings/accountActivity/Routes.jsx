import React from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";
import AccoutnActivity from "components/admin/settings/accountActivity/list/List"


const InternalRouting = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<AccoutnActivity />} />
                <Route path="/:id" element={<AccoutnActivity />} />
            </Routes>
        </>
    );
};

export default InternalRouting;
