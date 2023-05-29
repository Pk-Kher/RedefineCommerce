/*Component Name: UnsavedFormHandler
Component Functional Details: User can create or update UnsavedFormHandler master details from here.
Created By: chandan
Created Date: <Creation Date>
Modified By: chandan
Modified Date: <Modified Date> */

import React, { useEffect } from 'react';
import _ from 'lodash';

const UnsavedFormHandler = ({ values, setsaveUnSavedFields, InitialData }) => {
    useEffect(() => {
        if (!_.isEqual(InitialData, values)) {
            setsaveUnSavedFields((prevState) => ({
                ...prevState,
                currentState: true
            }))
        } else {
            setsaveUnSavedFields((prevState) => ({
                ...prevState,
                currentState: false
            }))
        }
    }, [values]);
    return <></>;
}


export default UnsavedFormHandler;
