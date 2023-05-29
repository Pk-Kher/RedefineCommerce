/*Component Name: ToggleButton
Component Functional Details:  ToggleButton .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import { useFormikContext } from 'formik';
import React from 'react';
import FormToggleButton from 'components/common/formComponent/ToggleButton';

const ToggleButton = ({ title, name }) => {
    const { values } = useFormikContext();
    return (
        <>
            <div className="last:mb-0 flex flex-wrap justify-between items-center pt-4">
                <div className="flex items-center gap-1">
                    <label className="block text-sm font-bold">{title}</label>
                </div>
                <div className="flex items-center" >
                    <FormToggleButton name={name} id={name} defaultValue={values[name]} on={"ON"} off={"OFF"} />
                </div >
            </div>
        </>
    );
};

export default ToggleButton;
