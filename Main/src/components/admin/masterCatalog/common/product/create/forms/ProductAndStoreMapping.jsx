/*Component Name: ProductAndStoreMapping
Component Functional Details: User can create or update ProductAndStoreMapping master details from here.
Created By: chandan
Created Date: <Creation Date>
Modified By: chandan
Modified Date: <Modified Date> */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from "react-router-dom";
import Checkbox from "components/common/formComponent/Checkbox";
import { Formik, Form as FormikForm } from "formik";
import MasterProductService from 'services/admin/masterCatalog/masterCatalog/products/ProductService';
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { useDispatch, useSelector } from "react-redux";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import axios from 'axios';
import { serverError } from "services/common/helper/Helper";
import BasicModal from 'components/common/modals/Basic';
import UnsavedFormHandler from "./UnsavedFormHandler";
import ErrorHandler from "./ErrorHandler";

const ProductAndStoreMapping = ({ index, activeTab, setFormSubmit, setIsError, checkProductStatus, setsaveUnSavedFields }) => {
    const dispatch = useDispatch();
    const location = useSelector((store) => store?.location);
    const formRef = useRef();
    const { id } = useParams();
    const [openConfirmDeteach, setopenConfirmDeteach] = useState(false);
    const [mainStores, setMainStores] = useState([]);
    const [alreadyDeteachedStore, setalreadyDeteachedStore] = useState([]);

    const [stores, setStores] = useState([]);

    useEffect(() => {
        if (setFormSubmit && activeTab == index) {
            setFormSubmit(formRef.current);
        }
    }, [formRef, setFormSubmit, activeTab]);


    const getVendorData = useCallback((unmounted) => {
        if (id) {
            dispatch(setAddLoading(true))

            MasterProductService.getColorSplitMasterProduct(id)
                .then((stores) => {
                    if (stores.data.success && !unmounted) {
                        setStores(stores.data.data);
                        setMainStores(stores.data.data);

                        let tempalreadyDeteachedStore = []

                        stores.data.data.map((SingleStore) => {
                            SingleStore.storeList.map((storeObj) => {
                                if (storeObj.isSpit) {
                                    tempalreadyDeteachedStore.push(storeObj.storeid)
                                }
                            })
                        })
                        setalreadyDeteachedStore(tempalreadyDeteachedStore)

                    }
                    dispatch(setAddLoading(false))

                })
                .catch((error) => {
                    dispatch(setAddLoading(false))
                });
        }
    }, []);

    useEffect(() => {
        let unmounted = false;
        let source = axios.CancelToken.source();

        getVendorData(unmounted)

        return () => {
            unmounted = true;
            source.cancel("Cancelling in cleanup");
        };
    }, [id]);

    const handleSubmit = () => {
        setopenConfirmDeteach(true);
    }

    const handleDeteach = (values) => {
        dispatch(setAddLoading(true))

        MasterProductService.ColorSplitMasterProduct({
            "colorSplitMasterProductModel": {
                "productId": id,
                "isSplit": true,
                "storeId": values.storeIdList,
                "recStatus": "A",
                ...location
            }
        }).then((response) => {
            if (response.data.success && response.data.data) {
                dispatch(
                    setAlertMessage({
                        type: "success",
                        message: "Product Added Successfully",
                    })
                );
            } else {
                dispatch(setAlertMessage({ type: "danger", message: serverError(response) }))
            }
            getVendorData(false)

        }).catch((errors) => {
            dispatch(setAlertMessage({ type: "danger", message: serverError(errors) }))
            getVendorData(false)
        });
        setopenConfirmDeteach(false)
    }

    const searchStore = (e) => {
        var search = e.target.value.trim();
        if (search !== "") {
            setStores(() => {
                return mainStores
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

    const InitialData = {
        storeIdList: alreadyDeteachedStore
    }

    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={InitialData}
                // onSubmit={handleSubmit}
                onSubmit={handleDeteach}
                innerRef={formRef}
                validateOnMount={true}
            >
                {({ setFieldValue, resetForm, values, errors }) => {
                    return (
                        <FormikForm>
                            {
                                (setsaveUnSavedFields && setIsError) && <>
                                    <ErrorHandler setIsError={setIsError} errors={errors} checkProductStatus={checkProductStatus} />
                                    <UnsavedFormHandler values={values} setsaveUnSavedFields={setsaveUnSavedFields} InitialData={InitialData} />
                                </>
                            }


                            <div className="relative px-4 w-full max-h-screen">
                                <div className="relative bg-white rounded-md shadow overflow-auto w-full pb-4 mt-4 max-h-[calc(100vh-2rem)]">
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
                                        stores && stores.map((store, index) => {
                                            if (store?.storeList && store.storeList.length > 0) {
                                                return (
                                                    <div className="px-4 mb-4 last:mb-0" key={index}>
                                                        <div className="border border-neutral-200 rounded-t-md p-2 font-semibold text-gray-900">{store.storeType}</div>
                                                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6 py-2'>
                                                            {store?.storeList.map((subStore, index1) => {
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
                                                                                    value={subStore.storeid}
                                                                                    type="checkbox"
                                                                                    className="form-checkbox"
                                                                                    checked={values?.storeIdList ? values?.storeIdList.includes(subStore.storeid) : false}
                                                                                /> </div>
                                                                            <div className="h-28 p-0 w-auto flex items-center justify-center overflow-hidden">{/*  */}
                                                                                <img className="" src={`${process.env.REACT_APP_API_BLOB}${subStore.storeImagePath}`} alt="" />
                                                                            </div>
                                                                            {/* <div className="p-0 h-auto"><img className=" h-32 min-h-full mx-auto rounded-t-md" src={`${process.env.REACT_APP_API_BLOB}${subStore.storeImagePath}`} alt="" /></div> */}
                                                                            <div className="p-1 border-t bg-slate-100 flex items-center justify-center h-11 border-neutral-200 overflow-hidden text-ellipsis rounded-b-md">{subStore.storeName}</div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })
                                    }
                                </div>
                            </div>

                            <BasicModal
                                handleConfirmation={handleDeteach}
                                openModal={openConfirmDeteach}
                                data={values}
                                setOpenModal={setopenConfirmDeteach}
                                message={'Do you really want to update the store mapping?'}
                                title={`Confirm To Deteach`}
                                ButtonName={"Save"}
                            />
                        </FormikForm>
                    );
                }}
            </Formik>
        </>
    );
};

export default ProductAndStoreMapping;
