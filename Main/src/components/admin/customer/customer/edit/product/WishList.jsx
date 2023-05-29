/*Component Name: WishList
Component Functional Details:  WishList .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React from 'react';
import ProductTable from '../../../../../common/others/admin/CustomerCompany/ProductTable';
import CustomerService from 'services/admin/customer/CustomerService';

const WishList = ({ id }) => {
    return (
        <>
            <ProductTable API={CustomerService.getWishListProduct} CustomerId={id} ColumnHeaderDate={"Wishlist Date"} ColumnHeaderCount={"Wishlist Count"} />
        </>
    );
};

export default WishList;
