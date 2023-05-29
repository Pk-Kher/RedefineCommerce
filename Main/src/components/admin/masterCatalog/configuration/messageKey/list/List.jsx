import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import ReactTable from "components/common/table/ReactTableServerSide";
import { DateTimeFormat, serverError } from "services/common/helper/Helper";
import { paginationDetails, RecStatusValuebyName } from "global/Enum";
import Status from "components/common/displayStatus/Status";
import DropdownService from "services/common/dropdown/DropdownService";
import Actions from "./Action";
import AddMessageKeyModel from "../create/AddMessageKeyModel";
import { RecStatusValueForForm } from "global/Enum";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { ValidationMsgs } from "global/ValidationMessages";
import Messages from "components/common/alerts/messages/Index";
import BasciModal from "components/common/modals/Basic";
import { useLocation } from "react-router";
import MessageKeyServices from "services/admin/mesaageKey/MessageKeyServices";

const List = () => {
  const [Data, setData] = useState([]);
  const dispatch = useDispatch();
  const [userNameValues, setUserNameValues] = useState([]);
  const [openAddActionModal, setOpenAddActionModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [basicModalInfo, setBasicModalInfo] = useState({});
  const [openBasicModal, setOpenBasicModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [messageKey, setMessageKey] = useState(null);
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

  const getMessageKeys = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true));
      MessageKeyServices.getMessageKeys({
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

  const handleDelete = (messageKeys) => {
    var ids = [];
    if (messageKeys.length > 0) {
      ids = messageKeys.map((value) => {
        return { item1: value.id, item2: value.rowVersion };
      });
    } else {
      ids = [{ item1: messageKeys.id, item2: messageKeys.rowVersion }];
    }
    dispatch(setAddLoading(true));

    MessageKeyServices.updateMultipleStatus({
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
              message: ValidationMsgs.messageKey.messageKeyDeleted,
            })
          );
          getMessageKeys();
        } else {
          dispatch(
            setAlertMessage({
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
          setAlertMessage({
            message: ValidationMsgs.messageKey.messageKeyNotDeleted,
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

      MessageKeyServices.updateStatus({
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
                  ValidationMsgs.messageKey.messageKeyStatusUpdated,
              })
            );
            getMessageKeys();
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
                  ValidationMsgs.messageKey.messageKeyStatusNotUpdated,
                type: "danger",
              })
            );
          }
          dispatch(setAddLoading(false));
        });
    }
    setOpenBasicModal(false);
  };

  useEffect(() => {
    DropdownService.getDropdownValues("adminuser").then((response) => {
      setUserNameValues(response.data.data);
    });
  }, []);
  const handleSort = (sortValue) => { };
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
            handleShowModal={handleShowModal}
            id={value}
            row={row}
            setOpenDeleteModal={setOpenDeleteModal}
            setBasicModalInfo={setBasicModalInfo}
            setOpenBasicModal={setOpenBasicModal}
            setOpenAddActionModal={setOpenAddActionModal}
            setMessageKey={setMessageKey}
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
      <title>Message Key</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="col-span-full w-full flex justify-between mb-8">
          <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
            Message Key
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
            <span className="ml-1">Message Key</span>
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
            fetchData={getMessageKeys}
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
            hiddenColumns={useMemo(() => ["rowSelection"], [])}
            saveFilter={{ show: true, tabName: pathname + '_' + 'messageKey' }}
          />
        </div>
      </div>
      <ConfirmDelete
        handleDelete={handleDelete}
        data={messageKey}
        message={ValidationMsgs.messageKey.messageKeyPermanentDelete}
        title={"Delete"}
        module={"Message Key"}
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
      />
      <BasciModal
        handleConfirmation={statusChangedHandler}
        openModal={openBasicModal}
        setOpenModal={setOpenBasicModal}
        {...basicModalInfo}
      />
      {openAddActionModal && (
        <AddMessageKeyModel
          handleShowModal={handleShowModal}
          getMessageKeys={getMessageKeys}
          idson={editId}
        />
      )}
      {/* <ConfirmDelete /> */}
    </>
  );
};
export default List;
