/*Component Name: RadiobuttonGroup
Component Functional Details:  RadiobuttonGroup .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import RadioButton from 'components/common/formComponent/RadioButton';
import { useFormikContext } from 'formik';
import React from 'react';

const RadiobuttonGroup = ({ name, options }) => {
    const { values, setFieldValue } = useFormikContext();
    // const CompanyId = useSelector((store) => store?.CompanyConfiguration.id)
    // const FolderPath = `/${blobFolder.temp}/${CompanyId}/${blobFolder.companyConfiguration}`
    return (
        <>
            <div className="mb-4 last:mb-0 flex flex-col justify-between">
                <div className="text-sm">
                    <div className=" px-3">
                        {options.map((option, index) => {
                            return (
                                <div className='form-check form-check-inline pb-2' key={index}>
                                    <RadioButton id={option.value} type="radio" name={name} value={option.value} onChange={(e) => { setFieldValue(name, e.target.value) }} checked={values[name] === option.value} label={option.label} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default RadiobuttonGroup;
