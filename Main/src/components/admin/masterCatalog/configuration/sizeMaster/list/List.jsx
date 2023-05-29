import React, { useState, useCallback, useEffect } from "react";
import { format } from "date-fns";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ReactTable from "components/common/table/ReactTableServerSide";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import BasicModal from "components/common/modals/Basic";
import Messages from "components/common/alerts/messages/Index";
import Status from "components/common/displayStatus/Status";
import Actions from "../../sizeMaster/list/Actions";
import CheckBoxAction from "./CheckBoxAction";
import DropdownService from "services/common/dropdown/DropdownService";
import SizeMasterService from "services/admin/sizeMaster/SizeMasterService";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";

import {
  RecStatusValueForForm,
  paginationDetails,
  RecStatusValuebyName,
  PageName
} from "global/Enum";

import { DateTimeFormat, serverError } from "services/common/helper/Helper";
import ViewHistory from "components/common/modals/ViewHistory";
import { ValidationMsgs } from "global/ValidationMessages";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { useMemo } from "react";

const List = () => {
  const permission = useSelector(store => store.permission);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [size, setSize] = useState(null);
  const [ModalInfo, setModalInfo] = useState({});
  const [openBasicModal, setOpenBasicModal] = useState(false);
  const [viewHistoryModal, setViewHistoryModal] = useState(false);
  const location = useSelector((store) => store?.location);
  const [showMessage, setShowMessage] = useState({
    view: false,
    message: "",
    type: "",
  });

  const [ProductTypeOption, setProductTypeOption] = useState([]);
  const [RecordId, setRecordId] = useState(null);

  const [Data, setData] = useState([]);

  const dispatch = useDispatch();
  const [sortingOptions, setSortingOptions] = useState([
    {
      field: "firstname",
      direction: 0,
      priority: 0,
    },
  ]);

  const [paginationData, setPaginationData] = useState({
    paginationDetails,
  });

  const [selectedRows, setSelectedRows] = useState([]);
  const [filteringOptions, setColumnFilteringOptions] = useState([]);
  const [userNameValues, setUserNameValues] = useState([]);
  const COLUMNS = [
    // { Header: "ID", accessor: "id", Footer: "ID" },
    {
      id: "productType",
      Header: "Product Type",
      accessor: "productType",
      Footer: "Product Type",
      column_name: "productType",
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
                    "/admin/MasterCatalog/Configuration/sizeMaster/edit/" +
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
    },
    {
      id: "productsize",
      Header: "Product Size",
      accessor: "size",
      Footer: "Product Size",
      column_name: "productsize",
      disableSortBy: true,
      Cell: ({ value }) => {
        return value ? (
          <div className="flex flex-wrap gap-1">
            {value.map((name, index) => {
              return name ? (

                `${name}, `

              ) : (
                ""
              );
            })}
          </div>
        ) : (
          ""
        );
      },

    },

    {
      id: "createdDate",
      Header: "CREATED DATE",
      accessor: "createdDate",
      Footer: "CREATED DATE",
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
      Header: "CREATED BY",
      accessor: "createdName",
      Footer: "CREATED BY",
      column_name: "createdName",
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
      id: "UPDATED DATE",
      Header: "UPDATED DATE",
      accessor: "modifiedDate",
      Footer: "UPDATED DATE",
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
      id: "UPDATED BY",
      Header: "UPDATED BY",
      accessor: "modifiedName",
      Footer: "UPDATED BY",
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
            setSize={setSize}
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
  const getSizeMasterData = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true))

      SizeMasterService.getSizeMaster({
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

  // Need to change the Brand SErvice as per the Page API
  const statusChangedHandler = (data) => {
    dispatch(setAddLoading(true))

    SizeMasterService.updateStatus({
      args: {
        id: data.id,
        status: data.changeStatus,
        rowVersion: data.rowVersion,
        ...location,
      },
    }).then((response) => {
      if (response.data.success) {
        dispatch(
          setAlertMessage({
            type: "success",
            message: ValidationMsgs.sizeMaster.sizeMasterStatusUpdated,
          })
        );
        getSizeMasterData();
      } else {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: serverError(response),
          })
        )
        dispatch(setAddLoading(false))

      }
    }).catch((errors) => {
      dispatch(
        setAlertMessage({
          type: "danger",
          message: ValidationMsgs.sizeMaster.sizeMasterStatusNotUpdated,
        })
      );
      dispatch(setAddLoading(false))

    });
    setOpenBasicModal(false);
  };

  const handleDelete = (size) => {
    var ids = [];
    dispatch(setAddLoading(true))

    if (Array.isArray(size)) {
      ids = size.map((value) => {
        return { item1: value.id, item2: value.rowVersion };
      });
    } else {
      ids = [{ item1: size.id, item2: size.rowVersion }];
    }

    SizeMasterService.updateMultipleStatus({
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
              message: ValidationMsgs.sizeMaster.sizeMasterDeleted,
            })
          );
          getSizeMasterData();
          getProductTypeDropdownData();
          setColumnFilteringOptions((prevData) => {
            let prevFilterData = prevData.filter((currentFilterObj) => {
              return currentFilterObj.field !== "product_type"
            })
            return prevFilterData
          })
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
          dispatch(setAlertMessage({ message: ValidationMsgs.sizeMaster.sizeMasterNotDeleted, type: "danger" }));
        }
        dispatch(setAddLoading(false))

      });
    setOpenDeleteModal(false);
  };

  const getProductTypeDropdownData = useCallback(() => {
    DropdownService.getDropdownValues("size", true).then((response) => {
      setProductTypeOption(response.data.data);
    });
  }, [])

  useEffect(() => {
    DropdownService.getDropdownValues("adminuser").then((response) => {
      setUserNameValues(response.data.data);
    });
    getProductTypeDropdownData();
  }, [getProductTypeDropdownData]);

  const moreFilterOptions = [
    {
      name: "Product Type",
      columnName: "id",
      options: ProductTypeOption,
      type: "checkbox",
      conditionalSearch: true,
    },
    {
      name: "Created By",
      columnName: "createdBy",
      options: userNameValues,
      type: "checkbox",
      conditionalSearch: true,
    },
    {
      name: "Created Date",
      columnName: "createddate",
      options: [],
      type: "date",
    },
    {
      name: "Updated By",
      columnName: "modifiedBy",
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
      name: "Status",
      columnName: "recStatus",
      options: RecStatusValueForForm,
      type: "radio",
    }
  ];
  const { pathname } = useLocation();
  return (
    <>
      <title>Size Master</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
        <div className="col-span-full w-full flex justify-between mb-8">
          <div className="col-span-full w-full flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
              Size Master
            </h1>
            {(permission?.isEdit || permission?.isDelete) && <div className="flex flex-wrap sm:auto-cols-max gap-2">
              <NavLink
                to={"create"}
                className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                <span className="material-icons-outlined">add</span>
                <span className="ml-1">Add Size Master</span>
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
            totalPages={paginationData.totalPages}
            fetchData={getSizeMasterData}
            sortingOptions={sortingOptions}
            setSortingOptions={setSortingOptionHandler}
            CheckBoxAction={({ ...rest }) => (
              <CheckBoxAction
                setOpenDeleteModal={setOpenDeleteModal}
                setSize={setSize}
                {...rest}
              />
            )}
            handleSort={handleSort}
            // column filters
            filteringOptions={filteringOptions}
            setColumnFilteringOptions={setColumnFilteringOptions}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            editColumnFilter={true}
            moreFilterOption={moreFilterOptions}
            displayColumnFilter={[
              {
                columnName: "recStatus",
                name: "Status",
                options: RecStatusValueForForm,
              },
            ]}
            saveFilter={{ show: true, tabName: pathname + '_' + 'All' }}
          />
        </div>
      </div>
      <ConfirmDelete
        handleDelete={handleDelete}
        data={size}
        message={ValidationMsgs.sizeMaster.sizeMasterPermanentDelete}
        title={"Delete"}
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
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
          pageName={PageName.SizeMaster}
        />
      )}
    </>
  );
};

export default List;
