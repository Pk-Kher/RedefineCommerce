/*Component Name: Notes
Component Functional Details:  Notes .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React, { useState, useEffect, useCallback } from 'react';
import Textarea from 'components/common/formComponent/Textarea';
import { Form as FormikForm, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { serverError } from "services/common/helper/Helper";
import { DateTimeFormat } from "services/common/helper/Helper";
import { ValidationMsgs } from "global/ValidationMessages";
import CustomerNoteService from 'services/admin/customerNotes/CustomerNoteService';
import { RecStatusValuebyName, RecStatusValueName } from 'global/Enum';
import Note from 'components/common/others/admin/CustomerCompany/Note';

const Notes = () => {
    const { id } = useParams();

    return (
        <>
            <Note API={CustomerNoteService.getListByCustomerId} id={id} ShowNotesData={true} />
        </>
    );
};

export default Notes;
