/*Component Name: Routes
Component Functional Details: User can create or update Routes of main customer module details from here.
Created By: Shrey Patel
Created Date: 07/14/22
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";
import CouponCodes from "./couponCodes/Routes";
const InternalRouting = () => {
    return (
        <>
            <Routes>
                <Route path="/couponCodes/*" element={<CouponCodes />} />
            </Routes>
        </>
    );
};

export default InternalRouting;
