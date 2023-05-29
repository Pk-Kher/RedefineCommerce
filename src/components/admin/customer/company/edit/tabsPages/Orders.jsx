/*Component Name: Orders
Component Functional Details: User can create or update Orders master details from here.
Created By: chandan
Created Date: <Creation Date>
Modified By: chandan,Divyesh
Modified Date: <Modified Date> */

import React, { useCallback, useMemo, useState } from 'react';
import ReactTable from "../../../../../common/table/ReactTableServerSide";
import { NavLink, useParams } from "react-router-dom";
import Status from "../../../../../common/displayStatus/Status";
import Messages from "components/common/alerts/messages/Index";
import { paginationDetails, defaultImage, CurrencySymbolByCode } from "global/Enum";
import { DateTimeFormat } from "services/common/helper/Helper";
import { useDispatch, useSelector } from "react-redux";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import Image from "components/common/formComponent/Image";
import { format } from 'date-fns';
import OrderService from 'services/admin/order/OrderService';
import VarientProductModal from 'components/admin/masterCatalog/common/product/create/forms/VarientProductModal';


const Orders = ({ activeTab, filterData = [], PageName }) => {
    const permission = useSelector(store => store.permission);
    const dispatch = useDispatch();
    const location = useSelector((store) => store?.location);
    const [CustomerOrderModal, setCustomerOrderModal] = useState(false);
    const [filteringOptions, setColumnFilteringOptions] = useState([]);
    const [paginationData, setPaginationData] = useState({ ...paginationDetails });
    const [selectedRows, setSelectedRows] = useState([]);
    const { id } = useParams();
    const [Data, setData] = useState([]);
    const [dataForVarientProducts, setdataForVarientProducts] = useState([]);
    const [openVarientModal, setOpenVarientModal] = useState({
        name: "",
        ourSku: "",
        toShow: false
    });
    const handleSort = (sortValue) => { };

    const setPaginationDataFunc = (key, value) => {
        setPaginationData((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const [sortingOptions, setSortingOptions] = useState([
        {
            field: "name",
            direction: 0,
            priority: 0,
        },
    ]);

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
                customerId: 0,
                companyId: id
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
                        <>
                            <div className="text-green-500">Exported</div>
                            <div className="text-sm mt-1">
                                <span className="text-indigo-500 cursor-pointer">History</span>
                            </div>
                        </>
                    );
                } else {
                    return (
                        <div className="">Pending</div>
                    );
                }
            },
        },
        {
            id: "order",
            Header: "order",
            accessor: "orderNumber",
            column_name: "order",
            disableShowHide: true,
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
                                    className="font-medium text-indigo-500"
                                >
                                    <div className="text-sm font-normal">
                                        {value ? "#" + value : ""}
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
            id: "date",
            Header: "date",
            accessor: "orderDate",
            column_name: "date",
            Cell: ({ value, row }) => {
                if (row?.colorImage) {
                    return (
                        <Image src={row?.colorImage} className="w-40" containerheight={"h-24"} alt="IMG" />
                    );
                }
                return value ? (
                    <>
                        <div >{DateTimeFormat(value).date} </div>
                        <div className="text-[#707070] text-xs font-normal">
                            {format(new Date(value), "hh:mm a")}
                        </div>
                    </>
                ) :
                    <div className='w-14 h-14 shrink-0 mr-2 sm:mr-3'>
                        <img className="max-w-20 max-h-20" src={process.env.REACT_APP_API_BLOB + row.original.colorImage} alt="" />
                    </div>
            },
        },
        {
            id: "customerName_Zipcode",
            Header: "Customer Name / Zipcode",
            accessor: "customerName",
            column_name: "customerName_Zipcode",
            Cell: ({ value, row }) => {
                if (row?.original) {
                    return value ? (
                        <>
                            <div className="text-indigo-500 cursor-pointer" onClick={() => setCustomerOrderModal(true)}>
                                {/* {value ? value : "-"} */}
                                <NavLink
                                    to={
                                        "/admin/Customer/customer/edit/" +
                                        row.original.customerId
                                    }
                                >
                                    <div className="font-semibold">{value}</div>
                                </NavLink>
                            </div>
                            <div className="mb-2 last:mb-0">
                                {row?.original?.customerShippingAddress1 ? row?.original?.customerShippingAddress1 + ', ' : ''}
                                {row?.original?.customerShippingAddress2 ? <>{row?.original?.customerShippingAddress2 + ", "} < br /></> : ''}
                                {row?.original?.customerShippingCity ? row?.original?.customerShippingCity + ", " : ''}
                                {row?.original?.customerShippingState ? <>{row?.original?.customerShippingState + ", "} < br /> </> : ''}
                                {row?.original?.customerShippingCountry ? row?.original?.customerShippingCountry + ", " : ''}
                                {row?.original?.customerShippingZipcode ? row?.original?.customerShippingZipcode : ''}
                            </div>
                        </>
                    ) :
                        <>{row.original.productDetails}</>
                } else {
                    return (
                        <>
                            <div className="">{row?.original?.productName}</div>
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
            id: "customerTotalOrder",
            Header: "",
            accessor: "customerTotalOrder",
            column_name: "customerTotalOrder",
            disableSortBy: true,
            Cell: ({ value }) => {
                if (!value) {
                    return "";
                } else {
                    return <div class=""><a href="javascript:void(0);" class="text-indigo-500" data-modal-toggle="customerModal">Total {value} Orders</a></div>;
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
                    return (
                        <span className='capitalize'>{value}</span>
                    );
                }
            },
        },
        {
            id: "paymentStatus",
            Header: "Payment Status",
            accessor: "paymentStatus",
            column_name: "paymentStatus",
            Cell: ({ value, row }) => {
                if (value) {
                    return value === 'paid' ? <Status type={value} className="border-green-300 bg-green-100 text-green-600" /> : <Status type={value} className="border-yellow-300 bg-yellow-100 text-yellow-600" />;
                } else {
                    return "-";
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
                        <div className='text-center'>
                            <Status type={value} />
                            <span className="text-indigo-500 block">{row?.original?.shippingTackingNumber}</span>
                        </div>
                    );
                }
            },
        },
        {
            id: "tags",
            Header: "Items",
            accessor: "totalItems",
            column_name: "tags",
            Cell: ({ value }) => {
                if (!value) {
                    return "-";
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
                if (!value) {
                    return "";
                } else {
                    return <span className='capitalize '>{value}</span>;
                }
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
            Cell: ({ value }) => {
                if (!value) {
                    return "-";
                } else {
                    return value;
                }
            },
        },
    ];

    return (
        <>
            <h2 className="text-2xl text-gray-800 font-bold my-6">{PageName}</h2>
            <ReactTable
                COLUMNS={COLUMNS}
                DATA={Data}
                {...paginationData}
                setTablePageSize={(value) =>
                    setPaginationDataFunc("pageSize", value)
                }
                sortingOptions={sortingOptions}
                setSortingOptions={setSortingOptionHandler}
                handleSort={handleSort}
                // column filters
                //   editColumnFilter={true}
                filteringOptions={filteringOptions}
                fetchData={getAllData}
                setColumnFilteringOptions={setColumnFilteringOptions}
                // moreFilterOption={[
                //     {
                //         name: "Payment Status",
                //         options: paymentStatus,
                //         columnName: "paymentStatus",
                //         type: "checkbox",
                //     },
                // ]}
                setSelectedRows={setSelectedRows}
                expandedRows={useMemo(() => true, [])}
                selectedRows={selectedRows}
                savedButton={true}
                buttonText={'Saved'}
                hiddenColumns={useMemo(() => ['rowSelection'], [])}
                // setInitialColumnFilterOrder={setInitialColumnFilterOrder}
                // extraFilter={[{ Component: ActionButton, saveFilterOptionsHandler }]}
                tablePadding={true}
            />
            {/* <General
                setCustomerOrderModal={setCustomerOrderModal}
                CustomerOrderModal={CustomerOrderModal}
            /> */}

            <VarientProductModal
                title={`Ordered Products`}
                openModal={openVarientModal}
                setOpenModal={setOpenVarientModal}
                COLUMNS={columnForVarientProducts}
                DATA={dataForVarientProducts}
                setdataForVarientProducts={setdataForVarientProducts}
            />
        </>
    );
};

export default Orders;
