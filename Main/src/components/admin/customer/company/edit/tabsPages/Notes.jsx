/*Component Name: Notes
Component Functional Details:  Notes .
Created By: Divyesh
Created Date: <Creation Date>
Modified By: Divyesh
Modified Date: <Modified Date> */

import React, { useState, useEffect, useCallback } from 'react';
import { Form as FormikForm, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { DateTimeFormat } from "services/common/helper/Helper";
import CustomerNoteService from 'services/admin/customerNotes/CustomerNoteService';
import { RecStatusValuebyName, RecStatusValueName } from 'global/Enum';
import Note from 'components/common/others/admin/CustomerCompany/Note';

const Notes = () => {
    const { id } = useParams();

    return (
        <>
            <Note API={CustomerNoteService.getCustomerNoteByCompanyId} id={id} ShowNotesData={false} />
        </>
    );
};

export default Notes;
