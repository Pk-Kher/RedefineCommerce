/*Component Name: ProductDetails
Component Functional Details: User can create or update ProductDetails master details from here.
Created By: chandan
Created Date: <Creation Date>
Modified By: chandan
Modified Date: <Modified Date> */

import React from 'react';
import PreviewProductDetails from "./storePages/ProductDetailPreview"

import { useParams } from "react-router-dom";

const ProductDetails = ({ isPreview = true, Store }) => {
    const { previewStoreName } = useParams();

    const PreviewPages = {
        productDetail: PreviewProductDetails,
    }
    const Component = PreviewPages[isPreview ? previewStoreName : Store];

    return (
        <>
            {
                Component && <Component />
            }
        </>
    );
};

export default ProductDetails;
