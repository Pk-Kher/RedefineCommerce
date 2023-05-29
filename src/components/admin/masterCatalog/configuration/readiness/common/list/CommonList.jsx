/*Component Name: List
Component Functional Details: Common List if SEO and Product Readiness.
Created By: Happy
Created Date: 31/5/22
Modified By: Happy
Modified Date: 07/21/2022 */

import React, { useCallback, useMemo, useState } from "react";
import ReactTable from "components/common/table/ReactTableServerSide";
import { useDispatch } from "react-redux";
import { PageName } from "global/Enum";
import { paginationDetails, RecStatusValuebyName, } from "global/Enum";
import Actions from "./Actions";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import BasicModal from "components/common/modals/Basic";
import Messages from "components/common/alerts/messages/Index";
import { Link, NavLink } from "react-router-dom";
import { DateTimeFormat, serverError } from "services/common/helper/Helper";
import { format } from "date-fns";
import Status from "components/common/displayStatus/Status";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { useSelector } from "react-redux";
import ViewHistory from "components/common/modals/ViewHistory";
import { ValidationMsgs } from "global/ValidationMessages";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const List = ({ title, editURL, getReadinessAPI, statusChangeAPI, multiplestatusChangeAPI }) => {
  const permission = useSelector(store => store.permission);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const location = useSelector((store) => store?.location);
  const [readiness, setReadiness] = useState(null);
  const [ModelInfo, setModalInfo] = useState({});
  const [openBasicModal, setOpenBasicModal] = useState(false);
  const [viewHistoryModal, setViewHistoryModal] = useState(false);
  const [RecordId, setRecordId] = useState(null);

  const dispatch = useDispatch();
  const [Data, setData] = useState([]);

  const totalPercent = Data.reduce(
    (total, currentValue) => (total = total + currentValue.percentage),
    0
  );
  const COLUMNS = useMemo(
    () => [
      {
        id: "store name",
        Header: "Store Name",
        accessor: "storeName",
        column_name: "storeName",
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
                    to={
                      `${editURL}/${row.original.id}`
                    }
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
        id: "name",
        Header: "Name",
        accessor: "name",
        column_name: "name",
        Cell: ({ value, row }) => {
          return row ? (
            <>
              <div
                className="w-full flex justify-start items-center group"
                style={{ width: "200px" }}
              >
                <div >
                  <NavLink
                    to={
                      `${editURL}/${row.original.id}`
                    }
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
        id: "Percentage",
        Header: "Percentage",
        accessor: "percentage",
        column_name: "Percentage",
      },
      {
        id: "Created Date",
        Header: "Created Date",
        accessor: "createdDate",
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
        Header: "Created By",
        accessor: "createdName",
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
        id: "Updated Date",
        Header: "Updated Date",
        accessor: "modifiedDate",
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
        id: "Updated By",
        Header: "Updated By",
        accessor: "modifiedName",
        column_name: "modifiedName",
        Cell: ({ value }) => {
          return value ? (
            <>
              <div >{value} </div>
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
              setReadiness={setReadiness}
              setOpenDeleteModal={setOpenDeleteModal}
              setModalInfo={setModalInfo}
              setOpenBasicModal={setOpenBasicModal}
              setViewHistoryModal={setViewHistoryModal}
              setRecordId={setRecordId}
            />
          );
        },
        disableSortBy: true,
        disableShowHide: true,
      },
    ], [])

  const [paginationData, setPaginationData] = useState({ ...paginationDetails });
  const [filteringOptions, setColumnFilteringOptions] = useState([]);
  const [sortingOptions, setSortingOptions] = useState([
    {
      field: "name",
      direction: 0,
      priority: 0,
    },
  ]);
  const [selectedRows, setSelectedRows] = useState([]);

  const getReadinessData = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true))

      getReadinessAPI({
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
      });

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

  const statusChangedHandler = (data) => {
    dispatch(setAddLoading(true))

    const object = {
      id: data.id,
      status: data.changeStatus,
      rowVersion: data.rowVersion,
    };
    statusChangeAPI({
      args: {
        ...object,
        ...location,
      },
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              view: true,
              type: "success",
              message: ValidationMsgs.readiness.readinessStatusUpdated,
            })
          );
          getReadinessData();
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
        dispatch(
          setAlertMessage({
            view: true,
            type: "danger",
            message: ValidationMsgs.readiness.readinessStatusNotUpdated,
          })
        );
        setOpenBasicModal(false);
        dispatch(setAddLoading(false))
      });
    setOpenBasicModal(false);

  };
  const handleDelete = (readiness) => {
    dispatch(setAddLoading(true))

    var ids = [];
    if (Array.isArray(readiness)) {
      ids = readiness.map((value) => {
        return { item1: value.id, item2: value.rowVersion };
      });
    } else {
      ids = [{ item1: readiness.id, item2: readiness.rowVersion }];
    }
    multiplestatusChangeAPI({
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
              message: ValidationMsgs.readiness.readinessDeleted,
            })
          );
          getReadinessData();
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
            setAlertMessage({ message: ValidationMsgs.readiness.readinessNotDeleted, type: "danger" })
          );
        }
        dispatch(setAddLoading(false))
      });
    setOpenDeleteModal(false);
  };
  return (
    <>
      <title>{`${title} Readiness`}</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          <div className="col-span-full w-full flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
              {`${title} Readiness`}
            </h1>
            {(permission?.isEdit || permission?.isDelete) && <div className="flex flex-wrap sm:auto-cols-max gap-2">
              <Link
                to={"create"}
                className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                <span className="material-icons-outlined">add</span>{" "}
                <span className="ml-1">{`Add ${title} Readiness`}</span>
              </Link>
            </div>}
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
            fetchData={getReadinessData}
            sortingOptions={sortingOptions}
            setSortingOptions={setSortingOptionHandler}
            setColumnFilteringOptions={setColumnFilteringOptions}
            handleSort={handleSort}
            // column filters
            editColumnFilter={false}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            morefilter={false}
            hiddenColumns={["rowSelection"]}

          />
        </div>
      </div>
      <ConfirmDelete
        message={`Deleting this ${title} Readiness will permanently remove this record from your account. This can't be undone`}
        handleDelete={handleDelete}
        title={"Delete"}
        data={readiness}
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
      />

      <BasicModal
        handleConfirmation={statusChangedHandler}
        openModal={openBasicModal}
        setOpenModal={setOpenBasicModal}
        {...ModelInfo}
      />

      {viewHistoryModal && (
        <ViewHistory
          title={"View History"}
          openModal={viewHistoryModal}
          setOpenModal={setViewHistoryModal}
          rowId={RecordId}
          pageName={PageName.ProductReady}
          page={title}
        />
      )}

    </>
  );
};

export default List;
