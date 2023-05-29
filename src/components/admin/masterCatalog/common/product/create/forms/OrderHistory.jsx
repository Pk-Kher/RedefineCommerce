/*Component Name: OrderHistory
Component Functional Details: User can create or update OrderHistory master details from here.
Created By: 
Created Date: <Creation Date>
Modified By: 7-22-2022
Modified Date: Pradip kher ,Divyesh shah*/

import React, { useState, useCallback } from 'react';
import { paginationDetails } from 'global/Enum';
import ReactTable from 'components/common/table/ReactTableServerSide';
import { DateTimeFormat } from 'services/common/helper/Helper';
import { NavLink } from 'react-router-dom';
import Status from 'components/common/displayStatus/Status';
import { useDispatch } from "react-redux";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import ProductService from 'services/admin/masterCatalog/store/product/ProductService';


const OrderHistory = ({ productId, values }) => {
    const COLUMNS = [
        {
            id: "orderNo",
            Header: "Order No.",
            accessor: "orderNo",
            column_name: "orderNo",
            Cell: ({ value }) => {
                return value ? (
                    <>
                        <div >
                            <NavLink to={`/admin/Order/orders/edit/${value}`} className="font-medium text-sky-500" >
                                #{value}
                            </NavLink>
                        </div>
                    </>
                ) : (
                    "-"
                );
            },
        },
        {
            id: "orderDate",
            Header: "Order Date",
            accessor: "orderDate",
            column_name: "orderDate",
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
        },
        {
            id: "customerName",
            Header: "Customer",
            accessor: "customerName",
            column_name: "customerName",
        },
        {
            id: "quantity",
            Header: "QTY",
            accessor: "quantity",
            column_name: "quantity",
        },
        {
            id: "total",
            Header: "Total",
            accessor: "total",
            column_name: "total",
            Cell: ({ value }) => {
                return value ? (
                    <>
                        <div className=''>
                            ${value}
                        </div>
                    </>
                ) : (
                    "-"
                );
            },
        },
        {
            id: "paymentStatus",
            Header: "Payment Status",
            accessor: "paymentStatus",
            column_name: "paymentStatus",
            Cell: ({ value }) => {
                return <Status type={value} />;
            },
        },
        {
            id: "fullfillmentStatus",
            Header: "Fulfillment Status",
            accessor: "fullfillmentStatus",
            column_name: "fullfillmentStatus",
            Cell: ({ value }) => {
                return <Status type={value} />;
            },
        },
    ];
    const dispatch = useDispatch();
    const [loading/* , setLoading */] = useState(false);
    const [Data, setData] = useState([]);
    const [filteringOptions, setColumnFilteringOptions] = useState([]);
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

    const getOrderHistoryData = useCallback(
        (pageIndex = 1) => {
            dispatch(setAddLoading(true))
            ProductService.getOrderHistory({
                args: {
                    pageSize: paginationData.pageSize,
                    pageIndex: paginationData.pageIndex,
                    sortingOptions,
                    filteringOptions,
                },
                storeID: values.storeId,
                productId: productId,
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
        [filteringOptions, paginationData.pageSize, sortingOptions]
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
                fetchData={getOrderHistoryData}
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