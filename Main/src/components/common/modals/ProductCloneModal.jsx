/*Component Name: ProductCloneModal
Component Functional Details: User can create or update ProductCloneModal master details from here.
Created By: Happy
Created Date: 20/9/22
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import Checkbox from '../formComponent/Checkbox';
import { Formik, Form as FormikForm } from "formik";
import MasterProductService from 'services/admin/masterCatalog/masterCatalog/products/ProductService';
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { useDispatch, useSelector } from "react-redux";
import Messages from "components/common/alerts/messages/Index";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const ProductCloneModal = ({ openCloneModal, setOpenCloneModal, data, proId = [], attributeClone = false, getProductData }) => {
    const [initialValues, setInitialValues] = useState(null);
    const [stores, setStores] = useState([]);
    const [mainStores, setMainStores] = useState([]);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const companyConfiguration = useSelector((state) => state.CompanyConfiguration);
    const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

    useEffect(() => {
        let unmounted = false;
        let source = axios.CancelToken.source();
        if (proId.length > 0) {
            dispatch(setAddLoading(true))

            MasterProductService.getStoreListByProduct({
                companyConfigurationId: companyConfiguration.id,
                userid: user.id,
                productid: proId,
                isSuperUser: user.isSuperUser
            })
                .then((stores) => {
                    if (stores.data.success && !unmounted) {
                        setStores(stores.data.data);
                        setMainStores(stores.data.data);
                    }
                    dispatch(setAddLoading(false))

                })
                .catch((error) => {
                    dispatch(setAddLoading(false))

                });
        }
        return () => {
            unmounted = true;
            source.cancel("Cancelling in cleanup");
        };
    }, [proId]);

    const searchStore = (e) => {
        var search = e.target.value.trim();
        if (search !== "") {
            setStores(() => {
                return stores
                    .map((value) => {
                        var subStore = [];
                        value?.storeList.map((storeId) => {
                            if (
                                storeId.storeName
                                    .toLowerCase()
                                    .includes(search.toLowerCase())
                            ) {
                                subStore = [...subStore, { ...storeId }];
                            }
                            return "";
                        });
                        if (subStore && subStore.length > 0) {
                            return { ...value, storeList: subStore };
                        }
                        return { ...value, storeList: undefined };
                    })
                    .filter((value) => value.storeList !== undefined)
            });

        } else {
            setStores(mainStores);
        }
    };

    const setStoresValue = (stores, e) => {
        if (e.target.checked) {
            return [...stores, parseInt(e.target.value)];
        } else {
            var index = stores.indexOf(parseInt(e.target.value));
            if (index > -1) {
                stores.splice(index, 1); // 2nd parameter means remove one item only
            }
            return stores;
        }
    };

    const handleClone = (fields, { resetForm }) => {
        if (fields.storeIdList.length <= 0) {
            dispatch(
                setAlertMessage({
                    type: "danger",
                    message: "Please Select Store to clone.",
                })
            );
        } else {
            dispatch(setAddLoading(true))

            if (attributeClone) {
                MasterProductService.attributeCloneProduct({
                    cloneproductattributemodel: {
                        productId: proId[0],
                        storeIDList: fields.storeIdList,
                        attributeList: data
                    }
                }).then((response) => {
                    if (response.data.success && response.data.data) {
                        dispatch(
                            setAlertMessage({
                                type: "success",
                                message: "Attribute cloned successfully.",
                            })
                        );
                    } else {
                        dispatch(setAlertMessage({ type: "danger", message: "Product not cloned."/* serverError(response) */ }));
                    }
                    setOpenCloneModal(false);
                    dispatch(setAddLoading(false))

                })
                    .catch((errors) => {
                        dispatch(
                            setAlertMessage({
                                type: "danger",
                                message: "Attribute is not cloned.",
                            })
                        );
                        setOpenCloneModal(false);
                        dispatch(setAddLoading(false))
                    });
            }
            else {
                MasterProductService.cloneProduct({
                    productIdList: proId,
                    ...fields
                }).then((response) => {
                    if (response.data.success && response.data.data) {
                        dispatch(
                            setAlertMessage({
                                type: "success",
                                message: "Product cloned successfully.",
                            })
                        );
                    } else {
                        dispatch(setAlertMessage({ type: "danger", message: "Product not cloned."/* serverError(response) */ }));
                    }
                    setOpenCloneModal(false);
                    dispatch(setAddLoading(false))


                })
                    .catch((errors) => {
                        dispatch(
                            setAlertMessage({
                                type: "danger",
                                message: "Product is not cloned.",
                            })
                        );
                        setOpenCloneModal(false);
                        dispatch(setAddLoading(false))

                    });
            }
        }
    }

    if (initialValues && initialValues === null) {
        return ""
    }
    return (
        <>
            <div
                className="fixed inset-0 bg-slate-900 bg-opacity-95 z-40 transition-opacity"
                // show={openCloneModal}
                // tag="div"
                // enter="transition ease-out duration-200 transform"
                // enterStart="opacity-0 -translate-y-2"
                // enterEnd="opacity-100 translate-y-0"
                // leave="transition ease-out duration-200"
                // leaveStart="opacity-100"
                // leaveEnd="opacity-0"
                onClick={() => setOpenCloneModal(false)}
            ></div>
            <div
                className="fixed inset-0 z-40 overflow-hidden flex items-center my-4 justify-center transform px-4 sm:px-6"
            // show={openCloneModal}
            // tag="div"
            // id="clone-modal"
            // enter="transition ease-out duration-200 transform"
            // enterStart="opacity-0 -translate-y-2"
            // enterEnd="opacity-100 translate-y-0"
            // leave="transition ease-out duration-200"
            // leaveStart="opacity-100"
            // leaveEnd="opacity-0"
            >
                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        storeIdList: []
                    }}
                    onSubmit={handleClone}
                >
                    {({ setFieldValue, resetForm, values }) => {
                        return (
                            <FormikForm>
                                <div className="relative px-4 max-w-6xl max-h-screen w-screen">
                                    <div className="relative bg-white rounded-md shadow overflow-auto max-w-6xl w-full max-h-[calc(100vh-2rem)]">
                                        <div className="flex justify-between items-start p-5 rounded-t border-b sticky top-0 bg-white z-10">
                                            <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl"> Store List </h3>
                                            <button
                                                className="text-gray hover:text-gray-400"
                                                type="button"

                                                onClick={() => { setOpenCloneModal(false); }}
                                            >
                                                <div className="sr-only">Close</div>
                                                <svg className="w-4 h-4 fill-current">
                                                    <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z"></path>
                                                </svg>
                                            </button>
                                        </div>
                                        <Messages />
                                        <div className="py-4 px-4 mb-4 last:mb-0">
                                            <div className="relative w-full">
                                                <div className="absolute h-10 mt-0 left-0 top-0 flex items-center">
                                                    <svg
                                                        className="h-4 pl-4 fill-current text-gray-600"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                                                    </svg>
                                                </div>
                                                <input
                                                    type="search"
                                                    onChange={searchStore}
                                                    placeholder="Search"
                                                    className="block w-full bg-[#f7f7fa] border-neutral-200 hover:border-neutral-300  focus:border-neutral-100 focus:ring-neutral-300 focus:shadow-lg pl-10 pr-2 py-2 rounded-md"
                                                />
                                            </div>
                                        </div>
                                        {
                                            !GlobalLoading && stores && stores.map((store, index) => {
                                                if (store?.storeList) {
                                                    return (
                                                        <div className="px-4 mb-4 last:mb-0" key={index}>
                                                            <div className="border border-neutral-200 rounded-t-md p-2 font-semibold text-gray-900">{store.storeType}</div>
                                                            <div className='border border-t-0 rounded-b-md border-neutral-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6 p-3'>
                                                                {(store?.storeList && store.storeList.length > 0) ? store?.storeList.map((subStore, index1) => {
                                                                    return (
                                                                        <div className="relative w-full text-center" key={index1}>
                                                                            <div className="text-gray-700 text-xs border border-solid border-neutral-300 rounded-md relative">
                                                                                <div className="absolute left-1 top-1">
                                                                                    <Checkbox
                                                                                        name="storeIdList"
                                                                                        onChange={(e) => {
                                                                                            setFieldValue(
                                                                                                `storeIdList`,
                                                                                                setStoresValue(values?.storeIdList, e)
                                                                                            );
                                                                                        }}
                                                                                        value={subStore.storeId}
                                                                                        type="checkbox"
                                                                                        className="form-checkbox"
                                                                                        checked={values?.storeIdList ? values?.storeIdList.includes(subStore.storeId) : false}
                                                                                    /> </div>
                                                                                <div className="p-0 h-auto"><img className=" h-32 min-h-full mx-auto rounded-t-md" src={`${process.env.REACT_APP_API_BLOB}${subStore.storeImagePath}`} alt="" /></div>
                                                                                <div className="p-1 border-t bg-slate-100 flex items-center justify-center h-11 border-neutral-200 overflow-hidden text-ellipsis rounded-b-md">{subStore.storeName}</div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }) : <span className='col-span-4'>Product is already clone in appropriate store or store is not available.</span>
                                                                }
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            })
                                        }

                                        <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200">
                                            <button data-modal-toggle="clone-modal" type="button" className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700" onClick={() => { setOpenCloneModal(false); }}>Cancel</button>
                                            <button
                                                disabled={GlobalLoading}
                                                data-modal-toggle="clone-modal" type="submit" className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
                                                {GlobalLoading && (
                                                    <span className="spinner-border spinner-border-sm mr-2"></span>
                                                )}    Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </FormikForm>
                        );
                    }}
                </Formik>

            </div>
        </>
    );
};

export default ProductCloneModal;
