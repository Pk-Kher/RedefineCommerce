import React, { useCallback, useState } from "react";
import { format } from "date-fns";
import ReactTable from "components/common/table/ReactTableServerSide";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import Messages from "components/common/alerts/messages/Index";
import { moreFilterOptions } from "dummy/Dummy";
import { DateTimeFormat } from "services/common/helper/Helper";
import { paginationDetails } from "global/Enum";
import Status from "components/common/displayStatus/Status";
import StoreBuilderService from "services/admin/storeBuilder/StoreBuilderService";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const TrashList = () => {

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const dispatch = useDispatch();

    const COLUMNS = [
        {
        id: "name",
        Header: "Merchstore",
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
                    <NavLink
                    to={"/admin/StoreBuilder/edit/" + row.original.storeid}
                    >
                    <div className="text-sm font-normal">
                        {value ? value : ""}
                    </div>
                    </NavLink>
                </div>
                </div>
            </>
            ) : (
            ""
            );
        },
        },
        {
        id: "Domain",
        Header: "Domain",
        accessor: "parentstorename",
        column_name: "parentstorename",
        Cell: ({ value, row }) => {
            return value !== null && value !== "" && value !== undefined ? (
            <>
                <div className="text-sm font-normal">{value ? value : ""}</div>
            </>
            ) : (
            ""
            );
        },
        },
        {
        id: "Customer Contact",
        Header: "Customer Contact",
        accessor: "email",
        column_name: "email",
        Cell: ({ value }) => {
            return (
            <>
                <div className="text-sm font-normal">{value ? value : ""}</div>
            </>
            );
        },
        },
        {
        id: "open_date",
        Header: "Open Date",
        accessor: "openstoreon",
        column_name: "openstoreon",
        Cell: ({ value }) => {
            return value ? (
            <>
                <div >{DateTimeFormat(value).date} </div>
                {/* <div className="text-[#707070] text-xs font-normal">
                    {format(new Date(value), "hh:mm a")}
                </div> */}
            </>
            ) : (
            ""
            );
        },
        },
        {
        id: "close_date",
        Header: "Close Date",
        accessor: "closestoreon",
        column_name: "closestoreon",
        Cell: ({ value }) => {
            return value ? (
            <>
                <div >{DateTimeFormat(value).date} </div>
                {/* <div className="text-[#707070] text-xs font-normal">
                    {format(new Date(value), "hh:mm a")}
                </div> */}
            </>
            ) : (
            ""
            );
        },
        },
        {
        id: "store_id",
        Header: "Store ID",
        accessor: "code",
        column_name: "code",
        Cell: ({ value }) => {
            return (
            <>
                <div className="text-sm font-normal">{value ? value : ""}</div>
            </>
            );
        },
        },
        {
        id: "orders",
        Header: "Orders",
        accessor: "orders",
        column_name: "orders",
        Cell: ({ value }) => {
            return (
            <>
                <div className="text-sm font-normal">{value ? value : 0}</div>
            </>
            );
        },
        },
        {
        id: "product",
        Header: "Product",
        accessor: "products",
        column_name: "products",
        Cell: ({ value }) => {
            return (
            <>
                <div className="text-sm font-normal">{value ? value : 0}</div>
            </>
            );
        },
        },
        {
        id: "recstatus",
        Header: "status",
        accessor: "recstatus",
        column_name: "recstatus",
        Cell: ({ value }) => {
            return <Status type={value} />;
        },
        },
        {
        id: "created_date",
        Header: "Created Date",
        accessor: "createddate",
        column_name: "createddate",
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
        id: "created_by",
        Header: "Created By",
        accessor: "createdby",
        column_name: "createdby",
        Cell: ({ value }) => {
            return (
            <>
                <div className="text-sm font-normal">{value ? value : ""}</div>
            </>
            );
        },
        },
        {
        id: "updated_date",
        Header: "Updated Date",
        accessor: "modifieddate",
        column_name: "modifieddate",
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
        id: "updated_by",
        Header: "Updated By",
        accessor: "modifiedby",
        column_name: "modifiedby",
        Cell: ({ value }) => {
            return (
            <>
                <div className="text-sm font-normal">{value ? value : ""}</div>
            </>
            );
        },
        },
        // {
        //     id: "action",
        //     Header: "",
        //     accessor: "storeid",
        //     column_name: "action",
        //     disableSortBy: true,
        //     disableShowHide: true,
        // },
    ];

    const [Data, setData] = useState([]);
    const [store, setStore] = useState(null);

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

    const [selectedRows, setSelectedRows] = useState([]);
    const [filteringOptions, setColumnFilteringOptions] = useState([]);

    const getStoreBuilderData = useCallback(
        (pageIndex = 1) => {
        dispatch(setAddLoading(true))

        StoreBuilderService.getStoreBuilderList({
            args: {
            pageSize: paginationData.pageSize,
            pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
            sortingOptions,
            filteringOptions,
            },
        })
            .then((response) => {
            if (response.data.success) {
                setData(response.data.data.data);
                let hasNextPage = false;
                let hasPreviousPage = false;
                if (response.data.data.last_page > response.data.data.from) {
                hasNextPage = true;
                }
                if (response.data.data.from > 1) {
                hasPreviousPage = true;
                }
                setPaginationData((prevState) => ({
                ...prevState,
                pageIndex: response.data.data.current_page,
                pageSize: response.data.data.per_page,
                totalCount: response.data.data.total,
                totalPages: response.data.data.last_page,
                hasPreviousPage: hasPreviousPage,
                hasNextPage: hasNextPage,
                }));
            }
            dispatch(setAddLoading(false))

            })
            .catch(() => {
            dispatch(setAddLoading(false))
            });
        },
        [
        filteringOptions,
        paginationData.pageSize,
        sortingOptions,
        paginationData.pageIndex
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

    const handleStoreTrashDelete = (store) => {
        console.log(store, 'delete');
    };

    return (
        <>
        <title>Store Builder Trash list</title>
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
            <div className="col-span-full w-full flex justify-between items-center">
                <h1 className="text-2xl md:text-3xl text-gray-800 font-bold flex items-center">
                    <NavLink
                        to={"/admin/StoreBuilder/store"}
                        className="btn border-neutral-200 hover:border-neutral-400 text-gray-500 hover:text-gray-700 flex items-center mr-2"
                        >
                        <span className="material-icons-outlined">west</span>
                    </NavLink>
                    <span>Store Builder Trash list</span>
                </h1>
            </div>
            </div>
            <Messages />
            <div className="col-span-full w-full bg-white shadow-xxl rounded-md mb-8 relative">
            <ReactTable
                COLUMNS={COLUMNS}
                DATA={Data}
                {...paginationData}
                fetchData={getStoreBuilderData}
                sortingOptions={sortingOptions}
                setSortingOptions={setSortingOptionHandler}
                setTablePageSize={(value) =>
                setPaginationDataFunc("pageSize", value)
                }
                // column filters
                editColumnFilter={true}
                filteringOptions={filteringOptions}
                setColumnFilteringOptions={setColumnFilteringOptions}
                hiddenColumns={["rowSelection"]}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                morefilter={true}
                moreFilterOption={moreFilterOptions}

            />
            </div>
        </div>
        <ConfirmDelete
            handleDelete={handleStoreTrashDelete}
            data={store}
            message="Deleting this Store will permanently remove this record from your account. This can't be undone"
            openDeleteModal={openDeleteModal}
            setOpenDeleteModal={setOpenDeleteModal}
            title={"Delete"}
        />
        </>
    )
}

export default TrashList