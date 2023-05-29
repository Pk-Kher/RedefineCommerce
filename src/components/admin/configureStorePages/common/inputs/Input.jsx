/*Component Name: Input
Component Functional Details:  Input .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React from 'react';
import FormInput from 'components/common/formComponent/Input';

const Input = ({ name = '', title = '', defaultValue = '' }) => {
    return (
        <>
            <div className="mb-6">
                <div className="mb-4 last:mb-0">
                    <label htmlFor={name} className="mb-1 block text-sm">{title ? title : ''}</label>
                    <div className="flex flex-wrap">
                        <FormInput name={name} defaultValue={defaultValue && ''} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Input;
