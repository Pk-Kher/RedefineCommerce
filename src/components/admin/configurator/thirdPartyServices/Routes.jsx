import React from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";
import List from "./list/List"
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
