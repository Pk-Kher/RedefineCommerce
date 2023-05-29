/*Component Name: Product
Component Functional Details: User can create or update Product master details from here.
Created By: Ankit Sharma
Created Date: 09/12/2022
Modified By: Ankit Sharma
Modified Date: 09/12/2022 */

import React, { useState, useCallback } from 'react';
import { paginationDetails, CurrencySymbolByCode } from 'global/Enum';
import ReactTableServerSide from 'components/common/table/ReactTableServerSide';
import ImageComponent from 'components/common/formComponent/Image';
import { Link, useParams } from 'react-router-dom';
import ProductService from 'services/admin/masterCatalog/store/product/ProductService';
import { useEffect } from 'react';
import DropdownService from 'services/common/dropdown/DropdownService';
import BundleProductsService from 'services/admin/masterCatalog/store/bundle/BundleProductsService';


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
    const COLUMNS = [
        {
            id: "id",
            Header: "id",
            accessor: "id",
            column_name: "id",
        },
        {
            id: "image",
            Header: "Product Image",
            accessor: "productImage",
            column_name: "image",
            isVisible: false,
            disableShowHide: true,
            Cell: ({ value, row }) => {
                return row ? (
                    <>
                        <div className="flex items-center">
                            {Array.isArray(row.original.image) ?
                                row.original.image.map((img, index) => {
                                    <>
                                        <ImageComponent className="w-16 h-16 rounded-full box-content" src={`${img}`} />
                                    </>
                                }) : <ImageComponent className="w-16 h-16 rounded-full box-content" src={`${value}`} />}

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
            Cell: ({ value, row }) => {
                return row ? (
                    <>
                        <div
                            className="w-full flex justify-start items-center group"
                            style={{ width: "200px" }}
                        >
                            <div className="">
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
            accessor: "estimatedCost",
            column_name: "estimatedCost",
            Cell: ({ value }) => {
                if (!value) {
                    return "";
                } else {
                    return CurrencySymbolByCode.USD + parseFloat(value).toFixed(2);
                }
            },
        },
    ]
    const [loading, setLoading] = useState(false);
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
        setLoading(true);
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
                setLoading(false);
            });

    }, [filteringOptions, bundlePaginationData.pageSize, sortingOptions, bundlePaginationData.pageIndex]);

    return (
        <>
            <div className="px-6 py-12 border-b-4 border-neutral-200 last:border-b-0">
                <div className="flex items-center justify-between">
                    <div
                        className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2"
                    >
                        {tab.label}
                    </div>
                    <div className="">
                        <span
                            className="text-indigo-500 cursor-pointer"
                            onClick={() => {
                                setActiveTab(index);
                            }}
                        >
                            Edit
                        </span>
                    </div>
                </div>
                <div className="">
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
                        loading={loading}
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
