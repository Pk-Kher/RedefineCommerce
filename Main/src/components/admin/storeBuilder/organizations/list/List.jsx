/*Component Name: Organizations List
Component Functional Details: User can create or update Organizations List master details from here.
Created By: Ankit
Created Date: 04/10/2022
Modified By: Ankit
Modified Date: 04/10/2022 */

import React, { useState, useCallback } from "react";
import ReactTable from "components/common/table/ReactTableServerSide";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import { NavLink } from "react-router-dom";
import Messages from "components/common/alerts/messages/Index";
import OrganizationService from "services/admin/organizations/OrganizationService";
import Actions from "./Action";
import { useDispatch, useSelector } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { paginationDetails, RecStatusValuebyName, PageName } from "global/Enum";
import ViewHistory from "components/common/modals/ViewHistory";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { useMemo } from "react";

const List = () => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [organizationID, setOrganizationID] = useState(null);
  const [modelInfo, setModalInfo] = useState({});
  const [openBasicModal, setOpenBasicModal] = useState(false);
  const [viewHistoryModal, setViewHistoryModal] = useState(false);
  const [recordID, setRecordID] = useState(null);

  const dispatch = useDispatch();

  const COLUMNS = [
    {
      id: "Name",
      Header: "Name",
      accessor: "name",
      Footer: "Name",
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
                    "/admin/StoreBuilder/organizations/edit/" + row.original.id
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
      id: "storename",
      Header: "Store Name",
      accessor: "storename",
      Footer: "Store Name",
      column_name: "storename",
      Cell: ({ value, row }) => {
        return row ? (
          <>
            <div
              className="w-full flex justify-start items-center group"
              style={{ width: "200px" }}
            >
              <div className="text-sm font-normal">{value ? value : ""}</div>
            </div>
          </>
        ) : (
          ""
        );
      },
    },
    /*{
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
      Header: "Created By",
      accessor: "createdName",
      Footer: "Created By",
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
    },*/
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
            setOrganizationID={setOrganizationID}
            setOpenDeleteModal={setOpenDeleteModal}
            setModalInfo={setModalInfo}
            setOpenBasicModal={setOpenBasicModal}
            setViewHistoryModal={setViewHistoryModal}
            setRecordID={setRecordID}
          />
        );
      },
      disableSortBy: true,
      disableShowHide: true,
    },
  ]

  const getRecordHistory = (id) => {
    // setViewHistoryModal(true);
  };
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({
    ...paginationDetails,
  });
  const [sortingOptions, setSortingOptions] = useState([
    {
      field: "name",
      direction: 0,
      priority: 0,
    },
  ]);

  const [selectedRows, setSelectedRows] = useState([]);
  const [filteringOptions, setColumnFilteringOptions] = useState([]);

  const getOrganizationsData = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true))

      OrganizationService.getOrganizations({
        args: {
          pageSize: paginationData.pageSize,
          pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
          sortingOptions,
          filteringOptions,
        },
      }).then((response) => {
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

  const handleDelete = (organizationData) => {
    const object = {
      id: organizationData.id,
      recstatus: RecStatusValuebyName.Archived,
    };
    OrganizationService.updateStatus({ ...object })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              view: true,
              type: "success",
              message: "Organization deleted successfully.",
            })
          );
          getOrganizationsData();
        } else {
          dispatch(
            setAlertMessage({
              view: true,
              type: "danger",
              message: "Organization is not deleted.",
            })
          );
        }
      })
      .catch((error) => {
        dispatch(
          setAlertMessage({
            view: true,
            type: "danger",
            message: "Organization deleted.",
          })
        );
      });
    setOpenDeleteModal(false);
  };

  return (
    <>
      <title>Organizations</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
        <div className="col-span-full w-full flex justify-between mb-8">
          <div className="col-span-full w-full flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
              Organizations
            </h1>
            <div className="flex flex-wrap sm:auto-cols-max gap-2">
              <NavLink
                to={"create"}
                className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                <span className="material-icons-outlined">add</span>
                <span className="ml-1">Add Organization</span>
              </NavLink>
            </div>
          </div>
        </div>

        <Messages />

        <div className="col-span-full w-full bg-white shadow-xxl rounded-md mb-8 relative">
          <ReactTable
            COLUMNS={COLUMNS}
            DATA={data}
            hasNextPage={paginationData.hasNextPage}
            hasPreviousPage={paginationData.hasPreviousPage}
            pageIndex={paginationData.pageIndex}
            setPageIndex={(value) => setPaginationDataFunc("pageIndex", value)}
            pageSize={paginationData.pageSize}
            setTablePageSize={(value) =>
              setPaginationDataFunc("pageSize", value)
            }
            totalCount={paginationData.totalCount}
            fetchData={getOrganizationsData}
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
        organizationID={organizationID}
        message="Deleting this Organization will permanently remove this record from your account. This can't be undone"
        title={"Delete"}
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
        {...modelInfo}
      />
      {viewHistoryModal && (
        <ViewHistory
          title={"View History"}
          openModal={viewHistoryModal}
          setOpenModal={setViewHistoryModal}
          rowId={recordID}
          pageName={PageName.Organizations}
        />
      )}
    </>
  );
};

export default List;
