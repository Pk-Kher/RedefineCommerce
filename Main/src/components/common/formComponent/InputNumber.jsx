/*Component Name: InputNumber
Component Functional Details:  InputNumber .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import { ErrorMessage } from 'formik';
import React from 'react';
import { NumericFormat } from 'react-number-format';
import { useSelector } from 'react-redux';
import FormErrorMessage from '../alerts/FormErrorMessage';

const InputNumber = ({ className, disabled, displayError = false, ...res }) => {
    const permission = useSelector(store => store.permission);
    return (
        <>
            <NumericFormat {...res} className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md ${disabled ? "bg-gray-100" : ""} ${className}`} disabled={disabled || (!permission?.isEdit && !permission?.isDelete)} />
            {displayError === true && (
                <ErrorMessage name={res.name} component={FormErrorMessage} />
            )}
        </>
    );
};

export default InputNumber;
