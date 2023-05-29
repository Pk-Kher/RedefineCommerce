/*Component Name: Product
Component Functional Details: User can create or update Product master details from here.
Created By: Shrey Patel
Created Date: Currunt Date
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useState, useCallback, useEffect } from 'react';
import { paginationDetails, RecStatusValuebyName, defaultImage } from 'global/Enum';
import ReactTableServerSide from 'components/common/table/ReactTableServerSide';
import Image from "components/common/formComponent/Image";
// import { useParams } from 'react-router-dom';
// import ProductService from 'services/admin/masterCatalog/masterCatalog/products/ProductService';
import BundleProductsService from 'services/admin/masterCatalog/store/bundle/BundleProductsService';
import Status from 'components/common/displayStatus/Status';
import { useDispatch, useSelector } from "react-redux";
import { serverError } from "services/common/helper/Helper";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
// import DropdownService from 'services/common/dropdown/DropdownService';
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import { ValidationMsgs } from "global/ValidationMessages";
// import CheckBox from 'components/common/table/CheckBox';
import InputNumber from 'components/common/formComponent/InputNumber';
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";


const Product = ({ productId, values, getBundleProductData, BundleData }) => {
    const dispatch = useDispatch();
    const [Product, setProduct] = useState([]);
    // const [BundleData, setBundleData] = useState([]);
    const [filteringOptions, setColumnFilteringOptions] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [RowVersion, setRowVersion] = useState("");
    const location = useSelector((store) => store?.location);

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

    const COLUMNS1 = [
        {
            id: "image",
            Header: "product Image",
            accessor: "productImage",
            column_name: "image",
            isVisible: false,
            disableShowHide: true,
            disableSortBy: true,
            Cell: ({ value, row }) => {
                return value ? (
                    <>
                        <div className={`flex -space-x-9 items-center`} style={{ width: "120px" }}>
                            <div className="h-14 w-14 flex items-center justify-center overflow-hidden box-content rounded-full border bg-white">
                                <Image src={value} containerheight={""} className="max-h-full" />
                            </div>
                        </div>
                    </>
                ) : (
                    <div
                        className="h-14 w-14 flex items-center justify-center overflow-hidden box-content rounded-full border bg-white">
                        <Image src={defaultImage} containerheight={""} className="max-h-full" />
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
                            <div >
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
            id: "quantity",
            Header: "Qty",
            accessor: "quantity",
            column_name: "quantity",
            disableSortBy: true,
            Cell: ({ value, row }) => {
                return value ? (
                    <>
                        <div style={{ width: "120px" }}>
                            <InputNumber id={row.original.id} qtyValueCheck={value} className="rounded-lg" name={`${row.index}quantity`} value={value} onBlur={(e) => submitHandler(e)} />
                        </div>
                    </>
                ) : ""
            },
        },
        {
            id: "attribute",
            Header: "Attribute",
            accessor: "color",
            column_name: "attribute",
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
            id: "salePrice",
            Header: "Sale Price",
            accessor: "salePrice",
            column_name: "salePrice",
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
            id: "msrp",
            Header: "MSRP",
            accessor: "msrp",
            column_name: "msrp",
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
            id: "status",
            Header: "Status",
            accessor: "recStatus",
            column_name: "recStatus",
            disableSortBy: true,
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

    const submitHandler = (e) => {
        dispatch(setAddLoading(true))

        const QuantityId = e.target.id;
        const Obj = [
            {
                path: "/quantity",
                op: "Replace",
                from: "string",
                value: e.target.value,
            }
        ]
        if (e?.target?.value > 0 && e?.target?.value !== e.target.getAttribute("qtyValueCheck")) {
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
            if (e?.target?.value !== e.target.getAttribute("qtyValueCheck")) {
                dispatch(
                    setAlertMessage({
                        type: "danger",
                        message: ValidationMsgs.product.updatedEmpty,
                    })
                )
            } else {
                dispatch(
                    setAlertMessage({
                        type: "danger",
                        message: ValidationMsgs.product.valueNotUpdated,
                    })
                );
            }
        }
        dispatch(setAddLoading(false))
    };

    const handleDelete = () => {
        dispatch(setAddLoading(true))

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
                    dispatch(setAddLoading(false))

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
                dispatch(setAddLoading(false))
            });
        setOpenDeleteModal(false);
    };

    return (
        <>
            {/* <div className={`mt-5 max-h-[42em] ${filteringOptions?.length > 0 ? "overflow-auto" : "overflow-ellipsis"}`}>
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
                    // column filters
                    // editColumnFilter={true}
                    filteringOptions={filteringOptions}
                    setColumnFilteringOptions={setColumnFilteringOptions}
                    setSelectedRows={setSelectedRows}
                    selectedRows={selectedRows}
                    expandedRows={true}
                    hiddenColumns={['rowSelection']}
                    tablePadding={'px-4 pb-4'}
                    displaySearch={'right'}
                    checkBoxFilterOptions={[
                        {
                            columnName: "brandId",
                            name: "Select Brand",
                            options: brand,
                            icon: 'filter_alt',
                            search: true,
                        },
                    ]}
                />
            </div>
            {filteringOptions?.length > 0 &&
                <div className="w-full ml-5 mt-3">
                    <button
                        disabled={GlobalLoading}
                        type="button" onClick={addProductToBundle} className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(GlobalLoading) ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}>
                        <div className={`w-full flex justify-center align-middle `}>
                            {GlobalLoading && (
                                <span className="spinner-border spinner-border-sm mr-2"></span>
                            )}
                            Add Selected Product in Bundle
                        </div>
                    </button>
                </div>
            } */}

            <div className="mt-2 max-h-[46em] overflow-x-auto">
                <ReactTableServerSide
                    COLUMNS={COLUMNS1}
                    DATA={BundleData}
                    {...paginationData}
                    setTablePageSize={(value) =>
                        setPaginationDataFunc("pageSize", value)
                    }
                    fetchData={getBundleProductData}
                    sortingOptions={sortingOptions}
                    setSortingOptions={setSortingOptionHandler}
                    // column filters
                    // editColumnFilter={true}
                    // filteringOptions={filteringOptions}
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
