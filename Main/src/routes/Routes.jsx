/*Component Name: Switch
Component Functional Details:  Switch .
Created By: PK Kher
Created Date: 6-17-2022
Modified By: PK Kher
Modified Date: 6-17-2022 */

import React from 'react';
import { Routes as ReactRoutes, Route } from "react-router-dom";
import PageNotFound from "error/PageNotFound";
import Unauthorize from 'error/Unauthorize';


const Routes = ({ children }) => {
    return (
        <ReactRoutes>
            {children}
            <Route path="/unauthorized" element={<Unauthorize />} />
            <Route path="*" element={<PageNotFound />} />
        </ReactRoutes>
    )
};

export default Routes;
