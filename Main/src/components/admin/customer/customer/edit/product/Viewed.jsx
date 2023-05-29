/*Component Name: Viewed
Component Functional Details:  Viewed .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React from 'react';
import ProductTable from '../../../../../common/others/admin/CustomerCompany/ProductTable';
import CompanyInformationService from "services/admin/companyInformation/CompanyInformationServices";

const Viewed = ({ id }) => {
    return (
        <>
            <ProductTable API={CompanyInformationService.getViewedList} CustomerId={id} ColumnHeaderDate={"Viewed Date"} ColumnHeaderCount={"Viewed Count"} />
        </>
    );
};

export default Viewed;
