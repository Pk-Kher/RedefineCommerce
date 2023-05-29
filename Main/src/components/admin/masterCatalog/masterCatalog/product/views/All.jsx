/*Component Name: All
Component Functional Details: User can create or update All master details from here.
Created By: Happy
Created Date: <Creation Date>
Modified By: chandan
Modified Date: <Modified Date> */

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { PageName, paginationDetails, RecStatusValuebyName, ProductStatusMoreFilterOption, ProductNavStatusValueNameForMoreFilter, ProductIsDiscontinueMoreFilterOption, defaultImage, CurrencySymbolByCode } from "global/Enum";
import ReactTable from 'components/common/table/ReactTableServerSide';
import { MasterProductStatusTabs, productType } from 'dummy/Dummy';
import Status from 'components/common/displayStatus/Status';
import { DateTimeFormat, serverError } from 'services/common/helper/Helper';
import { Link, useLocation } from 'react-router-dom';
import ProductService from 'services/admin/masterCatalog/masterCatalog/products/ProductService';
import Actions from 'components/common/others/admin/Action';
import ConfirmDelete from 'components/common/modals/ConfirmDelete';
import BasicModal from 'components/common/modals/Basic';
import VarientProductModal from 'components/admin/masterCatalog/common/product/create/forms/VarientProductModal';
import { useDispatch, useSelector } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import ViewHistory from 'components/common/modals/ViewHistory';
import CheckBoxAction from './CheckBoxAction';
import ProductCloneModal from 'components/common/modals/ProductCloneModal';
import ProductAttributeCloneModal from 'components/common/modals/ProductAttributeClone';
import CheckBox from 'components/common/table/CheckBox';
import { ValidationMsgs } from "global/ValidationMessages";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import DropdownService from "services/common/dropdown/DropdownService";
import StoreService from 'services/admin/store/StoreService';
import Image from 'components/common/formComponent/Image';
import ValidateServices from 'services/admin/validate/ValidateServices';
import MasterCatalogCommonService from 'services/admin/masterCatalog/MasterCatalogCommonService';

const All = ({ activeTab, selectedData, setSelectedData, setGetDataFunction, tab, moreFilterOptions, openAttributeCloneModal, setOpenAttributeCloneModal }) => {
    const [Product, setProduct] = useState(null);
    const [ProductId, setProductId] = useState(0);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openCloneModal, setOpenCloneModal] = useState(false);
    const user = useSelector((store) => store?.user);
    const company = useSelector((store) => store?.CompanyConfiguration);
    const { pathname } = useLocation();
    const [ModalInfo, setModalInfo] = useState({});
    const [openBasicModal, setOpenBasicModal] = useState(false);
    const [openVarientModal, setOpenVarientModal] = useState({
        name: "",
        ourSku: "",
        toShow: false
    });
    const [viewHistoryModal, setViewHistoryModal] = useState(false);
    const dispatch = useDispatch();
    const location = useSelector((store) => store?.location);
    const [Data, setData] = useState([]);
    const [dataForVarientProducts, setdataForVarientProducts] = useState([]);
    const [RecordId, setRecordId] = useState(null);
    const type = productType.MC
    const [hiddenColumns, setHiddenColumns] = useState([]);
    const [initialColumnFilterOrder, setInitialColumnFilterOrder] = useState([]);
    const [stores, setStores] = useState([]);

    const [filteringOptions, setColumnFilteringOptions] = useState(tab?.filter);
    const [selectedRows, setSelectedRows] = useState([]);
    const [paginationData, setPaginationData] = useState({ ...paginationDetails });
    const [userNameValues, setUserNameValues] = useState([]);

    const setPaginationDataFunc = (key, value) => {
        setPaginationData((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };
    const [sortingOptions, setSortingOptions] = useState([
        {
            field: "name",
            direction: 0,
            priority: 0,
        },
    ]);

    const setSortingOptionHandler = useCallback((column, direction) => {
        setSortingOptions([
            {
                field: column,
                direction: direction,
                priority: 0,
            },
        ]);
    }, [activeTab]);

    const getAllData = useCallback((pageIndex) => {
        dispatch(setAddLoading(true))

        ProductService.getMasterProductsWithoutSubrows({
            args: {
                pageSize: paginationData.pageSize,
                pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
                sortingOptions,
                filteringOptions: [...tab?.filter, ...filteringOptions]
            },
        }).then((response) => {
            const MasterCatalog = response.data.data;
            setData(MasterCatalog?.items);
            setPaginationData((prevState) => ({
                ...prevState,
                pageIndex: MasterCatalog?.pageIndex,
                pageSize: MasterCatalog?.pageSize,
                totalCount: MasterCatalog?.totalCount,
                totalPages: MasterCatalog?.totalPages,
                hasPreviousPage: MasterCatalog?.hasPreviousPage,
                hasNextPage: MasterCatalog?.hasNextPage,
            }));
            dispatch(setAddLoading(false))

        }).catch(() => {
            dispatch(setAddLoading(false))

        })

    }, [filteringOptions, paginationData.pageSize, sortingOptions, paginationData.pageIndex, tab]);

    useEffect(() => {
        setGetDataFunction(() => getAllData);
    }, [activeTab]);

    useEffect(() => {
        let firsLevelRecord = selectedRows.filter((value) => (value.depth === 0 && value.original.recStatus === RecStatusValuebyName.Active) && (!value.original.isDiscontinue) && ((value.original.navSyncStatus === RecStatusValuebyName.NavSync) || MasterProductStatusTabs[activeTab].value === 'NAVSyncPending' || MasterProductStatusTabs[activeTab].value === 'ResyncwithNAV'));
        // setFirstLevelSelectedRows(firsLevelRecord);
        setSelectedData(firsLevelRecord);

        DropdownService.getDropdownValues("adminuser").then((response) => {
            setUserNameValues(response.data.data);
        });

    }, [selectedRows]);
    useEffect(() => {
        if (user?.id && company?.id) {
            StoreService.getStoreByUserId({
                userid: user?.id,
                companyConfigurationId: company?.id,
                isSuperUser: user?.isSuperUser
            }).then((response) => {
                if (response.data.data) {
                    setStores(response.data.data);
                }
            }).catch((error) => { })
        }
    }, [user, company])
    const COLUMNS = [
        {
            id: "id",
            disableShowHide: true,
            Header: ({ getToggleAllRowsSelectedProps }) => {
                return (
                    <div className="flex items-center relative">
                        <span className={`inline-flex leading-none w-4 h-4`}>
                            {!['Active', 'Inactive', 'Draft', 'Discontinued'].includes(MasterProductStatusTabs[activeTab].value) &&
                                <CheckBox {...getToggleAllRowsSelectedProps()} />
                            }
                        </span>
                        <div
                            className={`absolute left-full bg-white input-check min-w-auto pl-1 ${selectedData.length <= 0 && "hidden"
                                }`}
                        >
                            {(MasterProductStatusTabs[activeTab].value !== 'NAVSyncPending' && MasterProductStatusTabs[activeTab].value !== 'ResyncwithNAV') && <CheckBoxAction
                                setOpenDeleteModal={setOpenDeleteModal}
                                setOpenCloneModal={setOpenCloneModal}
                                setOpenAttributeCloneModal={setOpenAttributeCloneModal}
                                selectedFlatRows={selectedData}

                            />}

                        </div>
                    </div>
                );
            },
            accessor: "id",
            column_name: "id",
            disableSortBy: true,
            Cell: ({ value, row }) => {
                if ((row.original.recStatus === RecStatusValuebyName.Active) && (!row.original.isDiscontinue) && ((row.original.navSyncStatus === RecStatusValuebyName.NavSync) || MasterProductStatusTabs[activeTab].value === 'NAVSyncPending' || MasterProductStatusTabs[activeTab].value === 'ResyncwithNAV')) {
                    return (
                        <CheckBox {...row.getToggleRowSelectedProps()} />
                    )
                } else {
                    return '';
                }
            }
        },
        {
            id: "expander",
            accessor: "a",
            Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
                ""
            ),
            Cell: ({ row }) => {
                return <span title="Show Sub Product" className="material-icons-outlined select-none leading-none ml-2 w-6 h-6 cursor-pointer transition-all variant-arrow" onClick={() => {
                    getVarientDataFunc(row?.original)
                }}>
                    add
                </span>
            },
            disableShowHide: true,
            disableSortBy: true,
        },
        {
            id: "product Image",
            Header: "product Image",
            accessor: "productImage",
            column_name: "product Image",
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
                                        <Link to={`/admin/MasterCatalog/MasterCatalog/edit/${row.original.id}`} key={index}>
                                            <div className="h-14 w-14 flex items-center justify-center overflow-hidden  box-content rounded-full border bg-white">
                                                <Image src={ProductMainImg} containerheight={""} className="max-h-full" />
                                                {/* <img key={index} className="max-h-full" src={`${process.env.REACT_APP_API_BLOB}${ProductMainImg}`} alt="No Image" /> */}
                                            </div>
                                        </Link>
                                    )
                                })
                                    :
                                    <Link to={`/admin/MasterCatalog/MasterCatalog/edit/${row?.original.productId}`}>
                                        <div className='w-14 h-14 shrink-0 mr-2 sm:mr-3 bg-sky-400/10 rounded-full text-center'>
                                            <Image src={defaultImage} className="max-h-full" />
                                        </div>
                                        {/* <img className="w-14 h-14 shrink-0 mr-2 sm:mr-3 bg-sky-400/10 rounded-full text-center" src={`${process.env.REACT_APP_API_BLOB}${value}`} alt="No Image" /> */}
                                    </Link>
                            }
                            {(row.original.subRows && row.original.subRows.length !== 0) &&
                                <div>
                                    <span className="w-14 h-14 rounded-full box-content bg-neutral-200 flex items-center justify-center text-center">+{row?.original?.subRows?.length}</span>
                                </div>
                            }
                        </div>
                    </>
                ) : (row?.original.productId ?
                    <Link to={`/admin/MasterCatalog/MasterCatalog/edit/${row?.original.productId}`}>
                        <div className="h-14 w-14 flex items-center justify-center overflow-hidden  box-content rounded-full border bg-white">
                            <Image src={value} containerheight={""} className="max-h-full" />
                        </div>
                    </Link> :
                    // <div className="flex -space-x-9 items-center" style={{ width: "125px" }}>
                    <>
                        <Link to={`/admin/MasterCatalog/MasterCatalog/edit/${row?.original.id}`}>
                            <div className="h-14 w-14 flex items-center justify-center overflow-hidden  box-content rounded-full border bg-white">
                                <Image src={value} containerheight={""} className="max-h-full" />
                            </div>
                        </Link>
                        {(row.original.subRows && row.original.subRows.length !== 0) &&
                            <div>
                                <span className="w-14 h-14 rounded-full box-content bg-neutral-200 inline-flex items-center justify-center text-center">+{row?.original?.subRows?.length}</span>
                            </div>
                        }
                    </>
                    // </div>
                );
            },
        },
        {
            id: "name",
            Header: "Product Name",
            accessor: "name",
            column_name: "name",
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
                                    <Link to={`/admin/MasterCatalog/MasterCatalog/edit/${row?.original.productId}`}>{value}</Link>
                                    :
                                    <Link to={`/admin/MasterCatalog/MasterCatalog/edit/${row.original.id}`}>{value}</Link>
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
            id: "ourSKU",
            Header: "Our SKU",
            accessor: "ourSKU",
            column_name: "ourSKU",
            Cell: ({ value }) => {
                return value ? value : ''
            },
        },
        {
            id: "vendorSKU",
            Header: "vendor SKU",
            accessor: "vendorSKU",
            column_name: "vendorSKU",
            Cell: ({ value }) => {
                return value ? value : ''
            },
        },
        {
            id: "brandName",
            Header: "Brand NAME",
            accessor: "brandName",
            column_name: "brandName",
            Cell: ({ value }) => {
                return value ? value : ''
            },
        },
        {
            id: "vendorName",
            Header: "vendor Name",
            accessor: "vendorName",
            column_name: "vendorName",
            Cell: ({ value }) => {
                return value ? value : '';
            },
        },
        {
            id: "category",
            Header: "Category",
            accessor: "category",
            column_name: "category",
            disableSortBy: true,
            Cell: ({ value }) => {
                if (!value) {
                    return " ";
                } else {
                    return value;
                }
            },
        },
        {
            id: "store",
            Header: "Store",
            accessor: "storeLogoUrl",
            column_name: "store",
            disableSortBy: true,
            Cell: ({ value, row }) => {
                return value && value.length > 0 && (
                    <>
                        <div className={`flex -space-x-5 items-center`} style={{ width: "160px" }} >
                            {
                                Array.isArray(value) && value.slice(0, 3).map((ProductMainImg, index) => {
                                    return (
                                        <div className="h-14 w-14 flex items-center justify-center overflow-hidden  box-content rounded-full border bg-white" key={index + row.index}>
                                            <Image src={ProductMainImg} containerheight={""} className="max-h-full" />
                                            {/* <img key={index} className="max-h-full" src={`${process.env.REACT_APP_API_BLOB}${ProductMainImg}`} alt="" /> */}
                                        </div>

                                    )
                                })
                            }
                            {/* <div>
                                <span className="w-14 h-14 rounded-full box-content bg-neutral-200 flex items-center justify-center">+{value.length}</span>
                            </div> */}
                        </div>
                    </>
                ) /* : (row?.original.storeLogoUrl &&
                    <div div className="flex -space-x-9 items-center" style={{ width: "125px" }}>
                        <div className="flex -space-x-9 items-center">
                            <ImageComponent src={defaultImage} className="w-14 h-14 rounded-full inline-flex text-center items-center justify-center" />
                        </div>
                        {(row.original.subRows !== undefined && row.original.subRows.length !== 0) &&
                            <div>
                                <span className="w-14 h-14 rounded-full box-content bg-neutral-200 inline-flex items-center justify-center">+{value.length}</span>
                            </div>
                        }
                    </div>
                ); */
            },
        },
        {
            id: "upc",
            Header: "UPC",
            accessor: "upc",
            column_name: "upc",
            Cell: ({ value }) => {
                return value ? value : "";
            },
        },
        // {
        //     id: "cloned",
        //     Header: "Cloned",
        //     accessor: "isCloned",
        //     column_name: "cloned",
        //     Cell: ({ value }) => {

        //         return value === true ? <div className="text-green-500"><span className="material-icons-outlined">done</span></div> : ""

        //     },
        // },
        {
            id: "quantity",
            Header: "Quantity",
            accessor: "quantity",
            column_name: "quantity",
            Cell: ({ value }) => {
                return value ? value : ''
            },
        },
        {
            id: "ourCost",
            Header: "our Cost",
            accessor: "ourcost",
            column_name: "ourcost",
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
            id: "createdDate",
            Header: "CREATED Date",
            accessor: "createdDate",
            Footer: "CREATED",
            column_name: "createdDate",
            Cell: ({ value }) => {
                return value ? (
                    <>
                        <div >{DateTimeFormat(value).date} </div>
                        <div className="text-[#707070] text-xs font-normal">
                            {DateTimeFormat(value).time}
                        </div>
                    </>
                ) : (
                    " "
                );
            },
        },
        {
            id: "createdBy",
            Header: "Created BY",
            accessor: "createdName",
            column_name: "createdName",
            Cell: ({ value }) => {
                return value ? (
                    <>
                        <div >{value}</div>
                    </>
                ) : (
                    " "
                );
            },
        },
        {
            id: "updatedDate",
            Header: "UPDATED Date",
            accessor: "modifiedDate",
            column_name: "modifiedDate",
            Cell: ({ value }) => {
                return value ? (
                    <>
                        <div >{DateTimeFormat(value).date} </div>
                        <div className="text-[#707070] text-xs font-normal">
                            {DateTimeFormat(value).time}
                        </div>
                    </>
                ) : (
                    " "
                );
            },
        },
        {
            id: "updatedBy",
            Header: "UPDATED BY",
            accessor: "modifiedName",
            column_name: "modifiedName",
            Cell: ({ value }) => {
                return value ? (
                    <>
                        <div >{value}</div>
                    </>
                ) : (
                    " "
                );
            },
        },
        {
            id: "lastNavSyncDate",
            Header: "Last Nav Sync Date",
            accessor: "lastNavSyncDate",
            column_name: "lastNavSyncDate",
            Cell: ({ value }) => {
                return value ? (
                    <>
                        <div >{DateTimeFormat(value).date} </div>
                        <div className="text-[#707070] text-xs font-normal">
                            {DateTimeFormat(value).time}
                        </div>
                    </>
                ) : (
                    " "
                );
            },
        },
        {
            id: "navSyncStatus",
            Header: "Nav Sync Status",
            accessor: "navSyncStatus",
            column_name: "navSyncStatus",
            Cell: ({ value }) => {
                return <Status type={value} navSync={true} />;
            },
        },
        {
            id: "recStatus",
            Header: "status",
            accessor: "recStatus",
            column_name: "recStatus",
            Cell: ({ value }) => {
                return <Status type={value} />;
            },
        },
        {
            id: "isDiscontinue",
            Header: "Is Discontinue",
            accessor: "isDiscontinue",
            column_name: "isDiscontinue",
            Cell: ({ value }) => {
                return value ? (
                    <>
                        <div className="text-xs inline-block font-medium border border-green-300 bg-green-100 text-green-600 rounded-md text-center px-2.5 py-1 w-28">
                            {"Discontinued"}
                        </div>
                    </>
                ) : (
                    ""
                );
            },
        },
        {
            id: "action",
            Header: "",
            accessor: "id",
            column_name: "action",
            Cell: ({ value, row }) => {
                return (
                    <Actions
                        id={value}
                        row={row}
                        setDeleteData={setProduct}
                        moduleName="Master Product"
                        openDeleteModal={openDeleteModal}
                        setOpenDeleteModal={setOpenDeleteModal}
                        setModalInfo={setModalInfo}
                        setOpenBasicModal={setOpenBasicModal}
                        editUrl={`/admin/MasterCatalog/MasterCatalog/edit/${row.id.includes(".") ? row?.original?.productId : row?.original?.id}`}
                        setViewHistoryModal={setViewHistoryModal}
                        setRecordId={setRecordId}

                    />
                );
            },
            disableSortBy: true,
            disableShowHide: true,
        },
    ];

    const handleSort = (sortValue) => { };

    const saveFilterOptionsHandler = () => {
        const saveFilterOptions = {
            'hiddenColumns': hiddenColumns,
            'filteringOptions': filteringOptions,
            'initialColumnFilterOrder': initialColumnFilterOrder,
            'activeTab': activeTab
        };
    }

    const handleDelete = (Product) => {
        // setLoading(true);
        dispatch(setAddLoading(true))

        ProductService.updateProductStatus({
            args: {
                id: Product.id,
                status: Product.changeStatus,
                rowVersion: Product.rowVersion,
                ...location,
            },
        })
            .then((response) => {
                if (response.data.data) {
                    dispatch(
                        setAlertMessage({
                            view: true,
                            type: "success",
                            message: ValidationMsgs.masterCatalog.products.Deleted,
                        })
                    );
                    getAllData();
                } else {
                    dispatch(
                        setAlertMessage({
                            view: true,
                            type: "danger",
                            message: serverError(response),
                        })
                    );
                }
                // setLoading(false);
                dispatch(setAddLoading(false))

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
                        setAlertMessage({ message: ValidationMsgs.masterCatalog.products.notDeleted, type: "danger" })
                    );
                }
                // setLoading(false);
                dispatch(setAddLoading(false))

            });
        setOpenDeleteModal(false);
    };
    const statusChangedHandler = (data) => {
        dispatch(setAddLoading(true))
        if (data?.changeStatus == 'A' && data?.id) {
            // ValidateServices.getMasterCatalogValidateProductStatus(data?.id).then((response) => {
            //     if (response.data.data) {
            //         ChangeMasterStatus(data);
            //     } else {
            //         dispatch(setAlertMessage({
            //             type: 'danger',
            //             message: ValidationMsgs.product.notActive
            //         }));
            //         dispatch(setAddLoading(false))
            //     }
            // }).catch(() => {
            //     dispatch(setAlertMessage({
            //         type: 'danger',
            //         message: ValidationMsgs.product.notActive
            //     }));
            //     dispatch(setAddLoading(false));
            // })
            MasterCatalogCommonService.validateProduct(data?.id, productType.MC)
                .then((response) => {
                    if (response?.data?.data?.length > 0 && response?.data?.otherData) {
                        dispatch(setAlertMessage({
                            type: 'danger',
                            message: serverError({ data: { errors: response?.data?.otherData } })
                        }))
                    } else {
                        ChangeMasterStatus(data);
                    }
                    dispatch(setAddLoading(false));
                }).catch((error) => {
                    dispatch(setAddLoading(false));
                });
        } else {
            ChangeMasterStatus(data);
        }
        setOpenBasicModal(false);
    };
    const ChangeMasterStatus = (data) => {
        ProductService.updateProductStatus({
            args: {
                id: data.id,
                status: data.changeStatus,
                rowVersion: data.rowVersion,
                ...location,
            },
        })
            .then((response) => {
                if (response.data.success) {
                    dispatch(
                        setAlertMessage({
                            view: true,
                            type: "success",
                            message: ValidationMsgs.masterCatalog.products.statusUpdated,
                        })
                    );
                    getAllData();
                    setOpenBasicModal(false);
                } else {
                    dispatch(
                        setAlertMessage({
                            view: true,
                            type: "danger",
                            message: serverError(response),
                        })
                    );
                }
                // setLoading(false);
                dispatch(setAddLoading(false))

            })
            .catch((errors) => {
                dispatch(
                    setAlertMessage({
                        view: true,
                        type: "danger",
                        message: ValidationMsgs.masterCatalog.products.statusNotUpdated,
                    })
                );
                // setLoading(false);
                dispatch(setAddLoading(false))

            });
    };

    const moreFilters = useMemo(
        () => [
            {
                name: "Brand",
                options: moreFilterOptions.brand,
                columnName: "brandId",
                type: "checkbox",
                conditionalSearch: true,
            },
            {
                name: "Vendor",
                columnName: "vendorId",
                options: moreFilterOptions.vendor,
                type: "checkbox",
            },
            {
                name: "Gender",
                columnName: "categoryId",
                options: moreFilterOptions.category,
                type: "checkbox",
            },
            {
                name: "Product Type",
                columnName: "producttypeid",
                options: moreFilterOptions.productType,
                type: "checkbox",
                conditionalSearch: true,
            },
            {
                name: "Store",
                columnName: "storeId",
                options: stores,
                type: "checkbox",
                conditionalSearch: true,
            },
            {
                name: "Nav Sync Status",
                columnName: "navSyncStatus",
                options: ProductNavStatusValueNameForMoreFilter,
                type: "radio",
                conditionalSearch: true,
            },
            {
                name: "Last Nav Sync Date",
                columnName: "lastNavSyncDate",
                options: [],
                type: "date",
            },
            {
                name: "Status",
                columnName: "recStatus",
                options: ProductStatusMoreFilterOption,
                type: "radio",
                conditionalSearch: true,
            },
            {
                name: "Is Discontinued",
                columnName: "isDiscontinue",
                options: ProductIsDiscontinueMoreFilterOption,
                type: "radio",
                // conditionalSearch: true,
            },
            {
                name: "Created Date",
                columnName: "createddate",
                options: [],
                type: "date",
            },
            {
                name: "Updated Date",
                columnName: "modifieddate",
                options: [],
                type: "date",
            },
            {
                name: "Created By",
                options: userNameValues,
                columnName: "createdBy",
                type: "checkbox",
            },
            {
                name: "Updated By",
                options: userNameValues,
                columnName: "modifiedBy",
                type: "checkbox",
            }
        ],
        [moreFilterOptions, stores]
    );

    const columnForVarientProducts = [
        {
            id: "product Image",
            Header: "product Image",
            accessor: "productImage",
            column_name: "product Image",
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
                                        <Link to={`/admin/MasterCatalog/MasterCatalog/edit/${row.original.id}`} key={index}>
                                            <div className="h-14 w-14 flex items-center justify-center overflow-hidden  box-content border bg-white">
                                                <Image src={ProductMainImg} containerheight={""} className="max-h-full" />
                                            </div>
                                            {/* <img key={index} className="w-14 h-14 rounded-full box-content bg-sky-400/10" src={`${process.env.REACT_APP_API_BLOB}${ProductMainImg}`} alt="No Image" /> */}
                                        </Link>
                                    )
                                })
                                    :
                                    <Link to={`/admin/MasterCatalog/MasterCatalog/edit/${row?.original.productId}`}>
                                        <div className="h-14 w-14 flex items-center justify-center overflow-hidden  box-content border bg-white">
                                            <Image src={value} className={"max-h-full"} />
                                            {/* <img className="" src={`${process.env.REACT_APP_API_BLOB}${value}`} alt="No Image" /> */}
                                        </div>
                                    </Link>
                            }
                            {(row.original.subRows && row.original.subRows.length !== 0) &&
                                <div>
                                    <span className="w-14 h-14 rounded-full box-content bg-neutral-200 flex items-center justify-center">+{row?.original?.subRows?.length}</span>
                                </div>
                            }
                        </div>
                    </>
                ) : (row?.original.productId ?
                    <Link to={`/admin/MasterCatalog/MasterCatalog/edit/${row?.original.productId}`}>
                        <div className="h-14 w-14 flex items-center justify-center overflow-hidden  box-content border bg-white">
                            <Image src={value} containerheight={""} className="max-h-full" />
                        </div>
                    </Link> :
                    // <div className="flex -space-x-9 items-center" style={{ width: "125px" }}>
                    <>
                        <Link to={`/admin/MasterCatalog/MasterCatalog/edit/${row?.original.id}`}>
                            <div className="h-14 w-14 flex items-center justify-center overflow-hidden  box-content border bg-white">
                                <Image src={value} containerheight={""} className="max-h-full" />
                            </div>
                        </Link>
                        {(row.original.subRows && row.original.subRows.length !== 0) &&
                            <div>
                                <span className="w-14 h-14 box-content bg-neutral-200 inline-flex items-center justify-center text-center">+{row?.original?.subRows?.length}</span>
                            </div>
                        }
                    </>
                    // </div>
                );
            },
        },
        {
            id: "name",
            Header: "Product Name",
            accessor: "name",
            column_name: "name",
            disableShowHide: true,
            disableSortBy: true,
            Cell: ({ value, row }) => {
                return row ? (
                    <>
                        <div
                            className="w-full flex justify-start items-center group"
                            style={{ width: "200px" }}
                        >
                            <div >
                                {value}
                            </div>
                        </div>
                    </>
                ) : (
                    " "
                );
            },
        },
        {
            id: "ourSKU",
            Header: "Our SKU",
            accessor: "ourSKU",
            column_name: "ourSKU",
            disableShowHide: true,
            disableSortBy: true,
            Cell: ({ value }) => {
                return value ? value : ''
            },
        },
        // {
        //     id: "vendorSKU",
        //     Header: "vendor SKU",
        //     accessor: "vendorSKU",
        //     column_name: "vendorSKU",
        //     disableShowHide: true,
        //     disableSortBy: true,
        //     Cell: ({ value }) => {
        //         return value ? value : ''
        //     },
        // },
        {
            id: "upc",
            Header: "UPC",
            accessor: "upc",
            column_name: "upc",
            disableShowHide: true,
            disableSortBy: true,
            Cell: ({ value }) => {
                return value ? value : "";
            },
        },
        // {
        //     id: "cloned",
        //     Header: "Cloned",
        //     accessor: "isCloned",
        //     column_name: "cloned",
        //     Cell: ({ value }) => {

        //         return value === true ? <div className="text-green-500"><span className="material-icons-outlined">done</span></div> : ""

        //     },
        // },
        {
            id: "quantity",
            Header: "Quantity",
            accessor: "quantity",
            column_name: "quantity",
            disableShowHide: true,
            disableSortBy: true,
            Cell: ({ value }) => {
                return value ? value : ''
            },
        },
        // {
        //     id: "lastNavSyncDate",
        //     Header: "Last Nav Sync Date",
        //     accessor: "lastNavSyncDate",
        //     column_name: "lastNavSyncDate",
        //     disableShowHide: true,
        //     disableSortBy: true,
        //     Cell: ({ value }) => {
        //         return value ? (
        //             <>
        //                 <div >{DateTimeFormat(value).date} </div>
        //                 <div className="text-[#707070] text-xs font-normal">
        //                     {DateTimeFormat(value).time}
        //                 </div>
        //             </>
        //         ) : (
        //             " "
        //         );
        //     },
        // },

        {
            id: "navSyncStatus",
            Header: "Nav Sync Status",
            accessor: "navSyncStatus",
            column_name: "navSyncStatus",
            disableShowHide: true,
            disableSortBy: true,
            Cell: ({ value }) => {
                return <Status type={value} navSync={true} />;
            },
        },
        {
            id: "createdDate",
            Header: "CREATED Date",
            accessor: "createdDate",
            Footer: "CREATED",
            column_name: "createdDate",
            disableShowHide: true,
            disableSortBy: true,
            Cell: ({ value }) => {
                return value ? (
                    <>
                        <div >{DateTimeFormat(value).date} </div>
                        <div className="text-[#707070] text-xs font-normal">
                            {DateTimeFormat(value).time}
                        </div>
                    </>
                ) : (
                    " "
                );
            },
        },
        {
            id: "createdBy",
            Header: "Created BY",
            accessor: "createdName",
            column_name: "createdName",
            disableShowHide: true,
            disableSortBy: true,
            Cell: ({ value }) => {
                return value ? (
                    <>
                        <div >{value}</div>
                    </>
                ) : (
                    " "
                );
            },
        },
        {
            id: "updatedDate",
            Header: "UPDATED Date",
            accessor: "modifiedDate",
            column_name: "modifiedDate",
            disableShowHide: true,
            disableSortBy: true,
            Cell: ({ value }) => {
                return value ? (
                    <>
                        <div >{DateTimeFormat(value).date} </div>
                        <div className="text-[#707070] text-xs font-normal">
                            {DateTimeFormat(value).time}
                        </div>
                    </>
                ) : (
                    " "
                );
            },
        },
        {
            id: "updatedBy",
            Header: "UPDATED BY",
            accessor: "modifiedName",
            column_name: "modifiedName",
            disableShowHide: true,
            disableSortBy: true,
            Cell: ({ value }) => {
                return value ? (
                    <>
                        <div >{value}</div>
                    </>
                ) : (
                    " "
                );
            },
        },
        {
            id: "recStatus",
            Header: "status",
            accessor: "recStatus",
            column_name: "recStatus",
            disableShowHide: true,
            disableSortBy: true,
            Cell: ({ value }) => {
                return <Status type={value} />;
            },
        },
    ];

    const getVarientDataFunc = (currentRowData) => {
        dispatch(setAddLoading(true))
        setOpenVarientModal((prevData) => ({
            ...prevData,
            name: currentRowData.name,
            ourSku: currentRowData.ourSKU,
            toShow: true
        }))

        ProductService.getMasterProductsVarientData(currentRowData.id).then((response) => {
            const VarientData = response?.data?.data;
            setdataForVarientProducts(VarientData || [])

            dispatch(setAddLoading(false))
        }).catch(() => {
            dispatch(setAddLoading(false))
        })
    }

    useEffect(() => {
        setProductId(() => {
            let ids = [];
            selectedData.map((value) => {
                ids = [...ids, value.original.id];
                return "";
            })
            return ids;
        })
    }, [selectedData]);

    return (
        <>
            <ReactTable
                COLUMNS={COLUMNS}
                DATA={Data}
                {...paginationData}
                setTablePageSize={(value) =>
                    setPaginationDataFunc("pageSize", value)
                }
                type={type}
                fetchData={getAllData}
                sortingOptions={sortingOptions}
                setSortingOptions={setSortingOptionHandler}
                filteringOptions={filteringOptions}
                setColumnFilteringOptions={setColumnFilteringOptions}
                handleSort={handleSort}
                editColumnFilter={true}
                setHiddenColumns={setHiddenColumns}
                setSelectedRows={setSelectedRows}
                moreFilterOption={moreFilters}
                selectedRows={selectedRows}
                savedButton={true}
                buttonText={'Saved'}
                productSubCheckboxAction={false}
                expandedRows={useMemo(() => true, [])}
                setInitialColumnFilterOrder={setInitialColumnFilterOrder}
                hiddenColumns={useMemo(() => ['rowSelection'], [])}
                saveFilter={{ show: true, tabName: pathname + '_' + tab?.value }}
            // CheckBoxAction={useCallback(
            //     ({ ...rest }) => (

            // <CheckBoxAction
            //     setProduct={setProduct}
            //     setProductId={setProductId}
            //     setSelectedRows={setSelectedRows}
            //     setOpenDeleteModal={setOpenDeleteModal}
            //     setOpenCloneModal={setOpenCloneModal}
            //     setOpenAttributeCloneModal={setOpenAttributeCloneModal}
            //     activeTab={activeTab}
            //     {...rest}
            // />
            //     ),
            //     []
            // )}
            // extraFilter={[{ Component: SaveButton, saveFilterOptionsHandler }]}
            />
            <ConfirmDelete
                handleDelete={handleDelete}
                message={ValidationMsgs.product.deletePermanently}
                title={"Delete"}
                openDeleteModal={openDeleteModal}
                setOpenDeleteModal={setOpenDeleteModal}
                data={Product}
            />
            {openCloneModal && <ProductCloneModal
                type={type}
                openCloneModal={openCloneModal}
                setOpenCloneModal={setOpenCloneModal}
                data={Product}
                proId={ProductId}
                getProductData={getAllData}
            />}
            <ProductAttributeCloneModal
                type={type}
                openAttributeCloneModal={openAttributeCloneModal}
                setOpenAttributeCloneModal={setOpenAttributeCloneModal}
                proId={ProductId}
                getProductData={getAllData}
            />
            <BasicModal
                handleConfirmation={statusChangedHandler}
                openModal={openBasicModal}
                setOpenModal={setOpenBasicModal}
                {...ModalInfo}
            />

            <VarientProductModal
                title={`Variant Of ${openVarientModal.name} | SKU : ${openVarientModal.ourSku}`}
                openModal={openVarientModal}
                setOpenModal={setOpenVarientModal}
                COLUMNS={columnForVarientProducts}
                DATA={dataForVarientProducts}
                setdataForVarientProducts={setdataForVarientProducts}
            />


            {viewHistoryModal && (
                <ViewHistory
                    title={"View History"}
                    openModal={viewHistoryModal}
                    setOpenModal={setViewHistoryModal}
                    rowId={RecordId}
                    pageName={PageName.MasterCatalogProduct}
                />
            )}
        </>
    );
};

export default All;

const SaveButton = ({ buttonText, saveFilterOptionsHandler }) => {
    return (
        <>
            <div className="relative inline-flex ">
                <button
                    className="flex flex-wrap items-center rounded-md text-sm px-3 py-2 bg-white border border-neutral-200 text-gray-500 hover:text-gray-700 opacity-60"
                    onClick={saveFilterOptionsHandler}
                >
                    <span className="material-icons">grade</span>
                    <span className="ml-1">{'Save'}
                    </span>
                    <wbr />
                </button>
            </div>
        </>
    );
};
