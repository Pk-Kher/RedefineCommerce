/*Component Name: Button
Component Functional Details:  Button .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React from 'react';
import { useDispatch } from 'react-redux';
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import { serverError } from 'services/common/helper/Helper';

const SaveButton = ({ className, children, errors = {}, ...rest }) => {
    const dispatch = useDispatch();
    return (
        <>
            <button type="submit" className={`btn bg-indigo-500 hover:bg-indigo-600 text-white ${className}`} onClick={() => {
                dispatch(setAlertMessage({ type: "danger", message: serverError({ data: { errors: errors } }) }));
            }} {...rest} >{children}</button>
        </>
    );
};

export default SaveButton;
