/*Component Name: Emails
Component Functional Details:  Emails .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: chandan
Modified Date: <Modified Date> */

import React, { useState, useCallback } from 'react';
import { CurrencySymbolByCode, defaultImage, paginationDetails } from 'global/Enum';
import ReactTableServerSide from 'components/common/table/ReactTableServerSide';
import { useMemo } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams, Link } from "react-router-dom";
import { DateTimeFormat } from 'services/common/helper/Helper';
import Status from 'components/common/displayStatus/Status';
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import Image from 'components/common/formComponent/Image';
import OrderService from 'services/admin/order/OrderService';
import VarientProductModal from 'components/admin/masterCatalog/common/product/create/forms/VarientProductModal';
import GeneralStatus from 'components/common/displayStatus/General';

const Orders = ({ activeTab, filterData = [] }) => {

    const { id } = useParams();
    const dispatch = useDispatch();

    const COLUMNS = [
        {
            id: "expander",
            accessor: "a",
            Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
                ""
            ),
            Cell: ({ row }) => {
                return <span title="Show Sub Product" className="material-icons-outlined select-none leading-none ml-2 w-6 h-6 cursor-pointer transition-all variant-arrow" onClick={() => {
                    getVarientDataFunc(row?.original)
                }}>
                    add
                </span>
            },
            disableShowHide: true,
            disableSortBy: true,
        },
        {
            id: "orderStatus",
            Header: "Order Status",
            accessor: "orderExportStatus",
            column_name: "orderStatus",
            isVisible: false,
            disableShowHide: true,
            Cell: ({ value, row }) => {
                if (value === 1) {
                    return (
                        <div className="text-green-500">Exported</div>
                    );
                } else {
                    return (
                        <div className="">Pending</div>
                    );
                }
            },
        },
        {
            id: "orderNumber",
            Header: "Order",
            accessor: "orderNumber",
            column_name: "id",
            Cell: ({ value, row }) => {
                return row ? (
                    <>
                        <div
                            className="w-full flex justify-start items-center group"
                            style={{ width: "200px" }}
                        >
                            <div >
                                <NavLink
                                    to={
                                        `/admin/Order/orders/edit/${row?.original?.orderNumber}`
                                    }
                                >
                                    <div className="text-indigo-500 text-sm font-normal">
                                        #{value ? value : ""}
                                    </div>
                                </NavLink>
                                {row?.original?.refenceOrderID ? <div className="text-[#707070] text-sm font-normal">Ref.#{row?.original?.refenceOrderID} </div> : ''}
                            </div>
                        </div>
                    </>
                ) : (
                    ""
                );
            },
        },
        {
            id: "orderDate",
            Header: "date",
            accessor: "orderDate",
            column_name: "orderDate",
            Cell: ({ value, row }) => {
                return value ? (
                    <>
                        <div >{DateTimeFormat(value).date} </div>
                        <div className="text-[#707070] text-xs font-normal">
                            {DateTimeFormat(value).time}
                        </div>
                    </>
                ) :
                    ""
            },
        },
        {
            id: "customerName_Zipcode",
            Header: "Customer Name / Zipcode",
            accessor: "customerName",
            column_name: "customerName_Zipcode",
            Cell: ({ value, row }) => {
                if (row.original) {
                    return value ? (
                        <>
                            <div className="font-bold">
                                <div className="font-semibold">{value}</div>
                            </div>
                            <div className="mb-2 last:mb-0">
                                {row?.original?.customerShippingAddress1 ? row?.original?.customerShippingAddress1 + ', ' : ''}
                                {row?.original?.customerShippingAddress2 ? <>{row?.original?.customerShippingAddress2 + ", "} < br /></> : ''}
                                {row?.original?.customerShippingCity ? row?.original?.customerShippingCity + ", " : ''}
                                {row?.original?.customerShippingState ? <>{row?.original?.customerShippingState + ", "} < br /> </> : ''}
                                {row?.original?.customerShippingCountry ? row?.original?.customerShippingCountry + ", " : ''}
                                {row?.original?.customerShippingZipcode ? row?.original?.customerShippingZipcode : ''}
                            </div>
                            <div className="text-indigo-500 cursor-pointer" >
                                {row?.original ? row?.original?.shippingTackingNumber : ''}
                            </div>
                        </>
                    ) :
                        <>{row.original.productDetails}</>
                } else {
                    return (
                        <>
                            <div className="">{row?.original?.customerName}</div>
                            <div className="text-[#707070] text-sm font-normal">Ref. Order$: {row?.original?.refenceOrderID}</div>
                            <div className="text-[#707070] text-sm font-normal">Color: {row?.original?.attributeOptionValue} </div>
                            <div className="text-[#707070] text-sm font-normal">SKU: {row?.original?.sku} </div>
                            <div className="text-[#707070] text-sm font-normal">Quantity: 2 </div>
                        </>
                    );
                }

            },
        },
        {
            id: "total",
            Header: "total",
            accessor: "orderTotal",
            column_name: "total",
            Cell: ({ value }) => {
                if (!value) {
                    return "";
                } else {
                    return CurrencySymbolByCode.USD + value;
                }
            },
        },
        {
            id: "paymentType",
            Header: "Payment Type",
            accessor: "paymentType",
            column_name: "paymentType",
            Cell: ({ value }) => {
                if (!value) {
                    return "";
                } else {
                    return <span className='capitalize'>{value}</span>;
                }
            },
        },
        {
            id: "paymentStatus",
            Header: "Payment Status",
            accessor: "paymentStatus",
            column_name: "paymentStatus",
            Cell: ({ value, row }) => {
                if (value && row?.original) {
                    return value === 'paid' ? <Status type={value} className="border-green-300 bg-green-100 text-green-600" /> : <Status type={value} className="border-yellow-300 bg-yellow-100 text-yellow-600" />;
                } else {
                    return "";
                }
            },
        },
        {
            id: "fulfillment Status",
            Header: "Fulfillment Status",
            accessor: "fulfillmentStatus",
            column_name: "fulfillment Status",
            Cell: ({ value, row }) => {
                if (!value) {
                    return "";
                } else {
                    return (
                        <>
                            <div className='text-center'>
                                <Status type={value} />
                                <div className='text-indigo-500 cursor-pointer'>{row?.original?.shippingTackingNumber}</div>
                            </div>
                        </>
                    )
                }
            },
        },
        {
            id: "totalItems",
            Header: "Item",
            accessor: "totalItems",
            column_name: "totalItems",
            Cell: ({ value }) => {
                if (!value) {
                    return "";
                } else {
                    return value;
                }
            },
        },
        {
            id: "delivery method",
            Header: "delivery method",
            accessor: "deliveryMethod",
            column_name: "deliveryMethod",
            Cell: ({ value, row }) => {
                return value ? <GeneralStatus type={value} /> : ''
            },
        },

    ];

    const columnForVarientProducts = [
        {
            id: "product Image",
            Header: "product Image",
            accessor: "colorImage",
            column_name: "product Image",
            isVisible: false,
            disableShowHide: true,
            disableSortBy: true,
            Cell: ({ value, row }) => {
                return value ? (
                    <>
                        <div className={`flex -space-x-9 items-center`} style={{ width: "160px" }}>
                            {/* <Link to={`/admin/MasterCatalog/MasterCatalog/edit/${row.original.id}`} > */}
                            <img className="w-14 h-14 box-content bg-sky-400/10" src={`${process.env.REACT_APP_API_BLOB}${value}`} alt="No Image" />
                            {/* </Link> */}
                        </div>
                    </>
                ) :
                    <div className={`flex -space-x-9 items-center`} style={{ width: "160px" }}>
                        <Image src={defaultImage} className="h-16 w-20" />
                    </div>
            },
        },
        {
            id: "name",
            Header: "Product Name",
            accessor: "productName",
            column_name: "name",
            disableShowHide: true,
            disableSortBy: true,
            Cell: ({ value, row }) => {
                if (row.original) {
                    return value ? (
                        <>
                            <div className="font-semibold">{value}</div>
                            <div className="mb-2 last:mb-0">
                                <div className="text-[#707070] text-sm font-normal">Ref. Order$: {/* {row?.original?.refenceOrderID} */}</div>
                                <div className="text-[#707070] text-sm font-normal">Color: {/* {row?.original?.attributeOptionValue}  */}</div>
                                <div className="text-[#707070] text-sm font-normal">SKU: {row?.original?.sku} </div>
                                <div className="text-[#707070] text-sm font-normal">Quantity: {row?.original?.qty} </div>
                            </div>
                        </>
                    ) :
                        <>{row?.original?.productName}</>
                }
            },
        },
        {
            id: "price",
            Header: "Price",
            accessor: "price",
            column_name: "price",
            disableShowHide: true,
            disableSortBy: true,
            Cell: ({ value }) => {
                return value ? `$${value}` : "";
            },
        },
        {
            id: "totalAmount",
            Header: "Total Amount",
            accessor: "subTotal",
            column_name: "totalAmount",
            disableShowHide: true,
            disableSortBy: true,
            Cell: ({ value }) => {
                return value ? `$${value}` : "";
            },
        },
        {
            id: "items",
            Header: "Items",
            accessor: "qty",
            column_name: "items",
            disableShowHide: true,
            disableSortBy: true,
            Cell: ({ value }) => {
                return value ? value : "";
            },
        },
        {
            id: "fulfillment Status",
            Header: "Fulfillment Status",
            accessor: "fulfillmentStatus",
            column_name: "fulfillment Status",
            disableShowHide: true,
            disableSortBy: true,
            Cell: ({ value, row }) => {
                if (!value) {
                    return "";
                } else {
                    return (
                        <>
                            <div className='text-center'>
                                <div className='capitalize'>{value}</div>
                                <span className='text-indigo-500 cursor-pointer'>{row?.original?.shippingTackingNumber}</span>
                            </div>
                        </>
                    )
                }
            },
        },
    ];

    const [loading/* , setLoading */] = useState(false);
    const [Data, setData] = useState([]);
    const [filteringOptions, setColumnFilteringOptions] = useState([]);
    const [dataForVarientProducts, setdataForVarientProducts] = useState([]);
    const [openVarientModal, setOpenVarientModal] = useState({
        name: "",
        ourSku: "",
        toShow: false
    });
    const [sortingOptions, setSortingOptions] = useState([
        {
            field: "name",
            direction: 0,
            priority: 0,
        },
    ]);
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
    const getAllData = useCallback((pageIndex = 1, storeId = [0]) => {
        dispatch(setAddLoading(true));
        OrderService.getOrders(
            {
                pageSearchArgs: {
                    pageSize: paginationData.pageSize,
                    pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
                    pagingStrategy: 0,
                    sortingOptions,
                    filteringOptions: [...filterData, ...filteringOptions],
                },
                storeID: storeId,
                customerId: id,
                companyId: 0
            }).then((response) => {
                setData(response.data.data.items);
                setPaginationData((prevState) => ({
                    ...prevState,
                    pageIndex: response.data.data.pageIndex,
                    pageSize: response.data.data.pageSize,
                    totalCount: response.data.data.totalCount,
                    totalPages: response.data.data.totalPages,
                    hasPreviousPage: response.data.data.hasPreviousPage,
                    hasNextPage: response.data.data.hasNextPage,
                }));
                dispatch(setAddLoading(false));
            }).catch(() => {
                dispatch(setAddLoading(false));
            })
    },
        [filteringOptions, paginationData.pageSize, sortingOptions, activeTab, filterData]);

    const getVarientDataFunc = (currentRowData) => {
        dispatch(setAddLoading(true))
        setOpenVarientModal((prevData) => ({
            ...prevData,
            name: currentRowData.name,
            ourSku: currentRowData.ourSKU,
            toShow: true
        }))

        // OrderService.OrderedShoppingCartItemDetails({
        OrderService.OrderedShoppingCartItems({
            pageSearchArgs: {
                pageIndex: paginationData.pageSize,
                pageIndex: paginationData.pageIndex,
                pagingStrategy: 0,
                sortingOptions,
                filteringOptions: [...filterData, ...filteringOptions],
            },
            orderId: currentRowData.id
        }).then((response) => {
            // const VarientData = response?.data?.data;
            const VarientData = response?.data?.data.items;
            setdataForVarientProducts(VarientData || [])
            dispatch(setAddLoading(false))
        }).catch(() => {
            dispatch(setAddLoading(false))
        })
    }
    return (
        <div className='grow'>
            <div className='py-6 space-y-6'>
                <h2 className="text-2xl text-gray-800 font-bold mb-5">Orders</h2>
                <ReactTableServerSide
                    COLUMNS={COLUMNS}
                    DATA={Data}
                    {...paginationData}
                    setTablePageSize={(value) =>
                        setPaginationDataFunc("pageSize", value)
                    }
                    fetchData={getAllData}
                    sortingOptions={sortingOptions}
                    setSortingOptions={setSortingOptionHandler}
                    loading={loading}
                    hiddenColumns={['rowSelection']}
                    tablePadding={'px-4 pb-4'}
                    expandedRows={useMemo(() => true, [])}

                />
            </div>

            <VarientProductModal
                title={`Ordered Products`}
                openModal={openVarientModal}
                setOpenModal={setOpenVarientModal}
                COLUMNS={columnForVarientProducts}
                DATA={dataForVarientProducts}
                setdataForVarientProducts={setdataForVarientProducts}
            />

        </div>
    );
};

export default Orders;
