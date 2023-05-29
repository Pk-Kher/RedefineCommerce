/*Component Name: StepFour
Component Functional Details:  StepFour .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: Happy Patel
Modified Date: 12/21/2022 */

import React, { useState, useCallback } from 'react';
import { paginationDetails } from 'global/Enum';
import ReactTableServerSide from 'components/common/table/ReactTableServerSide';
import { DateTimeFormat } from 'services/common/helper/Helper';
import ImportExportService from 'services/admin/masterCatalog/masterCatalog/products/ImportExportService';
import { setAddLoading } from 'redux/globalLoader/GlobalLoaderAction';
import { useDispatch } from 'react-redux';
import { StoreExportTypes } from 'dummy/Dummy';


const History = ({ activeTab, exportTypeOptions, type }) => {
    const dispatch = useDispatch()
    const COLUMNS = [
        {
            id: "start",
            Header: "Start Date",
            accessor: "start",
            column_name: "start",
            Cell: ({ value }) => {
                return value ? (
                    <>
                        <div >{DateTimeFormat(value).date} </div>
                        <div className="text-[#707070] text-xs font-normal">
                            {DateTimeFormat(value).time}
                        </div>
                    </>
                ) : (
                    "-"
                );
            },
            disableSortBy: true,
            disableShowHide: true,
        },
        {
            id: "end",
            Header: "End Date",
            accessor: "end",
            column_name: "end",
            Cell: ({ value }) => {
                return value ? (
                    <>
                        <div >{DateTimeFormat(value).date} </div>
                        <div className="text-[#707070] text-xs font-normal">
                            {DateTimeFormat(value).time}
                        </div>
                    </>
                ) : (
                    "-"
                );
            },
            disableSortBy: true,
            disableShowHide: true,
        },
        {
            id: "status",
            Header: "Upload Status",
            accessor: "status",
            column_name: "status",
            disableSortBy: true,
            disableShowHide: true,
        },
        {
            id: "created_by",
            Header: "Created By",
            accessor: "createdBy",
            column_name: "createdBy",
            disableSortBy: true,
            disableShowHide: true,
        },
        {
            id: "action",
            Header: "Action",
            accessor: "filePath",
            column_name: "action",
            Cell: ({ value, row }) => {
                return (
                    value && <div className="truncate w-32 text-indigo-500 hover:text-indigo-600">
                        <a
                            href={`${value}`}
                            className="flex flex-wrap rounded-md items-center text-sm px-3 py-2 bg-white border border-neutral-200 hover:border-neutral-300 text-gray-500 hover:text-gray-600"
                            title={`Download Log File`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span className="material-icons-outlined">download</span>
                            <span className="ml-1">Download</span>
                        </a>
                    </div >
                );
            },
            disableSortBy: true,
            disableShowHide: true,
        },
    ]
    const [loading/* , setLoading */] = useState(false);
    const [Data, setData] = useState([]);
    const [filteringOptions, setColumnFilteringOptions] = useState([]);
    const [sortingOptions, setSortingOptions] = useState([
        {
            field: "id",
            direction: 1,
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
    const getExportHistoryData = useCallback(
        (pageIndex) => {
            dispatch(setAddLoading(true))

            ImportExportService.getLogData({
                pageSize: paginationData.pageSize,
                pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
                sortingOptions,
                filteringOptions: [...filteringOptions,
                { "field": "type", "operator": 0, "value": "Import" },
                { field: 'page', operator: 1, value: (StoreExportTypes[type]).join(",") }
                ]
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
                dispatch(setAddLoading(false))
            }).catch(() => {
                dispatch(setAddLoading(false))
            })
        },
        [
            activeTab,
            filteringOptions,
            paginationData.pageSize,
            sortingOptions,
            paginationData.pageIndex,
            type,
        ]
    );
    return (
        <>
            <ReactTableServerSide
                COLUMNS={COLUMNS}
                DATA={Data}
                {...paginationData}
                setTablePageSize={(value) =>
                    setPaginationDataFunc("pageSize", value)
                }
                fetchData={getExportHistoryData}
                sortingOptions={sortingOptions}
                setSortingOptions={setSortingOptionHandler}
                loading={loading}
                displaySearch={false}
                hiddenColumns={['rowSelection']}
                tablePadding={'px-4 pb-4'}
                filters={false}

            />
        </>
    );
};

export default History;
