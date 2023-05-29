import React, { useCallback, useMemo, useState, useEffect } from "react";
import { format } from "date-fns";
import ReactTable from "../../../../../common/table/ReactTableServerSide";
import { NavLink, useLocation } from "react-router-dom";
import { CategoryData } from "dummy/Dummy";
import CategoryService from "services/admin/category/CategoryService";
import CheckBoxAction from "./CheckBoxAction";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import BasicModal from "components/common/modals/Basic";
import Actions from "./Actions";
import Messages from "components/common/alerts/messages/Index";
import DropdownService from "services/common/dropdown/DropdownService";
import { NumericList, serverError } from "services/common/helper/Helper";
import ViewHistory from "components/common/modals/ViewHistory";
import { ValidationMsgs } from "global/ValidationMessages";

import {
  paginationDetails,
  RecStatusValue,
  RecStatusValueForForm,
  RecStatusValuebyName,
  PageName
} from "global/Enum";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { useDispatch, useSelector } from "react-redux";
import { DateTimeFormat, getClientInfo } from "services/common/helper/Helper";
import Status from "components/common/displayStatus/Status";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const List = () => {
  const permission = useSelector(store => store.permission);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [ModalInfo, setModalInfo] = useState({});
  const [openBasicModal, setOpenBasicModal] = useState(false);
  const [category, setCategory] = useState(null);
  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);
  const [CategoryOption, setCategoryOption] = useState([]);
  const [StatusObj, setStatusObj] = useState(RecStatusValueForForm);
  // const [NavId, setNavId] = useState([]);
  // const [BrandOption, setBrandOption] = useState([]);
  // const [VendorOption, setVendorOption] = useState([]);
  const [viewHistoryModal, setViewHistoryModal] = useState(false);

  const [Data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState(paginationDetails);
  const [sortingOptions, setSortingOptions] = useState([
    {
      field: "name",
      direction: 0,
      priority: 0,
    },
  ]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filteringOptions, setColumnFilteringOptions] = useState([]);
  const [RecordId, setRecordId] = useState(null);
  const [userNameValues, setUserNameValues] = useState([]);

  const getCategoryData = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true))

      CategoryService.getCategoriesWithTreeview({
        pageSize: paginationData.pageSize,
        pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
        sortingOptions,
        filteringOptions,
      }).then((response) => {
        setData(response.data.data.items);
        // setData(CategoryData)
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
      paginationData.pageIndex
    ]
  );

  const COLUMNS = [
    {
      id: "name",
      Header: "Title",
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
                    "/admin/MasterCatalog/Configuration/category/edit/" +
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
      Header: "# Products",
      accessor: "productCount",
      column_name: "productCount",
      Cell: ({ value }) => {
        return <div >{value}</div>;
      },
    },
    {
      id: "Created date",
      Header: "Created date",
      accessor: "createdDate",
      column_name: "createddate",
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
      id: "createdName",
      Header: "Created By",
      accessor: "createdName",
      column_name: "createdName",
      Cell: ({ value }) => {
        return (
          <>
            <div >{value} </div>
          </>
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
      id: "modifiedName",
      Header: "Updated By",
      accessor: "modifiedName",
      column_name: "modifiedName",
      Cell: ({ value }) => {
        return (
          <>
            <div >{value} </div>
          </>
        );
      },
    },
    {
      id: "status",
      Header: "Status",
      accessor: "recStatus",
      column_name: "recStatus",
      Cell: ({ value }) => {
        return (
          <Status type={value} />
        );
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
            setCategory={setCategory}
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

  const getRecordHistory = (id) => {
    // setViewHistoryModal(true);
  };

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
  const handleSort = (sortValue) => { };

  const handleDelete = (category) => {
    var ids = [];
    dispatch(setAddLoading(true))

    if (category.length > 0) {
      ids = category.map((value) => {
        return { item1: value.id, item2: value.rowVersion };
      });
    } else {
      ids = [{ item1: category.id, item2: category.rowVersion }];
    }
    CategoryService.updateMultipleStatus({
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
              message: ValidationMsgs.category.categoryDeleted,
            })
          );
          getCategoryData();
          getCategoryDropdownData();
          setColumnFilteringOptions((prevData) => {
            let prevFilterData = prevData.filter((currentFilterObj) => {
              return currentFilterObj.field !== "id"
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
          dispatch(
            setAlertMessage({ message: ValidationMsgs.category.categoryNotDeleted, type: "danger" })
          );
        }
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
    dispatch(setAddLoading(true))

    CategoryService.updateStatus({
      args: { ...object, ...location },
    })
      .then((response) => {
        if (response?.data?.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.category.categoryStatusUpdated,
            })
          );
          getCategoryData();
          setOpenBasicModal(false);
        } else {
          dispatch(
            setAlertMessage({
              type: "danger",
              message: serverError(response),
            })
          );
          setOpenBasicModal(false);
          dispatch(setAddLoading(false))

        }
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.category.categoryStatusNotUpdated,
          })
        );
        dispatch(setAddLoading(false))

      });
    setOpenBasicModal(false);
  };

  const getCategoryDropdownData = useCallback(() => {
    DropdownService.getDropdownValues("category", true).then((response) => {
      setCategoryOption(response.data.data);
    });
  }, [])

  useEffect(() => {
    DropdownService.getDropdownValues("adminuser").then((response) => {
      setUserNameValues(response.data.data);
    });
    getCategoryDropdownData();
  }, [getCategoryDropdownData]);

  const moreFilterOptions = [
    {
      name: "Name",
      columnName: "id",
      options: CategoryOption,
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
      options: StatusObj,
      type: "radio",
    },
    // {
    //   name: "Edit Column",
    //   options: BrandOption,
    //   type: "radio",
    //   conditionalSearch: true,
    // },
    // {
    //   name: "Filter By",
    //   options: VendorOption,
    //   type: "radio",
    //   conditionalSearch: true,
    // },
  ];
  const { pathname } = useLocation();
  return (
    <>
      <title>All Categories</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
        <div className="grid grid-cols-12">
          <div className="col-span-full w-full flex justify-between mb-8">
            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
              Category Master
            </h1>
            {(permission?.isEdit || permission?.isDelete) && <div className="flex flex-wrap sm:auto-cols-max gap-2">
              <NavLink
                to={"/admin/MasterCatalog/Configuration/category/create"}
                className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                <span className="material-icons-outlined"> add</span>
                <span className="ml-1">Add Category</span>
              </NavLink>
            </div>}
          </div>
        </div>
        <Messages />
        <div className="col-span-full w-full bg-white shadow-xxl rounded-md mb-8 relative">
          <ReactTable
            COLUMNS={COLUMNS}
            DATA={Data}
            {...paginationData}
            fetchData={getCategoryData}
            sortingOptions={sortingOptions}
            setSortingOptions={setSortingOptionHandler}
            handleSort={handleSort}
            setTablePageSize={(value) =>
              setPaginationDataFunc("pageSize", value)
            }
            moreFilterOption={moreFilterOptions}
            // column filters
            filteringOptions={filteringOptions}
            setColumnFilteringOptions={setColumnFilteringOptions}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            CheckBoxAction={({ ...rest }) => (
              <CheckBoxAction
                setOpenDeleteModal={setOpenDeleteModal}
                setCategory={setCategory}
                {...rest}
              />
            )}
            editColumnFilter={true}
            displayColumnFilter={[
              {
                columnName: "recStatus",
                name: "Status",
                options: RecStatusValue,
              },
            ]}
            expandedRows={useMemo(() => true, [])}
            saveFilter={{ show: true, tabName: pathname + '_' + 'All' }}
          />
        </div>
      </div>
      <ConfirmDelete
        handleDelete={handleDelete}
        data={category}
        message={ValidationMsgs.category.categoryPermanentDelete}
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
          getRecordHistory={getRecordHistory}
          rowId={RecordId}
          pageName={PageName.Category}
        />
      )}

    </>
  );
};

export default List;
