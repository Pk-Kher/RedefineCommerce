/*Component Name: ErrorHandler
Component Functional Details: User can create or update ErrorHandler master details from here.
Created By: chandan
Created Date: <Creation Date>
Modified By: chandan
Modified Date: <Modified Date> */

import { useFormikContext } from 'formik';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import { serverError } from 'services/common/helper/Helper';

const ErrorHandler = ({ errors = {}, setIsError, checkProductStatus }) => {
    const { validateForm } = useFormikContext();
    const [displayErrorMsgCount, setDisplayErrorMsgCount] = useState(0);
    const { id } = useParams();
    const dispatch = useDispatch();
    useEffect(() => {
        setIsError(Object.keys(errors).length ? true : false);
        checkProductStatus(errors);
    }, [errors]);
    useEffect(() => {
        // validateForm();
        setDisplayErrorMsgCount(prev => prev + 1);
    }, []);

    useEffect(() => {
        if (Object.keys(errors).length > 0 && displayErrorMsgCount === 1 && id) {
            dispatch(setAlertMessage({
                type: 'danger',
                message: serverError({ data: { errors: errors } })
            }));
            setDisplayErrorMsgCount(prev => prev + 1);
        }
    }, [errors, displayErrorMsgCount]);
    return <></>
}

export default ErrorHandler;
