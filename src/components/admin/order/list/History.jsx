/*Component Name: History
Component Functional Details:  History .
Created By: PK Kher
Created Date: 1-16-2023
Modified By: PK Kher
Modified Date: <Modified Date> */

import React, { useState, useCallback, useEffect } from 'react';
import { setAddLoading } from 'redux/globalLoader/GlobalLoaderAction';
import { useDispatch } from 'react-redux';
import { paginationDetails } from 'global/Enum';
import ReactTableServerSide from 'components/common/table/ReactTableServerSide';
import { NavLink } from 'react-router-dom';
import { DateTimeFormat } from 'services/common/helper/Helper';
import Status from 'components/common/displayStatus/Status';
import OrderService from 'services/admin/order/OrderService';

const History = ({ setHistoryModal, orderDetails }) => {
    const dispatch = useDispatch();
    const COLUMNS = [
        {
            id: "order_Status",
            Header: "Order Status",
            accessor: "logDescription",
            column_name: "order_Status",
            Cell: ({ value, row }) => {
                if (!value) {
                    return "";
                } else {
                    return (
                        <>
                            <Status type={value} />
                        </>
                    );
                }
            },
        },

        {
            id: "date",
            Header: "Date",
            accessor: "createdDate",
            column_name: "date",
            Cell: ({ value, row }) => {
                return (
                    <>
                        <div >{DateTimeFormat(value).date} </div>
                        <div className="text-[#707070] text-xs font-normal">
                            {DateTimeFormat(value).time}
                        </div>
                    </>
                )
            },
        },
    ];
    const [Data, setData] = useState([]);
    const [sortingOptions, setSortingOptions] = useState([
        {
            field: "createdDate",
            direction: 1,
            priority: 0,
        },
    ]);
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
            dispatch(setAddLoading(true));
            OrderService.orderLogList({
                pageSearchArgs: {
                    pageSize: paginationData.pageSize,
                    pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
                    sortingOptions,
                    filteringOptions: [...filteringOptions, {
                        field: "logStatusId",
                        operator: 1,
                        value: "34"
                    }],
                },
                orderNumber: orderDetails?.orderNumber
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
        [paginationData.pageSize, sortingOptions]
    );
    return (
        <>
            <div className="fixed inset-0 bg-slate-900 bg-opacity-30 z-30 transition-opacity" onClick={() => setHistoryModal(false)} />
            <div className="fixed inset-0 z-30 overflow-hidden flex items-center my-4 justify-center transform px-4 sm:px-6 ">
                <div className="relative bg-white rounded shadow-lg overflow-auto max-w-4xl w-full max-h-full z-30" >
                    <div className="flex justify-between items-start p-5 rounded-t border-b sticky top-0 left-0 bg-white z-30">
                        <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl">History</h3>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-toggle="customerModal"
                            onClick={() => setHistoryModal(false)}>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path className="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path>
                            </svg>
                        </button>
                    </div>

                    <div className="col-span-full xl:col-span-9">
                        <div className="w-full bg-white rounded-md mb-6">
                            <div className="w-full">
                                <div className='grow'>
                                    <div className=' space-y-6'>
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
                                            hiddenColumns={['rowSelection']}
                                            tablePadding={'p-0'}
                                            displaySearch={false}
                                            filters={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div>
        </>
    );
};

export default History;
