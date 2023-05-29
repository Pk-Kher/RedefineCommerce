/*Component Name: PromotionText1
Component Functional Details:  PromotionText1 .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import { useFormikContext } from 'formik';
import React from 'react';

const PromotionText1 = ({ values = "Text" }) => {

    return (
        <section id="promotionText1">
            <div className="mx-auto">
                <div className="group">
                    <div className="w-full border-2 relative border-solid border-transparent">
                        <div className="container mx-auto">
                            <div className="bg-green-500 text-gray-900 p-1 text-center" dangerouslySetInnerHTML={{ __html: values }}>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromotionText1;
