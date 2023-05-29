/*Component Name: ProductGallerySlideStyle
Component Functional Details: User can create or update ProductGallerySlideStyle master details from here.
Created By: chandan
Created Date: <Creation Date>
Modified By: chandan
Modified Date: <Modified Date> */

import React from 'react';
import { useFormikContext } from 'formik';

const ProductGallerySlideStyle = () => {
    const { setFieldValue, values } = useFormikContext();

    const { product_gallery_slider_option } = values

    return (
        <>
            <div className="mb-6 last:mb-0 flex flex-wrap justify-between items-center" >
                <label className="mb-3 block text-sm font-bold">Product Gallery Slider Style</label>
                <div className="grid grid-cols-3 gap-2 mb-5">
                    <div className={`border-2 rounded-md overflow-hidden focus:ring-indigo-500 focus:border-indigo-500   ${product_gallery_slider_option === 1 ? 'border-blue-500 activeTab' : 'border-gray-300 cursor-pointer'} `} onClick={() => setFieldValue("product_gallery_slider_option", 1)}  >
                        <img alt="" src="http://ystore.us/HTML/RedefineCommerce/Admin/images/progallery-01.png" />
                    </div>
                    <div className={`border-2 rounded-md overflow-hidden focus:ring-indigo-500 focus:border-indigo-500   ${product_gallery_slider_option === 2 ? 'border-blue-500 activeTab' : 'border-gray-300 cursor-pointer'} `} onClick={() => setFieldValue("product_gallery_slider_option", 2)} >
                        <img alt="" src="http://ystore.us/HTML/RedefineCommerce/Admin/images/progallery-02.png" />
                    </div>
                    <div className={`border-2 rounded-md overflow-hidden focus:ring-indigo-500 focus:border-indigo-500   ${product_gallery_slider_option === 3 ? 'border-blue-500 activeTab' : 'border-gray-300 cursor-pointer'} `} onClick={() => setFieldValue("product_gallery_slider_option", 3)} >
                        <img alt="" src="http://ystore.us/HTML/RedefineCommerce/Admin/images/progallery-03.png" />
                    </div>
                </div>
            </div >
        </>
    );
};

export default ProductGallerySlideStyle;
