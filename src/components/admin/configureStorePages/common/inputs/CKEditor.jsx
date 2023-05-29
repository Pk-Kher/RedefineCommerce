/*Component Name: CKEditor
Component Functional Details:  CKEditor .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React from 'react';
import FormCkEditor from "components/common/formComponent/CKEditor"
import { useFormikContext } from 'formik';

const CKEditor = ({ name, initialValues, ...rest }) => {
    const { values, setFieldValue } = useFormikContext();
    return (
        <>
            <FormCkEditor
                id={`${name}`}
                name={`${name}`}
                defaultValue={values[name]}
                onChange={(value) => {
                    setFieldValue(name, value);
                }}
                loading={initialValues[name]}
                {...rest}
            />
        </>
    );
};

export default CKEditor;
