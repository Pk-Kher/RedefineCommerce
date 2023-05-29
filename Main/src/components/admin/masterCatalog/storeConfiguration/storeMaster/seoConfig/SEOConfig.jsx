/*Component Name: SEOConfig
Component Functional Details: User can create or update SEOConfig master details from here.
Created By: Happy
Created Date: <Creation Date>
Modified By: Divyesh
Modified Date: <Modified Date> */

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Social from "./Social";
import Integration from "./Integration";
import General from "./General";
import BasicModal from "components/common/modals/Basic";
import Tabs from "components/common/Tabs";
import { displayTabs } from "global/Enum"
import { ValidationMsgs } from "global/ValidationMessages";
import { serverError } from "services/common/helper/Helper";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import StoreSeoConfigurationService from "services/admin/store/StoreSeoConfigurationService";
import Messages from "components/common/alerts/messages/Index";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const SEOConfig = () => {
    const { id } = useParams("");
    const permission = useSelector(store => store.permission);
    const [ModalInfo, setModalInfo] = useState({});
    const [openBasicModal, setOpenBasicModal] = useState(false);
    const [FormSubmit, setFormSubmit] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState(0);
    const [isError, setIsError] = useState(false);
    const [data, setData] = useState({});
    const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);
    const location = useSelector((store) => store?.location);

    const componentsForm = {
        General: General,
        Social: Social,
        Integration: Integration,
    };
    const onTabClick = (e, index) => {
        e.preventDefault();
        if (!isError) {
            setActiveTab(index);
        } else {
            setModalInfo((prev) => {
                return {
                    ...prev,
                    message: ValidationMsgs.common.tabValidation,
                    module: "Product",
                    title: "Form Error",
                    ButtonName: "OK",
                    displayCancelButton: false,
                };
            });
            setOpenBasicModal((prev) => !prev);
        }
    };

    const getSeoStoreSetupService = () => {
        dispatch(setAddLoading(true))

        StoreSeoConfigurationService.getSeoStoreSetupService(id)
            .then((res) => {
                var SeoData = res.data;
                if (SeoData.success && res.data.data) {
                    setData(SeoData?.data);
                }
                dispatch(setAddLoading(false))

            })
            .catch((err) => {
                dispatch(setAddLoading(false))
            });
    };

    useEffect(() => {
        getSeoStoreSetupService();
    }, []);

    const createSeoConfigurationService = (fields) => {
        dispatch(setAddLoading(true))

        StoreSeoConfigurationService.createSeoConfigurationService({ seoStoreSetupModel: { ...data, ...fields, ...location,/*  rowVersion: "" */ } })
            .then((response) => {
                if (response.data.success) {
                    // setisDesabledAddCatalog(response.data.data.id);

                    dispatch(
                        setAlertMessage({
                            type: "success",
                            message: ValidationMsgs.store.created,
                        })
                    );
                    getSeoStoreSetupService();
                } else {
                    dispatch(
                        setAlertMessage({ type: "danger", message: serverError(response) })
                    );
                    dispatch(setAddLoading(false))

                }
            })
            .catch((errors) => {
                dispatch(
                    setAlertMessage({
                        type: "danger",
                        message: ValidationMsgs.store.notCreated,
                    })
                );
                dispatch(setAddLoading(false))

            });
    };

    const updateSeoStoreSoicalSetupService = (fields) => {
        dispatch(setAddLoading(true))

        StoreSeoConfigurationService.updateSeoStoreSetupService({ seoStoreSetupModel: { ...data, ...fields, ...location, } })
            .then((response) => {
                if (response.data.success) {
                    dispatch(
                        setAlertMessage({
                            type: "success",
                            message: ValidationMsgs.store.updated,
                        })
                    );
                    getSeoStoreSetupService();
                } else {
                    dispatch(
                        setAlertMessage({ type: "danger", message: serverError(response) })
                    );
                    dispatch(setAddLoading(false))

                }
            })
            .catch((errors) => {
                dispatch(
                    setAlertMessage({
                        type: "danger",
                        message: ValidationMsgs.store.notUpdated,
                    })
                );
                dispatch(setAddLoading(false))

            });
    };

    const submitHandler = (fields) => {
        if (!data?.id) {
            createSeoConfigurationService(fields);
        } else {
            updateSeoStoreSoicalSetupService(fields);
        }
    };

    return (
        <>
            <title>SEO Setup</title>
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="flex flex-wrap mb-8 justify-between">
                    <div className="flex items-center">
                        <Link
                            to={"/admin/MasterCatalog/Store/"}
                            className="btn border-neutral-200 hover:border-neutral-400 text-gray-500 hover:text-gray-700 flex items-center mr-2"
                        >
                            <span className="material-icons-outlined">west</span>
                        </Link>

                        <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
                            SEO Setup
                        </h1>
                    </div>

                    {(FormSubmit && (permission?.isEdit || permission?.isDelete)) && <div className="flex flex-wrap space-x-2">
                        <button type="button" onClick={() => navigate(-1)} className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700">
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={GlobalLoading}
                            onClick={() => {
                                FormSubmit.handleSubmit();
                            }}
                            className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(GlobalLoading) ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}
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
                <Messages />
                <div className="bg-white shadow-xxl rounded-md mb-8">
                    <div className="w-full bg-white shadow-xxl rounded-md mb-8 pt-4">
                        <Tabs
                            options={displayTabs}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            onTabClick={onTabClick}
                        />
                        <div className="w-full">
                            <>
                                {displayTabs.map((tab, index) => {
                                    const Component = componentsForm[tab.componentname];
                                    return (
                                        <div
                                            className={`${activeTab !== index && "hidden"
                                                } w-full rounded-md mb-8 tab-content text-sm`}
                                            key={index}
                                        >
                                            <Component
                                                setFormSubmit={setFormSubmit}
                                                activeTab={activeTab}
                                                setActiveTab={setActiveTab}
                                                index={index}
                                                data={data}
                                                submitHandler={submitHandler}
                                                setIsError={setIsError}
                                                getSeoStoreSetupService={getSeoStoreSetupService}
                                            // moduleName={moduleName}
                                            />
                                        </div>
                                    );
                                })}
                            </>
                        </div>
                    </div>
                </div>
            </div>
            <BasicModal
                openModal={openBasicModal}
                setOpenModal={setOpenBasicModal}
                {...ModalInfo}
            />
        </>
    );
};

export default SEOConfig;
