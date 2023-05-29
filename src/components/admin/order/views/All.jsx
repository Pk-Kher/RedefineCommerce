/*Component Name: All
Component Functional Details: User can create or update All master details from here.
Created By: Happy
Created Date: <Creation Date>
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { CurrencySymbolByCode, paginationDetails, RecStatusValue } from "global/Enum";
import ReactTable from 'components/common/table/ReactTableServerSide';
import { DateTimeFormat } from 'services/common/helper/Helper';
import { format } from 'date-fns';
import Transition from 'utils/Transition';
import { NavLink, useLocation } from 'react-router-dom';
import General from '../list/customerOrderDetail/General';
import OrderService from 'services/admin/order/OrderService';
import { useDispatch } from 'react-redux';
import { setAddLoading } from 'redux/globalLoader/GlobalLoaderAction';
import Image from "components/common/formComponent/Image";
import VariantProductModal from 'components/admin/masterCatalog/common/product/create/forms/VarientProductModal';
import GeneralStatus from 'components/common/displayStatus/General';
import CheckBox from 'components/common/table/CheckBox';
import History from '../list/History';
const All = ({ activeTab, filterData, childFunc, setDisplayTabs, tab, setNavSyncRows, setShowListMessage, storeId, statusList }) => {

    const dispatch = useDispatch();
    const [Data, setData] = useState([]);
    const [CustomerOrderModal, setCustomerOrderModal] = useState(false);
    const [historyModal, setHistoryModal] = useState(false);
    useEffect(() => {
        setShowListMessage(!CustomerOrderModal);
    }, [CustomerOrderModal]);
    const [hiddenColumns, setHiddenColumns] = useState([]);
    const [initialColumnFilterOrder, setInitialColumnFilterOrder] = useState([]);
    const [filteringOptions, setColumnFilteringOptions] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [paginationData, setPaginationData] = useState({ ...paginationDetails });
    const [orderDetails, setOrderDetails] = useState({});
    const [productItemData, setProductItemData] = useState([]);
    const [openItemModal, setOpenItemModal] = useState({ orderNumber: null, refNo: '', toShow: false });
    const [orderStatusOptions, setOrderStatusOptions] = useState([]);
    const [paymentStatusOptions, setPaymentStatusOptions] = useState([]);
    const [fulfillmentStatusOptions, setFulfillmentStatusOptions] = useState([]);

    useEffect(() => {
        setNavSyncRows(() => {
            return selectedRows.filter(value => (!value?.original?.isNavImport && ['CAPTURED', 'Pending', 'AUTHORIZE'].includes(value?.original?.paymentStatus) && !['Void', 'Cancelled', 'Shipped', 'Fraud'].includes(value?.original?.orderStatus))).map(value => value?.original?.id);
        });
    }, [selectedRows]);
    const getProductItems = (order) => {
        dispatch(setAddLoading(true));
        OrderService.OrderedShoppingCartItems({
            pageSearchArgs: {
                pageIndex: 0,
                pageSize: 0,
                pagingStrategy: 0,
                filteringOptions: [{
                    field: 'isItemCancel',
                    operator: 1,
                    value: false
                }]
            },
            orderId: order?.id
        }).then((response) => {
            if (response?.data?.data?.items) {
                setProductItemData(response.data.data.items);
                setOpenItemModal((prevData) => ({
                    toShow: true,
                    refNo: order?.refenceOrderID,//this referenceOrderID spelling mistake from API side
                    orderNumber: order?.orderNumber
                }))
            }
            dispatch(setAddLoading(false));
        }).catch(() => {
            dispatch(setAddLoading(false));
        });
    }
    const setPaginationDataFunc = (key, value) => {
        setPaginationData((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };
    const [sortingOptions, setSortingOptions] = useState([
        {
            field: "orderDate",
            direction: 1,
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
    const getAllData = useCallback((pageIndex = 1/* , storeId = [0] */) => {
        dispatch(setAddLoading(true));
        OrderService.getOrders({
            pageSearchArgs: {
                pageSize: paginationData.pageSize,
                pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
                sortingOptions,
                filteringOptions: [...filterData, ...filteringOptions],
            },
            storeID: [(storeId === 'none' ? 0 : storeId)],
            customerId: 0,
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
            setDisplayTabs((prev) => {
                return prev.map((value, index) => {
                    return { ...value, recordCount: (value.id === tab?.id ? response.data.data.totalCount : value?.recordCount) }
                })
            });
            dispatch(setAddLoading(false));
        }).catch(() => {
            dispatch(setAddLoading(false));
        })
    }, [filteringOptions, paginationData.pageSize, sortingOptions, activeTab, filterData, storeId, tab]);
    useEffect(() => {
        if (storeId) {
            getAllData();
        }
    }, [storeId]);
    const getMoreFilterOptions = () => {
        OrderService.getMoreFilterOptions({
            storeId: 0
        }).then((response) => {
            if (response?.data?.success && response?.data?.data) {
                let order, payment, fulfillment = [];
                setOrderStatusOptions(() => {
                    return response.data.data.status.map((value) => {
                        return {
                            label: value?.name,
                            value: value?.name
                        }
                    });
                });
                setPaymentStatusOptions(() => {
                    return response.data.data.paymentStatus.map((value) => {
                        return {
                            label: value?.name,
                            value: value?.name
                        }
                    });
                });
                setFulfillmentStatusOptions(() => {
                    return response.data.data.fulfillmentStatus.map((value) => {
                        return {
                            label: value?.name,
                            value: value?.name
                        }
                    });
                });
            }
        })
    };
    useEffect(() => {
        getMoreFilterOptions();
    }, []);
    const COLUMNS = [
        {
            id: "id",
            disableShowHide: true,
            Header: ({ getToggleAllRowsSelectedProps }) => {
                return (
                    <div className="flex items-center relative">
                        <span className={`inline-flex leading-none w-4 h-4`}>
                            <CheckBox {...getToggleAllRowsSelectedProps()} />
                        </span>
                    </div>
                );
            },
            accessor: "id",
            column_name: "id",
            disableSortBy: true,
            Cell: ({ value, row }) => {
                return (!row?.original?.isNavImport && ['CAPTURED', 'Pending', 'AUTHORIZE'].includes(row?.original?.paymentStatus) && !['Void', 'Cancelled', 'Shipped', 'Fraud'].includes(row?.original?.orderStatus)) && <CheckBox {...row.getToggleRowSelectedProps()} />
            }
        },
        {
            id: "expander",
            accessor: "a",
            Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
                ""
            ),
            Cell: ({ row }) => {
                return <span title="Show Sub Product" className="material-icons-outlined select-none leading-none ml-2 w-6 h-6 cursor-pointer transition-all variant-arrow" onClick={() => {
                    getProductItems(row?.original);
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
                let CheckValue = row?.original?.orderStatus.toLowerCase();
                return (
                    <>
                        <div className="text-sm mt-1 flex flex-col">
                            {/* <Status type={row?.original?.orderStatus} className="border-white a bg-white" /> */}
                            {value ? <GeneralStatus type={row?.original?.orderStatus} style={{ backgroundColor: `${statusList?.['orderstatus']?.[row?.original?.orderStatus?.toLowerCase()]?.color}`, color: `${statusList?.['orderstatus']?.[row?.original?.orderStatus?.toLowerCase()]?.textColor}` }} /> : ''}
                            {CheckValue == "pending" ? "" :
                                <>
                                    {value === 1 && <span className="text-indigo-500 cursor-pointer" onClick={() => {
                                        setHistoryModal(true);
                                        setOrderDetails(row?.original);
                                    }}>History</span>}
                                </>
                            }
                        </div>
                    </>
                );
            },
        },
        {
            id: "order",
            Header: "order",
            accessor: "orderNumber",
            column_name: "orderNumber",
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
                                        `/admin/Order/orders/edit/${row?.original?.id}`
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
            column_name: "orderDate",
            Cell: ({ value, row }) => {
                if (row?.colorImage) {
                    return (
                        <Image src={row?.colorImage} className="w-40" containerheight={"h-20"} alt="IMG" />
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
                    <> <img className="max-w-20 max-h-20" src={row.original.image} alt="" /></>
            },
        },
        {
            id: "customerName_Zipcode",
            Header: "Customer Name / Zipcode",
            accessor: "customerName",
            column_name: "customerName_Zipcode",
            Cell: ({ value, row }) => {
                return <>
                    <div className="mb-2 last:mb-0 flex items-center justify-between cursor-pointer text-indigo-500" onClick={() => {
                        setCustomerOrderModal(true);
                        setOrderDetails(row?.original);
                    }}>

                        <div className=""><span className="text-indigo-500" >  {(value) ? value : ""}</span></div>
                        <div className=""><span className="text-indigo-500" >Total {row?.original?.totalOrderNo || 0} Order</span></div>
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

            },
        },
        {
            id: "total",
            Header: "total",
            accessor: "orderTotal",
            column_name: "total",
            Cell: ({ value }) => {
                return CurrencySymbolByCode.USD + (value ? parseFloat(value).toFixed(2) : parseFloat(0).toFixed(2));
            },
        },
        {
            id: "paymentType",
            Header: "Payment Type",
            accessor: "paymentType",
            column_name: "paymentType",
            Cell: ({ value }) => {
                // console.log(statusList, statusList?.['paymenttype']?.[value?.toLowerCase()], 'pkkk');
                return value ? <GeneralStatus type={value} style={{ backgroundColor: `${statusList?.['paymenttype']?.[value?.toLowerCase()]?.color}`, color: `${statusList?.['paymenttype']?.[value?.toLowerCase()]?.textColor}` }} /> : ''
            },
        },
        {
            id: "paymentStatus",
            Header: "Payment Status",
            accessor: "paymentStatus",
            column_name: "paymentStatus",
            Cell: ({ value, row }) => {
                if (value) {
                    return value ? <GeneralStatus type={value} style={{ backgroundColor: `${statusList?.['paymentstatus']?.[value?.toLowerCase()]?.color}`, color: `${statusList?.['paymentstatus']?.[value?.toLowerCase()]?.textColor}` }} /> : ''

                };
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
                            {value ? <GeneralStatus type={value} style={{ backgroundColor: `${statusList?.['fulfillmentstatus']?.[value?.toLowerCase()]?.color}`, color: `${statusList?.['fulfillmentstatus']?.[value?.toLowerCase()]?.textColor}` }} /> : ''}
                            <span className="text-indigo-500 block" >{row?.original?.shippingTackingNumber}</span>
                        </>
                    );
                }
            },
        },
        // {
        //     id: "tags",
        //     Header: "tags",
        //     accessor: "tags",
        //     column_name: "tags",
        //     Cell: ({ value, row }) => {
        //         if (value) {
        //             return value + " Items";
        //         } else if (row?.original?.qty) {
        //             return row?.original?.qty + " Items";
        //         }
        //     },
        // },
        {
            id: "totalItems",
            Header: "Items",
            accessor: "totalItems",
            column_name: "totalItems",
        },
        {
            id: "delivery method",
            Header: "delivery method",
            accessor: "deliveryMethod",
            column_name: "deliveryMethod",
            Cell: ({ value, row }) => {
                return value ? <GeneralStatus type={value} style={{ backgroundColor: `${statusList?.['deliverymethod']?.[value?.toLowerCase()]?.color}`, color: `${statusList?.['deliverymethod']?.[value?.toLowerCase()]?.textColor}` }} /> : ''
            },
        },
    ];
    const ProductItemCOLUMNS = [
        {
            id: "colorImage",
            Header: "",
            accessor: "colorImage",
            column_name: "colorImage",
            Cell: ({ value, row }) => {
                if (value) {
                    return (
                        <div className='w-5'>
                            <Image src={value} className="w-40" containerheight={"h-20"} alt="IMG" />
                        </div>
                    );
                }
                return "";
            },
            disableSortBy: true
        },
        {
            id: "productName",
            Header: "Product Name",
            accessor: "productName",
            column_name: "customerName_Zipcode",
            Cell: ({ value, row }) => {
                return (
                    <>
                        <div className="">{value}</div>
                        <div className="text-[#707070] text-sm font-normal">Ref. Order$: {row?.original?.refenceOrderID}</div>
                        <div className="text-[#707070] text-sm font-normal">Color: {row?.original?.attributeOptionValue} </div>
                        <div className="text-[#707070] text-sm font-normal">SKU: {row?.original?.sku} </div>
                        <div className="text-[#707070] text-sm font-normal">Quantity: {row?.original?.qty}</div>
                    </>
                );
            },
            disableSortBy: true
        },
        {
            id: "Price",
            Header: "Price",
            accessor: "price",
            column_name: "price",
            Cell: ({ value, row }) => {
                return (
                    <>
                        <div className="">${value ? parseFloat(value).toFixed(2) : parseFloat(0).toFixed(2)}</div>
                    </>
                );
            },
            disableSortBy: true
        },
        {
            id: "subTotal",
            Header: "Total Price",
            accessor: "subTotal",
            column_name: "subTotal",
            Cell: ({ value, row }) => {
                return (
                    <>
                        <div className="">${value ? parseFloat(value).toFixed(2) : parseFloat(0).toFixed(2)}</div>
                    </>
                );
            },
            disableSortBy: true
        },
        {
            id: "Status",
            Header: "Status",
            accessor: "isItemCancel",
            column_name: "isItemCancel",
            Cell: ({ value, row }) => {
                return (
                    <>
                        {value ? <GeneralStatus type={'Cancel'} className="bg-red-100 text-red-600 rounded-md text-center px-2.5 py-1 w-28" /> : <GeneralStatus type={'Active'} className="border-green-300 bg-green-100 text-green-600 rounded-md text-center px-2.5 py-1 w-28" />}
                    </>
                );
            },
            disableSortBy: true
        },
    ];
    const handleSort = (sortValue) => { };
    const { pathname } = useLocation();
    return (
        <>
            <ReactTable
                COLUMNS={COLUMNS}
                DATA={Data}
                {...paginationData}
                setTablePageSize={(value) =>
                    setPaginationDataFunc("pageSize", value)
                }
                fetchData={getAllData}
                sortingOptions={sortingOptions}
                setSortingOptions={setSortingOptionHandler}
                handleSort={handleSort}
                // column filters
                editColumnFilter={true}
                filteringOptions={filteringOptions}
                setColumnFilteringOptions={setColumnFilteringOptions}
                moreFilterOption={[
                    {
                        name: "Order Status",
                        options: orderStatusOptions,
                        columnName: "orderStatus",
                        type: "checkbox",
                    },
                    {
                        name: "Payment Status",
                        options: paymentStatusOptions,
                        columnName: "paymentStatus",
                        type: "checkbox",
                    },
                    {
                        name: "Fulfillment Status",
                        options: fulfillmentStatusOptions,
                        columnName: "fulfillmentStatus",
                        type: "checkbox",
                    },
                    {
                        name: "Tag",
                        columnName: "tags",
                        type: "custom_component",
                        Component: MoreFilterTagSearch
                    },
                ]}
                // expandedRows={useMemo(() => false, [])}
                setSelectedRows={setSelectedRows}
                selectedRows={selectedRows}
                hiddenColumns={useMemo(() => ["rowSelection"], [])}
                setInitialColumnFilterOrder={setInitialColumnFilterOrder}
                saveFilter={{ show: true, tabName: pathname + '_' + tab?.value }}
            />
            {CustomerOrderModal && <General
                setCustomerOrderModal={setCustomerOrderModal}
                CustomerOrderModal={CustomerOrderModal}
                orderDetails={orderDetails}
            />}

            <VariantProductModal
                title={`Order Products ${openItemModal?.orderNumber ? '-' + ' #' + openItemModal?.orderNumber : ''} ${openItemModal?.refNo ? '(Ref.#' + openItemModal?.refNo + ')' : ''}`}
                openModal={openItemModal}
                setOpenModal={setOpenItemModal}
                COLUMNS={ProductItemCOLUMNS}
                DATA={productItemData}
                setdataForVarientProducts={setProductItemData}
            />
            {historyModal && <History setHistoryModal={setHistoryModal} orderDetails={orderDetails} />}
        </>
    );
};

export default React.memo(All);

const ActionButton = ({ saveFilterOptionsHandler }) => {
    const [show, setShow] = useState(false);

    // const getEditData = useRef(null);
    const dropdown = useRef(null);
    const trigger = useRef(null);
    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!dropdown.current) return;
            if (
                !show ||
                dropdown.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            setShow(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });
    return (
        <div className="relative inline-flex ml-2" x-data="{ open: false }">
            <div className="text-right">
                <button
                    ref={trigger}
                    onClick={() => setShow(!show)}
                    className="flex flex-wrap items-center rounded-md text-sm px-3 py-2 bg-white border border-neutral-200 text-gray-500 hover:text-gray-700"
                    aria-haspopup="true"
                    aria-expanded="true"
                >
                    <span className="material-icons-outlined">more_horiz</span>
                </button>
            </div>
            <Transition
                className="origin-top-left z-10 absolute top-full right-0 min-w-36 bg-white border border-neutral-200 pt-1.5 rounded shadow-lg overflow-hidden mt-1"
                show={show}
                tag="div"
                enter="transition ease-out duration-200 transform"
                enterStart="opacity-0 -translate-y-2"
                enterEnd="opacity-100 translate-y-0"
                leave="transition ease-out duration-200"
                leaveStart="opacity-100"
                leaveEnd="opacity-0"
            >
                <ul className="pb-4" ref={dropdown}>
                    <li className="pt-4 px-5">
                        <button
                            type="button"
                            onClick={saveFilterOptionsHandler}
                            className="text-indigo-500 hover:text-indigo-600 cursor-pointer"
                        >
                            Save as
                        </button>
                    </li>

                    <li className="pt-4 px-5">
                        <span className="text-indigo-500 hover:text-indigo-600 cursor-pointer"
                        >
                            Create View
                        </span>
                    </li>

                </ul>
            </Transition>
        </div>
    );
};

const MoreFilterTagSearch = ({
    name,
    type,
    mainFilter,
    columnName = name.toLowerCase().replaceAll(' ', "_"),
    setmainColumnFilter,
    clearSubFilter,
}) => {
    const [tag, setTag] = useState('');
    useEffect(() => {
        setTag(() => {
            var temp = mainFilter.filter((value) => {
                return value.field === columnName
            });
            if (temp.length > 0) {
                return temp[0].value;
            } else {
                return "";
            }
        });
    }, [mainFilter, columnName]);
    return (
        <>
            <input type="text" value={tag} onChange={(e) => {
                setmainColumnFilter({
                    field: columnName,
                    operator: 0,
                    value: e.target.value,
                });
            }} maxLength={255} className={`block w-64 bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md m-5`} />
        </>
    )
}
const ExpandButton = () => {
    return <div className="relative inline-flex">
        <button className="btn bg-white rounded-md border-neutral-200 text-gray-500 hover:text-gray-700" id="toggle-exapnd">
            <span className="material-icons-outlined mr-1 text-[20px]">
                settings_overscan
            </span>
            Expand
        </button>
    </div>
}
