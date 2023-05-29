/*Component Name: CategorySEO
Component Functional Details: User can create or update CategorySEO master details from here.
Created By: Shrey Patel
Created Date: Oct/19/2022
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React from 'react';
import Input from "components/common/formComponent/Input";

const CategorySEO = ({ setFieldValue, values }) => {
    return (
        <>
            <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 p-6 ">
                <div className="w-full mb-6">
                    <div className="flex items-center justify-between">
                        <div className="block uppercase tracking-wide text-gray-500 text-base font-bold">
                            SEO
                        </div>
                    </div>
                </div>
                <div className="w-full">
                    <div className="w-full mb-6 last:mb-0">
                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            Title <span className="text-rose-500 text-lg leading-none">*</span>
                        </label>
                        <Input
                            id="seTitle"
                            name={`seTitle`}
                            type="text"
                        />
                    </div>
                    <div className="w-full mb-6 last:mb-0">
                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            Keywords {/* <span className="text-rose-500 text-lg leading-none">*</span> */}
                        </label>
                        <Input
                            id="seKeywords"
                            name={`seKeywords`}
                            type="text"
                        />
                    </div>
                    <div className="w-full mb-6 last:mb-0">
                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            Description
                            {/* <span className="text-rose-500 text-lg leading-none">*</span> */}
                        </label>
                        <Input
                            id="seDescription"
                            name={`seDescription`}
                            type="text"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CategorySEO;
