/*Component Name: Product
Component Functional Details: User can create or update Product master details from here.
Created By: Ankit Sharma
Created Date: 11/16/2022
Modified By: chandan
Modified Date: 11/16/2022 */

import React, { useState, useCallback, useEffect } from 'react';
import { paginationDetails, RecStatusValuebyName, defaultImage, CurrencySymbolByCode } from 'global/Enum';
import ReactTableServerSide from 'components/common/table/ReactTableServerSide';
import Image from "components/common/formComponent/Image";
import { Link } from 'react-router-dom';
import ProductService from 'services/admin/masterCatalog/masterCatalog/products/ProductService';
import BundleProductsService from 'services/admin/masterCatalog/store/bundle/BundleProductsService';
import Status from 'components/common/displayStatus/Status';
import { useDispatch, useSelector } from "react-redux";
import { serverError } from "services/common/helper/Helper";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import DropdownService from 'services/common/dropdown/DropdownService';
import Messages from "components/common/alerts/messages/Index";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import { ValidationMsgs } from "global/ValidationMessages";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";


const Product = ({ productId, values }) => {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [brand, setBrand] = useState([]);
    const [Product, setProduct] = useState([]);
    const [MasterData, setMasterData] = useState([]);
    const [BundleData, setBundleData] = useState([]);
    const [filteringOptions, setColumnFilteringOptions] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [RowVersion, setRowVersion] = useState("");
    const location = useSelector((store) => store?.location);
    const [Quantity, setQuantity] = useState("");
    const [saveLoading, setSaveLoading] = useState(false);

    const COLUMNS = [
        {
            id: "id",
            Header: "id",
            accessor: "id",
            column_name: "id",
        },
        {
            id: "image",
            Header: "product Image",
            accessor: "productImage",
            column_name: "image",
            isVisible: false,
            disableShowHide: true,
            Cell: ({ value, row }) => {

                return value && value.length > 0 ? (
                    <>
                        <div className="flex -space-x-9 items-center" style={{ width: "100px" }}>
                            {
                                Array.isArray(value) ? value.map((ProductMainImg, index) => {
                                    return (
                                        <img className="w-14 h-14 rounded-full box-content" src={`${process.env.REACT_APP_API_BLOB}${ProductMainImg}`} alt="" />
                                    )
                                }) : <>
                                    <img className="w-14 h-14 rounded-full box-content" src={`${process.env.REACT_APP_API_BLOB}${value}`} alt="" />
                                </>
                            }
                            {(row.original.subRows !== undefined && row.original.subRows.length !== 0) &&
                                <span className="w-14 h-14 rounded-full box-content bg-neutral-200 inline-flex items-center justify-center">+{row?.original?.subRows?.length}</span>
                            }
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex -space-x-9 items-center relative">
                            <Image src={defaultImage} className="w-14 h-14 rounded-full inline-flex text-center items-center justify-center" />
                        </div>
                    </>
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
                                {value}
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
            id: "salePrice",
            Header: "Customer Price",
            accessor: "salePrice",
            column_name: "salePrice",
            Cell: ({ value }) => {
                if (!value) {
                    return "";
                } else {
                    return CurrencySymbolByCode.USD + parseFloat(value).toFixed(2);
                }
            },
        },
    ]

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
    const setProductPaginationDataFunc = (key, value) => {
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

    const getBundleProductData = useCallback((pageIndex) => {
        setLoading(true);
        BundleProductsService.getBundleProducts(productId)
            .then((response) => {
                const BundleProductResponse = response.data.data;
                setBundleData(BundleProductResponse.lstBundleXProducts);
                setBundlePaginationData((prevState) => ({
                    ...prevState,
                    pageIndex: BundleProductResponse?.pageIndex,
                    pageSize: BundleProductResponse?.pageSize,
                    totalCount: BundleProductResponse?.totalCount,
                    totalPages: BundleProductResponse?.totalPages,
                    hasPreviousPage: BundleProductResponse?.hasPreviousPage,
                    hasNextPage: BundleProductResponse?.hasNextPage,
                }));
                setLoading(false);
            });

    }, [filteringOptions, bundlePaginationData.pageSize, sortingOptions, bundlePaginationData.pageIndex]);

    const getProductData = useCallback((pageIndex) => {
        setLoading(true);
        ProductService.getMasterProducts({
            args: {
                pageSize: paginationData.pageSize,
                pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
                sortingOptions,
                filteringOptions,
            },
            storeId: 1
        }).then((response) => {
            const productResponse = response.data.data;
            setMasterData(productResponse.items);
            setPaginationData((prevState) => ({
                ...prevState,
                pageIndex: productResponse?.pageIndex,
                pageSize: productResponse?.pageSize,
                totalCount: productResponse?.totalCount,
                totalPages: productResponse?.totalPages,
                hasPreviousPage: productResponse?.hasPreviousPage,
                hasNextPage: productResponse?.hasNextPage,
            }));
            setLoading(false);
        });

    }, [filteringOptions, paginationData.pageSize, sortingOptions]);

    const submitHandler = (row, e) => {
        dispatch(setAddLoading(true))
        setQuantity(e?.target?.value);
        const QuantityId = row?.original?.id;
        const Obj = [
            {
                path: "/quantity",
                op: "Replace",
                from: "string",
                value: e.target.value,
            }
        ]
        if (Quantity > 0) {
            BundleProductsService.updateProductQuantity(QuantityId, Obj).then((response) => {
                if (response?.data?.success) {
                    dispatch(
                        setAlertMessage({
                            type: "success",
                            message: ValidationMsgs.product.Updated,
                        })
                    );
                    dispatch(setAddLoading(false))
                    getBundleProductData();
                } else {
                    dispatch(
                        setAlertMessage({ type: "danger", message: serverError(response) })
                    );
                    dispatch(setAddLoading(false))
                }
            }).catch((errors) => {
                dispatch(
                    setAlertMessage({
                        type: "danger",
                        message: ValidationMsgs.product.notUpdated,
                    })
                );
                dispatch(setAddLoading(false))
            });
        }
        else {
            dispatch(
                setAlertMessage({
                    type: "danger",
                    message: ValidationMsgs.product.updatedEmpty,
                })
            );
            dispatch(setAddLoading(false))
        }
    };

    const COLUMNS1 = [
        {
            id: "image",
            Header: "product Image",
            accessor: "productImage",
            column_name: "image",
            isVisible: false,
            disableShowHide: true,
            Cell: ({ value, row }) => {
                return value ? (
                    <>
                        <div className="flex -space-x-9 items-center relative" style={{ width: "100px" }}>
                            <img className="w-14 h-14 rounded-full box-content" src={`${process.env.REACT_APP_API_BLOB}${value}`} alt="" />
                            {(row.original.subRows !== undefined && row.original.subRows.length !== 0) &&
                                <span className="w-14 h-14 rounded-full box-content bg-neutral-200 inline-flex items-center justify-center">+{row.original.subRows.length}</span>
                            }
                        </div>
                    </>
                ) : (
                    <div className="flex -space-x-9 items-center relative">
                        <Image src={defaultImage} className="w-14 h-14 rounded-full inline-flex text-center items-center justify-center" />
                    </div>
                );
            },
        },
        {
            id: "name",
            Header: "Name",
            accessor: "name",
            column_name: "name",
            Cell: ({ value, row }) => {
                return row ? (
                    <>
                        <div className="w-full flex justify-start items-center group"
                            style={{ width: "200px" }}>
                            <div className="">
                                <Link to={`/admin/MasterCatalog/products/edit/${row.original.id}`}></Link>
                            </div>
                        </div>
                    </>
                ) : (
                    ""
                );
            },
        },
        {
            id: "quantity",
            Header: "Qty",
            accessor: "quantity",
            column_name: "quantity",
            Cell: ({ value, row }) => {
                if (!value) {
                    return "";
                } else {
                    return <input id="quantity" className="rounded-lg" maxLength={4} type={"number"} name={`${row.index}quantity`} defaultValue={value} onBlur={(e) => submitHandler(row, e)} />
                }
            },
        },
        {
            id: "attribute",
            Header: "Attribute",
            accessor: "color",
            column_name: "attribute",
            Cell: ({ value }) => {
                if (!value) {
                    return "";
                } else {
                    return value;
                }
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
            id: "salePrice",
            Header: "Sale Price",
            accessor: "salePrice",
            column_name: "salePrice",
            Cell: ({ value }) => {
                if (!value) {
                    return "";
                } else {
                    return CurrencySymbolByCode.USD + parseFloat(value).toFixed(2);
                }
            },
        },
        {
            id: "msrp",
            Header: "MSRP",
            accessor: "msrp",
            column_name: "msrp",
            Cell: ({ value }) => {
                if (!value) {
                    return "";
                } else {
                    return CurrencySymbolByCode.USD + parseFloat(value).toFixed(2);
                }
            },
        },
        {
            id: "status",
            Header: "Status",
            accessor: "recStatus",
            column_name: "recStatus",
            Cell: ({ value }) => {
                return <Status type={value} />;
            },
        },
        {
            id: "action",
            Header: "Action",
            accessor: "id",
            column_name: "action",
            Cell: ({ value, row }) => {
                return (
                    <button
                        type="button"
                        className="text-rose-500 text-2xl font-semibold material-icons-outlined ml-4"
                        onClick={() => {
                            setProduct(value);
                            setRowVersion(row?.original?.rowVersion);
                            setOpenDeleteModal(true);
                        }}
                    >
                        <span className="material-icons-outlined">
                            close
                        </span>
                    </button>
                );
            },
            disableSortBy: true,
            disableShowHide: true,
        },
    ];

    useEffect(() => {
        DropdownService.getDropdownValues('brand').then((res) => {
            if (res.data.success) {
                setBrand(() => {
                    return res.data.data;
                });
            }
        }).catch(error => { })
    }, []);

    const addProductToBundle = (fields, resetForm) => {
        dispatch(setAddLoading(true))
        const selectedRowsData = selectedRows;
        const { browser, ...rest } = location;
        BundleProductsService.createProduct({
            bundleProductXModel: {
                bundleProductId: productId,
                bundleProductXModelLists: selectedRowsData.map((bundleProduct, index) => {
                    if (bundleProduct.original.productId == undefined) {
                        bundleProduct.original.productId = bundleProduct.original.id;
                    }
                    return {
                        id: 0,
                        masterProductId: bundleProduct.original.productId,
                        masterProductAttributeCombinationId: bundleProduct.original.id,
                        quantity: 1,
                        status: RecStatusValuebyName.Active,
                    }
                }),
                ...rest,
            }
        }).then((response) => {
            if (response?.data?.success) {
                dispatch(
                    setAlertMessage({
                        type: "success",
                        message: ValidationMsgs.product.bundleAdded,
                    })
                );
                dispatch(setAddLoading(false))
                getBundleProductData();
            } else {
                dispatch(
                    setAlertMessage({ type: "danger", message: serverError(response) })
                );
                dispatch(setAddLoading(false))
            }
        }).catch((errors) => {
            dispatch(
                setAlertMessage({
                    type: "danger",
                    message: ValidationMsgs.product.bundleNotAdded,
                })
            );
            dispatch(setAddLoading(false))
        });

    }

    const handleDelete = () => {
        const BundleNotDelete = "Bundle Product is not deleted.";
        BundleProductsService.updateStatus({
            args: {
                id: Product,
                rowVersion: RowVersion,
                status: RecStatusValuebyName.Archived,
                ...location
            }
        })
            .then((response) => {
                if (response.data.data) {
                    dispatch(
                        setAlertMessage({
                            view: true,
                            type: "success",
                            message: "Bundle Product deleted successfully.",
                        })
                    );
                    getBundleProductData();
                } else {
                    dispatch(
                        setAlertMessage({
                            view: true,
                            type: "danger",
                            message: BundleNotDelete,
                        })
                    );
                }
            })
            .catch((errors) => {
                if (errors.response.data.Errors.Error) {
                    dispatch(
                        setAlertMessage({
                            message: errors.response.data.Errors.Error,
                            type: "danger",
                        })
                    );
                } else {
                    dispatch(
                        setAlertMessage({ message: BundleNotDelete, type: "danger" })
                    );
                }
            });
        setOpenDeleteModal(false);
    };

    return (
        <>
            <div className="mt-5">
                <ReactTableServerSide
                    COLUMNS={COLUMNS}
                    DATA={MasterData}
                    {...paginationData}
                    setTablePageSize={(value) =>
                        setProductPaginationDataFunc("pageSize", value)
                    }
                    fetchData={getProductData}
                    sortingOptions={sortingOptions}
                    setSortingOptions={setSortingOptionHandler}
                    loading={loading}
                    // column filters
                    // editColumnFilter={true}
                    filteringOptions={filteringOptions}
                    setColumnFilteringOptions={setColumnFilteringOptions}
                    setSelectedRows={setSelectedRows}
                    selectedRows={selectedRows}
                    expandedRows={true}
                    tablePadding={'px-4 pb-4'}
                    displaySearch={'right'}
                    checkBoxFilterOptions={[
                        {
                            columnName: "brandId",
                            name: "Select Brand",
                            options: brand,
                            icon: 'filter_alt',
                        },
                    ]}

                />
            </div>

            <div className="w-full ml-5">
                <button type="button" onClick={addProductToBundle} className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(saveLoading) ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}>
                    <div className={`w-full flex justify-center align-middle `}>
                        {saveLoading && (
                            <span className="spinner-border spinner-border-sm mr-2"></span>
                        )}
                        Add Selected Product in Bundle
                    </div>
                </button>
            </div>

            <Messages />

            <div className="mt-2">
                <ReactTableServerSide
                    COLUMNS={COLUMNS1}
                    DATA={BundleData}
                    {...bundlePaginationData}
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
            <ConfirmDelete
                handleDelete={handleDelete}
                data={Product}
                message={ValidationMsgs.product.deletePermanently}
                title={"Delete"}
                openDeleteModal={openDeleteModal}
                setOpenDeleteModal={setOpenDeleteModal}
            />
        </>
    );
};
export default Product;
