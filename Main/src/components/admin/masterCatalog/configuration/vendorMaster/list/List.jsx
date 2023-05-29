/*Component Name: Vendor listing
Component Functional Details: Here we are listing Vendor listing data .
Created By: chandan 
Created Date: -
Modified By:chandan
Modified Date: 06/10/2022 */

import React, { useState, useCallback, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ReactTable from "components/common/table/ReactTableServerSide";
import Status from "components/common/displayStatus/Status";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import BasicModal from "components/common/modals/Basic";
import Messages from "components/common/alerts/messages/Index";
import { serverError } from "services/common/helper/Helper";
import ViewHistory from "components/common/modals/ViewHistory";
import { ValidationMsgs } from "global/ValidationMessages";
import Actions from "./Actions";
import VendorService from "services/admin/vendor/VendorService";
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
import { useMemo } from "react";

const List = () => {
  const dispatch = useDispatch();
  const permission = useSelector(store => store?.permission);
  const [Data, setData] = useState([]);
  const location = useSelector((store) => store?.location);
  const [viewHistoryModal, setViewHistoryModal] = useState(false);

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
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [ModalInfo, setModalInfo] = useState({});

  const [openBasicModal, setOpenBasicModal] = useState(false);
  const [BrandOption, setBrandOption] = useState([]);
  const [VendorOption, setVendorOption] = useState([]);
  const [RecordId, setRecordId] = useState(null);
  const [userNameValues, setUserNameValues] = useState([]);

  const COLUMNS = [
    {
      id: "name",
      Header: "Name",
      accessor: "name",
      column_name: "name",
      isVisible: false,
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
                    "/admin/MasterCatalog/Configuration/vendor/edit/" +
                    row.original.id
                  }
                >
                  <div className="font-semibold">{value}</div>
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
      id: "productCount",
      Header: "# of Products",
      accessor: "productCount",
      column_name: "productCount",
      Cell: ({ value }) => {
        if (!value) {
          return "";
        } else {
          return value;
        }
      },
    },
    {
      id: "navId",
      Header: "NAV Vendor ID",
      accessor: "navId",
      column_name: "navId",
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
      Header: "Created date",
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
      id: "createdBy",
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
            setRecordId={setRecordId}
          />
        );
      },
      disableSortBy: true,
      disableShowHide: true,
    },
  ];

  const getVendorData = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true))

      VendorService.getVendors({
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

  const handleUpdateVendorStatus = (vendorData) => {
    dispatch(setAddLoading(true))

    const object = {
      id: vendorData.id,
      status: RecStatusValuebyName.Archived,
      rowVersion: vendorData.rowVersion,
    };
    VendorService.updateVendorById({
      ...object,
      ...location,
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.vendor.vendorDeleted,
            })
          );

          getVendorData();
          getVendorOption();
          setColumnFilteringOptions((prevData) => {
            let prevFilterData = prevData.filter((currentFilterObj) => {
              return currentFilterObj.field !== "id"
            })
            return prevFilterData

          })
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
            message: ValidationMsgs.vendor.vendorNotDeleted,
          })
        );
        dispatch(setAddLoading(false))

      });
    setOpenDeleteModal(false);
  };

  const statusChangedHandler = (data) => {
    const object = {
      id: data.id,
      status: data.changeStatus,
      rowVersion: data.rowVersion,
    };
    if (data?.id) {
      dispatch(setAddLoading(true))

      VendorService.updateVendorById({
        ...object,
        ...location,
      })
        .then((response) => {
          if (response.data.success) {
            dispatch(
              setAlertMessage({
                type: "success",
                message: ValidationMsgs.vendor.vendorStatusUpdated,
              })
            );

            getVendorData();
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
              message: ValidationMsgs.vendor.vendorStatusNotUpdated,
            })
          );
          dispatch(setAddLoading(false))
        });

      setOpenBasicModal(false);
    }
  };

  const getVendorOption = useCallback(() => {
    DropdownService.getDropdownValues("vendor", true).then((response) => {
      setVendorOption(Object.values(response.data.data));
    });
  }, [])

  useEffect(() => {
    DropdownService.getDropdownValues("brand").then((response) => {
      setBrandOption(response.data.data);
    });
    getVendorOption();

    DropdownService.getDropdownValues("adminuser").then((response) => {
      setUserNameValues(response.data.data);
    });
  }, [getVendorOption]);

  const moreFilterOptions = [
    {
      name: "Name",
      columnName: "id",
      options: VendorOption,
      type: "checkbox",
    },
    // {
    // some changes
    //   name: "Sort",
    //   options: NavId.map((navId) => {
    //     return { label: `${navId}`, value: `${navId}` };
    //   }),
    //   type: "radio",
    //   conditionalSearch: true,
    // },
    {
      name: "Created Date",
      columnName: "createddate",
      options: [],
      type: "date",
    },
    {
      name: "Updated Date",
      columnName: "modifiedDate",
      options: [],
      type: "date",
    },
    {
      name: "Created By",
      columnName: "createdBy",
      options: userNameValues,
      type: "checkbox",
      conditionalSearch: true,
    },
    {
      name: "Updated By",
      columnName: "modifiedBy",
      options: userNameValues,
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
      <title>All Vendors</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
        <div className="col-span-full w-full flex justify-between mb-8">
          <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
            Vendor Master
          </h1>
          <div className="flex flex-wrap sm:auto-cols-max gap-2">
            {(permission?.isEdit || permission?.isDelete) && <NavLink
              to={"/admin/MasterCatalog/Configuration/vendor/create"}
              className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              <span className="material-icons-outlined"> add</span>
              <span className="ml-1">Add Vendor</span>
            </NavLink>}
          </div>
        </div>
        <Messages />
        <div className="col-span-full w-full bg-white shadow-xxl rounded-md mb-8 relative">
          <ReactTable
            COLUMNS={COLUMNS}
            DATA={Data}
            {...paginationData}
            setPageIndex={(value) => setPaginationDataFunc("pageIndex", value)}
            setTablePageSize={(value) =>
              setPaginationDataFunc("pageSize", value)
            }
            sortingOptions={sortingOptions}
            setSortingOptions={setSortingOptionHandler}
            handleSort={handleSort}
            // column filters
            filteringOptions={filteringOptions}
            setColumnFilteringOptions={setColumnFilteringOptions}
            moreFilterOption={moreFilterOptions}
            // displayColumnFilter={[
            //   {
            //     columnName: "recStatus",
            //     name: "Status",
            //     options: RecStatusValueForForm,
            //   },
            // ]}
            editColumnFilter={true}
            morefilter={true}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            // sortingColumns={SORTING_COLUMNS}
            fetchData={getVendorData}
            hiddenColumns={useMemo(() => ["rowSelection"], [])}
            pageName={`VendorMaster`}
            saveFilter={{ show: true, tabName: pathname + '_' + 'All' }}
          />
        </div>
      </div>

      <ConfirmDelete
        handleDelete={handleUpdateVendorStatus}
        message={ValidationMsgs.vendor.vendorPermanentDelete}
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
          pageName={PageName.Vendor}
        />
      )}
    </>
  );
};

export default List;
