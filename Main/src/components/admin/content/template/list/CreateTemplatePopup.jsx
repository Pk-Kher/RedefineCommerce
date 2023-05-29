import React, { useState, useRef, useEffect, useCallback } from 'react';
import Transition from "utils/Transition";
import { Formik, Form as FormikForm } from "formik";
import Input from 'components/common/formComponent/Input';
import { ValidationMsgs } from 'global/ValidationMessages';
import * as Yup from "yup";

import { useDispatch, useSelector } from 'react-redux'
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { serverError } from "services/common/helper/Helper";
import Messages from "components/common/alerts/messages/Index";
import { useNavigate } from 'react-router-dom';
import TemplateService from 'services/admin/template/TemplateService';
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const CreateTemplatePopup = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((store) => store.user);

    const [show, setShow] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const dropdown = useRef(null);
    const trigger = useRef(null);
    const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!dropdown.current) return;

            if (
                !show ||
                dropdown.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;

            setShow(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });

    const validationSchema = Yup.object({
        title: Yup.string().required(ValidationMsgs.templateCreate.nameRequired)
    });

    const createTemplate = useCallback((fields) => {
        dispatch(setAddLoading(true))

        TemplateService.createTemplates(fields)
            .then((response) => {
                if (response.data.success && response.data.data) {
                    const templateID = response.data.data.id;
                    navigate(`/admin/Content/template/edit/${templateID}`);
                } else {
                    dispatch(
                        setAlertMessage({ type: "danger", message: serverError(response) })
                    );

                }
                dispatch(setAddLoading(false))

            }).catch((err) => {
                console.log("catch ", err)

                dispatch(setAlertMessage({ type: "danger", message: "Something went wrong.Please try again." }));
                dispatch(setAddLoading(false))

            })
    });

    const handleSubmitHandler = (fields) => {
        console.log(fields, "Fields");
        createTemplate(fields)
    }

    return (
        <>
            <button
                type='button'
                className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                ref={trigger}
                onClick={() => setOpenModal(true)}
            >
                <span className="material-icons-outlined">add</span>
                <span className="ml-1">Create Template</span>
            </button>

            <Formik
                enableReinitialize={true}
                initialValues={{
                    title: "",
                    created_by: user.firstname + " " + user.lastname,
                    updated_by: user.firstname + " " + user.lastname
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmitHandler}
            >
                {
                    ({ values, setFieldValue, resetForm }) => {
                        return (
                            <FormikForm>
                                <Transition
                                    className="fixed inset-0 bg-slate-900 bg-opacity-30 z-50 transition-opacity"
                                    show={openModal}
                                    tag="div"
                                    enter="transition ease-out duration-200 transform"
                                    enterStart="opacity-0 -translate-y-2"
                                    enterEnd="opacity-100 translate-y-0"
                                    leave="transition ease-out duration-200"
                                    leaveStart="opacity-100"
                                    leaveEnd="opacity-0"
                                ></Transition>
                                <Transition
                                    className="fixed inset-0 z-50 overflow-hidden flex items-center my-4 justify-center transform px-4 sm:px-6"
                                    show={openModal}
                                    tag="div"
                                    id="basic-modal"
                                    enter="transition ease-out duration-200 transform"
                                    enterStart="opacity-0 -translate-y-2"
                                    enterEnd="opacity-100 translate-y-0"
                                    leave="transition ease-out duration-200"
                                    leaveStart="opacity-100"
                                    leaveEnd="opacity-0"
                                >
                                    <div className="bg-white rounded shadow-lg overflow-auto max-w-lg w-full max-h-full">
                                        {/* Modal Header */}
                                        <div className="px-5 py-3 border-b border-neutral-200">
                                            <div className="flex justify-between items-center">
                                                <div className="font-semibold text-gray-800">Create Template</div>
                                                <button
                                                    className="text-gray-400 hover:text-gray-500"
                                                    onClick={() => {
                                                        setOpenModal(false);
                                                        resetForm();
                                                    }}
                                                >
                                                    <div className="sr-only">Close</div>
                                                    <svg className="w-4 h-4 fill-current">
                                                        <path
                                                            d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z">
                                                        </path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <div className='px-5'>
                                            <Messages />
                                        </div>
                                        {/* Modal Content */}
                                        <div className="px-5 pt-4 pb-4">
                                            <div className="w-full flex items-center justify-center">
                                                <div className="w-full">
                                                    <div className="panel-01 tab-content py-4">
                                                        <div className="flex flex-wrap mb-6">
                                                            {/* <Input type="hidden" name="page_type" defaultValue={pageType}/> */}
                                                            {/* <div className="w-full mb-6">
                                                                <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"> Website </label>
                                                            </div> */}
                                                            <div className="w-full mb-6">
                                                                <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"> Template Name </label>
                                                                <Input type="text" name="title" placeholder="Template Name" />
                                                            </div>
                                                            <div className="w-full justify-center">
                                                                <button className={`btn bg-indigo-500 hover:bg-indigo-600 text-white mr-1 ${(GlobalLoading)
                                                                    ? "bg-indigo-200 hover:bg-indigo-200"
                                                                    : "cursor-pointer"
                                                                    }`} type='submit'>
                                                                    {GlobalLoading && (
                                                                        <span className="spinner-border spinner-border-sm mr-2"></span>
                                                                    )}
                                                                    Create Template
                                                                </button>
                                                                <button
                                                                    type='button'
                                                                    className="btn border-gray-300 hover:border-neutral-400 text-gray-500"
                                                                    onClick={() => {
                                                                        setOpenModal(false);
                                                                        resetForm();
                                                                    }}
                                                                >
                                                                    <span>Cancel</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Transition>
                            </FormikForm>
                        )
                    }
                }
            </Formik>
        </>
    )
}

export default CreateTemplatePopup