/*Component Name: SalesDiscountReport
Component Functional Details: User can create or update SalesDiscountReport master details from here.
Created By: Shrey Patel
Created Date: Current Date
Modified By: Chandan
Modified Date: <Modified Date> */

import React, { useState, useCallback } from "react";
import ReactTable from "components/common/table/ReactTableServerSide";
import PromotionsService from "services/admin/promotions/PromotionsService";
import { CurrencySymbolByCode, paginationDetails } from "global/Enum";
import { DateTimeFormat } from "services/common/helper/Helper";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { useDispatch } from "react-redux";
import { useMemo } from "react";

const SalesDiscountReport = ({ OpenDiscountReport, setOpenDiscountReport, id }) => {
    const dispatch = useDispatch();

    const [data, setData] = useState([]);
    const COLUMNS = [
        {
            id: "orders",
            Header: "orders",
            accessor: "orderNumber",
            column_name: "orders",
        },
        {
            id: "customerName",
            Header: "Customer Name",
            accessor: "customerName",
            column_name: "customerName",
        },
        {
            id: "totorderval",
            Header: "Total Amount",
            accessor: "orderTotalValue",
            column_name: "totorderval",
            Cell: ({ value }) => {
                return value ? CurrencySymbolByCode.USD + value : ""
            }
        },
        {
            id: "discounts",
            Header: "Total Discounts",
            accessor: "discount",
            column_name: "discounts",
            Cell: ({ value }) => {
                return value ? CurrencySymbolByCode.USD + value : ""
            }
        },
        {
            id: "discount code",
            Header: "discount code",
            accessor: "discountCode",
            column_name: "discount code",
            disableShowHide: true,
        },
        {
            id: "discountType",
            Header: "discount type",
            accessor: "discountType",
            column_name: "discountType",
        }
        ,
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
                    ""
                );
            },
        },
    ];

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
    const getDiscountReportData = useCallback(
        (pageIndex) => {
            dispatch(setAddLoading(true))

            PromotionsService.getDiscountReport({
                promotionsId: id,
                args: {
                    pageSize: paginationData.pageSize,
                    pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
                    sortingOptions,
                    filteringOptions,
                },
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
            filteringOptions,
            paginationData.pageSize,
            sortingOptions,
            paginationData.pageIndex,
        ]
    );

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
    const handleSort = (sortValue) => { };

    // if (data === undefined) { return null }

    return (
        <>
            <div id="viewhistoryModal"
                aria-hidden="true"
                className={`${!OpenDiscountReport && "hidden"
                    } overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center h-modal max-h-screen`}
            >
                <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="relative w-full max-w-4xl">
                        <div className="relative bg-white rounded-lg shadow max-h-screen overflow-y-auto">
                            <div className="flex justify-between items-start p-5 rounded-t border-b sticky top-0 left-0 bg-white">
                                <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl">
                                    Sales by discount report
                                </h3>
                                <button
                                    onClick={() => setOpenDiscountReport((prev) => !prev)}
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                                    data-modal-toggle="viewhistoryModal"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </button>
                            </div>
                            {/* <div> */}
                            <div className="overflow-x-auto max-h-screen mb-5">
                                <ReactTable
                                    COLUMNS={COLUMNS}
                                    DATA={data}
                                    {...paginationData}
                                    setTablePageSize={(value) =>
                                        setPaginationDataFunc("pageSize", value)
                                    }
                                    fetchData={getDiscountReportData}
                                    sortingOptions={sortingOptions}
                                    setSortingOptions={setSortingOptionHandler}
                                    handleSort={handleSort}
                                    // column filters
                                    filteringOptions={filteringOptions}
                                    displaySearch={false}
                                    tablePadding={'1'}
                                    filters={false}
                                    hiddenColumns={["rowSelection"]}

                                />
                            </div>
                            {/* </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SalesDiscountReport;
