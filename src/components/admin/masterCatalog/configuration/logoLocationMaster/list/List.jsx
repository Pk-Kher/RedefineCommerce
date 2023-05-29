/*Component Name: logo location listing
Component Functional Details: Here we are listing logo location listing data .
Created By: chandan 
Created Date: -
Modified By:chandan
Modified Date: 06/10/2022 */

import React, { useState, useCallback, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Actions from "./Actions";
import ReactTable from "components/common/table/ReactTableServerSide";
import Status from "components/common/displayStatus/Status";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import BasicModal from "components/common/modals/Basic";
import Messages from "components/common/alerts/messages/Index";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import {
  RecStatusValue,
  RecStatusValuebyName,
  paginationDetails,
  PageName
} from "global/Enum";
import { DateTimeFormat, serverError } from "services/common/helper/Helper";

import LogoLocationServices from "services/admin/logolocation/LogoLocationService";
import DropdownService from "services/common/dropdown/DropdownService";
import ViewHistory from "components/common/modals/ViewHistory";
import CategoryService from 'services/admin/category/CategoryService';
import { ValidationMsgs } from "global/ValidationMessages";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { useMemo } from "react";

const List = () => {
  const permission = useSelector(store => store.permission);
  const [Data, setData] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const location = useSelector((store) => store?.location);
  const [ModalInfo, setModalInfo] = useState({});
  const [viewHistoryModal, setViewHistoryModal] = useState(false);

  const [paginationData, setPaginationData] = useState({
    paginationDetails,
  });

  const [openBasicModal, setOpenBasicModal] = useState(false);
  const dispatch = useDispatch();

  const [sortingOptions, setSortingOptions] = useState([
    {
      field: "gender",
      direction: 0,
      priority: 0,
    },
  ]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filteringOptions, setColumnFilteringOptions] = useState([]);
  const [RecordId, setRecordId] = useState(null);
  const [CategoryOption, setCategoryOption] = useState([]);
  const [userNameValues, setUserNameValues] = useState([]);

  const COLUMNS = [
    {
      id: "gender",
      Header: "Gender",
      accessor: "gender",
      Footer: "Gender",
      column_name: "gender",
      disableShowHide: true,
      Cell: ({ value, row }) => {
        return row ? (
          <>
            <div
              className="w-full flex justify-start items-center group"
              style={{ width: "200px" }}
            >
              <div >
                <Link to={"edit/" + row.original.id}>{value}</Link>
              </div>
            </div>
          </>
        ) : (
          ""
        );
      },
    },
    {
      id: "productType",
      Header: "PRODUCT TYPE",
      accessor: "productType",
      Footer: "PRODUCT TYPE",
      column_name: "productType",
    },

    {
      id: "subProductType",
      Header: "SUB PRODUCT TYPE",
      accessor: "subProductType",
      Footer: "SUB PRODUCT TYPE",
      column_name: "subProductType",
      Cell: ({ value }) => {
        if (!value) {
          return "";
        } else {
          return value;
        }
      },
    },
    {
      id: "logolocations",
      Header: "LOGO LOCATIONS",
      accessor: "logoLocations",
      Footer: "LOGO LOCATIONS",
      column_name: "logolocations",
    },
    {
      id: "CREATED Date",
      Header: "CREATED Date",
      accessor: "createdDate",
      Footer: "CREATED Date",
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
      id: "CREATED BY",
      Header: "CREATED BY",
      accessor: "createdName",
      Footer: "CREATED BY",
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
      id: "UPDATED Date",
      Header: "UPDATED Date",
      accessor: "modifiedDate",
      Footer: "UPDATED",
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
      id: "updatedby",
      Header: "UPDATED BY",
      accessor: "modifiedName",
      Footer: "UPDATED BY",
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
      id: "recStatus",
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
            id={value}
            row={row}
            openDeleteModal={openDeleteModal}
            setOpenDeleteModal={setOpenDeleteModal}
            setModalInfo={setModalInfo}
            setOpenBasicModal={setOpenBasicModal}
            setViewHistoryModal={setViewHistoryModal}
            getRecordHistory={getRecordHistory}
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

  const getLogoLocationData = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true))

      LogoLocationServices.getLogoLocations({
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

  const handleDelete = (logoLocationData) => {
    const object = {
      id: logoLocationData.id,
      status: RecStatusValuebyName.Archived,
      rowVersion: logoLocationData.rowVersion,
    };
    dispatch(setAddLoading(true))

    LogoLocationServices.updateStatus({ ...object, ...location })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.logoLocationDetails.logoLocationDeleted,
            })
          );
          getLogoLocationData();
          getCategoryDropdownData();
          setColumnFilteringOptions((prevData) => {
            let prevFilterData = prevData.filter((currentFilterObj) => {
              return currentFilterObj.field !== "categoryId"
            })
            console.log(prevFilterData, "prevFilterData")
            return prevFilterData
          })
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
            message: ValidationMsgs.logoLocationDetails.logoLocationNotDeleted,
          })
        );
        dispatch(setAddLoading(false))

      });

    setOpenDeleteModal(false);
  };

  const displayColumnFilter = [
    {
      columnName: "recStatus",
      name: "Status",
      options: RecStatusValue,
    },
  ];

  const statusChangedHandler = (data) => {
    const object = {
      id: data.id,
      status: data.changeStatus,
      rowVersion: data.rowVersion,
    };
    dispatch(setAddLoading(true))

    LogoLocationServices.updateStatus({
      ...object,
      ...location,
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.logoLocationDetails.logoLocationStatusUpdated,
            })
          );

          getLogoLocationData();
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
            type: "success",
            message: ValidationMsgs.logoLocationDetails.logoLocationStatusNotUpdated,
          })
        );
        dispatch(setAddLoading(false))

      });
    setOpenBasicModal(false);
  };

  const getCategoryDropdownData = useCallback(() => {
    CategoryService.getCategoryDropdownOptions(-1).then((response) => {
      setCategoryOption(() => {
        return response.data.data;
      });
    });
  }, [])

  useEffect(() => {
    /* DropdownService.getDropdownValues("brand").then((response) => {
      setBrandOption(response.data.data);
    });
    DropdownService.getDropdownValues("vendor").then((response) => {
      setVendorOption(response.data.data);
    });
 */
    DropdownService.getDropdownValues("adminuser").then((response) => {
      setUserNameValues(response.data.data);
    });
    getCategoryDropdownData();
    // setNavId(Object.values(NumericList(0, 50, 1)));
  }, [getCategoryDropdownData]);

  const moreFilterOptions = [
    {
      name: "Gender",
      options: CategoryOption,
      columnName: "categoryId",
      type: "checkbox",
      conditionalSearch: true,
    },
    // {
    //   name: "Edit Column",
    //   options: BrandOption/* .map((brandData) => {
    //     return { label: brandData, value: brandData };
    //   }) */,
    //   type: "radio",
    //   conditionalSearch: true,
    // },
    // {
    //   name: "Sort",
    //   options: NavId.map((navId) => {
    //     return { label: `${navId}`, value: `${navId}` };
    //   }),
    //   type: "radio",
    //   conditionalSearch: true,
    // },
    {
      name: "Created Date",
      columnName: "createdDate",
      options: [],
      type: "date",
    },
    {
      name: "Created By",
      options: userNameValues,
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
      options: userNameValues,
      type: "checkbox",
      conditionalSearch: true,
    },
    //   {
    //     name: "Filter By",
    //     options: VendorOption/* .map((logoLocationData) => {
    //       return { label: logoLocationData.productType, value: logoLocationData.productType || "" };
    //     }) */,

    //     type: "radio",
    //     conditionalSearch: true,
    //   },
    {
      name: "Status",
      options: RecStatusValue,
      columnName: "recStatus",
      type: "radio",
    },
  ]
  const { pathname } = useLocation();
  return (
    <>
      <title>Logo Location Master</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          <div className="col-span-full w-full flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
              Logo Location Master
            </h1>
            <div className="flex flex-wrap sm:auto-cols-max gap-2">
              {/* <button
                type="button"
                className="btn shadow-none text-indigo-500 hover:text-indigo-600 font-semibold"
              >
                <span >Export</span>
              </button>
              <button
                type="button"
                className="btn shadow-none text-indigo-500 hover:text-indigo-600 font-semibold"
              >
                <span >Import</span>
              </button> */}
              {(permission?.isEdit || permission?.isDelete) && <div className="flex flex-wrap sm:auto-cols-max gap-2">
                <Link
                  to="create"
                  className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                >
                  <span className="material-icons-outlined">add</span>
                  <span className="ml-1">Add Logo Location</span>
                </Link>
              </div>}
            </div>
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
            totalPages={paginationData.totalPages}
            fetchData={getLogoLocationData}
            sortingOptions={sortingOptions}
            setSortingOptions={setSortingOptionHandler}
            handleSort={handleSort}
            morefilter={true}
            moreFilterOption={moreFilterOptions}
            // column filters
            filteringOptions={filteringOptions}
            setColumnFilteringOptions={setColumnFilteringOptions}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            //   CheckBoxAction={CheckBoxAction}
            editColumnFilter={true}
            displayColumnFilter={displayColumnFilter}
            pageName={`LogoLocationMaster`}
            hiddenColumns={useMemo(() => ["rowSelection"], [])}
            saveFilter={{ show: true, tabName: pathname + '_' + 'All' }}
          />
        </div>
      </div>
      <ConfirmDelete
        handleDelete={handleDelete}
        message={ValidationMsgs.logoLocationDetails.logoLocationPermanentDelete}
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
          pageName={PageName.LogoLocationMaster}
        />
      )}
    </>
  );
};

export default List;
