/*Component Name: List
Component Functional Details: User can create or update List of Store Builder details from here.
Created By: Keval Takodara
Created Date: 30th SEP, 2022
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useCallback, useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import ReactTable from "components/common/table/ReactTableServerSide";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import Messages from "components/common/alerts/messages/Index";
import { DateTimeFormat, serverError } from "services/common/helper/Helper";
import {
  paginationDetails,
  RecStatusValuebyName,
  defaultImage,
  RecStatusValueForForm,
} from "global/Enum";
import Status from "components/common/displayStatus/Status";
import StoreBuilderService from "services/admin/storeBuilder/StoreBuilderService";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import Actions from "./Actions";
import Clone from "./Clone";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { ValidationMsgs } from "global/ValidationMessages";
import Image from "components/common/formComponent/Image";
import DropdownService from "services/common/dropdown/DropdownService";
import { useLocation } from "react-router-dom";
import BasciModal from "components/common/modals/Basic";

const List = () => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openCloneModal, setOpenCloneModal] = useState(false);
  const [openBasicModal, setOpenBasicModal] = useState(false);
  const [basicModalInfo, setBasicModalInfo] = useState({});
  const location = useSelector((store) => store?.location);
  const [userNameValues, setUserNameValues] = useState([]);

  const [Data, setData] = useState([]);
  const [store, setStore] = useState(null);
  const [storesDropdownData, setStoresDropdownData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filteringOptions, setColumnFilteringOptions] = useState([]);
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const COLUMNS = [
    {
      id: "logoUrl",
      Header: "Merchstore",
      accessor: "logoUrl",
      column_name: "merchStore",
      Cell: ({ value, row }) => {
        return value !== null && value !== "" && value !== undefined ? (
          <>
            <NavLink
              to={"/admin/StoreBuilder/store/edit/" + row.original.storeId}
            >
              <div className="h-20 w-20 flex items-center justify-center overflow-hidden  box-content border bg-white">
                <Image
                  src={value}
                  className="max-h-full"
                  containerheight={""}
                />
              </div>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to={"/admin/StoreBuilder/store/edit/" + row.original.storeId}
            >
              <div className="h-20 w-20 flex items-center justify-center overflow-hidden  box-content border bg-white">
                <Image
                  className="max-h-full"
                  containerheight={""}
                  src={defaultImage}
                />
              </div>
            </NavLink>
          </>
        );
      },
    },
    {
      id: "merchStore",
      Header: "",
      accessor: "merchStore",
      column_name: "merchStore",
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
                <NavLink
                  to={"/admin/StoreBuilder/store/edit/" + row.original.storeId}
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
      id: "domain",
      Header: "Domain",
      accessor: "domain",
      column_name: "domain",
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
      id: "customerContact",
      Header: "Customer Contact",
      accessor: "customerContact",
      column_name: "customerContact",
      Cell: ({ value }) => {
        return (
          <>
            <div className="text-sm font-normal">{value ? value : ""}</div>
          </>
        );
      },
    },
    {
      id: "openDate",
      Header: "Open Date",
      accessor: "openDate",
      column_name: "openDate",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div>{DateTimeFormat(value).date} </div>
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
      id: "closeDate",
      Header: "Close Date",
      accessor: "closeDate",
      column_name: "closeDate",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div>{DateTimeFormat(value).date} </div>
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
      id: "storeId",
      Header: "Store ID",
      accessor: "storeId",
      column_name: "storeId",
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
      id: "createdDate",
      Header: "Created Date",
      accessor: "createdDate",
      column_name: "createdDate",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div>{DateTimeFormat(value).date} </div>
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
      Header: "Created By",
      accessor: "createdBy",
      column_name: "createdBy",
      Cell: ({ value }) => {
        return (
          <>
            <div className="text-sm font-normal">{value ? value : ""}</div>
          </>
        );
      },
    },
    {
      id: "updatedDate",
      Header: "Updated Date",
      accessor: "updatedDate",
      column_name: "updatedDate",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div>{DateTimeFormat(value).date} </div>
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
      Header: "Updated By",
      accessor: "updatedBy",
      column_name: "updatedBy",
      Cell: ({ value }) => {
        return (
          <>
            <div className="text-sm font-normal">{value ? value : ""}</div>
          </>
        );
      },
    },
    {
      id: "status",
      Header: "status",
      accessor: "status",
      column_name: "status",
      Cell: ({ value }) => {
        return <Status type={value} />;
      },
    },
    {
      id: "action",
      Header: "",
      accessor: "storeId",
      column_name: "action",
      Cell: ({ value, row }) => {
        return (
          <Actions
            id={value}
            row={row}
            setDeleteData={setStore}
            setOpenDeleteModal={setOpenDeleteModal}
            setCloneData={setStore}
            setOpenCloneModal={setOpenCloneModal}
            setBasicModalInfo={setBasicModalInfo}
            setOpenBasicModal={setOpenBasicModal}
          />
        );
      },
      disableSortBy: true,
      disableShowHide: true,
    },
  ];

  const moreFilterOption = useMemo(() => [
    {
      name: "Store",
      columnName: "storeId",
      options: storesDropdownData,
      type: "checkbox",
      conditionalSearch: true,
    },
    {
      name: "Created By",
      options: userNameValues,
      columnName: "createdBy",
      type: "checkbox",
    },
    {
      name: "Created Date",
      columnName: "createddate",
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
  ]);

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

  useEffect(() => {
    DropdownService.getDropdownValues("adminuser").then((response) => {
      setUserNameValues(response.data.data);
    });

    DropdownService.getDropdownValues("store").then((response) => {
      setStoresDropdownData(response.data.data);
    });
  }, []);

  const setSortingOptionHandler = (column, direction) => {
    setSortingOptions([
      {
        field: column,
        direction: direction,
        priority: 0,
      },
    ]);
  };

  const getStoreBuilderData = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true));
      StoreBuilderService.getStoreBuilderList({
        storeTypeId: 3,
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
        dispatch(setAddLoading(false));
      });
    },
    [
      filteringOptions,
      paginationData.pageSize,
      sortingOptions,
      paginationData.pageIndex,
    ]
  );

  const handleDelete = (store) => {
    var ids = [];
    if (store.length) {
      ids = store.map((value) => {
        return { item1: value.id, item2: value.rowVersion };
      });
    } else {
      ids = [{ item1: store.id, item2: store.rowVersion }];
    }
    dispatch(setAddLoading(true));
    StoreBuilderService.deleteStore({
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
              type: "success",
              message: ValidationMsgs.storeBuilder.storeDeleted,
            })
          );
          getStoreBuilderData();
        } else {
          dispatch(
            setAlertMessage({
              type: "success",
              message: serverError(response),
            })
          );
          dispatch(setAddLoading(false));
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
          setAlertMessage({
            message: ValidationMsgs.storeBuilder.storeDeleted,
            type: "danger",
          });
        }
        dispatch(setAddLoading(false));
      });
  };

  const statusChangedHandler = (store) => {
    var ids = [];
    if (store.length) {
      ids = store.map((value) => {
        return { item1: value.id, item2: value.rowVersion };
      });
    } else {
      ids = [{ item1: store.id, item2: store.rowVersion }];
    }
    dispatch(setAddLoading(true));
    StoreBuilderService.deleteStore({
      args: {
        idsRowVersion: ids,
        status: store.changeStatus,
        ...location,
      },
    })
      .then((response) => {
        if (response.data.data) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.storeBuilder.storeStatusUpdated,
            })
          );
          getStoreBuilderData();
        } else {
          dispatch(
            setAlertMessage({
              type: "success",
              message: serverError(response),
            })
          );
        }
        setOpenBasicModal(false);
        dispatch(setAddLoading(false));
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
          setAlertMessage({
            message: ValidationMsgs.storeBuilder.storeStatusUpdated,
            type: "danger",
          });
        }
        dispatch(setAddLoading(false));
      });
  };

  return (
    <>
      <title>Store Builder list</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          <div className="col-span-full w-full flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
              Store Builder list
            </h1>
            <div className="ml-328px "></div>
            <div className="flex flex-wrap sm:auto-cols-min gap-2">
              <NavLink
                to={"/admin/StoreBuilder/store/create"}
                className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                <span className="material-icons-outlined">add</span>
                <span className="ml-1"> Store Builder </span>
              </NavLink>
              <NavLink
                to={"/admin/StoreBuilder/store/trash"}
                className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                <span className="ml-1"> Trash List </span>
              </NavLink>
            </div>
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
            moreFilterOption={moreFilterOption}
            saveFilter={{
              show: true,
              tabName: pathname + "_" + "storeBuilder",
            }}
          />
        </div>
      </div>
      <ConfirmDelete
        handleDelete={handleDelete}
        data={store}
        message="Deleting this Store will permanently remove this record from your account. This can't be undone"
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
        title={"Delete"}
      />

      <BasciModal
        handleConfirmation={statusChangedHandler}
        openModal={openBasicModal}
        setOpenModal={setOpenBasicModal}
        {...basicModalInfo}
      />

      <Clone
        openCloneModal={openCloneModal}
        setOpenCloneModal={setOpenCloneModal}
        data={store}
      />
    </>
  );
};

export default List;
