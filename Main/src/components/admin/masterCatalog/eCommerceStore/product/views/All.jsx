/*Component Name: All
Component Functional Details: User can create or update All master details from here.
Created By: Happy
Created Date: <Creation Date>
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { paginationDetails, PageName, defaultImage, RecStatusValuebyName, GMCProductStatusFormOption, CurrencySymbolByCode } from "global/Enum";
import ReactTable from 'components/common/table/ReactTableServerSide';
import { StoreProductStatusTabs, roleColumns } from 'dummy/Dummy';
import Status from 'components/common/displayStatus/Status';
import { DateTimeFormat, serverError } from 'services/common/helper/Helper';
import { Link, useLocation, useParams } from 'react-router-dom';
import Actions from 'components/common/others/admin/Action';
import ConfirmDelete from 'components/common/modals/ConfirmDelete';
import BasicModal from "components/common/modals/Basic";
import ViewHistory from 'components/common/modals/ViewHistory';
import ProductService from 'services/admin/masterCatalog/store/product/ProductService';
import { useSelector, useDispatch } from 'react-redux';
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import { ValidationMsgs } from 'global/ValidationMessages';
import CheckBoxAction from "./CheckBoxAction";
import BundleList from 'components/admin/masterCatalog/eCommerceStore/bundle/list/List';
import DropdownService from 'services/common/dropdown/DropdownService';
import Image from "components/common/formComponent/Image";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import VarientProductModal from 'components/admin/masterCatalog/common/product/create/forms/VarientProductModal';
import ImageComponent from 'components/common/formComponent/Image';
import MasterCatalogCommonService from 'services/admin/masterCatalog/MasterCatalogCommonService';
import StoreService from 'services/admin/store/StoreService';

const All = ({ activeTab, type, filterData, tab }) => {
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const { pathname } = useLocation();
    const [product, setProduct] = useState(null);
    const [ModelInfo, setModalInfo] = useState({});
    const [openBasicModal, setOpenBasicModal] = useState(false);
    const [viewHistoryModal, setViewHistoryModal] = useState(false);
    const location = useSelector((store) => store?.location);
    const dispatch = useDispatch();
    const [Data, setData] = useState([]);
    const { storeType, storeName, storeId } = useParams();
    const [store, setStore] = useState({});
    useEffect(() => {
        StoreService.getStoreById(storeId).then((response) => {
            if (response?.data?.success && response?.data?.data) {
                setStore(response?.data?.data);
            }
        }).catch(() => { })
    }, [storeId]);

    const [hiddenColumns, setHiddenColumns] = useState([]);
    const [initialColumnFilterOrder, setInitialColumnFilterOrder] = useState([]);
    const [filteringOptions, setColumnFilteringOptions] = useState(filterData);
    const [selectedRows, setSelectedRows] = useState([]);
    const [paginationData, setPaginationData] = useState({ ...paginationDetails });

    const [openVarientModal, setOpenVarientModal] = useState({
        name: "",
        ourSku: "",
        toShow: false
    });
    const [dataForVarientProducts, setdataForVarientProducts] = useState([]);

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

    const setSortingOptionHandler = (column, direction) => {
        setSortingOptions([
            {
                field: column,
                direction: direction,
                priority: 0,
            },
        ]);
    };

    const getAllData = useCallback((pageIndex) => {
        dispatch(setAddLoading(true))

        ProductService.getStoreProductsWithoutSubrows({
            args: {
                pageSize: paginationData.pageSize,
                pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
                sortingOptions,
                filteringOptions: [...filterData, ...filteringOptions]
            },
            storeId: storeId
        }).then((response) => {
            const productResponse = response.data.data
            setData(productResponse.items);
            setPaginationData((prevState) => ({
                ...prevState,
                pageIndex: productResponse.pageIndex,
                pageSize: productResponse.pageSize,
                totalCount: productResponse.totalCount,
                totalPages: productResponse.totalPages,
                hasPreviousPage: productResponse.hasPreviousPage,
                hasNextPage: productResponse.hasNextPage,
            }));
            dispatch(setAddLoading(false))

        }).catch(() => {
            dispatch(setAddLoading(false))

        })

    }, [filteringOptions, paginationData.pageSize, sortingOptions, paginationData.pageIndex, storeId]);

    // useEffect(() => {
    //     setColumnFilteringOptions([
    //         {
    //             field: StoreProductStatusTabs[activeTab]?.value !== 'All' ? 'recStatus' : '',
    //             operator: 0,
    //             value: StoreProductStatusTabs[activeTab]?.fieldValue || ""
    //         },
    //     ]);
    // }, [setColumnFilteringOptions, activeTab]);

    const COLUMNS = [
        {
            id: "id",
            disableShowHide: true,
            Header: ({ getToggleAllRowsSelectedProps }) => {
                return (
                    <>
                        {/* <div className="flex items-center relative">
                        <span className="inline-flex leading-none w-4 h-4">
                            <CheckBox {...getToggleAllRowsSelectedProps()} />
                        </span>
                        <div
                            className={`absolute left-full bg-white input-check min-w-auto pl-1 ${selectedRows.length <= 0 && "hidden"
                                }`}
                        >
                            <CheckBoxAction
                                setProduct={setProduct}
                                setSelectedRows={setSelectedRows}
                                setOpenDeleteModal={setOpenDeleteModal}
                                setOpenCloneModal={setOpenCloneModal}
                                activeTab={activeTab}
                                draft={draft}
                                type={type}
                                selectedFlatRows={selectedRows}
                                getProductData={getProductData}
                            />

                        </div>
                    </div> */}
                    </>
                );
            },
            accessor: "id",
            column_name: "id",
            disableSortBy: true,
            Cell: ({ value, row }) => {
                return (
                    <>
                        {/* // (row?.original?.subRows && row?.original?.subRows.length > 0 && row.original.recStatus == RecStatusValuebyName.Active && !row.original.isCloned) ? <CheckBox {...row.getToggleRowSelectedProps()} /> : '' */}
                    </>
                );
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
            id: "image",
            Header: "image",
            accessor: "productImage",
            column_name: "image",
            isVisible: false,
            disableShowHide: true,
            disableSortBy: true,
            Cell: ({ value, row }) => {
                return value && value.length > 0 ? (
                    <>
                        <div className="flex -space-x-9 items-center" style={{ width: "125px" }}>
                            {
                                Array.isArray(value) ? value.map((ProductMainImg, index) => {
                                    return (
                                        <Link key={index} to={`/admin/MasterCatalog/${storeType}/${storeName}/${storeId}/products/edit/${row.original.id}`}>
                                            <div className="h-14 w-14 flex items-center justify-center overflow-hidden  box-content rounded-full border bg-white">
                                                <Image src={ProductMainImg} containerheight={""} className="max-h-full" />
                                                {/* <img key={index} className="max-h-full" src={`${process.env.REACT_APP_API_BLOB}${ProductMainImg}`} alt="No Image" /> */}
                                            </div>
                                        </Link>
                                    )
                                })
                                    :
                                    <Link to={`/admin/MasterCatalog/${storeType}/${storeName}/${storeId}/products/edit/${row?.original.productId}`}>
                                        <div className='w-14 h-14 shrink-0 mr-2 sm:mr-3 bg-sky-400/10 rounded-full text-center'>
                                            <Image src={defaultImage} className="max-h-full" />
                                        </div>
                                        {/* <img className="w-14 h-14 shrink-0 mr-2 sm:mr-3 bg-sky-400/10" src={`${process.env.REACT_APP_API_BLOB}${value}`} alt="No Image" /> */}
                                    </Link>
                            }
                            {(row.original.subRows && row.original.subRows.length !== 0) &&
                                <div>
                                    <span className="w-14 h-14 rounded-full box-content bg-neutral-200 inline-flex items-center justify-center">+{row?.original?.subRows?.length}</span>
                                </div>
                            }
                        </div>
                    </>
                ) : (row?.original.productId ?
                    <Link to={`/admin/MasterCatalog/${storeType}/${storeName}/${storeId}/products/edit/${row?.original.productId}`}>
                        <div className="h-14 w-14 flex items-center justify-center overflow-hidden  box-content rounded-full border bg-white">
                            <Image src={value} containerheight={""} className="max-h-full" />
                        </div>
                    </Link> :
                    // <div className="flex -space-x-9 items-center" style={{ width: "125px" }}>
                    <>
                        <Link to={`/admin/MasterCatalog/${storeType}/${storeName}/${storeId}/products/edit/${row.original.id}`}>
                            <div className="h-14 w-14 flex items-center justify-center overflow-hidden  box-content rounded-full border bg-white">
                                <Image src={value} containerheight={""} className="max-h-full" />
                            </div>
                        </Link>
                        {(row.original.subRows && row.original.subRows.length !== 0) &&
                            <div>
                                <span className="w-14 h-14 rounded-full box-content bg-neutral-200 inline-flex items-center justify-center">+{row?.original?.subRows?.length}</span>
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
                            <div>
                                {row.id.includes(".") ?
                                    <Link to={`/admin/MasterCatalog/${storeType}/${storeName}/${storeId}/products/edit/${row?.original.productId}`}>{value}</Link>
                                    :
                                    <Link to={`/admin/MasterCatalog/${storeType}/${storeName}/${storeId}/products/edit/${row.original.id}`}>{value}</Link>
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
                return value ? value : ''
            },
        },
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
        // {
        //     id: "category2",
        //     Header: "Category2",
        //     accessor: "category2",
        //     column_name: "category2",
        //     Cell: ({ value }) => {
        //         if (!value) {
        //             return "";
        //         } else {
        //             return value;
        //         }
        //     },
        // },
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
                        <div>{value}</div>
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
                        <div>{DateTimeFormat(value).date} </div>
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
                        <div>{value}</div>
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
            Cell: ({ value }) => {
                return <Status type={value} />;
            },
        },
        {
            id: "action",
            Header: "",
            accessor: "id",
            column_name: "action",
            Cell: ({ value, row }) => {
                return (
                    <>
                        <Actions
                            row={row}
                            openDeleteModal={openDeleteModal}
                            setOpenDeleteModal={setOpenDeleteModal}
                            setDeleteData={setProduct}
                            setModalInfo={setProduct}
                            setOpenBasicModal={setOpenBasicModal}
                            editUrl={`/admin/MasterCatalog/${storeType}/${storeName}/${storeId}/products/edit/${row.id.includes(".") ? row?.original?.productId : row?.original?.id}`}
                            moduleName={'Product'}
                            setViewHistoryModal={setViewHistoryModal}
                            setRecordId={setProduct}
                            type={type}
                        // hideAction={['delete']}
                        />
                    </>
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
    };

    const statusChangedHandler = (data) => {
        dispatch(setAddLoading(true))
        if (data?.changeStatus == 'A' && data?.id) {
            MasterCatalogCommonService.validateProduct(data?.id, store?.storeTypeId)
                .then((response) => {
                    if (response?.data?.data?.length > 0 && response?.data?.otherData) {
                        dispatch(setAlertMessage({
                            type: 'danger',
                            message: serverError({ data: { errors: response?.data?.otherData } })
                        }))
                    } else {
                        ChangeProductStatus(data);
                    }
                    dispatch(setAddLoading(false));
                }).catch((error) => {
                    dispatch(setAddLoading(false));
                });
        } else {
            ChangeProductStatus(data);
        }
        setOpenBasicModal(false);
    };

    const ChangeProductStatus = (data) => {

        dispatch(setAddLoading(true));
        var statusNotUpdated = data?.changeStatus === 'R' ? ValidationMsgs.product.notDeleted : ValidationMsgs.product.statusNotUpdated
        ProductService.updateProductStatus(
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
                        message: data?.changeStatus === 'R' ? ValidationMsgs.product.Deleted : ValidationMsgs.product.statusUpdated,
                    })
                );
                getAllData();
            } else {
                dispatch(
                    setAlertMessage({
                        view: true,
                        type: "danger",
                        message: statusNotUpdated,
                    })
                );
            }
            dispatch(setAddLoading(false))

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
            dispatch(setAddLoading(false))

        });
        setOpenBasicModal(false);
    };

    const CheckBoxFunc = useCallback(
        ({ ...rest }) => (
            <CheckBoxAction
                // setStore={setStore}
                setSelectedRows={setSelectedRows}
                setOpenDeleteModal={setOpenDeleteModal}
                {...rest}
            />
        ),
        []
    );

    const [vendors, setVendors] = useState([]);
    const getVendorDropdownData = useCallback(() => {
        DropdownService.getDropdownValues("vendor").then((res) => {
            if (res.data.success && res.data.data) {
                setVendors(() => {
                    return res.data.data;
                });
            }
        });
    }, []);
    const [BrandOption, setBrandOption] = useState([]);
    const [ProductTypeOption, setProductTypeOption] = useState([]);
    const [CategoryOption, setCategoryOption] = useState([]);

    const [userNameValues, setUserNameValues] = useState([]);
    useEffect(() => {
        getVendorDropdownData();
        DropdownService.getDropdownValues("storebrand", false, storeId).then((response) => {
            setBrandOption(() => {
                return response.data.data;
            });
        });
        // DropdownService.getDropdownValues("storevendor", false, storeId).then((response) => {
        //     setVendorOption(() => {
        //         return response.data.data;
        //     });
        // });
        DropdownService.getDropdownValues("storecategory", false, storeId)
            .then((response) => {
                setCategoryOption(() => {
                    return response.data.data;
                });
            })
        DropdownService.getDropdownValues("producttype").then((response) => {
            setProductTypeOption(() => {
                return response.data.data;
            });
        });

        DropdownService.getDropdownValues("adminuser").then((response) => {
            setUserNameValues(response.data.data);
        });
    }, [Data]);

    const moreFilterOptions = useMemo(
        () => [
            {
                name: "Brand",
                options: BrandOption,
                columnName: "brandId",
                type: "checkbox",
                conditionalSearch: true,
            },
            {
                name: "Vendor",
                columnName: "vendorId",
                options: vendors,
                type: "checkbox",
            },
            {
                name: "Category",
                columnName: "categoryId",
                options: CategoryOption,
                type: "checkbox",
            },
            {
                name: "Product Type",
                columnName: "producttypeid",
                options: ProductTypeOption,
                type: "checkbox",
                conditionalSearch: true,
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
            },
            {
                name: "Status",
                columnName: "recStatus",
                options: GMCProductStatusFormOption,
                type: "radio",
                conditionalSearch: true,
            },
        ],
        [userNameValues, BrandOption, vendors, CategoryOption, ProductTypeOption]
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
                                            <div className="h-14 w-14 flex items-center justify-center overflow-hidden  box-content rounded-full border bg-white">
                                                <Image src={ProductMainImg} containerheight={""} className="max-h-full" />
                                                {/* <img key={index} className="max-h-full" src={`${process.env.REACT_APP_API_BLOB}${ProductMainImg}`} alt="No Image" /> */}
                                            </div>
                                        </Link>
                                    )
                                })
                                    :
                                    <Link to={`/admin/MasterCatalog/MasterCatalog/edit/${row?.original.productId}`}>
                                        <div className="h-14 w-14 flex items-center justify-center overflow-hidden  rounded-full border bg-white">
                                            <Image src={value} className={"max-h-full"} />
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
            disableSortBy: true,
            Cell: ({ value, row }) => {
                return row ? (
                    <>
                        <div
                            className="w-full flex justify-start items-center group"
                            style={{ width: "200px" }}
                        >
                            <div>
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
        {
            id: "vendorSKU",
            Header: "vendor SKU",
            accessor: "vendorSKU",
            column_name: "vendorSKU",
            disableShowHide: true,
            disableSortBy: true,
            Cell: ({ value }) => {
                return value ? value : ''
            },
        },
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
        {
            id: "lastNavSyncDate",
            Header: "Last Nav Sync Date",
            accessor: "lastNavSyncDate",
            column_name: "lastNavSyncDate",
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
                        <div>{value}</div>
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
                        <div>{DateTimeFormat(value).date} </div>
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

        ProductService.getStoreProductsVarientData(currentRowData.id).then((response) => {
            const VarientData = response?.data?.data;
            setdataForVarientProducts(VarientData || [])
            dispatch(setAddLoading(false))
        }).catch(() => {
            dispatch(setAddLoading(false))
        })
    }

    return (
        <>

            {StoreProductStatusTabs[activeTab]?.value !== 'Bundle' ? <>
                <div className="col-span-full w-full bg-white shadow-xxl rounded-md  relative">
                    <ReactTable
                        COLUMNS={COLUMNS}
                        DATA={Data}
                        {...paginationData}
                        setTablePageSize={(value) =>
                            setPaginationDataFunc("pageSize", value)
                        }
                        fetchData={getAllData}
                        sortingOptions={sortingOptions}
                        setSortingOptions={setSortingOptionHandler}
                        handleSort={handleSort}
                        // column filters
                        editColumnFilter={true}
                        setHiddenColumns={setHiddenColumns}
                        filteringOptions={filteringOptions}
                        setColumnFilteringOptions={setColumnFilteringOptions}
                        setSelectedRows={setSelectedRows}
                        moreFilterOption={moreFilterOptions}
                        selectedRows={selectedRows}
                        saveFilter={{ show: true, tabName: pathname + '_' + tab?.value }}
                        buttonText={'Saved'}
                        expandedRows={true}
                        productSubCheckboxAction={false}
                        // extraFilter={[{ Component: SaveButton, saveFilterOptionsHandler }]}
                        setInitialColumnFilterOrder={setInitialColumnFilterOrder}
                        CheckBoxAction={CheckBoxFunc}
                        hiddenColumns={hiddenColumns}
                    />
                </div>
                <ConfirmDelete
                    handleDelete={statusChangedHandler}
                    data={product}
                    message={ValidationMsgs.product.deletePermanently}
                    openDeleteModal={openDeleteModal}
                    setOpenDeleteModal={setOpenDeleteModal}
                    {...ModelInfo}
                    title={"Delete"}
                />

                <VarientProductModal
                    title={`Variant Of ${openVarientModal.name} | SKU : ${openVarientModal.ourSku}`}
                    openModal={openVarientModal}
                    setOpenModal={setOpenVarientModal}
                    COLUMNS={columnForVarientProducts}
                    DATA={dataForVarientProducts}
                    setdataForVarientProducts={setdataForVarientProducts}
                />

                <BasicModal
                    handleConfirmation={statusChangedHandler}
                    openModal={openBasicModal}
                    setOpenModal={setOpenBasicModal}
                    {...product}
                />
                {viewHistoryModal && (
                    <ViewHistory
                        title={"View History"}
                        openModal={viewHistoryModal}
                        setOpenModal={setViewHistoryModal}
                        rowId={product}
                        pageName={PageName.Product}
                    />
                )}
            </> : <BundleList />
            }

        </>
    );
};

export default All;

const SaveButton = ({ saveFilterOptionsHandler }) => {
    return (
        <>
            <div className="relative inline-flex ml-2 mr-2">
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
