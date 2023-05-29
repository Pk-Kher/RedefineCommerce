/*Component Name: Routes
Component Functional Details:  Routes .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React from 'react';
import { Route } from 'react-router';
import Routes from "routes/Routes";
import Cache from 'components/admin/masterCatalog/settings/cache'
const Index = () => {
    return (
        <>
            <Routes>
                <Route path="clearCache/*" element={<Cache />} />
            </Routes>
        </>
    );
};

export default Index;
