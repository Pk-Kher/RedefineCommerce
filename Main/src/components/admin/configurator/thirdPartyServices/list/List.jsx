/*Component Name: Third Party Services List
Created By: Divyesh
Created Date: 05/01/2023 
Modified By: 
Modified Date: */

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
import ThirdPartyServices from "services/admin/thirdPartyServices/ThirdPartyServices";
import DropdownService from "services/common/dropdown/DropdownService";

const List = () => {
  const permission = useSelector(store => store.permission);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [ThirdPartyId, setThirdPartyId] = useState(null);
  const [ModelInfo, setModalInfo] = useState({});
  const [openBasicModal, setOpenBasicModal] = useState(false);
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
                    "/admin/configurator/thirdPartyServices/edit/" +
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
      id: "thirdPartyServiceName",
      Header: "Third Party Services",
      accessor: "thirdPartyServiceName",
      Footer: "thirdPartyServiceName",
      column_name: "thirdPartyServiceName",
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
      id: "storeName",
      Header: "Store Name",
      accessor: "storeName",
      Footer: "storeName",
      column_name: "storeName",
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
            setThirdPartyId={setThirdPartyId}
            setOpenDeleteModal={setOpenDeleteModal}
            setModalInfo={setModalInfo}
            setOpenBasicModal={setOpenBasicModal}
            setRecordId={setRecordId}

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
      field: "displayOrder",
      direction: 0,
      priority: 0,
    },
  ]);

  const [selectedRows, setSelectedRows] = useState([]);
  const [filteringOptions, setColumnFilteringOptions] = useState([]);

  const getThirdPartyData = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true))

      ThirdPartyServices.getThirdPartyList({
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


  const statusChangedHandler = (StatusData) => {
    dispatch(setAddLoading(true))

    ThirdPartyServices.updateStatus({
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
              message: ValidationMsgs.thirdPartyService.thirdPartyStatusUpdated,
            })
          );
          getThirdPartyData();
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
            message: ValidationMsgs.thirdPartyService.thirdPartyStatusNotUpdated,
          })
        );
        dispatch(setAddLoading(false))

      });
    setOpenBasicModal(false);
  };

  const handleDelete = (ThirdPartyDataID) => {
    // var ids = [];
    // if (ThirdPartyDataID.length > 0) {
    //   ids = ThirdPartyDataID.map((value) => {
    //     return { item1: value.id, item2: value.rowVersion };
    //   });
    // } else {
    //   ids = [{ item1: ThirdPartyDataID.id, item2: ThirdPartyDataID.rowVersion }];
    // }
    dispatch(setAddLoading(true))

    ThirdPartyServices.updateMultipleStatus({
      args: {
        idsRowVersion: [{ item1: ThirdPartyDataID.id, item2: ThirdPartyDataID.rowVersion }],
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
              message: ValidationMsgs.thirdPartyService.thirdPartyDeleted,
            })
          );
          getThirdPartyData();
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
            setAlertMessage({ message: ValidationMsgs.thirdPartyService.thirdPartyNotDeleted, type: "danger" })
          );
        }
        dispatch(setAddLoading(false))
      });
    setOpenDeleteModal(false);
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
    [userNameValues]
  );
  const { pathname } = useLocation();
  return (
    <>
      <title>Third Party Services</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
        <div className="col-span-full w-full flex justify-between mb-8">
          <div className="col-span-full w-full flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
              Third Party Services
            </h1>
            {(permission?.isEdit || permission?.isDelete) && <div className="flex flex-wrap sm:auto-cols-max gap-2">
              <NavLink
                to={"create"}
                className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                <span className="material-icons-outlined">add</span>
                <span className="ml-1">Add Services</span>
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
            fetchData={getThirdPartyData}
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
            saveFilter={{ show: true, tabName: pathname + '_' + 'thirdPartyServices' }}

          />
        </div>
      </div>
      <ConfirmDelete
        handleDelete={handleDelete}
        data={ThirdPartyId}
        message={ValidationMsgs.thirdPartyService.thirdPartyPermanentDelete}
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
    </>
  );
};

export default List;
