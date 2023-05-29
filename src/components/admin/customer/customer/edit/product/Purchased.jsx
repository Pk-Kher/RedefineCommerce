/*Component Name: Purchased
Component Functional Details:  Purchased .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React from 'react';
import ProductTable from '../../../../../common/others/admin/CustomerCompany/ProductTable';
import CustomerService from 'services/admin/customer/CustomerService';

const Purchased = ({ id }) => {
    return (
        <>
            <ProductTable API={CustomerService.getPurchaseProductList} CustomerId={id} ColumnHeaderDate={"Purchased Date"} ColumnHeaderCount={"Purchased Count"} />
        </>
    );
};

export default Purchased;
