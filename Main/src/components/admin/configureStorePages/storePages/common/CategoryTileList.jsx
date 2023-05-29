/*Component Name: CategoryTileList
Component Functional Details:  CategoryTileList .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React from 'react';

const CategoryTileList = ({ values }) => {
    return (
        <>
            <div className="text-center">
                <div >
                    <div className="flex text-center lg:w-auto">
                        <div className="relative  pb-4">
                            <div className="w-full bg-gray-200 rounded-md overflow-hidden aspect-w-1 aspect-h-1">
                                <img src="http://ystore.us/HTML/RedefineCommerce/Admin/images/look-11.png" alt="Front of men's Basic Tee in white." className="w-auto h-auto max-h-max" width="50" />
                            </div>
                            <div className={`mt-4 flex items-center text-base font-medium text-gray-900 text-center ${(values?.titleAlign === 'center' ? 'justify-center' : (values?.titleAlign === 'right' ? 'justify-end' : 'justify-start'))}`}>
                                <span className={`${values?.titleSize}`} style={{ color: values?.titleColor }}>Category Name</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CategoryTileList;
