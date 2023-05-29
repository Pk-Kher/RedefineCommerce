/*Component Name: LifeCycle
Component Functional Details:  LifeCycle .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import LifeCycleView from 'components/common/others/admin/CustomerCompany/LifeCycle';
import React, { useState, useCallback, useEffect } from 'react';
import { CurrencySymbolByCode, paginationDetails } from 'global/Enum';
import ReactTableServerSide from 'components/common/table/ReactTableServerSide';
import { DateTimeFormat } from 'services/common/helper/Helper';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setAddLoading } from 'redux/globalLoader/GlobalLoaderAction'
import Status from 'components/common/displayStatus/Status';
import CustomerLifeCycleService from 'services/admin/customerLifeCycle/CustomerLifeCycleService';

const LifeCycle = () => {

    const { id } = useParams();
    const dispatch = useDispatch();

    const COLUMNS = [
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
            id: "orderAmount",
            Header: "Order Amount",
            accessor: "orderAmount",
            column_name: "orderAmount",
            Cell: ({ value, row }) => {
                return (
                    CurrencySymbolByCode.USD + value
                );
            }

        },
        {
            id: "status",
            Header: "Status",
            accessor: "orderStatus",
            column_name: "status",
            Cell: ({ value, row }) => {
                return <>
                    <Status type={value} /><br />
                    <span className='text-indigo-500 cursor-pointer'>
                        {row?.original?.trackingNo}
                    </span>
                </>
            }
        },
    ];

    let today = new Date();
    const [loading/* , setLoading */] = useState(false);
    const [Data, setData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [StartFromDate, setStartFromDate] = useState(new Date(new Date().setDate(today.getDate() - 7)));
    const [EndToDate, setEndToDate] = useState(new Date());
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

    const getLifeCycleData = useCallback(
        (pageIndex = 1) => {
            dispatch(setAddLoading(true))
            // CustomerLifeCycleService.getCustomerLifecycleMonthWise({
            CustomerLifeCycleService.getCustomerLifecycleDateWise({
                args: {
                    pageSize: paginationData.pageSize,
                    pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
                    sortingOptions,
                    filteringOptions,
                },
                customerId: id,
                fromDate: StartFromDate,
                todate: EndToDate
            }).then((response) => {
                const OrderData = response?.data;
                setData(OrderData?.data?.items);
                if (OrderData?.success) {
                    CustomerLifeCycleService.getCustomerLifecycleMonthWise({
                        args: {
                            pageSize: paginationData.pageSize,
                            pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
                            sortingOptions,
                            filteringOptions,
                        },
                        customerId: id,
                        fromDate: StartFromDate,
                        todate: EndToDate
                    }).then((response) => {
                        const LineChartData = response?.data
                        setChartData(LineChartData?.data?.items);
                        dispatch(setAddLoading(false))
                    }).catch(() => {
                        dispatch(setAddLoading(false))
                    })
                }
                setPaginationData((prevState) => ({
                    ...prevState,
                    pageIndex: OrderData?.data?.pageIndex,
                    pageSize: OrderData?.data?.pageSize,
                    totalCount: OrderData?.data?.totalCount,
                    totalPages: OrderData?.data?.totalPages,
                    hasPreviousPage: OrderData?.data?.hasPreviousPage,
                    hasNextPage: OrderData?.data?.hasNextPage,
                }));
            }).catch(() => {
                dispatch(setAddLoading(false))
            })
        },
        [filteringOptions,
            paginationData.pageSize,
            sortingOptions,
            paginationData.pageIndex, StartFromDate, EndToDate]
    );

    useEffect(() => {
        if (StartFromDate && EndToDate) {
            getLifeCycleData()
        }
    }, [StartFromDate, EndToDate])

    return (
        <>
            <div className='overflow-x-auto grow'>
                <LifeCycleView productActivityDropDown={false} ProductView={false} setStartFromDate={setStartFromDate} StartFromDate={StartFromDate} EndToDate={EndToDate} setEndToDate={setEndToDate} chartData={chartData} />
                <div className='pt-5'>
                    <ReactTableServerSide
                        COLUMNS={COLUMNS}
                        DATA={Data}
                        {...paginationData}
                        setTablePageSize={(value) =>
                            setPaginationDataFunc("pageSize", value)
                        }
                        fetchData={getLifeCycleData}
                        sortingOptions={sortingOptions}
                        setSortingOptions={setSortingOptionHandler}
                        loading={loading}
                        hiddenColumns={['rowSelection']}
                        tablePadding={'px-4 pb-4'}

                    />
                </div>
            </div>
        </>
    );
};

export default LifeCycle;
