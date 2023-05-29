import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import ShippingService from "services/admin/shippingService/shippingService";
import ReactTable from "components/common/table/ReactTableServerSide";
import { DateTimeFormat, serverError } from "services/common/helper/Helper";
import { paginationDetails, RecStatusValuebyName } from "global/Enum";
import Status from "components/common/displayStatus/Status";
import DropdownService from "services/common/dropdown/DropdownService";
import { RecStatusValueForForm } from "global/Enum";
import AddShippingServiceModal from "../create/AddShippingServiceModal";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { ValidationMsgs } from "global/ValidationMessages";
import Messages from "components/common/alerts/messages/Index";
import BasciModal from "components/common/modals/Basic";
import Actions from "./Action";
import { useLocation } from "react-router";

const List = () => {
  const [Data, setData] = useState([]);
  const dispatch = useDispatch();
  const [userNameValues, setUserNameValues] = useState([]);
  const [openAddActionModal, setOpenAddActionModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [basicModalInfo, setBasicModalInfo] = useState({});
  const [openBasicModal, setOpenBasicModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [shippingService, setShippingService] = useState(null);
  const [editId, setEditId] = useState(null);

  const location = useSelector((store) => store?.location);
  const handleShowModal = () => {
    setOpenAddActionModal((prev) => !prev);
  };
  const [sortingOptions, setSortingOptions] = useState([
    {
      field: "name",
      direction: 0,
      priority: 0,
    },
  ]);
  const [filteringOptions, setColumnFilteringOptions] = useState([]);
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

  useEffect(() => {
    DropdownService.getDropdownValues("adminuser").then((response) => {
      setUserNameValues(response.data.data);
    });
  }, []);

  const handleSort = (sortValue) => { };

  const getShippingService = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true));
      ShippingService.getShippingService({
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

  const handleDelete = (shippingService) => {
    var ids = [];
    if (shippingService.length) {
      ids = shippingService.map((value) => {
        return { item1: value.id, item2: value.rowVersion };
      });
    } else {
      ids = [{ item1: shippingService.id, item2: shippingService.rowVersion }];
    }
    dispatch(setAddLoading(true));

    ShippingService.updateMultipleStatus({
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
              message: ValidationMsgs.shippingService.shippingServiceDeleted,
            })
          );
          getShippingService();
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
            message: ValidationMsgs.shippingService.shippingServiceNotDeleted,
            type: "danger",
          });
        }
        dispatch(setAddLoading(false));
      });
    setOpenDeleteModal(false);
  };

  const statusChangedHandler = (data) => {
    if (data?.id) {
      dispatch(setAddLoading(true));

      ShippingService.updateStatus({
        args: {
          id: data.id,
          rowVersion: data.rowVersion,
          status: data.changeStatus,
          ...location,
        },
      })
        .then((response) => {
          if (response.data.data) {
            dispatch(
              setAlertMessage({
                view: true,
                type: "success",
                message:
                  ValidationMsgs.shippingService.shippingServiceStatusUpdated,
              })
            );
            getShippingService();
          } else {
            dispatch(
              setAlertMessage({
                view: true,
                type: "danger",
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
            dispatch(
              setAlertMessage({
                message:
                  ValidationMsgs.shippingService
                    .shippingServiceStatusNotUpdated,
                type: "danger",
              })
            );
          }
          dispatch(setAddLoading(false));
        });
    }
    setOpenBasicModal(false);
  };

  const COLUMNS = [
    {
      id: "name",
      Header: "Name",
      accessor: "name",
      column_name: "name",
      disableShowHide: true,
      Cell: ({ value, row }) => {
        return row ? (
          <>
            <div
              className="w-full flex justify-start items-center group + cursor-pointer"
              style={{ width: "200px" }}
            >
              <div>
                <div
                  className="text-sm font-normal"
                  onClick={() => {
                    setEditId(row.original.id);
                    handleShowModal();
                  }}
                >
                  {value ? value : ""}
                </div>
              </div>
            </div>
          </>
        ) : (
          ""
        );
      },
    },
    {
      id: "userName",
      Header: "User Name",
      accessor: "userName",
      column_name: "userName",
    },
    {
      id: "password",
      Header: "Password",
      accessor: "password",
      column_name: "password",
    },
    {
      id: "clientKey",
      Header: "Client Key",
      accessor: "clientKey",
      column_name: "clientKey",
    },
    {
      id: "secretKey",
      Header: "Secret Key",
      accessor: "secretKey",
      column_name: "secretKey",
    },
    {
      id: "token",
      Header: "Token",
      accessor: "token",
      column_name: "token",
    },
    {
      id: "url",
      Header: "URL",
      accessor: "url",
      column_name: "url",
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
              {DateTimeFormat(value).time}
            </div>
          </>
        ) : (
          ""
        );
      },
    },
    {
      id: "createdName",
      Header: "Created By",
      accessor: "createdName",
      column_name: "createdName",
    },
    {
      id: "Updated Date",
      Header: "Updated Date",
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
          ""
        );
      },
    },
    {
      id: "Updated By",
      Header: "Updated By",
      accessor: "modifiedName",
      column_name: "modifiedName",
    },
    {
      id: "status",
      Header: "Status",
      accessor: "recStatus",
      column_name: "recStatus",
      Cell: ({ value }) => {
        if (value !== undefined) {
          return <Status type={value} />;
        } else {
          return "";
        }
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
            handleShowModal={handleShowModal}
            id={value}
            row={row}
            setOpenDeleteModal={setOpenDeleteModal}
            setBasicModalInfo={setBasicModalInfo}
            setOpenBasicModal={setOpenBasicModal}
            setOpenAddActionModal={setOpenAddActionModal}
            setShippingService={setShippingService}
            setEditId={setEditId}
          />
        );
      },
      disableSortBy: true,
      disableShowHide: true,
    },
  ];

  const moreFilterOption = useMemo(() => [
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
  const { pathname } = useLocation();
  return (
    <>
      <title>Shipping Service</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="col-span-full w-full flex justify-between mb-8">
          <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
            Shipping Service
          </h1>
          <button
            className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
            type="button"
            onClick={() => {
              setEditId(null);
              handleShowModal();
            }}
          >
            <span className="material-icons-outlined"> add</span>
            <span className="ml-1">Shipping Service</span>
          </button>
        </div>
        {!openAddActionModal && <Messages />}
        <div className="col-span-full w-full bg-white shadow-xxl rounded-md mb-8 relative">
          <ReactTable
            COLUMNS={COLUMNS}
            DATA={Data}
            {...paginationData}
            setTablePageSize={(value) =>
              setPaginationDataFunc("pageSize", value)
            }
            fetchData={getShippingService}
            sortingOptions={sortingOptions}
            setSortingOptions={setSortingOptionHandler}
            handleSort={handleSort}
            setColumnFilteringOptions={setColumnFilteringOptions}
            moreFilterOption={moreFilterOption}
            editColumnFilter={true}
            setSelectedRows={setSelectedRows}
            selectedRows={selectedRows}
            filteringOptions={filteringOptions}
            moreFilter={true}
            hiddenColumns={useMemo(() => ['rowSelection'], [])}
            saveFilter={{ show: true, tabName: pathname + '_' + 'shippingService' }}
          />
        </div>
      </div>
      <ConfirmDelete
        handleDelete={handleDelete}
        data={shippingService}
        messages={ValidationMsgs.shippingService.shippingServicePermanentDelete}
        title={"Delete"}
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
        module={"Shipping Service"}
      />
      <BasciModal
        handleConfirmation={statusChangedHandler}
        openModal={openBasicModal}
        setOpenModal={setOpenBasicModal}
        {...basicModalInfo}
      />
      {openAddActionModal && (
        <AddShippingServiceModal
          handleShowModal={handleShowModal}
          getShippingService={getShippingService}
          idson={editId}
        />
      )}
    </>
  );
};

export default List;
