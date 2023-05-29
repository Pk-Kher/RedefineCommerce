/*Component Name: Cart
Component Functional Details:  Cart .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React from 'react';
import ProductTable from '../../../../../common/others/admin/CustomerCompany/ProductTable';
import CustomerService from 'services/admin/customer/CustomerService';

const Cart = ({ id }) => {
    return (
        <>
            <ProductTable API={CustomerService.getAddedCartProduct} CustomerId={id} ColumnHeaderDate={"Added To Cart Date"} ColumnHeaderCount={"Added To Cart Count"} />
        </>
    );
};

export default Cart;
