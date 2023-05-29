/*Component Name: StepTwo
Component Functional Details:  StepTwo .
Created By: PK Kher
Created Date: 7-19-2022
Modified By: Happy Patel
Modified Date: 11-23-2022 */

import React from "react";
import * as Yup from "yup";
import { blobFolder } from "global/Enum";
import { Formik, Form as FormikForm, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { ValidationMsgs } from "global/ValidationMessages";
import Messages from "components/common/alerts/messages/Index";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import ProductService from "services/admin/masterCatalog/masterCatalog/products/ProductService";
import FormErrorMessage from "components/common/alerts/FormErrorMessage";
import ImportExportService from "services/admin/masterCatalog/masterCatalog/products/ImportExportService";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { importValidation, serverError } from "services/common/helper/Helper";
import Error from "./Error";
import { useState } from "react";
import { values } from "lodash";
import { useRef } from "react";
import { useEffect } from "react";

const StepTwo = ({ currentStep, stepLength, index, goToStep, type, exportId }) => {
    const location = useSelector((store) => store?.location);
    const CompanyId = useSelector((store) => store?.CompanyConfiguration.id);
    const dispatch = useDispatch();
    const file = useRef();
    const [importError, setImportError] = useState({})

    const validationSchema = Yup.object({
        file: Yup.string().required(ValidationMsgs.common.importFileRequired),
    });
    const onSubmit = (fields, { resetForm }) => {

        dispatch(setAddLoading(true));
        const formData = new FormData();
        formData.append("file", fields.file);
        // formData.append("other.ExportType", exportId);
        // formData.append("other.Browser", location.browser);
        // formData.append("other.Location", location.location);
        // formData.append("other.IPAddress", location.ipAddress);
        // formData.append("other.MACAddress", location.macAddress);
        ImportExportService.importData(formData, `other.ExportType=${exportId}&other.Browser=${location.browser}&other.Location=${location.location}&other.IPAddress=${location.ipAddress}&other.MACAddress=${location.macAddress}`)
            .then((response) => {
                if (response?.data?.success) {
                    if (response?.data?.data?.data) {
                        dispatch(
                            setAlertMessage({
                                type: "success",
                                message: response?.data?.data?.data,
                                // message: ValidationMsgs?.product?.export?.importSuccess,
                            })
                        );
                        file.current.value = null;
                        resetForm({})
                    }
                    if (response?.data?.data?.fieldValidation && response?.data?.data?.fieldValidation?.length > 0) {
                        setImportError({
                            type: "danger",
                            message: importValidation(response?.data?.data?.fieldValidation)
                        });
                    }
                } else {
                    dispatch(
                        setAlertMessage({
                            type: "danger",
                            message: serverError(response),
                        })
                    );
                }
                dispatch(setAddLoading(false))
            })
            .catch(() => {
                dispatch(
                    setAlertMessage({
                        type: "danger",
                        message: ValidationMsgs.product.export.importFailed,
                    })
                );
                dispatch(setAddLoading(false))
            });
    };
    return (
        <>
            <Error showMessage={importError} setMessage={setImportError} />
            <Formik
                enableReinitialize={true}
                initialValues={{ file: "" }}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                {({ setFieldValue, values, errors }) => {
                    console.log(values);
                    return (
                        <FormikForm>
                            <div
                                className={`import-step import-step-2 ${currentStep !== 2 ? "hidden" : "visible"
                                    }`}
                            >
                                <div className="p-4 uppercase tracking-wide text-lg font-bold border-b-2 border-neutral-200">
                                    Import CSV document (Step {index + 1} of {stepLength})
                                </div>

                                <div className="p-4">
                                    <div className="mb-6">
                                        <label htmlFor="" className="block uppercase tracking-wide text-xs font-bold mb-2"> File :</label>
                                        <input type="file" ref={file} name="file" id={`file`} defaultValue={values.file} onChange={(event) => { setFieldValue("file", event.currentTarget.files[0]); }}
                                            className="w-full px-2 py-1 text-sm leading-7 bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md"
                                        />
                                        <FormErrorMessage >{errors?.file}</FormErrorMessage>
                                        <div className="text-xs mt-1">
                                            <div className="">The file must be under 20MBytes.</div>
                                            <div className="">
                                                You can import 25000 items at once.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-6">
                                        <label
                                            htmlFor=""
                                            className="block uppercase tracking-wide text-xs font-bold mb-2"
                                        >
                                            Product Image :
                                        </label>
                                        <input
                                            type="file"
                                            name=""
                                            className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md"
                                            id=""
                                        />
                                        <div className="text-xs mt-1">
                                            <div className="">The file must be under 20MBytes.</div>
                                            <div className="">
                                                You can import 25000 items at once.
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 flex items-center justify-end space-x-2 border-t-2 border-neutral-200">
                                    <span className="cursor-pointer btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700" onClick={goToStep.bind(null, currentStep - 1)}>Previous Step</span>
                                    <button
                                        type="submit"
                                        className="cursor-pointer btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white"
                                    >
                                        Import
                                    </button>
                                </div>
                            </div>
                        </FormikForm>
                    );
                }}
            </Formik>
        </>
    );
};

export default StepTwo;
