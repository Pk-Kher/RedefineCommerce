/*Component Name: List
Component Functional Details: User can create or update List master details from here.
Created By: Divyesh
Created Date: 06/01/2022
Modified By: Divyesh
Modified Date: 21/07/2022 */

import React, { useState, useCallback } from "react";
import ReactTable from "components/common/table/ReactTableServerSide";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import BasicModal from "components/common/modals/Basic";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";
import Messages from "components/common/alerts/messages/Index";
import AttributesService from "services/admin/attributes/AttributesService";
import Actions from "./Action";
import { useDispatch, useSelector } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { paginationDetails, RecStatusValuebyName, PageName } from "global/Enum";
import { DateTimeFormat, getClientInfo, serverError } from "services/common/helper/Helper";
import ViewHistory from "components/common/modals/ViewHistory";
import { ValidationMsgs } from "global/ValidationMessages";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { useMemo } from "react";
import Status from "components/common/displayStatus/Status";

const List = () => {
  const permission = useSelector(store => store.permission);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [attributeId, setattributeId] = useState(null);
  const [ModelInfo, setModalInfo] = useState({});
  const [openBasicModal, setOpenBasicModal] = useState(false);
  const [viewHistoryModal, setViewHistoryModal] = useState(false);
  const [RecordId, setRecordId] = useState(null);

  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);
  const COLUMNS = [
    {
      id: "Name",
      Header: "Name",
      accessor: "name",
      Footer: "Name",
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
                  to={
                    "/admin/MasterCatalog/Configuration/Attributes/edit/" +
                    row.original.id
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
      id: "displayOrder",
      Header: "Display Order",
      accessor: "displayOrder",
      Footer: "displayOrder",
      column_name: "displayOrder",
      Cell: ({ value, row }) => {
        return row ? (
          <>
            <div
              className="w-full flex justify-start items-center group"
              style={{ width: "200px" }}
            >
              <div className="text-sm font-normal">
                {value ? value : ""}
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
            setattributeId={setattributeId}
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
  ];

  const getRecordHistory = (id) => {
    // setViewHistoryModal(true);
  };
  const [Data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({ ...paginationDetails });
  const [sortingOptions, setSortingOptions] = useState([
    {
      field: "displayOrder",
      direction: 0,
      priority: 0,
    },
  ]);

  const [selectedRows, setSelectedRows] = useState([]);
  const [filteringOptions, setColumnFilteringOptions] = useState([]);

  const getAttributesData = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true))

      AttributesService.getAttributes({
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

  // Need to change the Brand SErvice as per the Page API
  const statusChangedHandler = (data) => {
    dispatch(setAddLoading(true))

    var updatedvalues = {
      id: data.id,
      name: data.name,
      season: data.season,
      logoUrl: data.logoUrl,
      notes: data.notes,
      vendorId: [0],
      recStatus: data.changeStatus,
    };

    AttributesService.updateBrand({ brandModel: updatedvalues })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.attributes.attributeStatusUpdated,
            })
          );
          getAttributesData();
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
            view: true,
            type: "danger",
            message: ValidationMsgs.attributes.attributeStatusNotUpdated,
          })
        );
        dispatch(setAddLoading(false))

      });
    setOpenBasicModal(false);
  };

  const handleDelete = (attributeData) => {
    dispatch(setAddLoading(true))

    const object = {
      id: attributeData.id,
      status: RecStatusValuebyName.Archived,
      rowVersion: attributeData.rowVersion,
    };
    AttributesService.updateStatus({ args: { ...object, ...location } })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              view: true,
              type: "success",
              message: ValidationMsgs.attributes.attributeDeleted,
            })
          );
          getAttributesData();
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
      .catch((error) => {
        dispatch(
          setAlertMessage({
            view: true,
            type: "danger",
            message: ValidationMsgs.attributes.attributeNotDeleted,
          })
        );
        dispatch(setAddLoading(false))

      });
    setOpenDeleteModal(false);
  };

  return (
    <>
      <title>Attributes</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
        <div className="col-span-full w-full flex justify-between mb-8">
          <div className="col-span-full w-full flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
              Attributes
            </h1>
            {(permission?.isEdit || permission?.isDelete) && <div className="flex flex-wrap sm:auto-cols-max gap-2">
              <NavLink
                to={"create"}
                className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                <span className="material-icons-outlined">add</span>
                <span className="ml-1">Add Attributes</span>
              </NavLink>
            </div>}
          </div>
        </div>

        <Messages />

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
            fetchData={getAttributesData}
            sortingOptions={sortingOptions}
            setSortingOptions={setSortingOptionHandler}
            hiddenColumns={["rowSelection"]}
            handleSort={handleSort}
            filteringOptions={filteringOptions}
            setColumnFilteringOptions={setColumnFilteringOptions}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}

          />
        </div>
      </div>
      <ConfirmDelete
        handleDelete={handleDelete}
        attributeId={attributeId}
        message={ValidationMsgs.attributes.attributePermanentDelete}
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
      {viewHistoryModal && (
        <ViewHistory
          title={"View History"}
          openModal={viewHistoryModal}
          setOpenModal={setViewHistoryModal}
          rowId={RecordId}
          pageName={PageName.Attributes}
        />
      )}
    </>
  );
};

export default List;
