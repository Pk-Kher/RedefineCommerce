/*Component Name: CustomerLogo
Component Functional Details: User can create or update CustomerLogo master details from here.
Created By: Happy
Created Date: 11/10/22
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useState, useCallback } from 'react';
import { paginationDetails } from 'global/Enum';
import ReactTableServerSide from 'components/common/table/ReactTableServerSide';
import { DateTimeFormat } from 'services/common/helper/Helper';
import Status from 'components/common/displayStatus/Status';
import Image from "components/common/formComponent/Image";
import { useDispatch } from 'react-redux';
import { setAddLoading } from 'redux/globalLoader/GlobalLoaderAction';
import OrderService from 'services/admin/order/OrderService';
import { NavLink } from 'react-router-dom';


const CustomerLogo = ({ orderDetails }) => {
    const dispatch = useDispatch();
    const COLUMNS = [
        {
            id: "logo",
            Header: "Logo",
            accessor: "logoLocationImage",
            column_name: "logo",
            Cell: ({ value, row }) => {
                return <div className="flex items-center">
                    <Image src={value} className="w-20" containerheight={"h-20"} />
                </div>

            }
        },
        {
            id: "logoName",
            Header: "Logo Name",
            accessor: "logoName",
            column_name: "logoName",
        },
        {
            id: "logoNumber",
            Header: "Logo Number",
            accessor: "logoNumber",
            column_name: "logoNumber",
        },
        {
            id: "logoSize",
            Header: "Logo Size",
            accessor: "logoSize",
            column_name: "logoSize",
        },
        {
            id: "ProductType",
            Header: "Product Type",
            accessor: "productType",
            column_name: "ProductType",
            Cell: ({ value, row }) => {
                return <div className="flex items-center">
                    <Image src={value} className="w-20" containerheight={"h-20"} />
                </div>

            }
        },
        {
            id: "logoLocation",
            Header: "Logo Location",
            accessor: "logoLocationImage",
            column_name: "logoLocation",
            Cell: ({ value, row }) => {
                return <div className="flex items-center">
                    <Image src={value} className="w-20" containerheight={"h-20"} />
                </div>

            }
        },
        {
            id: "uploadDate",
            Header: "Upload Date",
            accessor: "uploadDate",
            column_name: "uploadDate",
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
            id: "approveDate",
            Header: "Approved Date",
            accessor: "approvedDate",
            column_name: "approveDate",
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
            id: "status",
            Header: "Status",
            accessor: "status",
            column_name: "status",
            Cell: ({ value, row }) => {
                return (value && value.toLowerCase() === 'waiting') ? <NavLink to={`/admin/Customer/customer/edit/${orderDetails?.customerId}?tab=7&logoId=${row?.original?.customerLogoId}`} target="_blank" className={`text-indigo-500 w-40`} >Waiting For Approval</NavLink> : <Status type={value} />;
            },
        },
        {
            id: "id",
            Header: "",
            accessor: "id",
            column_name: "id",
            disableSortBy: true,
            Cell: ({ value }) => {
                return ''
            },
        },
    ];
    const [Data, setData] = useState([]);
    const [sortingOptions, setSortingOptions] = useState([
        {
            field: "name",
            direction: 0,
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
    const getCustomerLogoData = useCallback(
        (pageIndex) => {
            dispatch(setAddLoading(true));
            OrderService.getCustomerLogoByOrderId({
                args: {
                    pageSize: paginationData.pageSize,
                    pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
                    sortingOptions,
                    filteringOptions: [],
                },
                orderId: orderDetails?.orderNumber,
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
            });
        },
        [
            paginationData.pageSize,
            sortingOptions,
            paginationData.pageIndex,
            orderDetails
        ]
    );
    return (
        <div className='grow'>
            <div className=''>
                {orderDetails?.orderNumber && <ReactTableServerSide
                    COLUMNS={COLUMNS}
                    DATA={Data}
                    {...paginationData}
                    setTablePageSize={(value) =>
                        setPaginationDataFunc("pageSize", value)
                    }
                    fetchData={getCustomerLogoData}
                    filteringOptions={filteringOptions}
                    sortingOptions={sortingOptions}
                    setSortingOptions={setSortingOptionHandler}
                    hiddenColumns={['rowSelection']}
                    tablePadding={'pb-10'}
                    filters={false}
                    displaySearch={false}

                />}
            </div>
        </div>
    );
};

export default CustomerLogo;
