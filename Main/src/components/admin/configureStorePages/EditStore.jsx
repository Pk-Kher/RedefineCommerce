/*Component Name: EditStore
Component Functional Details: User can create or update EditStore master details from here.
Created By: chandan
Created Date: <Creation Date>
Modified By: chandan
Modified Date: <Modified Date> */

import React, { useState, useCallback } from 'react';

import StoreHeader from "components/admin/configureStorePages/common/StoreHeader"
import StoreAsideBar from "components/admin/configureStorePages/common/StoreSideBar"
import StoreSetting from './common/StoreSetting';
import { storeSettingProductPageDate, storeCategoryListProperty, storeProductListProperty } from 'dummy/Dummy'
import Messages from "components/common/alerts/messages/Index";

import PreviewStore from "./PreviewStore"
import CategoryListing from './storePages/categoryListing/CategoryListing';
import ProductListing from './storePages/prodoctListing';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import StoreService from 'services/admin/store/StoreService';
import { Formik, Form as FormikForm } from 'formik';
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import { useDispatch, useSelector } from 'react-redux';
import CMSConfiguration from 'services/admin/cmsConfiguration/CMSConfiguration';
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { serverError } from 'services/common/helper/Helper';
import { ValidationMsgs } from 'global/ValidationMessages';

const EditStore = () => {
    const [showSidebar, setShowSideBar] = useState(true);
    const [page, setPage] = useState("CategoryPage");
    const { id } = useParams();
    const [store, setStore] = useState({});
    useEffect(() => {
        dispatch(setAddLoading(true))

        StoreService.getStoreById(id).then((response) => {
            if (response.data.data) {
                let storeData = response.data.data;
                setStore(storeData);
            }
            dispatch(setAddLoading(false))

        }).catch((error) => {
            dispatch(setAddLoading(false))
        });
    }, [id]);
    const PreviewPages = {
        productDetail: { Component: PreviewStore, Property: storeSettingProductPageDate },
        CategoryPage: { Component: CategoryListing, Property: storeCategoryListProperty },
        ProductListing: { Component: ProductListing, Property: storeProductListProperty },
    }
    const Component = PreviewPages[page].Component;
    const dispatch = useDispatch();
    const { id: CurrentStoreId } = useParams();
    const [initialValues, setInitialValues] = useState({});
    const [configData, setConfigData] = useState({});
    const getProductDetailPageTheme = useCallback(() => {
        dispatch(setAddLoading(true))

        CMSConfiguration
            .getConfiguration(CurrentStoreId, page)
            .then((res) => {
                // console.log("product_detail_page ", res.data.data, JSON.parse(res.data.data.config_value))
                setInitialValues(JSON.parse(res.data.data.config_value));
                setConfigData(res.data.data);
                dispatch(setAddLoading(false))

            }).catch((error) => {
                dispatch(setAddLoading(false))

            });
    }, [page]);

    const updateProductDetailPageTheme = useCallback((data) => {
        var jsonData = JSON.stringify(data);
        dispatch(setAddLoading(true))

        let headerConfigObj = {
            id: configData?.id || 0,
            "store_id": CurrentStoreId,
            "config_name": page,
            "config_value": jsonData,
            "status": "Y"
        }
        CMSConfiguration.updateConfiguration(headerConfigObj)
            .then((res) => {
                if (res.data.success) {
                    dispatch(
                        setAlertMessage({
                            type: "success",
                            message: ValidationMsgs.cmsConfig.themeStored,
                        })
                    );
                    getProductDetailPageTheme();
                } else {
                    dispatch(
                        setAlertMessage({
                            type: "danger",
                            message: serverError(res),
                        })
                    );
                }
                dispatch(setAddLoading(false))
            })
            .catch((error) => {
                dispatch(setAlertMessage({ type: "danger", message: ValidationMsgs.cmsConfig.themeNotStored }));
                dispatch(setAddLoading(false));
            })
    }, [page, configData]);

    const handleAttribute = (fields, resetForm) => {

        updateProductDetailPageTheme(fields);
    }

    useEffect(() => {
        getProductDetailPageTheme();
    }, [page]);
    return (
        <>
            <title>Configure Store</title>
            <main className="bg-white">
                <Formik
                    enableReinitialize={true}
                    initialValues={initialValues}
                    onSubmit={handleAttribute}
                >
                    {({ setFieldValue, errors, values, isSubmitting, touched }) => {
                        // console.log(values);
                        return (
                            <FormikForm>
                                <StoreHeader page={page} setPage={setPage} store={store} />
                                <div className="flex justify-between border-solid border-b-gray-100 w-full" >
                                    <div className="w-full">
                                        <div className="flex flex-wrap mb-6 relative">

                                            <StoreAsideBar showSidebar={showSidebar} setShowSideBar={setShowSideBar}>
                                                <StoreSetting page={page} AttributeData={PreviewPages[page] ? PreviewPages[page]?.Property : []} initialValues={initialValues} />
                                            </StoreAsideBar>
                                            <div id="right" className={`transition-all relative grow ${showSidebar ? 'ml-[380px]' : "ml-[25px]"}`}>
                                                <div className="p-6 relative z-10">
                                                    <Messages />
                                                    <div className="border border-dashed border-neutral-200 mx-auto">
                                                        <div className="p-4">
                                                            {
                                                                Component && <Component showSidebar={showSidebar} isPreview={false} Store={page} storeDetails={store} />
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </FormikForm>
                        )
                    }
                    }
                </Formik>

            </main>
        </>
    );
};

export default EditStore;
