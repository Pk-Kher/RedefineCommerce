/*Component Name: Index
Component Functional Details:  Index .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React from 'react';
import { Route } from 'react-router';
import Routes from 'routes/Routes';
import List from "./list/List"
const Index = () => {
    return (
        <Routes>
            <Route path='/' element={<List />} />
        </Routes>
    );
};

export default Index;
