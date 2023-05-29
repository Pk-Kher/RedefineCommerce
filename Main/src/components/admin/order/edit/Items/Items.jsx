/*Component Name: LineItems
Component Functional Details:  LineItems .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React, { useState, useCallback, useMemo } from 'react';
import { CurrencySymbolByCode, OrderSubType, paginationDetails } from 'global/Enum';
import ReactTableServerSide from 'components/common/table/ReactTableServerSide';
import Image from "components/common/formComponent/Image";
import Actions from './Actions';
import { useEffect } from 'react';
import OrderService from 'services/admin/order/OrderService';
import { useDispatch, useSelector } from 'react-redux';
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import { setAddLoading } from 'redux/globalLoader/GlobalLoaderAction';
import { useLocation, useParams } from 'react-router-dom';
import General from 'components/common/displayStatus/General';
import Select from 'components/common/formComponent/Select';
import DropdownService from 'services/common/dropdown/DropdownService';
import EditQuantity from './EditQuantity';
import { serverError } from 'services/common/helper/Helper';
import { ValidationMsgs } from 'global/ValidationMessages';


const Items = ({ orderDetail = { shoppingCartItemDetailsViewModels: [] }, setDisplayMessage }) => {
    const permission = useSelector(store => store?.permission);
    const dispatch = useDispatch();
    const location = useSelector(store => store?.location);
    const [productType, setProductType] = useState([]);
    const [productTypeId, setProductTypeId] = useState(0);
    const [editQtyModal, setEditQtyModal] = useState({ show: false });
    useEffect(() => {
        setDisplayMessage(!editQtyModal?.show)
    }, [editQtyModal?.show]);
    const { id } = useParams();
    const cancelOrderItem = (id) => {
        OrderService.cancelOrderItem({
            orderedShoppingCartItemsId: id,
            isItemCancel: true,
            orderId: orderDetail?.orderNumber,
            ...location,
        }).then((response) => {
            if (response.data.success && response.data.data) {
                dispatch(
                    setAlertMessage({
                        view: true,
                        type: "success",
                        message: ValidationMsgs.order.cancelOrderItem,
                    })
                );
                getData();
            } else {
                dispatch(
                    setAlertMessage({
                        view: true,
                        type: "danger",
                        message: serverError(response),
                    })
                )
            }
        }).catch((errors) => {
            dispatch(
                setAlertMessage({
                    view: true,
                    type: "danger",
                    message: ValidationMsgs.order.cancelOrderItemFail,
                })
            )
        });
    }
    const COLUMNS = [
        {
            id: "image",
            Header: "Line Item",
            accessor: "colorImage",
            column_name: "colorImage",
            disableSortBy: true,
            Cell: ({ value, row }) => {
                return (
                    <>
                        <div className='flex flex-row'>
                            <div className="w-14 h-14 shrink-0 mr-2 sm:mr-3">
                                <img className="w-14 h-14 shrink-0 mr-2 sm:mr-3" src={`${process.env.REACT_APP_API_BLOB}${value}`} alt="" />
                            </div>
                        </div>
                    </>
                );
            },
        },
        {
            id: "line_items",
            Header: "",
            accessor: "line_items",
            column_name: "line_items",
            disableSortBy: true,
            Cell: ({ value, row }) => {
                return (
                    <>
                        <div className='w-80'>
                            <div className="">{row?.original?.productName}</div>
                            <div className="text-[#707070] text-sm font-normal">Color: {row?.original?.attributeOptionValue || '-'} </div>
                            <div className="text-[#707070] text-sm font-normal">SKU: {row?.original?.sku || '-'} </div>
                            <div className='grid grid-cols-8 gap-4'>
                                {row?.original?.shoppingCartLogoPersonViewModels && row?.original?.shoppingCartLogoPersonViewModels.map((value, index) => {
                                    return (
                                        <div className="flex justify-center items-center h-10 border mx-1 w-10 overflow-hidden text-sm" key={index}>
                                            <Image src={value?.logoImagePath} alt="No Image" className={`max-h-full`} />
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="divide-y divide-gray-300">
                                {row?.original?.shoppingCartLineSizeListViewModel && row?.original?.shoppingCartLineSizeListViewModel.map((value, index) => {
                                    return (
                                        <div className="flex flex-wrap gap-2 justify-between py-1" key={row?.original?.attributeOptionId + index}>
                                            <div className="">Size: {value?.sizeName || '-'}</div>
                                            <div className="">Qty: {value?.qty || 0}</div>
                                            <div className="">${(value?.price / value?.qty) || 0}/Qty</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </>
                );
            },
        },
        // {
        //     id: "details",
        //     Header: "",
        //     accessor: "details",
        //     column_name: "details",
        //     disableSortBy: true,
        //     Cell: ({ value, row }) => {
        //         return (
        //             <>
        //                 <div className='flex flex-row'>
        //                     <span title="" className="underline text-indigo-500 cursor-pointer">Details</span>
        //                 </div>
        //             </>
        //         );
        //     },
        // },
        // {
        //     id: "Available",
        //     Header: "Available",
        //     accessor: "availableQty",
        //     column_name: "Available",
        // },

        // {
        //     id: "totalQty",
        //     Header: "QTY",
        //     accessor: "totalQty",
        //     column_name: "totalQty",
        // },

        {
            id: "shippedQty",
            Header: "Shipped",
            accessor: "shippedQty",
            column_name: "shippedQty",
            Cell: ({ value, row }) => {
                return <span className='inline-flex'>{value}/{row?.original?.qty}
                    <span className="material-icons-outlined block cursor-pointer ml-2">local_shipping</span>
                </span>;
            },
        },
        {
            id: "estimate_Cost",
            Header: "Est. Cost",
            accessor: "estimateCost",
            column_name: "estimate_Cost",
            Cell: ({ value, row }) => {
                return (
                    <>
                        {`${CurrencySymbolByCode.USD}${parseFloat(value).toFixed(2) || 0}`}<br />
                        {/* <span className="text-xs text-gray-500">(${row?.original?.estimateCostPerQty} each)</span> */}
                    </>
                );
            },
        },
        {
            id: "price",
            Header: "Price",
            accessor: "price",
            column_name: "price",
            Cell: ({ value }) => {
                return (
                    <span>
                        {`${CurrencySymbolByCode.USD}${parseFloat(value).toFixed(2) || 0}`}
                    </span>
                );
            },
        },
        {
            id: "sub_total",
            Header: "Sub Total",
            accessor: "subTotal",
            column_name: "sub_total",
            Cell: ({ value }) => {
                return (
                    <>
                        <span>{`${CurrencySymbolByCode.USD}${parseFloat(value).toFixed(2) || 0}`}</span>
                    </>
                );
            },
        },
        // {
        //     id: "status",
        //     Header: "Status",
        //     accessor: "isItemCancel",
        //     column_name: "Status",
        //     Cell: ({ value }) => {
        //         return (
        //             value ? <General type={'Cancel'} className="bg-red-100 text-red-600 rounded-md text-center px-2.5 py-1 w-28" /> : <General type={'Active'} className="border-green-300 bg-green-100 text-green-600 rounded-md text-center px-2.5 py-1 w-28" />
        //         );
        //     },
        // },
        {
            id: "action",
            Header: "",
            accessor: "orderShoppingCartItemsId",
            column_name: "action",
            Cell: ({ value, row }) => {
                return (
                    ((permission?.isEdit || permission?.isDelete) && (!row?.original?.isItemCancel && !row?.original?.isNavImport)) ? <Actions row={row} cancelOrderItem={cancelOrderItem} id={value} editQtyModal={editQtyModal} setEditQtyModal={setEditQtyModal} /> : ''
                );
            },
            disableSortBy: true,

        },
    ];
    const [Data, setData] = useState([]);
    const [sortingOptions, setSortingOptions] = useState([]);
    const [paginationData, setPaginationData] = useState({
        ...paginationDetails,
    });
    const setPaginationDataFunc = (key, value) => {
        setPaginationData((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };
    const setSortingOptionHandler = (column, direction) => {
        setSortingOptions([
            {
                field: column,
                direction: direction,
                priority: 0,
            },
        ]);
    };
    const getData = useCallback(
        (pageIndex) => {
            dispatch(setAddLoading(true))
            OrderService.OrderedShoppingCartItems({
                pageSearchArgs: {
                    pageSize: paginationData.pageSize,
                    pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
                    sortingOptions,
                    filteringOptions: [{
                        field: 'isItemCancel',
                        operator: 1,
                        value: false
                    }]
                },
                orderId: id,
                productTypeId: (productTypeId !== 'none' ? productTypeId : 0)
            }).then((response) => {
                if (response?.data?.data?.items) {
                    setPaginationData((prevState) => ({
                        ...prevState,
                        pageIndex: response.data.data.pageIndex,
                        pageSize: response.data.data.pageSize,
                        totalCount: response.data.data.totalCount,
                        totalPages: response.data.data.totalPages,
                        hasPreviousPage: response.data.data.hasPreviousPage,
                        hasNextPage: response.data.data.hasNextPage,
                    }));
                    setData(response.data.data?.items);
                }
                dispatch(setAddLoading(false))
            }).catch(() => {
                dispatch(setAddLoading(false))
            })
        },
        [orderDetail, productTypeId]
    );
    useEffect(() => {
        DropdownService.getDropdownValues("producttype", false, 0).then((response) => {
            if (response?.data?.success && response?.data?.data) {
                setProductType(response.data.data);
            }
        }).catch(() => { })
    }, []);
    useEffect(() => {
        if (productTypeId) {
            getData();
        }
    }, [productTypeId]);
    return (
        <div className="col-span-full w-full rounded-md overflow-auto">
            <div className=''>
                {orderDetail?.orderNumber && <ReactTableServerSide
                    COLUMNS={COLUMNS}
                    DATA={Data}
                    fetchData={getData}
                    sortingOptions={sortingOptions}
                    setSortingOptions={setSortingOptionHandler}
                    hiddenColumns={['rowSelection']}
                    tablePadding={'px-4 pb-4'}
                    {...paginationData}
                    setTablePageSize={(value) =>
                        setPaginationDataFunc("pageSize", value)
                    }
                />}
            </div>
            <div className="p-6 fix sticky bottom-0 bg-white overflow-visible">
                <div className="flex items-center flex-wrap gap-2">
                    <div className="">
                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold " htmlFor="grid-first-name">Order Sub Type</label>
                    </div> <div className="">
                        <Select
                            menuPlacement="top"
                            isClearable={true}
                            options={productType}
                            name="orderSubType"
                            placeholder="Select Product Sub Type"
                            defaultValue={productTypeId}
                            onChange={(e) => {
                                if (e) {
                                    setProductTypeId(e.value);
                                } else {
                                    setProductTypeId("none");
                                }
                            }}
                            classNames={'w-64'}
                        />
                    </div>
                </div>
            </div>
            {editQtyModal?.show && <EditQuantity editQtyModal={editQtyModal} setEditQtyModal={setEditQtyModal} getData={getData} orderDetail={orderDetail} />}
        </div>
    );
}

export default Items;
