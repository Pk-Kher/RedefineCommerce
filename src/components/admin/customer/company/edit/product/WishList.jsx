// /*Component Name: Cart
// Component Functional Details:  Cart .
// Created By: Divyesh
// Created Date: <Creation Date>
// Modified By: Divyesh
// Modified Date: <Modified Date> */

import React, { useState, useCallback, useEffect } from 'react';
import ProductTable from '../../../../../common/others/admin/CustomerCompany/ProductTable';
import CompanyInformationService from "services/admin/companyInformation/CompanyInformationServices";

const WishList = ({ id }) => {
    return (
        <>
            <ProductTable API={CompanyInformationService.getWishListProduct} CompanyId={id} ColumnHeaderDate={"Wishlist Date"} ColumnHeaderCount={"Wishlist Count"} />
        </>
    );
};

export default WishList;