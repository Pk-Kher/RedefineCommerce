/*Component Name: Note
Component Functional Details: User can create or update Note master details from here.
Created By: Shrey Patel
Created Date: 01/11/2023
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useState, useEffect, useCallback } from 'react';
import Textarea from 'components/common/formComponent/Textarea';
import * as Yup from "yup";
import { Form as FormikForm, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { serverError } from "services/common/helper/Helper";
import { DateTimeFormat } from "services/common/helper/Helper";
import { ValidationMsgs } from "global/ValidationMessages";
import CustomerNoteService from 'services/admin/customerNotes/CustomerNoteService';
import { RecStatusValuebyName, RecStatusValueName } from 'global/Enum';

const Notes = ({ API, id, ShowNotesData = true }) => {
    const dispatch = useDispatch();
    const [NotesData, setNotesData] = useState({});
    const location = useSelector((store) => store?.location);
    const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);
    const permission = useSelector(store => store?.permission)

    const validationSchema = Yup.object().shape({
        notes: Yup.string().required(ValidationMsgs.customer.requiredNotes),
    });

    const getCustomerNotesData = useCallback(() => {
        if (id) {
            dispatch(setAddLoading(true))
            if (API instanceof Function) {
                API(id)
                    .then((res) => {
                        var response = res.data;
                        if (response.success) {
                            setNotesData(response?.data);
                        }
                        dispatch(setAddLoading(false))
                    })
                    .catch((err) => {
                        dispatch(setAddLoading(false))
                    });
            }
        }
    }, [id]);

    const createNotes = (values, resetForm) => {
        dispatch(setAddLoading(true))

        CustomerNoteService.CreateCustomerNotes({ customerModel: { ...values, ...location } })
            .then((response) => {
                if (response.data.success && response.data.data) {
                    dispatch(
                        setAlertMessage({ type: "success", message: ValidationMsgs.customer.notesCreated })
                    )
                    getCustomerNotesData();
                    resetForm({})
                } else {
                    dispatch(
                        setAlertMessage({ type: "danger", message: serverError(response) })
                    );
                }
                dispatch(setAddLoading(false))
            })
            .catch((errors) => {
                dispatch(setAlertMessage({ type: "danger", message: ValidationMsgs.customer.notesNotCreated }));
                dispatch(setAddLoading(false))
            });
    };

    const onSubmit = (values, { resetForm }) => {
        createNotes(values, resetForm);
    }

    useEffect(() => {
        getCustomerNotesData();
    }, [id, getCustomerNotesData]);

    return (
        <>
            <Formik
                initialValues={{
                    id: 0,
                    rowVersion: "",
                    customerId: id,
                    notes: "",
                    recStatus: RecStatusValuebyName.Active
                }}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
                validateOnChange={true}
                validateOnBlur={false}
            >
                {({ setFieldValue, errors, values }) => {
                    return (
                        <FormikForm>
                            <div className='grow'>
                                <div className='p-4 space-y-6'>
                                    <h2 className="text-2xl text-gray-800 font-bold mb-5">Notes</h2>
                                    <div className='flow-root'>
                                        <ul className='-mb-8' role={'list'}>
                                            {NotesData && NotesData.length > 0 ? NotesData?.map((Note, Index) => {
                                                return (
                                                    <li>
                                                        <div className="relative pb-8">
                                                            {NotesData?.length - 1 !== Index &&
                                                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                                            }
                                                            <div className="relative flex space-x-3">
                                                                {Index === 0 ?
                                                                    <div>
                                                                        <span className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                                                                            <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" >
                                                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                                                                            </svg>
                                                                        </span>
                                                                    </div>
                                                                    :
                                                                    <div>
                                                                        <span className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center ring-8 ring-white">
                                                                            <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path>
                                                                            </svg>
                                                                        </span>
                                                                    </div>
                                                                }
                                                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                                    <div>
                                                                        {/* <p className="text-sm text-gray-500">Applied to */}
                                                                        <a href="#" className="font-medium text-gray-900">{Note.notes}</a>
                                                                        {/* </p> */}
                                                                    </div>
                                                                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                                        <time dateTime="2020-09-20">{DateTimeFormat(Note?.createdDate, "MMMM dd").date}</time>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                )
                                            }) :
                                                <li>
                                                    <div className='font-semibold text-lg text-red-400 mb-6'>No Data Found!</div>
                                                </li>
                                            }
                                        </ul>
                                    </div>
                                    {ShowNotesData &&
                                        <div>
                                            <div className="mb-6 last:mb-0">
                                                <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">Add Notes <span className="text-rose-500 text-2xl leading-none"></span></label>
                                                <div >
                                                    <Textarea name={'notes'} defaultValue={values?.notes} id="notes" cols="30" rows="10" />
                                                </div>
                                                {(permission?.isEdit || permission?.isDelete) &&
                                                    <div className="text-right mt-4">
                                                        <button
                                                            disabled={GlobalLoading}
                                                            className="items-center btn bg-indigo-500 hover:bg-indigo-600 text-white rounded">
                                                            <div className={`w-full flex justify-center align-middle `}>
                                                                {GlobalLoading && (
                                                                    <span className="spinner-border spinner-border-sm mr-2"></span>
                                                                )}
                                                                Save
                                                            </div>
                                                        </button>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </FormikForm>
                    );
                }}
            </Formik>
        </>
    );
};

export default Notes;
