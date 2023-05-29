/*Component Name: Note
Component Functional Details:  Note .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React from 'react';
import { Formik, Form as FormikForm } from "formik";
import Textarea from 'components/common/formComponent/Textarea';
import OrderService from 'services/admin/order/OrderService';
import { useSelector, useDispatch } from 'react-redux';
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import { serverError } from 'services/common/helper/Helper';
import { setAddLoading } from 'redux/globalLoader/GlobalLoaderAction';
import { ValidationMsgs } from 'global/ValidationMessages';

const Note = ({ title = "Note", note = "", type, orderDetail }) => {
    const permission = useSelector(store => store?.permission);
    const dispatch = useDispatch();
    const location = useSelector((store) => store?.location);
    const saveNote = (values, { resetForm }) => {
        dispatch(setAddLoading(true));
        OrderService.updatenote({ ...values, ...location }).then((response) => {
            if (response.data.success && response.data.data) {
                dispatch(setAlertMessage({
                    type: "success",
                    message: ValidationMsgs.order.noteUpdated
                }));
            } else {
                dispatch(setAlertMessage({
                    type: "danger",
                    message: serverError(response)
                }));
            }
            dispatch(setAddLoading(false));
        }).catch((error) => {
            dispatch(setAddLoading(false));
        })
    }
    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    notes: note || '',
                    orderId: orderDetail?.orderNumber,
                    notesType: type,
                }}
                onSubmit={saveNote}
            >
                {({ errors, setFieldValue, values }) => {
                    return (
                        <FormikForm>
                            <div className="w-full justify-between bg-white px-5 py-3 pb-6 rounded-md shadow-lg">
                                <div className="w-full mb-2 last:mb-0">
                                    <div className="text-lg font-bold text-gray-500 text-left leading-10">{title}</div>
                                </div>
                                <div className="w-full mb-2 last:mb-0">
                                    <Textarea disabled={!permission?.isEdit && !permission?.isDelete} id="notes" name="notes" rows="3" className="shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md resize-none" />
                                </div>
                                {(permission?.isEdit || permission?.isDelete) && <div className="w-full mb-2 last:mb-0">
                                    <button
                                        className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white`}>
                                        <div className={`w-full flex justify-center align-middle `}>
                                            Save
                                        </div>
                                    </button>
                                </div>}
                            </div>
                        </FormikForm>
                    )
                }}
            </Formik>
        </>
    );
};

export default Note;
