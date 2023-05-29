/*Component Name: OrderHistory
Component Functional Details: User can create or update OrderHistory master details from here.
Created By: 
Created Date: <Creation Date>
Modified By: 7-22-2022
Modified Date: Pradip kher */

import React, { useState, useCallback } from 'react';
import { paginationDetails } from 'global/Enum';
import ReactTable from 'components/common/table/ReactTableServerSide';
import { DateTimeFormat } from 'services/common/helper/Helper';
import { orderHistory as DATA } from 'dummy/Dummy'
import { NavLink } from 'react-router-dom';
import Status from 'components/common/displayStatus/Status';


const OrderHistory = () => {
    const COLUMNS = [
        {
            id: "orderNo",
            Header: "Order No.",
            accessor: "orderNo",
            column_name: "orderNo",
            Cell: ({ value }) => {
                return value ? (
                    <>
                        <div className="">
                            <NavLink to={`/admin/Order/orders/edit/${1}`} className="font-medium text-sky-500" >
                                {value}
                            </NavLink>
                        </div>
                    </>
                ) : (
                    "-"
                );
            },
        },
        {
            id: "order_date",
            Header: "Order Date",
            accessor: "order_date",
            column_name: "order_date",
            Cell: ({ value }) => {
                return value ? (
                    <>
                        <div className="">{DateTimeFormat(value).date} </div>
                        <div className="text-[#707070] text-xs font-normal">
                            {DateTimeFormat(value).time}
                        </div>
                    </>
                ) : (
                    "-"
                );
            },
        },
        {
            id: "customer",
            Header: "Customer",
            accessor: "customer",
            column_name: "customer",
        },
        {
            id: "qty",
            Header: "QTY",
            accessor: "qty",
            column_name: "qty",
        },
        {
            id: "total",
            Header: "Total",
            accessor: "total",
            column_name: "total",
        },
        {
            id: "payment_status",
            Header: "Payment Status",
            accessor: "payment_status",
            column_name: "payment_status",
            Cell: ({ value }) => {
                return <Status type={value} />;
            },
        },
        {
            id: "fulfillment_status",
            Header: "Fulfillment Status",
            accessor: "fulfillment_status",
            column_name: "fulfillment_status",
            Cell: ({ value }) => {
                return <Status type={value} />;
            },
        },
    ]
    const [loading/* , setLoading */] = useState(false);
    const [Data, setData] = useState([]);
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
    const getOrderHistory = useCallback(
        (pageIndex) => {
            setData(DATA)
        },
        [
            /* filteringOptions,
            paginationData.pageSize,
            sortingOptions,
            paginationData.pageIndex, */
        ]
    );
    return (
        <div className="col-span-full w-full rounded-md my-8">
            <ReactTable
                COLUMNS={COLUMNS}
                DATA={Data}
                {...paginationData}
                setTablePageSize={(value) =>
                    setPaginationDataFunc("pageSize", value)
                }
                fetchData={getOrderHistory}
                sortingOptions={sortingOptions}
                setSortingOptions={setSortingOptionHandler}
                loading={loading}
                hiddenColumns={['rowSelection']}
                tablePadding={'px-4 pb-4'}

            />
        </div>
    );
}
export default OrderHistory;