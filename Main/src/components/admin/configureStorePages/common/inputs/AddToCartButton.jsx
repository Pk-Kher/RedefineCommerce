/*Component Name: AddToCart_BuyNowBtn
Component Functional Details: User can create or update AddToCart_BuyNowBtn master details from here.
Created By: chandan
Created Date: <Creation Date>
Modified By: chandan
Modified Date: <Modified Date> */

import React from 'react';
import { useFormikContext } from 'formik';

const AddToCartButton = ({ name }) => {
    const { setFieldValue, values } = useFormikContext();

    return (
        <>
            <div>
                <div className="mt-3">
                    <div className="mb-4 last:mb-0 flex items-center">
                        <div className="grid grid-cols-2 gap-2 mb-5" x-data="{activeTab:031}">
                            <div className={`border-2 rounded-md overflow-hidden focus:ring-indigo-500 focus:border-indigo-500 border-gray-300  ${(values[name] === 1) ? 'border-blue-500' : 'border-gray-300 cursor-pointer'}`} onClick={() => setFieldValue(name, 1)} >
                                <span className="py-5 px-8 flex items-center justify-center text-sm font-medium text-gray-700 bg-[#F7F3F0] w-full mt-5">
                                    Buy Now
                                </span>
                            </div>
                            <div className={`border-2 rounded-md overflow-hidden focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 ${(values[name] === 2) ? 'border-blue-500' : 'border-gray-300 cursor-pointer'}`} onClick={() => setFieldValue(name, 2)} >
                                <span className="py-5 px-8 flex items-center justify-center text-sm font-medium text-white bg-black btn-block w-full ease-in-out" aria-controls="disclosure-1">
                                    Add to bag
                                </span>
                                <span className="py-5 px-8 flex items-center justify-center text-sm font-medium text-gray-700 bg-[#F7F3F0] w-full mt-5">
                                    Buy Now
                                </span>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </>
    );
};

export default AddToCartButton;
