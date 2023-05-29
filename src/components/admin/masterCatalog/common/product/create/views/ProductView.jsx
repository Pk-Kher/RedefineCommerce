/*Component Name: Product
Component Functional Details: User can create or update Product master details from here.
Created By: Shrey Patel
Created Date: 09/12/2022
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useState, useCallback } from 'react';
import { paginationDetails } from 'global/Enum';
import ReactTableServerSide from 'components/common/table/ReactTableServerSide';
import { Link, useParams } from 'react-router-dom';
import BundleProductsService from 'services/admin/masterCatalog/store/bundle/BundleProductsService';
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { useDispatch } from "react-redux";
import { scrollTop } from 'services/common/helper/Helper';

const ProductView = ({
    displayFieldElement,
    fetchFieldProperty,
    fields,
    values,
    requiredFields,
    tab,
    setActiveTab,
    productId,
    index }) => {

    const dispatch = useDispatch();

    const COLUMNS = [
        {
            id: "id",
            Header: "id",
            accessor: "id",
            column_name: "id",
            disableSortBy: true,
        },
        {
            id: "image",
            Header: "product Image",
            accessor: "productImage",
            column_name: "image",
            isVisible: false,
            disableShowHide: true,
            disableSortBy: true,
            Cell: ({ value, row }) => {
                return row ? (
                    <>
                        <div className="flex items-center">
                            {Array.isArray(row.original.image) ?
                                row.original.image.map((img, index) => {
                                    <>
                                        <img className="w-16 h-16 rounded-full box-content" src={`${process.env.REACT_APP_API_BLOB}${img}`} />
                                    </>
                                }) : <img className="w-16 h-16 rounded-full box-content" src={`${process.env.REACT_APP_API_BLOB}${value}`} />}

                            {(row.original.subRows !== undefined && row.original.subRows.length !== 0) &&
                                <span className="w-14 h-14 rounded-full box-content bg-neutral-200 inline-flex items-center justify-center">+{row.original.subRows.length}</span>
                            }
                        </div>
                    </>
                ) : (
                    ""
                );
            },
        },
        {
            id: "name",
            Header: "Product Name",
            accessor: "name",
            column_name: "name",
            disableSortBy: true,
            Cell: ({ value, row }) => {
                return row ? (
                    <>
                        <div
                            className="w-full flex justify-start items-center group"
                            style={{ width: "200px" }}
                        >
                            <div >
                                <Link to={`/admin/MasterCatalog/${storeType}/${storeName}/${storeId}/products/edit/${id}`}>{value}</Link>
                            </div>
                        </div>
                    </>
                ) : (
                    ""
                );
            },
        },
        {
            id: "sku",
            Header: "Our SKU",
            accessor: "ourSKU",
            column_name: "sku",
            disableSortBy: true,
            Cell: ({ value }) => {

                if (!value) {
                    return "";
                } else {
                    return value;
                }
            },
        },
        {
            id: "quantity",
            Header: "Quantity",
            accessor: "quantity",
            column_name: "quantity",
            disableSortBy: true,
            Cell: ({ value }) => {
                if (!value) {
                    return "";
                } else {
                    return value;
                }
            },
        },
        {
            id: "estimatedCost",
            Header: "Customer Price",
            accessor: "salePrice",
            column_name: "estimatedCost",
            disableSortBy: true,
            Cell: ({ value }) => {
                if (!value) {
                    return "";
                } else {
                    return value;
                }
            },
        },
    ];
    const [brand, setBrand] = useState([]);
    const { storeName, storeType, storeId, id } = useParams();
    const [Data, setBundleData] = useState([]);
    const [filteringOptions, setColumnFilteringOptions] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

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

    const [bundlePaginationData, setBundlePaginationData] = useState({
        ...paginationDetails,
    });
    const setPaginationDataFunc = (key, value) => {
        setBundlePaginationData((prevState) => ({
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
    const getBundleProductData = useCallback((pageIndex) => {
        dispatch(setAddLoading(true))

        BundleProductsService.getBundleProducts(productId)
            .then((response) => {
                const BundleProductResponse = response.data.data
                setBundleData(BundleProductResponse.lstBundleXProducts);
                setBundlePaginationData((prevState) => ({
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

    }, [filteringOptions, bundlePaginationData.pageSize, sortingOptions, bundlePaginationData.pageIndex, productId]);

    return (
        <>
            <div className="px-6 py-12 border-b-4 border-neutral-200 last:border-b-0">
                <div className="flex items-center justify-between">
                    <div
                        className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2"
                    >
                        {tab.label}
                    </div>
                    <div >
                        <span
                            className="text-indigo-500 cursor-pointer"
                            onClick={() => {
                                setActiveTab(index);
                                scrollTop();
                            }}
                        >
                            Edit
                        </span>
                    </div>
                </div>
                <div className="max-h-[44em] overflow-x-auto">
                    <ReactTableServerSide
                        COLUMNS={COLUMNS}
                        DATA={Data}
                        {...paginationData}
                        setTablePageSize={(value) =>
                            setPaginationDataFunc("pageSize", value)
                        }
                        fetchData={getBundleProductData}
                        sortingOptions={sortingOptions}
                        setSortingOptions={setSortingOptionHandler}
                        // column filters
                        // editColumnFilter={true}
                        filteringOptions={filteringOptions}
                        setColumnFilteringOptions={setColumnFilteringOptions}
                        setSelectedRows={setSelectedRows}
                        selectedRows={selectedRows}
                        tablePadding={'px-4 pb-4'}
                        displaySearch={false}
                        hiddenColumns={["rowSelection"]}
                    />
                </div>
            </div>
        </>
    );
};
export default ProductView;
