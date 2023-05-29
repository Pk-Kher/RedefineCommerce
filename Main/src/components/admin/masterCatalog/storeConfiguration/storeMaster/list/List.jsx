import React, { useState, useCallback } from "react";
import ReactTable from "components/common/table/ReactTableServerSide";
import Actions from "./Actions";
import { Link, useLocation } from "react-router-dom";
import CheckBoxAction from "./CheckBoxAction";
import StoreService from "services/admin/store/StoreService";
import Status from "components/common/displayStatus/Status";
import Image from "components/common/formComponent/Image";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import BasicModal from "components/common/modals/Basic";
import Messages from "components/common/alerts/messages/Index";
import { defaultImage, RecStatusValuebyName, RecStatusValueForForm, } from "global/Enum";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { paginationDetails } from "global/Enum";
import { DateTimeFormat, serverError, } from "services/common/helper/Helper";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { ValidationMsgs } from "global/ValidationMessages";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import DropdownService from "services/common/dropdown/DropdownService";
import { useMemo } from "react";

const List = () => {
  const permission = useSelector(store => store.permission);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [ModalInfo, setModalInfo] = useState({});
  const [openBasicModal, setOpenBasicModal] = useState(false);
  const [store, setStore] = useState(null);
  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);
  const COLUMNS = [
    // { Header: "ID", accessor: "id", Footer: "ID" },
    {
      id: "logoUrl",
      Header: "Image",
      accessor: "logoUrl",
      Footer: "Image",
      column_name: "logoUrl",
      disableShowHide: true,
      disableSortBy: true,
      Cell: ({ value, row }) => {
        return value !== null && value !== "" && value !== undefined ? (
          <>
            <div className="flex items-center ">
              <Link
                to={
                  "/admin/MasterCatalog/Store/edit/" +
                  row.original.id
                }
              >
                <Image className="w-20" containerheight={"h-20"} src={value} alt={row.name} />
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center ">
              <Link
                to={
                  "/admin/MasterCatalog/Store/edit/" +
                  row.original.id
                }
              >
                <Image className="w-20" containerheight={"h-20"} src={defaultImage} />
              </Link>
            </div>
          </>
        );
      },
    },
    {
      id: "store name",
      Header: "store NAME",
      accessor: "name",
      Footer: "NAME",
      column_name: "name",
      disableShowHide: true,
      Cell: ({ value, row }) => {
        return row ? (
          <>
            <div
              className="w-full flex justify-start items-center group"
              style={{ width: "100px" }}
            >
              <div>
                <Link
                  to={
                    "/admin/MasterCatalog/Store/edit/" +
                    row.original.id
                  }
                >
                  {value}
                </Link>
              </div>
            </div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "ofProducts",
      Header: "#of products",
      accessor: "ofProducts",
      Footer: "ofProducts",
      column_name: "ofProducts",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div className="w-full flex justify-start items-center group">
              {value}
            </div>
          </>
        ) : (
          ""
        );
      },
    },
    {
      id: "createdDate",
      Header: "CREATED date",
      accessor: "createdDate",
      Footer: "CREATED",
      column_name: "createdDate",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div>{DateTimeFormat(value).date} </div>
            <div className="text-[#707070] text-xs font-normal">
              {DateTimeFormat(value).time}
            </div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "createdBy",
      Header: "Created By",
      accessor: "createdName",
      Footer: "Created By",
      column_name: "createdName",
    },
    {
      id: "UPDATED date",
      Header: "UPDATED date",
      accessor: "modifiedDate",
      Footer: "UPDATED",
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
          "-"
        );
      },
    },
    {
      id: "Updated By",
      Header: "Updated By",
      accessor: "modifiedName",
      Footer: "Updated By",
      column_name: "modifiedName",
    },

    {
      id: "recStatus",
      Header: "Status",
      accessor: "recStatus",
      column_name: "recStatus",
      Cell: ({ value }) => {
        if (value !== undefined) {
          return <Status type={value} />;
        } else {
          return "-";
        }
      },
    },
    {
      id: "action",
      Header: "Action",
      accessor: "action",
      column_name: "action",
      Cell: ({ value, row }) => {
        return (
          <div className="leading-7 py-3 text-left w-36">
            <div >
              <Link
                to={`/admin/MasterCatalog/Store/configuration/${row.original.id}`}
                className="text-indigo-500"
              >
                Configure Store
              </Link>
            </div>
            <div >
              <Link
                to={`/admin/MasterCatalog/Store/configuration/Theme/${row.original.id}`}
                className="text-indigo-500"
              >
                Configure Theme
              </Link>
            </div>
            {row.original.storeTypeId !== 1 && (
              <div >
                <Link
                  to={`/admin/MasterCatalog/Store/SEO/${row.original.id}`}
                  className="text-indigo-500"
                >
                  Configure SEO
                </Link>
              </div>
            )}
            {/* <div >
              <Link
                to={`/admin/Content/config/Header/${row.original.id}`}
                className="text-indigo-500"
              >
                Configure Header
              </Link>
            </div> */}

            <div >
              <Link
                to={`/admin/MasterCatalog/Store/${row.original.id}/Menu`}
                className="text-indigo-500"
              >
                Configure Menu
              </Link>
            </div>
            <div >
              <Link
                to={`/admin/MasterCatalog/Store/${row.original.id}/General`}
                className="text-indigo-500"
              >
                Configure General
              </Link>
            </div>
          </div>
        );
      },
      disableSortBy: true,
      disableShowHide: true,
    },
    {
      id: "actionMenu",
      Header: "",
      accessor: "id",
      column_name: "actionMenu",
      Cell: ({ value, row }) => {
        return (
          <Actions
            id={value}
            setStore={setStore}
            row={row}
            openDeleteModal={openDeleteModal}
            setOpenDeleteModal={setOpenDeleteModal}
            setModalInfo={setModalInfo}
            setOpenBasicModal={setOpenBasicModal}
          />
        );
      },
      disableSortBy: true,
      disableShowHide: true,
    },
  ];

  const [Data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({
    ...paginationDetails,
  });
  const setPaginationDataFunc = (key, value) => {
    setPaginationData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };
  const [sortingOptions, setSortingOptions] = useState([
    {
      field: "firstname",
      direction: 0,
      priority: 0,
    },
  ]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filteringOptions, setColumnFilteringOptions] = useState([]);

  const getStoreData = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true))

      StoreService.getStores({
        args: {
          pageSize: paginationData.pageSize,
          pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
          sortingOptions,
          filteringOptions,
        },
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

  const handleSort = (sortValue) => { };

  const statusChangedHandler = (data) => {
    dispatch(setAddLoading(true))

    StoreService.updateStatus({
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
              message: ValidationMsgs.store.statusUpdated,
            })
          );
          getStoreData();
          setOpenBasicModal(false);
        } else {
          dispatch(
            setAlertMessage({
              view: true,
              type: "danger",
              message: serverError(response),
            })
          );
          setOpenBasicModal(false);
          dispatch(setAddLoading(false))
        }

      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            view: true,
            type: "danger",
            message: ValidationMsgs.store.statusNotUpdated,
          })
        );
        setOpenBasicModal(false);
        dispatch(setAddLoading(false))

      });
    setOpenBasicModal(false);

  };
  const handleDelete = (store) => {
    dispatch(setAddLoading(true))

    var ids = [];
    if (Array.isArray(store)) {
      ids = store.map((value) => {
        return { item1: value.id, item2: value.rowVersion };
      });
    } else {
      ids = [{ item1: store.id, item2: store.rowVersion }];
    }
    StoreService.updateMultipleStatus({
      args: {
        idsRowVersion: ids,
        status: RecStatusValuebyName.Archived,
        ...location,
      },
    })
      .then((response) => {
        if (response.data.data) {
          dispatch(
            setAlertMessage({
              view: true,
              type: "success",
              message: ValidationMsgs.store.storeDeleted,
            })
          );
          getStoreData();
          getStoreDropdownData();
          setColumnFilteringOptions((prevData) => {
            let prevFilterData = prevData.filter((currentFilterObj) => {
              return currentFilterObj.field !== "id"
            })
            console.log(prevFilterData, "prevFilterData")
            return prevFilterData
          })
        } else {
          dispatch(
            setAlertMessage({
              view: true,
              type: "danger",
              message: serverError(response),
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
            setAlertMessage({ message: ValidationMsgs.store.storeNotDeleted, type: "danger" })
          );
        }
        dispatch(setAddLoading(false))

      });
    setOpenDeleteModal(false);
  };

  const [Stores, setStores] = useState([]);
  const [Users, setUsers] = useState([]);

  const getStoreDropdownData = useCallback(() => {
    DropdownService.getDropdownValues("store", true).then((res) => {
      if (res.data.success && res.data.data) {
        setStores(() => {
          return res.data.data;
        });
      }
    });
  }, [])

  useEffect(() => {
    DropdownService.getDropdownValues("adminuser").then((res) => {
      if (res.data.success && res.data.data) {
        setUsers(() => {
          return res.data.data;
        });
      }
    });
    getStoreDropdownData();
  }, [Data, getStoreDropdownData]);

  const moreFilterOptions = [
    {
      name: "Name",
      columnName: "id",
      options: Stores,
      type: "checkbox",
    },
    {
      name: "Created Date",
      columnName: "createdDate",
      options: [],
      type: "date",
    },
    {
      name: "Created By",
      columnName: "createdBy",
      options: Users,
      type: "checkbox",
      conditionalSearch: true,
    },
    {
      name: "Updated Date",
      columnName: "modifiedDate",
      options: [],
      type: "date",
    },

    {
      name: "Updated By",
      columnName: "modifiedBy",
      options: Users,
      type: "checkbox",
      conditionalSearch: true,
    },
    {
      name: "Status",
      columnName: "recStatus",
      options: RecStatusValueForForm,
      type: "radio",
    },
  ]
  const { pathname } = useLocation();

  return (
    <>
      <title>Store List</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
        <div className="col-span-full w-full flex justify-between mb-8">
          <div className="col-span-full w-full flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
              Store Setup
            </h1>
            {(permission?.isEdit || permission?.isDelete) &&
              <div className="flex flex-wrap sm:auto-cols-max gap-2">
                <Link
                  to={"create"}
                  className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                >
                  <span className="material-icons-outlined">add</span>{" "}
                  <span className="ml-1">Add Store</span>
                </Link>
              </div>
            }
          </div>
        </div>
        <Messages />
        <div className="col-span-full w-full bg-white shadow-xxl rounded-md mb-8 relative">
          <ReactTable
            COLUMNS={COLUMNS}
            DATA={Data}
            {...paginationData}
            setTablePageSize={(value) =>
              setPaginationDataFunc("pageSize", value)
            }
            fetchData={getStoreData}
            sortingOptions={sortingOptions}
            setSortingOptions={setSortingOptionHandler}
            handleSort={handleSort}
            // column filters
            editColumnFilter={true}
            filteringOptions={filteringOptions}
            setColumnFilteringOptions={setColumnFilteringOptions}
            setSelectedRows={setSelectedRows}
            moreFilterOption={moreFilterOptions}
            selectedRows={selectedRows}
            CheckBoxAction={({ ...rest }) => (
              <CheckBoxAction
                setOpenDeleteModal={setOpenDeleteModal}
                setStore={setStore}
                {...rest}
              />
            )}
            saveFilter={{ show: true, tabName: pathname + '_' + 'storeSetup' }}
          />
        </div>
      </div>
      <ConfirmDelete
        handleDelete={handleDelete}
        message={ValidationMsgs.store.deletePermanently}
        title={"Delete"}
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
        data={store}
      />
      <BasicModal
        handleConfirmation={statusChangedHandler}
        openModal={openBasicModal}
        setOpenModal={setOpenBasicModal}
        {...ModalInfo}
      />
    </>
  );
};

export default List;
