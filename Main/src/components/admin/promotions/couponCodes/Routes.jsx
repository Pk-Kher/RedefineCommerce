/*Component Name: Routes
Component Functional Details: User can create or update Routes master details from here.
Created By: Shrey Patel
Created Date: 07/14/22
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";
import List from "./list/List";
import Create from "./create/Create";

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
