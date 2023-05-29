/*Component Name: ProductTable
Component Functional Details: User can create or update ProductTable master details from here.
Created By: Shrey Patel
Created Date: 01/11/2023
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { CurrencySymbolByCode, defaultImage } from 'global/Enum';
import { paginationDetails } from 'global/Enum';
import { useParams, Link } from 'react-router-dom';
import Status from 'components/common/displayStatus/Status';
import ImageComponent from 'components/common/formComponent/Image';
import { DateTimeFormat } from 'services/common/helper/Helper';
import { setAddLoading } from 'redux/globalLoader/GlobalLoaderAction';
import ReactTableServerSide from 'components/common/table/ReactTableServerSide';

const Table = ({ API, CompanyId, CustomerId, ColumnHeaderDate, ColumnHeaderCount, ColumnHide }) => {
    const dispatch = useDispatch();
    const COLUMNS = [
        {
            id: "image",
            Header: "Image",
            accessor: "productImage",
            column_name: "image",
            disableSortBy: true,
            Cell: ({ value, row }) => {
                return value && value !== "" ? (
                    <img className="h-10 w-10 mr-4" src={`${process.env.REACT_APP_API_BLOB}${value[0]}`} alt="" />
                ) :
                    <ImageComponent src={defaultImage} className="h-16 w-20" />
            }
        },
        {
            id: "sku",
            Header: "sku",
            accessor: "ourSKU",
            column_name: "sku",
        },
        {
            id: "name",
            Header: "Title",
            accessor: "name",
            column_name: "name",
            Cell: ({ value, row }) => {
                return row ? (
                    <>
                        <div
                            className="w-full flex justify-start items-center group text-indigo-500"
                            style={{ width: "200px" }}
                        >
                            <div>
                                {row?.original?.url ?
                                    <a href={`${row?.original?.url}/${row?.original.sename}`} target="_blank" >{value}</a>
                                    // to={`/admin/MasterCatalog/eCommerceStore/pkHG/5/products/edit/${row.original.id}`}
                                    :
                                    <a href={`https://vercel.redefinecommerce.net/`} target="_blank" >{value}</a>
                                }
                            </div>
                        </div>
                    </>
                ) : (
                    " "
                );
            },
        },
        {
            id: "status",
            Header: "Status",
            accessor: "recStatus",
            column_name: "status",
            disableSortBy: true,
            Cell: ({ value, row }) => {
                return (
                    <Status type={value} />
                )
            }
        },
        {
            id: "upc",
            Header: "upc",
            accessor: "upc",
            column_name: "upc",
        },
        {
            id: "productCount",
            Header: "Quantity",
            accessor: "productCount",
            column_name: "productCount",
        },
        {
            id: "ourcost",
            Header: "Estimated Cost",
            accessor: "ourcost",
            column_name: "ourcost",
            Cell: ({ value, row }) => {
                return (CurrencySymbolByCode.USD + value)
            }
        },
        {
            id: "salePrice",
            Header: "Default List Price",
            accessor: "salePrice",
            column_name: "salePrice",
            Cell: ({ value, row }) => {
                return (CurrencySymbolByCode.USD + value)
            }
        },
        {
            id: "category",
            Header: "Category",
            accessor: "category",
            column_name: "category",
        },
        {
            id: ColumnHeaderDate,
            Header: ColumnHeaderDate,
            accessor: "createdDate",
            column_name: "createdDate",
            Cell: ({ value, row }) => {
                return value ? (
                    <>
                        <div >{DateTimeFormat(value).date} </div>
                        <div className="text-[#707070] text-xs font-normal">
                            {DateTimeFormat(value).time}
                        </div>
                    </>
                ) :
                    ""
            },
        },
        {
            id: ColumnHeaderCount,
            Header: ColumnHeaderCount,
            accessor: "purchaseCount",
            column_name: "purchaseCount",
        },
    ];
    const [filteringOptions, setColumnFilteringOptions] = useState([]);
    const [sortingOptions, setSortingOptions] = useState([
        {
            field: "name",
            direction: 0,
            priority: 0,
        },
    ]);
    const [Data, setData] = useState([]);
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

    const getProductData = useCallback(
        (pageIndex = 1) => {
            dispatch(setAddLoading(true))
            if (API instanceof Function) {
                API({
                    args: {
                        pageSize: paginationData.pageSize,
                        pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
                        sortingOptions,
                        filteringOptions,
                    },
                    comapnyid: CompanyId || 0,
                    customerId: CustomerId || 0
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
            }
        },
        [filteringOptions,
            paginationData.pageSize,
            sortingOptions,
            paginationData.pageIndex]
    );

    return (

        <ReactTableServerSide
            COLUMNS={COLUMNS}
            DATA={Data}
            {...paginationData}
            setTablePageSize={(value) =>
                setPaginationDataFunc("pageSize", value)
            }
            fetchData={getProductData}
            sortingOptions={sortingOptions}
            setSortingOptions={setSortingOptionHandler}
            hiddenColumns={ColumnHeaderCount == "Wishlist Count" ? ['rowSelection', 'Wishlist Count'] : ['rowSelection']}
            tablePadding={'px-4 pb-4'}
            displaySearch={true}
            // tablePadding={true}
            filters={false}
        />

    );
};

export default Table;
