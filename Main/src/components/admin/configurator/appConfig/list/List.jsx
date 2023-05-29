
import React, { useState, useCallback, useMemo, useEffect } from "react";
import ReactTable from "components/common/table/ReactTableServerSide";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import BasicModal from "components/common/modals/Basic";
import { format } from "date-fns";
import { NavLink, useLocation } from "react-router-dom";
import Messages from "components/common/alerts/messages/Index";
import Actions from "./Actions";
import { useDispatch, useSelector } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { paginationDetails, RecStatusValuebyName, RecStatusValueForForm, PageName } from "global/Enum";
import { DateTimeFormat, serverError } from "services/common/helper/Helper";
import { ValidationMsgs } from "global/ValidationMessages";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import Status from "components/common/displayStatus/Status";
import DropdownService from "services/common/dropdown/DropdownService";
import AppConfigService from "services/admin/appConfig/AppConfigService";
import Create from "../create/Create"
import StoreService from "services/admin/store/StoreService";
const List = () => {
    const permission = useSelector(store => store.permission);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [AppConfigId, setAppConfigId] = useState(null);
    const [ModelInfo, setModalInfo] = useState({});
    const [openBasicModal, setOpenBasicModal] = useState(false);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    useEffect(() => {
        if (!openCreateModal) {
            setModalInfo({})
        }
    }, [openCreateModal]);
    const dispatch = useDispatch();
    const location = useSelector((store) => store?.location);
    const [stores, setStores] = useState([]);
    const reduxData = useSelector((store) => store);
    useEffect(() => {
        if (reduxData?.user?.id && reduxData?.CompanyConfiguration?.id) {
            StoreService.getStoreByUserId({
                userid: reduxData?.user?.id,
                companyConfigurationId: reduxData?.CompanyConfiguration?.id,
                isSuperUser: reduxData?.user?.isSuperUser
            }).then((response) => {
                if (response.data.data) {
                    setStores(response?.data?.data);
                }
            }).catch((error) => { })
        }
    }, [reduxData?.user, reduxData?.CompanyConfiguration]);
    const COLUMNS = [
        {
            id: "Name",
            Header: "Name",
            accessor: "name",
            Footer: "Name",
            column_name: "name",
            disableShowHide: true,
            Cell: ({ value, row }) => {
                return <span className="cursor-pointer" onClick={() => { setOpenCreateModal(true); setModalInfo({ data: row?.original }) }}>{value}</span>;
            },
        },
        {
            id: "value",
            Header: "Value",
            accessor: "value",
            Footer: "value",
            column_name: "value",
        },
        {
            id: "description",
            Header: "Description",
            accessor: "description",
            Footer: "description",
            column_name: "description",
            Cell: ({ value, row }) => {
                return (
                    <div className="text-ellipsis">
                        {value ? value : ""}
                    </div>
                );
            },
        },
        {
            id: "StoreName",
            Header: "Store Name",
            accessor: "storeName",
            Footer: "StoreName",
            column_name: "storeName",
            Cell: ({ value, row }) => {
                return (
                    <div className="text-ellipsis">
                        {value ? value : ""}
                    </div>
                );
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
                            {format(new Date(value), "hh:mm a")}
                        </div>
                    </>
                ) : (
                    ""
                );
            },
        },
        {
            id: "createdBy",
            Header: "Created BY",
            accessor: "createdName",
            Footer: "Created BY",
            column_name: "createdName",
            Cell: ({ value }) => {
                return value ? (
                    <>
                        <div >{value}</div>
                    </>
                ) : (
                    ""
                );
            },
        },
        {
            id: "updatedDate",
            Header: "UPDATED Date",
            accessor: "modifiedDate",
            Footer: "UPDATED",
            column_name: "modifiedDate",
            Cell: ({ value }) => {
                return value ? (
                    <>
                        <div >{DateTimeFormat(value).date} </div>
                        <div className="text-[#707070] text-xs font-normal">
                            {format(new Date(value), "hh:mm a")}
                        </div>
                    </>
                ) : (
                    ""
                );
            },
        },

        {
            id: "updatedBy",
            Header: "UPDATED BY",
            accessor: "modifiedName",
            Footer: "UPDATED BY",
            column_name: "modifiedName",
            Cell: ({ value }) => {
                return value ? (
                    <>
                        <div >{value}</div>
                    </>
                ) : (
                    ""
                );
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
            Header: "",
            accessor: "id",
            column_name: "action",
            Cell: ({ value, row }) => {
                return (
                    <Actions
                        id={value}
                        row={row}
                        setAppConfigId={setAppConfigId}
                        setOpenDeleteModal={setOpenDeleteModal}
                        setModalInfo={setModalInfo}
                        setOpenBasicModal={setOpenBasicModal}
                        setOpenCreateModal={setOpenCreateModal}
                    />
                );
            },
            disableSortBy: true,
            disableShowHide: true,
        },
    ];

    const [Data, setData] = useState([]);
    const [paginationData, setPaginationData] = useState({ ...paginationDetails });
    const [sortingOptions, setSortingOptions] = useState([
        {
            field: "name",
            direction: 0,
            priority: 0,
        },
    ]);

    const [selectedRows, setSelectedRows] = useState([]);
    const [filteringOptions, setColumnFilteringOptions] = useState([]);

    const getAppConfigData = useCallback(
        (pageIndex) => {
            dispatch(setAddLoading(true))
            AppConfigService.getAppConfig({
                pageSize: paginationData.pageSize,
                pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
                sortingOptions,
                filteringOptions,
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

    const setSortingOptionHandler = (column, direction) => {
        setSortingOptions([
            {
                field: column,
                direction: direction,
                priority: 0,
            },
        ]);
    };

    const setPaginationDataFunc = (key, value) => {
        setPaginationData((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const handleSort = (sortValue) => { };


    const statusChangedHandler = (StatusData) => {
        dispatch(setAddLoading(true))
        AppConfigService.updateStatus({
            args: {
                id: StatusData.id,
                rowVersion: StatusData.rowVersion,
                status: StatusData.changeStatus,
                ...location,
            },
        })
            .then((response) => {
                if (response.data.success) {
                    dispatch(
                        setAlertMessage({
                            type: "success",
                            message: ValidationMsgs.appConfig.statusChanged,
                        })
                    );
                    getAppConfigData();
                } else {
                    dispatch(
                        setAlertMessage({
                            type: "danger",
                            message: serverError(response),
                        })
                    );
                    dispatch(setAddLoading(true))
                }
            })
            .catch((errors) => {
                dispatch(
                    setAlertMessage({
                        type: "danger",
                        message: ValidationMsgs.appConfig.statusNotChanged,
                    })
                );
                dispatch(setAddLoading(false))
            });
        setOpenBasicModal(false);
    };
    const [userNameValues, setUserNameValues] = useState([]);
    useEffect(() => {
        DropdownService.getDropdownValues("adminuser").then((response) => {
            setUserNameValues(response.data.data);
        });
    }, []);
    const moreFilterOptions = useMemo(
        () => [
            {
                name: "Store",
                options: stores,
                columnName: "storeId",
                type: "checkbox",
            },
            {
                name: "Created By",
                options: userNameValues,
                columnName: "createdBy",
                type: "checkbox",
            },
            {
                name: "Created Date",
                columnName: "createdDate",
                options: [],
                type: "date",
            },
            {
                name: "Updated By",
                options: userNameValues,
                columnName: "modifiedBy",
                type: "checkbox",
            },
            {
                name: "Updated Date",
                columnName: "modifiedDate",
                options: [],
                type: "date",
            },
            {
                name: "Status",
                columnName: "recStatus",
                options: RecStatusValueForForm,
                type: "radio",
                conditionalSearch: true,
            },
            // {
            //   name: "Filter By",
            //   columnName: "filter_by",
            //   type: "filter_by",
            //   conditionalSearch: true,
            // },
        ],
        [userNameValues, stores]
    );
    const { pathname } = useLocation();
    return (
        <>
            <title>App Config</title>
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
                <div className="col-span-full w-full flex justify-between mb-8">
                    <div className="col-span-full w-full flex justify-between items-center">
                        <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
                            App Config
                        </h1>
                        {(permission?.isEdit || permission?.isDelete) && <div className="flex flex-wrap sm:auto-cols-max gap-2">
                            <div className="btn bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer" onClick={() => setOpenCreateModal(true)}>
                                <span className="material-icons-outlined">add</span>
                                <span className="ml-1">App Config</span>
                            </div>
                        </div>}
                    </div>
                </div>

                {!openCreateModal && <Messages />}

                <div className="col-span-full w-full bg-white shadow-xxl rounded-md mb-8 relative">
                    <ReactTable
                        COLUMNS={COLUMNS}
                        DATA={Data}
                        hasNextPage={paginationData.hasNextPage}
                        hasPreviousPage={paginationData.hasPreviousPage}
                        pageIndex={paginationData.pageIndex}
                        setPageIndex={(value) => setPaginationDataFunc("pageIndex", value)}
                        pageSize={paginationData.pageSize}
                        setTablePageSize={(value) =>
                            setPaginationDataFunc("pageSize", value)
                        }
                        totalCount={paginationData.totalCount}
                        fetchData={getAppConfigData}
                        sortingOptions={sortingOptions}
                        setSortingOptions={setSortingOptionHandler}
                        hiddenColumns={useMemo(() => ['rowSelection'], [])}
                        handleSort={handleSort}
                        filteringOptions={filteringOptions}
                        setColumnFilteringOptions={setColumnFilteringOptions}
                        selectedRows={selectedRows}
                        setSelectedRows={setSelectedRows}
                        moreFilterOption={moreFilterOptions}
                        editColumnFilter={true}
                        saveFilter={{ show: true, tabName: pathname + '_' + 'appConfig' }}
                    />
                </div>
            </div>
            <ConfirmDelete
                handleDelete={statusChangedHandler}
                data={ModelInfo}
                message={ValidationMsgs.appConfig.delete}
                title={"Delete"}
                openDeleteModal={openDeleteModal}
                setOpenDeleteModal={setOpenDeleteModal}
                {...ModelInfo}
            />
            <BasicModal
                handleConfirmation={statusChangedHandler}
                openModal={openBasicModal}
                setOpenModal={setOpenBasicModal}
                {...ModelInfo}
            />
            {openCreateModal && <Create {...ModelInfo} stores={stores} setOpenCreateModal={setOpenCreateModal} getAppConfigData={getAppConfigData} />}
        </>
    );
};

export default List;
