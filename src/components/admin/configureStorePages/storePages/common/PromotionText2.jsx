/*Component Name: PromotionText2
Component Functional Details:  PromotionText2 .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import { useFormikContext } from 'formik';
import React from 'react';

const PromotionText2 = ({ values = "Text" }) => {
    return (
        <section id="promotionText2" className="mb-6">
            <div className="mx-auto">
                <div className="group">
                    <div className="w-full border-2 relative border-solid border-transparent">
                        <div className="container mx-auto px-2 lg:px-44 py-5 text-center bg-[#ffa400] flex justify-center" dangerouslySetInnerHTML={{ __html: values }}>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromotionText2;
