/*Component Name: List
Component Functional Details:  List .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: Shrey Patel
Modified Date: 09-13-2022 */

import React, { useCallback, useMemo, useState } from "react";
import ReactTable from 'components/common/table/ReactTableServerSide';
import { NavLink, useParams } from "react-router-dom";
import BundleService from "services/admin/bundle/BundleService";
import Actions from "components/common/others/admin/Action";
import { useDispatch, useSelector } from "react-redux";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import ViewHistory from "components/common/modals/ViewHistory";
import BasicModal from "components/common/modals/Basic";
import Status from 'components/common/displayStatus/Status';
import { PageName, paginationDetails, defaultImage, CurrencySymbolByCode } from 'global/Enum'
import { ValidationMsgs } from "global/ValidationMessages";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import Image from "components/common/formComponent/Image";
import { DateTimeFormat, serverError } from 'services/common/helper/Helper';
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { productType } from "dummy/Dummy";
import MasterCatalogCommonService from "services/admin/masterCatalog/MasterCatalogCommonService";

const List = () => {
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [bundle, setBundle] = useState(null);
    const [ModelInfo, setModalInfo] = useState({});
    const [openBasicModal, setOpenBasicModal] = useState(false);
    const [viewHistoryModal, setViewHistoryModal] = useState(false);
    const location = useSelector((store) => store?.location);
    const dispatch = useDispatch();
    const { storeId, storeName, storeType } = useParams();
    const COLUMNS = [
        {
            id: "images",
            Header: "Images",
            accessor: "productImage",
            column_name: "images",
            isVisible: false,
            disableShowHide: true,
            disableSortBy: true,
            Cell: ({ value, row }) => {
                return value && value.length > 0 ? (
                    <>
                        <div className={`flex -space-x-9 items-center`} style={{ width: "160px" }}>
                            {
                                Array.isArray(value) ? value.map((ProductMainImg, index) => {
                                    return (
                                        <NavLink to={`/admin/MasterCatalog/${storeType}/${storeName}/${storeId}/products/bundle/edit/${row.original.id}`}>
                                            <div className="h-14 w-14 flex items-center justify-center overflow-hidden  box-content rounded-full border bg-white">
                                                <Image src={ProductMainImg} containerheight={""} className="max-h-full" />
                                            </div>
                                        </NavLink>
                                    )
                                })
                                    :
                                    <>
                                        <NavLink to={`/admin/MasterCatalog/${storeType}/${storeName}/${storeId}/products/bundle/edit/${row.original.bundleProductId}`}>
                                            <div className="h-14 w-14 flex items-center justify-center overflow-hidden  box-content rounded-full border bg-white">
                                                <Image src={value} containerheight={""} className="max-h-full" />
                                            </div>
                                        </NavLink>
                                    </>
                            }
                            {/* {(row.original.subRows !== undefined && row.original.subRows.length !== 0) &&
                                <span className="w-14 h-14 rounded-full box-content bg-neutral-200 inline-flex items-center justify-center">+{row?.original?.subRows?.length}</span>
                            } */}
                        </div>
                    </>
                ) : (
                    <>
                        <NavLink to={`/admin/MasterCatalog/${storeType}/${storeName}/${storeId}/products/bundle/edit/${row.original.id}`}>
                            <div className="h-14 w-14 flex items-center justify-center overflow-hidden  box-content rounded-full border bg-white">
                                <Image src={defaultImage} containerheight={""} className="max-h-full" />
                            </div>
                        </NavLink>
                        {/* {(row.original.subRows !== undefined && row.original.subRows.length !== 0) &&
                            <div>
                                <span className="w-14 h-14 rounded-full box-content bg-neutral-200 inline-flex items-center justify-center">+{row?.original?.subRows?.length}</span>
                            </div>
                        } */}
                    </>
                );
            },
        },
        {
            id: "name",
            Header: "Name",
            accessor: "name",
            column_name: "name",
            isVisible: false,
            disableShowHide: true,
            Cell: ({ value, row }) => {
                return row ? (
                    <>
                        <div
                            className="w-full flex justify-start items-center group"
                            style={{ width: "200px" }}
                        >
                            <div >
                                {row.id.includes(".") ?
                                    <NavLink
                                        to={
                                            `/admin/MasterCatalog/${storeType}/${storeName}/${storeId}/products/bundle/edit/${row?.original.bundleProductId}`
                                        }
                                    >
                                        <div className="font-semibold">
                                            {value ? value : ""}
                                        </div>
                                    </NavLink>
                                    :
                                    <NavLink
                                        to={
                                            `/admin/MasterCatalog/${storeType}/${storeName}/${storeId}/products/bundle/edit/${row.original.id}`
                                        }
                                    >
                                        <div className="font-semibold">
                                            {value ? value : ""}
                                        </div>
                                    </NavLink>
                                }
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
            Header: "SKU",
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
            id: "recStatus",
            Header: "status",
            accessor: "recStatus",
            column_name: "recStatus",
            Cell: ({ value }) => {
                return <Status type={value} />
            },
        },
        {
            id: "upc",
            Header: "UPC",
            accessor: "upc",
            column_name: "upc",
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
        // {
        //     id: "Eastimated Cost",
        //     Header: "Eastimated Cost",
        //     accessor: "Eastimated Cost",
        //     column_name: "Eastimated Cost",
        //     Cell: ({ value }) => {
        //         if (!value) {
        //             return "";
        //         } else {
        //             return value;
        //         }
        //     },
        // },
        // {
        //     id: "defaultListPrice",
        //     Header: "DefaultList Price",
        //     accessor: "defaultListPrice",
        //     column_name: "defaultListPrice",
        //     Cell: ({ value }) => {
        //         if (!value) {
        //             return "";
        //         } else {
        //             return value;
        //         }
        //     },
        // },
        {
            id: "ourCost",
            Header: "our Cost",
            accessor: "ourCost",
            column_name: "cost",
            Cell: ({ value }) => {
                return (value ? CurrencySymbolByCode.USD + parseFloat(value).toFixed(2) : "")
            },
        },
        {
            id: "msrp",
            Header: "MSRP",
            accessor: "msrp",
            column_name: "msrp",
            Cell: ({ value }) => {
                return (value ? CurrencySymbolByCode.USD + parseFloat(value).toFixed(2) : "");
            },
        },
        {
            id: "imap",
            Header: "IMAP",
            accessor: "imap",
            column_name: "imap",
            Cell: ({ value }) => {
                return value ? CurrencySymbolByCode.USD + parseFloat(value).toFixed(2) : "";
            },
        },
        {
            id: "salePrice",
            Header: "Sale Price",
            accessor: "salePrice",
            column_name: "salePrice",
            Cell: ({ value }) => {
                return value ? CurrencySymbolByCode.USD + parseFloat(value).toFixed(2) : "";
            },
        },
        {
            id: "category",
            Header: "Category",
            accessor: "category",
            column_name: "category",
            Cell: ({ value }) => {
                if (!value) {
                    return "";
                } else {
                    return value;
                }
            },
        },
        {
            id: "createddate",
            Header: "Created Date",
            accessor: "createdDate",
            column_name: "createdDate",
            Cell: ({ value }) => {
                if (!value) {
                    return "";
                } else {
                    return (
                        <>
                            <div >{DateTimeFormat(value).date} </div>
                            <div className="text-[#707070] text-xs font-normal">
                                {DateTimeFormat(value).time}
                            </div>
                        </>
                    );;
                }
            },
        },
        {
            id: "UpdatedDate",
            Header: "Updated Date",
            accessor: "modifiedDate",
            column_name: "UpdatedDate",
            Cell: ({ value }) => {
                if (!value) {
                    return "";
                } else {
                    return (
                        <>
                            <div >{DateTimeFormat(value).date} </div>
                            <div className="text-[#707070] text-xs font-normal">
                                {DateTimeFormat(value).time}
                            </div>
                        </>
                    );
                }
            },
        },
        {
            id: "action",
            Header: "",
            accessor: "id",
            column_name: "action",
            Cell: ({ value, row }) => {
                return !row.original.sale_price ? (
                    <>
                        <Actions
                            row={row}
                            openDeleteModal={openDeleteModal}
                            setOpenDeleteModal={setOpenDeleteModal}
                            setDeleteData={setBundle}
                            setModalInfo={setBundle}
                            setOpenBasicModal={setOpenBasicModal}
                            editUrl={`/admin/MasterCatalog/eCommerceStore/corporateGear/bundle/edit/${row.original.id}`}
                            moduleName={'Bundle'}
                            setViewHistoryModal={setViewHistoryModal}
                            setRecordId={setBundle}
                        />
                    </>
                ) : (
                    ""
                );
            },
            disableSortBy: true,
        },
    ];
    const [Data, setData] = useState([]);
    const [paginationData, setPaginationData] = useState({ ...paginationDetails });
    const [sortingOptions, setSortingOptions] = useState([
        {
            field: "firstname",
            direction: 0,
            priority: 0,
        },
    ]);
    const setPaginationDataFunc = (key, value) => {
        setPaginationData((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };
    const [selectedRows, setSelectedRows] = useState([]);
    const [filteringOptions, setColumnFilteringOptions] = useState([]);
    const getBundleData = useCallback(
        (pageIndex = 1) => {
            dispatch(setAddLoading(true))

            BundleService.getBundles({
                args: {
                    pageSize: paginationData.pageSize,
                    pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
                    sortingOptions,
                    filteringOptions,
                },
                storeId: storeId,
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
        [filteringOptions, paginationData.pageSize, sortingOptions]
    );
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

    const statusChangedHandler = (data) => {
        dispatch(setAddLoading(true))
        if (data?.changeStatus == 'A' && data?.id) {
            MasterCatalogCommonService.validateProduct(data?.id, productType.Bundle)
                .then((response) => {
                    if (response?.data?.data?.length > 0 && response?.data?.otherData) {
                        dispatch(setAlertMessage({
                            type: 'danger',
                            message: serverError({ data: { errors: response?.data?.otherData } })
                        }))
                    } else {
                        ChangeBundleStatus(data);
                    }
                    dispatch(setAddLoading(false));
                }).catch((error) => {
                    dispatch(setAddLoading(false));
                });
        } else {
            ChangeBundleStatus(data);
        }
        setOpenBasicModal(false);
    };

    const ChangeBundleStatus = (data) => {
        var statusNotUpdated = data?.changeStatus === 'R' ? ValidationMsgs.bundle.notDelete : ValidationMsgs.bundle.statusNotUpdated
        BundleService.updateStatus(
            {
                args: {
                    id: data.id,
                    rowVersion: data.rowVersion,
                    status: data.changeStatus,
                    ...location
                }
            }
        ).then((response) => {
            if (response.data.data) {
                dispatch(
                    setAlertMessage({
                        view: true,
                        type: "success",
                        message: data?.changeStatus === 'R' ? ValidationMsgs.bundle.delete : ValidationMsgs.bundle.statusUpdated,
                    })
                );
                getBundleData();
            } else {
                dispatch(
                    setAlertMessage({
                        view: true,
                        type: "danger",
                        message: statusNotUpdated,
                    })
                );
            }
        }).catch((errors) => {
            if (errors.response.data.errors) {
                dispatch(
                    setAlertMessage({
                        message: errors.response.data.Errors.Error,
                        type: "danger",
                    })
                );
            } else {
                dispatch(
                    setAlertMessage({ message: statusNotUpdated, type: "danger" })
                );
            }
        });
        setOpenBasicModal(false);
    };
    return (
        <>
            <ReactTable
                COLUMNS={COLUMNS}
                DATA={Data}
                {...paginationData}
                setTablePageSize={(value) =>
                    setPaginationDataFunc("pageSize", value)
                }
                fetchData={getBundleData}
                sortingOptions={sortingOptions}
                setSortingOptions={setSortingOptionHandler}
                handleSort={handleSort}
                // column filters
                filteringOptions={filteringOptions}
                setColumnFilteringOptions={setColumnFilteringOptions}
                editColumnFilter={false}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                expandedRows={useMemo(() => true, [])}

            />
            <ConfirmDelete
                handleDelete={statusChangedHandler}
                data={bundle}
                message={ValidationMsgs.bundle.deletePermanently}
                openDeleteModal={openDeleteModal}
                setOpenDeleteModal={setOpenDeleteModal}
                {...ModelInfo}
                title={"Delete"}
            />
            <BasicModal
                handleConfirmation={statusChangedHandler}
                openModal={openBasicModal}
                setOpenModal={setOpenBasicModal}
                {...bundle}
            />
            {
                viewHistoryModal && (
                    <ViewHistory
                        title={"View History"}
                        openModal={viewHistoryModal}
                        setOpenModal={setViewHistoryModal}
                        rowId={bundle}
                        pageName={PageName.Bundle}
                    />
                )
            }
        </>
    );
};

export default List;

