/*Component Name: Product
Component Functional Details: User can create or update Product master details from here.
Created By: Shrey Patel
Created Date: Currunt Date
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useState, useCallback, useEffect } from "react";
import {
    paginationDetails,
    RecStatusValuebyName,
    defaultImage,
} from "global/Enum";
import ReactTableServerSide from "components/common/table/ReactTableServerSide";
import Image from "components/common/formComponent/Image";
import { useParams } from "react-router-dom";
import ProductService from "services/admin/masterCatalog/masterCatalog/products/ProductService";
import BundleProductsService from "services/admin/masterCatalog/store/bundle/BundleProductsService";
import Status from "components/common/displayStatus/Status";
import { useDispatch, useSelector } from "react-redux";
import { serverError } from "services/common/helper/Helper";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import DropdownService from "services/common/dropdown/DropdownService";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import { ValidationMsgs } from "global/ValidationMessages";
import CheckBox from "components/common/table/CheckBox";
import InputNumber from "components/common/formComponent/InputNumber";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import Products from "components/admin/masterCatalog/common/product/create/forms/products/Products";

const Product = ({ productId, values }) => {
    const dispatch = useDispatch();
    const [brand, setBrand] = useState([]);
    const [Product, setProduct] = useState([]);
    const [MasterData, setMasterData] = useState([]);
    const [BundleData, setBundleData] = useState([]);
    const [filteringOptions, setColumnFilteringOptions] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [RowVersion, setRowVersion] = useState("");
    const location = useSelector((store) => store?.location);
    const { storeId } = useParams();
    const GlobalLoading = useSelector(
        (store) => store?.GlobalLoaderReducer?.toLoad
    );

    const COLUMNS = [
        {
            id: "id",
            Header: () => {
                return "";
            },
            accessor: "id",
            column_name: "id",
            disableSortBy: true,
            Cell: ({ value, row }) => {
                if (!row?.original?.subRows || row?.original?.subRows?.length === 0) {
                    return <CheckBox {...row.getToggleRowSelectedProps()} />;
                } else {
                    return "";
                }
            },
        },
        {
            id: "image",
            Header: "product Image",
            accessor: "productImage",
            column_name: "image",
            isVisible: false,
            disableShowHide: true,
            Cell: ({ value, row }) => {
                return value && value?.length > 0 ? (
                    <>
                        <div className={`flex -space-x-9 items-center`} style={{ width: "160px" }}>
                            {Array.isArray(value) ? (
                                value.map((ProductMainImg, index) => {
                                    return (
                                        <div className="h-14 w-14 flex items-center justify-center overflow-hidden box-content rounded-full border bg-white">

                                            <Image
                                                src={ProductMainImg}
                                                containerheight={""}
                                                className="max-h-full"
                                            />
                                        </div>
                                    );
                                })
                            ) : (
                                <>
                                    <div className="h-14 w-14 flex items-center justify-center overflow-hidden box-content rounded-full border bg-white">
                                        <Image
                                            src={value}
                                            containerheight={""}
                                            className="max-h-full"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="h-14 w-14 flex items-center justify-center overflow-hidden box-content rounded-full border bg-white">
                            <Image
                                src={defaultImage}
                                containerheight={""}
                                className="max-h-full"
                            />
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
                            <div>{value}</div>
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
                    return value;
                }
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

    const getBundleProductData = useCallback(
        (pageIndex) => {
            dispatch(setAddLoading(true));

            BundleProductsService.getBundleProducts(productId).then((response) => {
                const BundleProductResponse = response.data.data;
                setBundleData(BundleProductResponse.lstBundleXProducts);
                dispatch(setAddLoading(false));
            });
        },
        [productId]
    );

    const getProductData = useCallback(
        (pageIndex) => {
            if (filteringOptions?.length > 0) {
                dispatch(setAddLoading(true));

                ProductService.getMasterProducts({
                    args: {
                        pageSize: paginationData.pageSize,
                        pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
                        sortingOptions,
                        filteringOptions,
                    },
                    storeId: storeId,
                })
                    .then((response) => {
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
                        dispatch(setAddLoading(false));
                    })
                    .catch(() => {
                        dispatch(setAddLoading(false));
                    });
            } else {
                setMasterData([]);
                setPaginationData({});
                dispatch(setAddLoading(false));
            }
        },
        [
            filteringOptions,
            paginationData.pageSize,
            sortingOptions,
            paginationData.pageIndex,
        ]
    );

    useEffect(() => {
        DropdownService.getDropdownValues("brand")
            .then((res) => {
                if (res.data.success) {
                    setBrand(() => {
                        return res.data.data;
                    });
                }
            })
            .catch((error) => { });
    }, []);
    const addProductToBundle = () => {
        dispatch(setAddLoading(true));

        const selectedRowsData = selectedRows;
        const { browser, ...rest } = location;

        let getSelectedProductId = [];

        selectedRowsData.forEach((bundleProduct, index) => {
            if (bundleProduct?.subRows?.length < 1) {
                getSelectedProductId.push({
                    id: 0,
                    masterProductId: bundleProduct.original.productId,
                    masterProductAttributeCombinationId: bundleProduct.original.id,
                    quantity: 1,
                    status: RecStatusValuebyName.Active,
                });
            }
        });

        BundleProductsService.createProduct({
            bundleProductXModel: {
                bundleProductId: productId,
                bundleProductXModelLists: getSelectedProductId,
                ...rest,
            },
        })
            .then((response) => {
                if (response?.data?.success) {
                    dispatch(
                        setAlertMessage({
                            type: "success",
                            message: ValidationMsgs.product.bundleAdded,
                        })
                    );
                    getBundleProductData();
                } else {
                    dispatch(
                        setAlertMessage({ type: "danger", message: serverError(response) })
                    );
                    dispatch(setAddLoading(false));
                }
            })
            .catch((errors) => {
                dispatch(
                    setAlertMessage({
                        type: "danger",
                        message: ValidationMsgs.product.bundleNotAdded,
                    })
                );
                dispatch(setAddLoading(false));
            });
    };

    return (
        <>
            <div
                className={`mt-5 max-h-[42em] ${filteringOptions?.length > 0 ? "overflow-auto" : "overflow-ellipsis"
                    }`}
            >
                <ReactTableServerSide
                    COLUMNS={COLUMNS}
                    DATA={MasterData}
                    {...paginationData}
                    setTablePageSize={(value) => setPaginationDataFunc("pageSize", value)}
                    fetchData={getProductData}
                    sortingOptions={sortingOptions}
                    setSortingOptions={setSortingOptionHandler}
                    // column filters
                    // editColumnFilter={true}
                    filteringOptions={filteringOptions}
                    setColumnFilteringOptions={setColumnFilteringOptions}
                    setSelectedRows={setSelectedRows}
                    selectedRows={selectedRows}
                    expandedRows={true}
                    hiddenColumns={["rowSelection"]}
                    tablePadding={"px-4 pb-4"}
                    displaySearch={"right"}
                    checkBoxFilterOptions={[
                        {
                            columnName: "brandId",
                            name: "Select Brand",
                            options: brand,
                            icon: "filter_alt",
                            search: true,
                        },
                    ]}
                />
            </div>
            {filteringOptions?.length > 0 && (
                <div className="w-full ml-5 mt-3">
                    <button
                        disabled={GlobalLoading}
                        type="button"
                        onClick={addProductToBundle}
                        className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${GlobalLoading
                            ? "bg-indigo-200 hover:bg-indigo-200"
                            : "cursor-pointer"
                            }`}
                    >
                        <div className={`w-full flex justify-center align-middle `}>
                            {GlobalLoading && (
                                <span className="spinner-border spinner-border-sm mr-2"></span>
                            )}
                            Add Selected Product in Bundle
                        </div>
                    </button>
                </div>
            )}

            <div className="mt-2 max-h-[46em] overflow-x-auto">
                <Products
                    productId={productId}
                    getBundleProductData={getBundleProductData}
                    BundleData={BundleData}
                />
            </div>
        </>
    );
};
export default Product;
