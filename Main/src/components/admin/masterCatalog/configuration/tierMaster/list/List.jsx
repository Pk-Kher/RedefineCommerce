/*Component Name: Tier listing
Component Functional Details: Here we are listing Tier listing data.
Created By: Ankit 
Created Date: 22/09/2022
Modified By: Ankit
Modified Date: 22/09/2022 */

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactTable from "components/common/table/ReactTableServerSide";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import BasicModal from "components/common/modals/Basic";
import Messages from "components/common/alerts/messages/Index";
import { serverError } from "services/common/helper/Helper";
import ViewHistory from "components/common/modals/ViewHistory";
import { ValidationMsgs } from "global/ValidationMessages";
import Actions from "./Actions";
import TierService from "services/admin/tier/TierService";
import DropdownService from "services/common/dropdown/DropdownService";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { DateTimeFormat } from "services/common/helper/Helper";
import {
  RecStatusValuebyName,
  RecStatusValueForForm,
  paginationDetails,
  PageName
} from "global/Enum";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import Status from "components/common/displayStatus/Status";

const List = () => {
  const permission = useSelector(store => store.permission);
  const dispatch = useDispatch();
  const [Data, setData] = useState([]);
  const location = useSelector((store) => store?.location);
  const [viewHistoryModal, setViewHistoryModal] = useState(false);

  const [paginationData, setPaginationData] = useState({
    paginationDetails,
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
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [ModalInfo, setModalInfo] = useState({});

  const [openBasicModal, setOpenBasicModal] = useState(false);
  const [TierOption, setTierOption] = useState([]);
  const [Stores, setStores] = useState([]);
  const [RecordId, setRecordId] = useState(null);
  const [Users, setUsers] = useState([]);

  const COLUMNS = [
    {
      id: "storeName",
      Header: "Store Name",
      accessor: "storeName",
      column_name: "storeName",
      disableShowHide: true,
      Cell: ({ value, row }) => {
        return row ? (
          <NavLink
            to={"/admin/MasterCatalog/Configuration/tier/store/" + row.original.storeId}
          >
            {value ? value : ""}
          </NavLink>
        ) : (
          ""
        );
      },
    },
    {
      id: "tier",
      Header: "Tier",
      accessor: "tier",
      column_name: "tier",
      Cell: ({ value }) => {
        if (!value) {
          return "";
        } else {
          return value;
        }
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
            <div >{DateTimeFormat(value).date} </div>
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
      Cell: ({ value }) => {
        if (!value) {
          return "";
        } else {
          return value;
        }
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
      Cell: ({ value }) => {
        if (!value) {
          return "";
        } else {
          return value;
        }
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
            id={row.original.storeId}
            row={row}
            openDeleteModal={openDeleteModal}
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

  const getTierData = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true))

      TierService.getTiers({
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

  const setPaginationDataFunc = (key, value) => {
    setPaginationData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleSort = (sortValue) => { };

  const handleUpdateTierStatus = (tierData) => {
    dispatch(setAddLoading(true))

    const object = {
      id: tierData.id,
      status: RecStatusValuebyName.Archived,
      rowVersion: tierData.rowVersion,
    };

    TierService.updateTierById({
      ...object,
      ...location,
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: "Tier deleted successfully.",
            })
          );

          getTierData();
        } else {
          dispatch(
            setAlertMessage({
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
            type: "danger",
            message: "Tier is not deleted.",
          })
        );
        dispatch(setAddLoading(false))

      });
    setOpenDeleteModal(false);
  };

  const statusChangedHandler = (data) => {
    dispatch(setAddLoading(true))

    const object = {
      id: data.id,
      status: data.changeStatus,
      rowVersion: data.rowVersion,
    };
    if (data?.id) {
      TierService.updateTierById({
        ...object,
        ...location,
      })
        .then((response) => {
          if (response.data.success) {
            dispatch(
              setAlertMessage({
                type: "success",
                message: ValidationMsgs.tier.tierStatusUpdated,
              })
            );

            getTierData();
            setOpenDeleteModal(false);
          } else {
            dispatch(
              setAlertMessage({
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
              type: "danger",
              message: ValidationMsgs.tier.tierStatusNotUpdated,
            })
          );
          dispatch(setAddLoading(false))

        });
      setOpenBasicModal(false);
    }
  };

  useEffect(() => {
    DropdownService.getDropdownValues("tier").then((response) => {
      setTierOption(Object.values(response.data.data));
    });
    DropdownService.getDropdownValues("adminuser").then((response) => {
      setUsers(response.data.data);
    });
    DropdownService.getDropdownValues(
      "store"
    ).then((res) => {
      if (res.data.success && res.data.data) {
        setStores(() => {
          return res.data.data;

        });
      }
    });
  }, []);

  const moreFilterOptions = [
    {
      name: "Store",
      columnName: "storeId",
      options: Stores,
      type: "checkbox",
    },
    {
      name: "Created Date",
      columnName: "createddate",
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
    }
  ]
  const { pathname } = useLocation();
  return (
    <>
      <title>All Tiers</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
        <div className="col-span-full w-full flex justify-between mb-8">
          <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
            Tier Master
          </h1>
          {(permission?.isEdit || permission?.isDelete) && <div className="flex flex-wrap sm:auto-cols-max gap-2">
            <NavLink
              to={"/admin/MasterCatalog/Configuration/tier/create"}
              className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              <span className="material-icons-outlined"> add</span>
              <span className="ml-1">Add Tier</span>
            </NavLink>
          </div>}
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
            totalPages={paginationData.totalPages}
            sortingOptions={sortingOptions}
            setSortingOptions={setSortingOptionHandler}
            handleSort={handleSort}
            // column filters
            filteringOptions={filteringOptions}
            setColumnFilteringOptions={setColumnFilteringOptions}
            moreFilterOption={moreFilterOptions}
            displayColumnFilter={[
              {
                columnName: "recStatus",
                name: "Status",
                options: RecStatusValueForForm,
              },
            ]}
            editColumnFilter={true}
            morefilter={true}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            // sortingColumns={SORTING_COLUMNS}
            fetchData={getTierData}
            hiddenColumns={useMemo(() => ["rowSelection"], [])}
            pageName={`TierMaster`}
            saveFilter={{ show: true, tabName: pathname + '_' + 'tierMaster' }}
          />
        </div>
      </div>

      <ConfirmDelete
        handleDelete={handleUpdateTierStatus}
        message={ValidationMsgs.tier.tierPermanentDelete}
        title={"Delete"}
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
        {...ModalInfo}
      />
      <BasicModal
        handleConfirmation={statusChangedHandler}
        openModal={openBasicModal}
        setOpenModal={setOpenBasicModal}
        {...ModalInfo}
      />

      {viewHistoryModal && (
        <ViewHistory
          title={"View History"}
          openModal={viewHistoryModal}
          setOpenModal={setViewHistoryModal}
          rowId={RecordId}
          pageName={PageName.Tier}
        />
      )}
    </>
  );
};

export default List;
