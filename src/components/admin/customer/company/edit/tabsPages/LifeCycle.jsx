/*Component Name: LifeCycle
Component Functional Details:  LifeCycle .
Created By: Divyesh
Created Date: <Creation Date>
Modified By: Divyesh
Modified Date: <Modified Date> */

import LifeCycleView from 'components/common/others/admin/CustomerCompany/LifeCycle';
import React, { useState, useCallback, useEffect } from 'react';
import { paginationDetails } from 'global/Enum';
import ReactTableServerSide from 'components/common/table/ReactTableServerSide';
import { DateTimeFormat } from 'services/common/helper/Helper';
import Status from 'components/common/displayStatus/Status';
import { useDispatch } from 'react-redux';
import { setAddLoading } from 'redux/globalLoader/GlobalLoaderAction'
import { useParams } from 'react-router-dom';
import CompanyLifeCycleService from 'services/admin/companyLifeCycle/CompanyLifeCycleService';
import CompanyInformationServices from 'services/admin/companyInformation/CompanyInformationServices';
import { CurrencySymbolByCode } from "global/Enum";

const LifeCycle = () => {

    const { id } = useParams();
    const dispatch = useDispatch();
    const [dropDownOption, setdropDownOption] = useState([]);

    const COLUMNS = [
        {
            id: "OrderDate",
            Header: "Order Date",
            accessor: "orderDate",
            column_name: "OrderDate",
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
            id: "OrderAmount",
            Header: "Order Amount",
            accessor: "orderAmount",
            column_name: "OrderAmount",
            Cell: ({ value, row }) => {
                return (
                    CurrencySymbolByCode.USD + value
                );
            }

        },
        {
            id: "orderStatus",
            Header: "Status",
            accessor: "orderStatus",
            column_name: "orderStatus",
            Cell: ({ value, row }) => {
                return <>
                    <Status type={value} /><br />
                    <span className='text-indigo-500 cursor-pointer'>
                        {row.original.trackingNo}
                    </span>
                </>
            }
        },

        {
            id: "CustomerName",
            Header: "Customer Name",
            accessor: "customerName",
            column_name: "CustomerName",
            Cell: ({ value, row }) => {
                return row ? (
                    <>
                        <div >{value}</div>
                    </>
                ) : (
                    "-"
                );
            },
        },

    ];

    let today = new Date();
    const [loading/* , setLoading */] = useState(false);
    const [Data, setData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [StartFromDate, setStartFromDate] = useState(new Date(new Date().setDate(today.getDate() - 7)));
    const [EndToDate, setEndToDate] = useState(new Date());
    const [filteringOptions, setColumnFilteringOptions] = useState([]);
    const [dropDownSelectedValue, setdropDownSelectedValue] = useState();
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
    const getLifecycleData = useCallback(
        (pageIndex = 1) => {
            dispatch(setAddLoading(true))
            // CustomerLifeCycleService.getCustomerLifecycleMonthWise({
            CompanyLifeCycleService.getCompanyLifecycleDateWise({
                args: {
                    pageSize: paginationData.pageSize,
                    pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
                    pagingStrategy: 0,
                    sortingOptions,
                    filteringOptions,
                },
                comapnyid: id,
                fromDate: StartFromDate,
                todate: EndToDate
            }).then((response) => {
                const OrderData = response?.data;
                setData(OrderData?.data?.items);
                if (OrderData?.success) {
                    CompanyLifeCycleService.getCompanyLifecycleMonthWise({
                        args: {
                            pageSize: paginationData.pageSize,
                            pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
                            sortingOptions,
                            filteringOptions,
                        },
                        comapnyid: id,
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
                dispatch(setAddLoading(false))
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
            getLifecycleData()
        }

    }, [StartFromDate, EndToDate])

    useEffect(() => {
        CompanyInformationServices.getCustomerDropDown(id).then((response) => {
            setdropDownOption(response.data.data);
        }).catch(() => { })

    }, [id])

    useEffect(() => {
        {
            dropDownSelectedValue ?
                setColumnFilteringOptions && setColumnFilteringOptions((prev) => {
                    return [
                        { "field": "customerId", "operator": 0, "value": dropDownSelectedValue }
                    ]
                })
                :
                setColumnFilteringOptions && setColumnFilteringOptions((prev) => {
                    return []
                })
        }
    }, [dropDownSelectedValue]);

    return (
        <>
            <div className='overflow-x-auto grow'>
                <LifeCycleView productActivityDropDown={true} storeDropDown={false} ProductView={false} setStartFromDate={setStartFromDate} StartFromDate={StartFromDate} EndToDate={EndToDate} setEndToDate={setEndToDate} dropDownSelectedValue={dropDownSelectedValue} setdropDownSelectedValue={setdropDownSelectedValue} chartData={chartData} dropDownOption={dropDownOption} setColumnFilteringOptions={setColumnFilteringOptions} />
                <div className='pt-5'>
                    <ReactTableServerSide
                        COLUMNS={COLUMNS}
                        DATA={Data}
                        {...paginationData}
                        setTablePageSize={(value) =>
                            setPaginationDataFunc("pageSize", value)
                        }
                        fetchData={getLifecycleData}
                        filteringOptions={filteringOptions}
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
