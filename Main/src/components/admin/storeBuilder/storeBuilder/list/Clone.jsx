import React, { useState, useCallback, useLayoutEffect } from "react";
import Transition from "utils/Transition";
import { Formik, Form as FormikForm } from "formik";
import Input from "components/common/formComponent/Input";
import { ValidationMsgs } from "global/ValidationMessages";
import * as Yup from "yup";
import RadioButton from "components/common/formComponent/RadioButton";
import { useNavigate, useParams } from "react-router-dom";
import InputNumber from "components/common/formComponent/InputNumber";
import StoreBuilderService from "services/admin/storeBuilder/StoreBuilderService";
import { useDispatch, useSelector } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { serverError } from "services/common/helper/Helper";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { RecStatusValuebyName } from "global/Enum";

const Clone = ({ data, openCloneModal, setOpenCloneModal }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);
    const validationSchema = Yup.object({
        name: Yup.string().required(ValidationMsgs.storeBuilder.clone.name),
        code: Yup.string().required(ValidationMsgs.storeBuilder.clone.code),
        url: Yup.string().required(ValidationMsgs.storeBuilder.clone.url),
    });

    const handleSubmitHandler = (fields, { resetForm }) => {
        dispatch(setAddLoading(true));
    
        StoreBuilderService.createStoreClone(fields)
            .then((response) => {
                if (response.data.success && response.data.data.id) {
                    dispatch(
                        setAlertMessage({
                            view: true,
                            type: "success",
                            message: ValidationMsgs.storeBuilder.clone.created,
                        })
                    );
                    navigate(`/admin/storeBuilder/edit/${response.data.data.id}`);
                } else {
                    dispatch(
                        setAlertMessage({ type: "danger", message: serverError(response) })
                    );
                    dispatch(setAddLoading(false));
                }
                setOpenCloneModal(false);
                resetForm();
            })
            .catch((errors) => {
                dispatch(
                    setAlertMessage({
                      view: true,
                      type: "danger",
                      message: "Store Clone is not created.",
                    })
                );
                setOpenCloneModal(false);
                dispatch(setAddLoading(false));
                resetForm();
            })
    };

    return (
        <Formik
            enableReinitialize={true}
            initialValues={{
                name: "",
                code: "",
                url: "",
                id: data?.storeId,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmitHandler}
        >
            {({ values, setFieldValue, resetForm, errors }) => {
                return (
                    <FormikForm>
                        <Transition
                            className="fixed inset-0 bg-slate-900 bg-opacity-30 z-30 transition-opacity"
                            show={openCloneModal}
                            tag="div"
                            enter="transition ease-out duration-200 transform"
                            enterStart="opacity-0 -translate-y-2"
                            enterEnd="opacity-100 translate-y-0"
                            leave="transition ease-out duration-200"
                            leaveStart="opacity-100"
                            leaveEnd="opacity-0"
                        ></Transition>
                        <Transition
                            className="fixed inset-0 z-30 overflow-hidden flex items-center my-4 justify-center transform px-4 sm:px-6"
                            show={openCloneModal}
                            tag="div"
                            id="basic-modal"
                            enter="transition ease-out duration-200 transform"
                            enterStart="opacity-0 -translate-y-2"
                            enterEnd="opacity-100 translate-y-0"
                            leave="transition ease-out duration-200"
                            leaveStart="opacity-100"
                            leaveEnd="opacity-0"
                        >
                            <div className="relative px-4 w-full max-w-2xl h-full md:h-auto">
                            <div className="relative bg-white rounded-lg shadow max-h-screen overflow-y-auto">
                                <div className="flex justify-between items-start p-5 rounded-t border-b sticky top-0 left-0 bg-white">
                                <div className="text-xl font-semibold text-gray-900 lg:text-2xl">
                                    Create Clone
                                </div>
                                </div>
                                <div className="p-6">
                                <div className="grid grid-cols-12 gap-6">
                                    <div className="col-span-12">
                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                                            Name{" "}
                                            <span className="text-rose-500 text-2xl leading-none">
                                            *
                                            </span>
                                        </label>
                                        <Input name={"name"} />
                                    </div>
                                    <div className="col-span-12">
                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                                            Code{" "}
                                            <span className="text-rose-500 text-2xl leading-none">
                                            *
                                            </span>
                                        </label>
                                        <Input name={"code"} />
                                    </div>
                                    <div className="col-span-12">
                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                                            URL{" "}
                                            <span className="text-rose-500 text-2xl leading-none">
                                            *
                                            </span>
                                        </label>
                                        <Input name={"url"} />
                                    </div>
                                    <div className="col-span-12"></div>
                                </div>
                                </div>
                                <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200">
                                <span
                                    className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700 cursor-pointer"
                                    onClick={() => {
                                    resetForm({});
                                    setOpenCloneModal(false);
                                    }}
                                >
                                    Cancel
                                </span>
                                <button
                                    className={`btn bg-indigo-500 hover:bg-indigo-600 text-white mr-1 ${GlobalLoading
                                    ? "bg-indigo-200 hover:bg-indigo-200"
                                    : "cursor-pointer"
                                    }`}
                                    type="submit"
                                >
                                    {GlobalLoading && (
                                    <span className="spinner-border spinner-border-sm mr-2"></span>
                                    )}
                                    Save
                                </button>
                                </div>
                            </div>
                            </div>
                        </Transition>
                    </FormikForm>
                );
            }}
        </Formik>
    )
}

export default Clone