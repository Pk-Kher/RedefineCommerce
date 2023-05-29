import React, { useState, useRef, useEffect, useCallback } from 'react';
import Transition from "utils/Transition";
import { Formik, Form as FormikForm } from "formik";
import Input from 'components/common/formComponent/Input';
import { ValidationMsgs } from 'global/ValidationMessages';
import * as Yup from "yup";
import { ContentPageType } from 'dummy/Dummy';
import TopicsDetailsServices from 'services/admin/topics/TopicsDetailsServices';
import { useDispatch, useSelector } from 'react-redux'
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { serverError } from "services/common/helper/Helper";
import Messages from "components/common/alerts/messages/Index";
import { useNavigate } from 'react-router-dom';
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const CreatePopup = (domainId) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [pageType, setPageType] = useState();
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
        title: Yup.string().required(ValidationMsgs.pageCreate.nameRequired)
    });

    const createTopic = useCallback((fields) => {
        dispatch(setAddLoading(true))

        TopicsDetailsServices.createTopic(fields)
            .then((response) => {
                if (response.data.success && response.data.data) {
                    const topicId = response.data.data.id;
                    navigate(`/admin/Content/Page/edit/setting/${topicId}`)
                } else {
                    dispatch(
                        setAlertMessage({ type: "danger", message: serverError(response) })
                    );
                }
                dispatch(setAddLoading(false))
            }).catch((err) => {
                dispatch(setAlertMessage({ type: "danger", message: ValidationMsgs.pageEditSetting.topic.topicNotUpdated }));
                dispatch(setAddLoading(false))
            })
    });

    const handleSubmitHandler = (fields) => {
        createTopic(fields);
    }

    return (
        <>
            <button
                type='button'
                className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                ref={trigger}
                onClick={() => setShow(!show)}
            >
                <span className="material-icons-outlined">add</span>
                <span className="ml-1">Create Page</span>
            </button>
            <Transition
                className="bg-slate-100 border-y border-b-0 border-neutral-200 overflow-hidden"
                show={show}
                tag="div"
                enter="transition ease-out duration-200 transform"
                enterStart="opacity-0 -translate-y-2"
                enterEnd="opacity-100 translate-y-0"
                leave="transition ease-out duration-200"
                leaveStart="opacity-100"
                leaveEnd="opacity-0"
            >
                <div className="origin-top-left z-10 absolute top-full right-0 min-w-56 bg-white border border-neutral-200 pt-1.5 rounded shadow-lg overflow-hidden mt-1" ref={dropdown}>
                    <ul className="mb-4">
                        <li
                            className="py-1 px-3"
                            onClick={() => {
                                setPageType(ContentPageType.Website);
                                setOpenModal(true);
                            }}
                        >
                            <label className="flex items-center cursor-pointer">
                                <span className="text-sm font-medium ml-2">Website page</span>
                            </label>
                        </li>
                        <li
                            className="py-1 px-3"
                            onClick={() => {
                                setPageType(ContentPageType.Landing);
                                setOpenModal(true);
                            }}
                        >
                            <label className="flex items-center cursor-pointer">
                                <span className="text-sm font-medium ml-2">Landing page</span>
                            </label>
                        </li>
                        <li
                            className="py-1 px-3"
                            onClick={() => {
                                setPageType(ContentPageType.Blog);
                                setOpenModal(true);
                            }}
                        >
                            <label className="flex items-center cursor-pointer">
                                <span className="text-sm font-medium ml-2">Blog Post</span>
                            </label>
                        </li>
                    </ul>
                </div>
            </Transition>

            <Formik
                enableReinitialize={true}
                initialValues={{
                    title: "",
                    pageType: pageType,
                    storeId: domainId.domainId,
                    status: "A",
                    id: 0
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
                                                <div className="font-semibold text-gray-800">Create Page</div>
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
                                                            {/* <div className="w-full mb-6">
                                                                <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"> Website </label>
                                                            </div> */}
                                                            <div className="w-full mb-6">
                                                                <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"> Page Name </label>
                                                                <Input type="text" name="title" placeholder="Page Name" />
                                                            </div>
                                                            <div className="w-full justify-center">
                                                                <button className={`btn bg-indigo-500 hover:bg-indigo-600 text-white mr-1 ${(GlobalLoading)
                                                                    ? "bg-indigo-200 hover:bg-indigo-200"
                                                                    : "cursor-pointer"
                                                                    }`} type='submit'>
                                                                    {GlobalLoading && (
                                                                        <span className="spinner-border spinner-border-sm mr-2"></span>
                                                                    )}
                                                                    Create Page
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

export default CreatePopup