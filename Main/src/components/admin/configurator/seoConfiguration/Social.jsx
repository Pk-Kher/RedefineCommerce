/*Component Name: social
Component Functional Details: User can create or update social master details from here.
Created By: Happy
Created Date: <Creation Date>
Modified By: Chandan,Divyesh Shah
Modified Date: 25-08-2022 */

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Field, Form as FormikForm, Formik } from "formik";
import * as Yup from "yup";
import Input from "components/common/formComponent/Input";
import SeoConfigurationService from "services/admin/seoConfiguration/SeoConfigurationService"
import { useDispatch, useSelector } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { serverError } from "services/common/helper/Helper";
import { RecStatusValuebyName } from "global/Enum"
import SEOSocial from "components/common/others/admin/SEO/SEOSocial";
import { ValidationMsgs } from "global/ValidationMessages";

const Social = ({ setFormSubmit, setIsError, Data, activeTab, index, submitHandler, moduleName }) => {
    const permission = useSelector(store => store.permission);
    const [AddOption, setAddOption] = useState(false);
    const formRef = useRef();
    const [checkerror, setCheckError] = useState(false);
    const dispatch = useDispatch();
    const [socialData, setSocialData] = useState([]);
    const location = useSelector(store => store.location);
    const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

    useEffect(() => {
        if (activeTab == index) {
            setFormSubmit(formRef.current);
        }
    }, [formRef, setFormSubmit, activeTab]);

    useEffect(() => {
        setIsError(checkerror);
    }, [checkerror]);
    const getSocialDataList = () => {
        SeoConfigurationService.getSocialDataList()
            .then((response) => {
                let socialData = response.data;
                if (response) {
                    // setData(socialData?.data)
                    setSocialData(socialData?.data)
                }
            })
            .catch(() => { });
    }

    useEffect(() => {
        getSocialDataList();
    }, []);

    const updateSeoSoicalConfigurationService = (fields, resetForm) => {

        SeoConfigurationService.updateSeoSoicalConfigurationService({ ...location, ...fields, })
            .then((response) => {
                if (response?.data?.success) {
                    dispatch(
                        setAlertMessage({
                            type: "success",
                            message: ValidationMsgs.seoConfig.socialInfoUpdated,
                        })
                    );
                    getSocialDataList();
                } else {
                    dispatch(
                        setAlertMessage({ type: "success", message: serverError(response) })
                    );
                }
            })
            .catch((errors) => {
                dispatch(
                    setAlertMessage({
                        type: "danger",
                        message: ValidationMsgs.seoConfig.socialInfoNotUpdated,
                    })
                );
            });
    };
    const submitSocialHandler = (fields) => {
        updateSeoSoicalConfigurationService(fields)
    }
    return (
        <>
            <div className="panel-02 tab-content">
                <div className="w-full">
                    <Formik
                        enableReinitialize={true}
                        initialValues={{
                            socialSEOConfigurationModel: socialData

                        }}
                        onSubmit={submitSocialHandler}
                        innerRef={formRef}
                    >
                        {({ errors, setFieldValue, values }) => {
                            // setCheckError(Object.keys(errors).length ? true : false);
                            return (
                                <FormikForm>
                                    <div className="p-6 pb-0 border-b-2 border-slate-200 last:border-b-0 ">
                                        <div className="p-6 border-2 border-neutral-200 grid grid-cols-2 gap-x-6 rounded-xl">
                                            {values.socialSEOConfigurationModel.map((values, index) => {
                                                return (
                                                    <div key={index} >
                                                        <div className="mb-6 last:mb-0">
                                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                                                {values?.name}
                                                                <span className="text-rose-500 text-2xl leading-none" />
                                                            </label>
                                                            <Input
                                                                type="text"
                                                                name={`socialSEOConfigurationModel.${index}.url`}
                                                                defaultValue={values?.url}
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            })
                                            }
                                            <div className="mb-6 last:mb-0 col-span-2"></div>
                                            {(permission?.isEdit || permission?.isDelete) &&
                                                <div className="mb-6 last:mb-0 col-span-2">
                                                    <button
                                                        className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                                                        data-modal-toggle="addOptionModal"
                                                        type="button"
                                                        onClick={() => setAddOption(true)}
                                                    >
                                                        Add option
                                                    </button>
                                                    <button
                                                        disabled={GlobalLoading}
                                                        className={`btn bg-indigo-500 hover:bg-indigo-600 text-white  ml-2 ${(GlobalLoading) ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}
                                                        data-modal-toggle="addOptionModal"
                                                        type="submit"
                                                    >
                                                        <div className={`w-full flex justify-center align-middle `}>
                                                            {GlobalLoading && (
                                                                <span className="spinner-border spinner-border-sm mr-2"></span>
                                                            )}
                                                            Save
                                                        </div>
                                                    </button>
                                                </div>}

                                        </div>
                                    </div>
                                </FormikForm>
                            )
                        }}
                    </Formik>
                    <Formik
                        enableReinitialize={true}
                        initialValues={{
                            openGraphImagePath: Data.openGraphImagePath || '',
                            openGraphTitle: Data.openGraphTitle || '',
                            openGraphDescription: Data.openGraphDescription || '',
                            facebookImagePath: Data.facebookImagePath || '',
                            facebookOpenGraphTitle: Data.facebookOpenGraphTitle || '',
                            facebookOpenGraphDescription: Data.facebookOpenGraphDescription || '',
                            twitterImagePath: Data.twitterImagePath || '',
                            twitterOpenGraphTitle: Data.twitterOpenGraphTitle || '',
                            twitterOpenGraphDescription: Data.twitterOpenGraphDescription || '',
                            linkedinImagePath: Data.linkedinImagePath || '',
                            linkedinOpenGraphTitle: Data.linkedinOpenGraphTitle || '',
                            linkedinOpenGraphDescription: Data.linkedinOpenGraphDescription || '',
                            pinterestImagePath: Data.pinterestImagePath || '',
                            pinterestOpenGraphTitle: Data.pinterestOpenGraphTitle || '',
                            pinterestOpenGraphDescription: Data.pinterestOpenGraphDescription || '',
                            rowVersion: Data.rowVersion || "",
                            recStatus: Data?.recStatus || RecStatusValuebyName.Active,

                        }}
                        onSubmit={submitHandler}
                        innerRef={formRef}
                    >
                        {({ errors, setFieldValue, values }) => {
                            setCheckError(Object.keys(errors).length ? true : false);
                            return (
                                <FormikForm>

                                    <div className="p-6 border-b-2 border-slate-200 last:border-b-0">
                                        <SEOSocial values={values} setFieldValue={setFieldValue} displayFieldElement={() => true} readOnly={false} fields={[]} moduleName={moduleName} />
                                    </div>
                                </FormikForm>
                            );
                        }}
                    </Formik >
                </div>
            </div>

            {AddOption && <AddOptionModal setAddOption={setAddOption} getSocialDataList={getSocialDataList} GlobalLoading={GlobalLoading} />}
        </>
    );
};

export default Social;

const AddOptionModal = ({ setAddOption, handleShowModel, getSocialDataList, GlobalLoading }) => {
    const validationSchemaForOption = Yup.object({
        name: Yup.string().required(ValidationMsgs.seoConfig.nameRequired),
        url: Yup.string().required(ValidationMsgs.seoConfig.urlRequired)
    });
    const dispatch = useDispatch();
    const { id } = useParams();
    const [Data, setData] = useState(null);

    const location = useSelector((store) => store?.location);

    const createSeoSocialConfigurationService = (fields, resetForm) => {

        SeoConfigurationService.createSeoSocialConfigurationService({ socialSEOConfigurationModel: { ...fields, ...location } })
            .then((response) => {
                if (response?.data?.success) {
                    dispatch(
                        setAlertMessage({
                            type: "success",
                            message: ValidationMsgs.seoConfig.socialDataAdded,
                        })
                    );
                    getSocialDataList();
                    resetForm({});
                } else {
                    dispatch(
                        setAlertMessage({ type: "danger", message: serverError(response) })
                    );
                }
            })
            .catch((errors) => {
                dispatch(
                    setAlertMessage({
                        type: "danger",
                        message: ValidationMsgs.seoConfig.socialDataNotAdded,
                    })
                );
            });
    };

    const updateSeoConfigurationService = (fields, resetForm) => {

        SeoConfigurationService.updateSeoConfigurationService({ socialSEOConfigurationModel: { ...fields, ...location } })
            .then((response) => {
                if (response?.data?.success) {
                    dispatch(
                        setAlertMessage({
                            type: "danger",
                            message: ValidationMsgs.seoConfig.socialDataUpdated,
                        })
                    );
                    getSocialDataList();
                } else {
                    dispatch(
                        setAlertMessage({ type: "danger", message: serverError(response) })
                    );
                }
            })
            .catch((errors) => {
                dispatch(
                    setAlertMessage({
                        type: "danger",
                        message: ValidationMsgs.seoConfig.socialDataNotUpdated,
                    })
                );
            });
    };

    const onSubmit = (fields, { resetForm }) => {
        if (!id) {
            createSeoSocialConfigurationService(fields, resetForm);
            setAddOption(false);
        } else {
            updateSeoConfigurationService(fields, resetForm);
            setAddOption(false);
        }
    };

    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    id: Data?.id || 0,
                    name: Data?.name || "",
                    url: Data?.url || "",
                    recStatus: Data?.recStatus || RecStatusValuebyName.Active,
                    rowVersion: Data?.rowVersion || "",
                }}
                validationSchema={validationSchemaForOption}
                onSubmit={onSubmit}

            >
                {({ resetForm, errors, values }) => {
                    return (
                        <FormikForm>
                            <div
                                id="addOptionModal"
                                aria-hidden="true"
                                className={`overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-4 z-50 justify-center items-center h-modal md:h-full md:inset-0`}
                            >
                                <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                                    <div className="relative px-4 w-full max-w-2xl h-full md:h-auto">
                                        <div className="relative bg-white rounded-lg shadow max-h-screen overflow-y-auto">
                                            <div className="flex justify-between items-start p-5 rounded-t border-b sticky top-0 left-0 bg-white">
                                                <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl">
                                                    Add Option
                                                </h3>
                                                <button
                                                    type="button"
                                                    onClick={() => { setAddOption(false); }}
                                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                                                    data-modal-toggle="addOptionModal"
                                                >
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="p-6">
                                                <div className="mb-6 last:mb-0">
                                                    <Input
                                                        type="text"
                                                        name="name"
                                                        placeholder="Name"
                                                    />
                                                </div>
                                                <div className="mb-6 last:mb-0">
                                                    <Input
                                                        type="text"
                                                        name="url"
                                                        placeholder="Url"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200">
                                                <button
                                                    data-modal-toggle="addOptionModal"
                                                    type="button"
                                                    onClick={() => { setAddOption(false); resetForm() }}
                                                    className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    data-modal-toggle="addOptionModal"
                                                    disabled={GlobalLoading}
                                                    type="submit"
                                                    className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(GlobalLoading) ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}
                                                >
                                                    <div className={`w-full flex justify-center align-middle `}>
                                                        {GlobalLoading && (
                                                            <span className="spinner-border spinner-border-sm mr-2"></span>
                                                        )}
                                                        Save
                                                    </div>
                                                </button>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </FormikForm>
                    );
                }}
            </Formik>
        </>

    )
}