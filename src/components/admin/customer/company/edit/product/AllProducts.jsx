/*Component Name: Cart
Component Functional Details:  Cart .
Created By: Divyesh
Created Date: <Creation Date>
Modified By: Divyesh
Modified Date: <Modified Date> */

import React from 'react';
import ProductTable from '../../../../../common/others/admin/CustomerCompany/ProductTable';
import CompanyInformationService from "services/admin/companyInformation/CompanyInformationServices";

const AllProducts = ({ id }) => {
    return (
        <>
            <ProductTable API={CompanyInformationService.getAllProducts} CompanyId={id} ColumnHeaderDate={"Viewed Date"} ColumnHeaderCount={"Viewed Count"} />
        </>
    );
};

export default AllProducts;