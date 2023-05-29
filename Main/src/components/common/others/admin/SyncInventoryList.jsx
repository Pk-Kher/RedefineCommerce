/*Component Name: Import
Component Functional Details:  Import
Created By: Shrey Patel
Created Date: 01-28-2023
Modified By: <ModifiedBy>
Modified Date: <ModifiedDate> */

import React, { useCallback, useState, useMemo } from "react";
import ReactTable from "../../table/ReactTableServerSide";
import Status from "../../../common/displayStatus/Status";
import Messages from "components/common/alerts/messages/Index";
import { paginationDetails } from "global/Enum";
import { DateTimeFormat } from "services/common/helper/Helper";
import { useDispatch, useSelector } from "react-redux";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import ThirdPartyInventorySync from "services/admin/masterCatalog/masterCatalog/ThirdPartyInventorySync/ThirdPartyInventorySync";
import { NavLink } from "react-router-dom";

const SyncInventoryList = ({ setShowInventoryList, setShowImportExportInventory, InventoryTypeId, InventoryName }) => {
    const permission = useSelector(store => store.permission);

    const dispatch = useDispatch();
    const [Data, setData] = useState([]);
    const [SyncStatusData, setSyncStatusData] = useState([]);
    const [sortingOptions, setSortingOptions] = useState([
        {
            field: "name",
            direction: 0,
            priority: 0,
        },
    ]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [filteringOptions, setColumnFilteringOptions] = useState([]);
    const [paginationData, setPaginationData] = useState({
        ...paginationDetails,
    });
    const setPaginationDataFunc = (key, value) => {
        setPaginationData((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const COLUMNS = [
        {
            id: "systemSKU",
            Header: "SystemSKU",
            accessor: "systemSKU",
            column_name: "systemSKU",
            disableSortBy: true,
            disableShowHide: true,
        },
        {
            id: "style",
            Header: "Style",
            accessor: "style",
            column_name: "style",
            disableShowHide: true,
            Cell: ({ value, row }) => {
                return value ? (
                    <div >
                        {value}
                    </div>
                ) : (
                    ""
                );
            },
        },
        {
            id: "color",
            Header: "Color",
            accessor: "color",
            column_name: "color",
        },
        {
            id: "size",
            Header: "Size",
            accessor: "size",
            column_name: "size",
            Cell: ({ value }) => {
                return value ? (
                    <div className="flex flex-wrap gap-1">{value}</div>
                ) : (
                    ""
                );
            },
        },
        {
            id: "inventory",
            Header: "Vendor Inventory",
            accessor: "inventory",
            column_name: "inventory",
            Cell: ({ value }) => {
                return value ? (
                    <div >{value} </div>
                ) : (
                    ""
                );
            },
        },
        {
            id: "bufferInventory",
            Header: "Buffer Inventory",
            accessor: "bufferInventory",
            column_name: "bufferInventory",
        },
        {
            id: "navInventory",
            Header: "Nav Inventory",
            accessor: "navInventory",
            column_name: "navInventory",
            Cell: ({ value }) => {
                return value ? (
                    <div >{value} </div>
                ) : (
                    ""
                );
            },
        },
        {
            id: "totalInventory",
            Header: "Inventory",
            accessor: "totalInventory",
            column_name: "totalInventory",
        },
        {
            id: "log",
            Header: "log",
            accessor: "log",
            column_name: "log",
            Cell: ({ value }) => {
                return value ? value : "";
            },
        },
        {
            id: "modifiedDate",
            Header: "Date/Time Of Update",
            accessor: "modifiedDate",
            column_name: "modifiedDate",
            Cell: ({ value }) => {
                return value ? (
                    <>
                        <div >{DateTimeFormat(value).date} </div>
                        <div className="text-[#707070] text-xs font-normal">
                            {DateTimeFormat(value).time}
                        </div>
                    </>
                ) : (
                    ""
                );
            },
        },
    ];

    const getInventorySyncData = useCallback(
        (pageIndex) => {
            dispatch(setAddLoading(true))

            ThirdPartyInventorySync.getSyncProductInventoryList({
                inventoryTypeId: InventoryTypeId,
                args: {
                    pageSize: paginationData.pageSize,
                    pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
                    sortingOptions,
                    filteringOptions,
                },
            }).then((response) => {
                setData(response.data.data.items);
                if (response.data.success) {
                    ThirdPartyInventorySync.getInventorySyncStatus(InventoryTypeId).then((response) => {
                        setSyncStatusData(response.data.data);
                        dispatch(setAddLoading(false))
                    }).catch(() => {
                        dispatch(setAddLoading(false))
                    })
                }
                setPaginationData((prevState) => ({
                    ...prevState,
                    pageIndex: response.data.data.pageIndex,
                    pageSize: response.data.data.pageSize,
                    totalCount: response.data.data.totalCount,
                    totalPages: response.data.data.totalPages,
                    hasPreviousPage: response.data.data.hasPreviousPage,
                    hasNextPage: response.data.data.hasNextPage,
                }));
                dispatch(setAddLoading(false))
            }).catch(() => {
                dispatch(setAddLoading(false))
            })
        },
        [
            filteringOptions,
            paginationData.pageSize,
            sortingOptions,
            paginationData.pageIndex,
        ]
    );
    const setSortingOptionHandler = (column, direction) => {
        setSortingOptions([
            {
                field: column,
                direction: direction,
                priority: 0,
            },
        ]);
    };
    const handleSort = (sortValue) => { };

    return (
        <>
            <title>Sync Inventory</title>
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="sm:flex sm:justify-between sm:items-center mb-8">
                    <div className="flex justify-between">
                        <div className="flex items-center">
                            <button onClick={() => setShowInventoryList(false)}
                                className="btn border-neutral-200 hover:border-neutral-400 text-gray-500 hover:text-gray-700 flex items-center mr-2"
                            >
                                <span className="material-icons-outlined">west</span>
                            </button>
                            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
                                Back
                            </h1>
                        </div>
                    </div>
                </div>
                <label className={`block bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-4`}>
                    <div className="border-b border-neutral-300">
                        <div className="font-semibold text-lg"> </div>
                        <div className="sm:flex sm:justify-between sm:items-center mb-8">
                            <div className="col-span-full w-full flex justify-between items-center">
                                <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
                                    Master Catalog - {InventoryName}  Bulk Export Product Inventory
                                </h1>
                                {(permission?.isEdit || permission?.isDelete) &&
                                    <div className="flex flex-wrap space-x-2 items-center">
                                        <button
                                            onClick={() => { setShowImportExportInventory(true) }}
                                            className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                                        >
                                            <span className="ml-1">Import/Export {InventoryName} Sync Products</span>
                                        </button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 font-semibold">{SyncStatusData}</div>
                </label>

                <Messages />
                <div className="col-span-full w-full bg-white shadow-xxl rounded-md mb-8 relative">
                    <ReactTable
                        COLUMNS={COLUMNS}
                        DATA={Data}
                        {...paginationData}
                        setTablePageSize={(value) =>
                            setPaginationDataFunc("pageSize", value)
                        }
                        fetchData={getInventorySyncData}
                        sortingOptions={sortingOptions}
                        setSortingOptions={setSortingOptionHandler}
                        handleSort={handleSort}
                        // column filters
                        filteringOptions={filteringOptions}
                        setColumnFilteringOptions={setColumnFilteringOptions}
                        hiddenColumns={useMemo(() => ["rowSelection"], [])}
                        setSelectedRows={setSelectedRows}
                        selectedRows={selectedRows}
                    />
                </div>
            </div>
        </>
    );
};

export default SyncInventoryList;
