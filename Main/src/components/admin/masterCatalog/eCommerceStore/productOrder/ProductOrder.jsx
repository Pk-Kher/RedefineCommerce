/*Component Name: ProductOrder
Component Functional Details: User can create or update ProductOrder master details from here.
Created By: Happy
Created Date: 17/11/02022
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Formik, Form as FormikForm } from "formik";
import Dropdown from "components/common/formComponent/Dropdown";
import DropdownService from "services/common/dropdown/DropdownService";
import CategoryMasterService from "services/admin/masterCatalog/store/categoryMaster/CategoryMasterService";
import { useCallback } from "react";
import ProductOrderService from "services/admin/masterCatalog/store/productOrder/ProductOrderService";
import { ValidationMsgs } from "global/ValidationMessages";
import { serverError } from "services/common/helper/Helper";
import { useDispatch, useSelector } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { defaultImage, RecStatusValuebyName } from "global/Enum";
import Image from "components/common/formComponent/Image";

import { ListManager } from "react-beautiful-dnd-grid";
import Input from "components/common/formComponent/Input";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const ProductOrder = () => {
    const [Data, setData] = useState([]);
    const [CategoryList, setCategoryList] = useState([]);
    const [BrandList, setBrandList] = useState([]);
    const [SelectedBrand, setSelectedBrand] = useState(0);
    const [SelectedCategory, setSelectedCategory] = useState(0);
    const { storeId } = useParams();
    const location = useSelector((store) => store?.location);
    const dispatch = useDispatch();
    const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

    const getAllCategory = () => {
        dispatch(setAddLoading(true))

        CategoryMasterService.getCategoryDropdownOptions(-1, storeId).then(
            (response) => {
                setCategoryList(() => {
                    return response.data.data;
                });
                dispatch(setAddLoading(false))

            }
        ).catch(() => {
            dispatch(setAddLoading(false))
        })
    };

    useEffect(() => {
        DropdownService.getDropdownValues("storebrand", false, storeId).then(
            (response) => {
                setBrandList(() => {
                    return response.data.data;
                });
            }
        );
        getCategoryDropdownData();
    }, []);

    const getCategoryDropdownData = useCallback((e) => {
        dispatch(setAddLoading(true))

        if (e && e?.value !== undefined) {
            setSelectedBrand(e.value);
            CategoryMasterService.getCategoryByBrandDropdownOptions(
                e.value,
                storeId
            ).then((response) => {
                if (response.data.data.length > 0) {
                    setCategoryList(() => {
                        return response.data.data;
                    });
                }
                else {
                    setCategoryList([])
                    setSelectedCategory(0);
                }

                dispatch(setAddLoading(false))
            }).catch(() => {
                dispatch(setAddLoading(false))
            })
        } else {
            getAllCategory();
        }
    }, []);

    const getProductOrderList = useCallback(() => {
        dispatch(setAddLoading(true))

        ProductOrderService.getProductOrderList({
            productDisplayOrderModel: {
                storeId: storeId,
                categoryId: SelectedCategory || 0,
                brandId: SelectedBrand || 0,
            },
        })
            .then((response) => {
                if (response.data.success) {
                    setData(response?.data?.data);
                    dispatch(
                        setAlertMessage({
                            view: true,
                            type: "success",
                            message: ValidationMsgs.store.productOrder.orderChanged,
                        })
                    );
                    dispatch(setAddLoading(false))

                } else {
                    setData([]);
                    dispatch(setAddLoading(false))

                }
                dispatch(setAddLoading(false))

            })
            .catch((error) => {
                dispatch(setAddLoading(false))

            });
    }, [SelectedBrand, SelectedCategory]);

    useEffect(() => {
        if (SelectedBrand > 0 || SelectedCategory > 0) {
            getProductOrderList();
        }
    }, [SelectedBrand, SelectedCategory]);

    const reorder = (list, startIndex, endIndex) => {
        let temp = [];
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        result.map((item, i) => {
            temp = [...temp, { ...item, displayOrder: i + 1 }];
        });

        return temp;
    };
    const ListElement = ({ item }) => {
        return (
            item && (
                <div className="w-full p-3">
                    <div className="border border-gray-300 p-3 mt-3 text-center h-full">
                        <div >
                            {item.image ? (
                                <img
                                    src={`${process.env.REACT_APP_API_BLOB}${item.image}`}
                                    title=""
                                    alt=""
                                    style={{
                                        height: "450px",
                                        width: "450px",
                                    }}
                                />
                            ) : (
                                <Image
                                    src={defaultImage}
                                    className="min-h-[450px] min-w-[450px]"
                                />
                            )}
                        </div>
                        <div className="mt-5">{item.productName}</div>
                        <div className="mt-2 text-sm">
                            Price : <span >${item.salePrice}</span>
                        </div>
                        <div className="flex items-center justify-center mt-2 text-sm">
                            Display Order :{" "}
                            <Input
                                className="w-20"
                                name={`displayOrder${item.productId}`}
                                defaultValue={item?.displayOrder}
                                onBlur={(e) => {
                                    reorderList(item?.displayOrder - 1, e.target.value - 1);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )
        );
    };

    function reorderList(sourceIndex, destinationIndex) {
        dispatch(setAddLoading(true))

        if (destinationIndex === undefined || destinationIndex === sourceIndex) {
            return;
        }

        const items = reorder(Data?.subRow, sourceIndex, destinationIndex);
        ProductOrderService.getProductOrderUpdate({
            productDisplayModel: {
                storeId: storeId,
                categoryId: SelectedCategory || 0,
                brandId: SelectedBrand || 0,
                ...location,
                recStatus: RecStatusValuebyName.Active,
                subRow: items,
            },
        })
            .then((response) => {
                if (response.data.success) {
                    dispatch(
                        setAlertMessage({
                            view: true,
                            type: "success",
                            message: ValidationMsgs.store.productOrder.orderChanged,
                        })
                    );

                } else {
                    dispatch(
                        setAlertMessage({ type: "danger", message: serverError(response) })
                    );
                }
                getProductOrderList();
                dispatch(setAddLoading(false))

            })
            .catch((error) => {
                dispatch(setAddLoading(false))
            });

        setData((prev) => {
            return {
                ...prev,
                subRow: items,
            };
        });
    }

    return (
        <>
            <title>Product Order</title>
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
                <div className="sm:flex sm:justify-between sm:items-center mb-8">
                    <div className="col-span-full w-full flex justify-between items-center">
                        <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
                            Product Order
                        </h1>
                    </div>
                </div>
                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        brandId: -1,
                        storeID: storeId,
                        categoryId: -1,
                    }}
                >
                    {({ errors, touched, setFieldValue, values }) => {
                        return (
                            <FormikForm>
                                <div className="bg-white shadow-xxl rounded-md mb-8">
                                    <div className="p-6 flex-wrap">
                                        <div className="flex flex-wrap items-center gap-2 justify-between">
                                            <div >
                                                Total Products -{" "}
                                                <span >{Data?.totalProducts || 0}</span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 justify-between">
                                                <div className="flex gap-2 items-center">
                                                    <div >Select Brand :</div>
                                                    <Dropdown
                                                        name={`brandId`}
                                                        options={BrandList}
                                                        defaultValue={values.brandId}
                                                        className="focus:ring-neutral-300 focus:shadow-lg py-1 w-1/2 "
                                                        onChange={(e) => {
                                                            if (e) {
                                                                setFieldValue(`brandId`, e.value);
                                                                setSelectedBrand(e.value);
                                                            } else {
                                                                setFieldValue(`brandId`, 0);
                                                                setSelectedBrand(0);
                                                            }
                                                            getCategoryDropdownData(e);
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex gap-2 items-center">
                                                    <div >Select Category :</div>
                                                    <Dropdown
                                                        name={`categoryId`}
                                                        options={CategoryList}
                                                        defaultValue={values.categoryId}
                                                        className="focus:ring-neutral-300 focus:shadow-lg py-1"
                                                        onChange={(data) => {
                                                            if (data) {
                                                                setFieldValue(`categoryId`, data.value);
                                                                setSelectedCategory(data.value);
                                                            } else {
                                                                setFieldValue(`categoryId`, 0);
                                                                setSelectedCategory(0);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {
                                    ((SelectedBrand > 0 || SelectedCategory > 0) && Data?.subRow?.length > 0) ?
                                        <div className="bg-white shadow-xxl rounded-md mb-8">
                                            <div className="p-6">
                                                {Data?.subRow && (
                                                    <ListManager
                                                        items={Data?.subRow}
                                                        direction="horizontal"
                                                        maxItems={4}
                                                        render={(item) => {
                                                            return item ? <ListElement item={item} /> : "";
                                                        }}
                                                        onDragEnd={reorderList}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        : ((SelectedBrand == 0 && SelectedCategory == 0)) ?
                                            <p className="flex justify-center items-center p-5 rounded-t border-b sticky top-0 left-0 text-red-600 bg-white">First, You have to select either brand or category.</p>
                                            :
                                            <p className="flex justify-center items-center p-5 rounded-t border-b sticky top-0 left-0 text-red-600 bg-white">No data found.</p>
                                }

                            </FormikForm>
                        );
                    }}
                </Formik>
            </div>
        </>
    );
};

export default ProductOrder;
