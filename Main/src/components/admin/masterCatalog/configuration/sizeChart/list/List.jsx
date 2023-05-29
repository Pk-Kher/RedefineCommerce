/*Component Name: ListSizeMasterService
Component Functional Details: User can create or update Create master details from here.
Created By: Shrey Patel
Created Date: 
Modified By: chandan
Modified Date: 06/10/2022 */

import React, { useState, useCallback, useEffect } from "react";
import ReactTable from "components/common/table/ReactTableServerSide";
import Actions from "./Actions";
import { Link, useLocation } from "react-router-dom";
import CheckBoxAction from "./CheckBoxAction";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import Status from "components/common/displayStatus/Status";
import DropdownService from "services/common/dropdown/DropdownService";
import SizeChartService from "services/admin/sizeChart/SizeChartService";
import Messages from "components/common/alerts/messages/Index";
import BasicModal from "components/common/modals/Basic";
import { useDispatch, useSelector } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { DateTimeFormat, serverError } from "services/common/helper/Helper";
import {
  RecStatusValueForForm,
  paginationDetails,
  RecStatusValuebyName,
  PageName
} from "global/Enum";
import ViewHistory from "components/common/modals/ViewHistory";
import { ValidationMsgs } from "global/ValidationMessages";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const List = () => {
  const permission = useSelector(store => store.permission);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [ModalInfo, setModalInfo] = useState({});
  const [viewHistoryModal, setViewHistoryModal] = useState(false);
  const [openBasicModal, setOpenBasicModal] = useState(false);
  const [openmodel, setOpenmodel] = useState(false);

  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);

  const [ProductTypeOption, setProductTypeOption] = useState([]);
  const [SizeChartOptions, setSizeChartOptions] = useState([]);
  const [sizeChart, setSizeChart] = useState("");
  const [paginationData, setPaginationData] = useState({
    paginationDetails,
  });
  const [RecordId, setRecordId] = useState(null);

  const COLUMNS = [
    // { Header: "ID", accessor: "id", Footer: "ID" },
    {
      id: "name",
      Header: "NAME",
      accessor: "name",
      Footer: "NAME",
      column_name: "name",
      disableShowHide: true,
      Cell: ({ value, row }) => {
        return row ? (
          <>
            <div
              className="w-full flex justify-start items-center group"
              style={{ width: "400px" }}
            >
              <div>
                <Link
                  to={
                    "/admin/MasterCatalog/Configuration/sizeChart/edit/" +
                    row.original.id
                  }
                >
                  {value ? value : ""}
                </Link>
              </div>
            </div>
          </>
        ) : (
          ""
        );
      },
    },
    {
      id: "brand",
      Header: "BRAND",
      accessor: "brandName",
      Footer: "BRAND",
      column_name: "brandName",
      Cell: ({ value, row }) => {
        return row ? (
          <>
            <div
              className="w-full flex justify-start items-center group"
              style={{ width: "100px" }}
            >
              <div >{value}</div>
            </div>
          </>
        ) : (
          ""
        );
      },
    },
    {
      id: "products",
      Header: "PRODUCTS",
      accessor: "productCount",
      Footer: "PRODUCTS",
      column_name: "productCount",
      Cell: ({ value, row }) => {
        return value ? (
          <>
            <div
              className="w-full flex justify-start items-center group"
              style={{ width: "150px" }}
            >
              <div >{value}</div>
            </div>
          </>
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
      Header: "CREATED BY",
      accessor: "createdName",
      Footer: "CREATED BY",
      column_name: "createdName",
      Cell: ({ value, row }) => {
        return row ? (
          <>
            <div className="w-full flex justify-start items-center group">
              <div >{value}</div>
            </div>
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
              {DateTimeFormat(value).time}
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
      Cell: ({ value, row }) => {
        return row ? (
          <>
            <div className="w-full flex justify-start items-center group">
              <div >{value}</div>
            </div>
          </>
        ) : (
          ""
        );
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
            setSizeChart={setSizeChart}
            row={row}
            openmodel={openmodel}
            setOpenmodel={setOpenmodel}
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

  // const [loading, setLoading] = useState(false);
  const [Data, setData] = useState([]);
  const [sortingOptions, setSortingOptions] = useState([
    {
      field: "firstname",
      direction: 0,
      priority: 0,
    },
  ]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filteringOptions, setColumnFilteringOptions] = useState([]);
  const [userNameValues, setUserNameValues] = useState([]);

  const getRecordHistory = (id) => {
    console.log("history log");
    // setViewHistoryModal(true);
  };

  const getSizeChartMaster = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true))

      SizeChartService.getSizeChartMaster({
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

  // Need to change the Size Chart Service as per the Page API
  const statusChangedHandler = (data) => {
    dispatch(setAddLoading(true))

    SizeChartService.updateMultipleStatus({
      args: {
        idsRowVersion: [{ item1: data.id, item2: data.rowVersion }],
        status: data.changeStatus,
        ...location,
      },
    }).then((response) => {
      if (response.data.success) {
        dispatch(
          setAlertMessage({
            type: "success",
            message: ValidationMsgs.sizeChart.sizeChartStatusUpdated,
          })
        );
        getSizeChartMaster();
      } else {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.sizeChart.sizeChartStatusNotUpdated,
          })
        );
        dispatch(setAddLoading(false))
      }
    }).catch((errors) => {
      dispatch(
        setAlertMessage({
          type: "danger",
          message: ValidationMsgs.sizeChart.sizeChartStatusNotUpdated,
        })
      );
      dispatch(setAddLoading(false))
    });
    setOpenBasicModal(false);
  };

  const handleDelete = (chart) => {
    dispatch(setAddLoading(true))

    var ids = [];
    if (Array.isArray(chart)) {
      ids = chart.map((value) => {
        return { item1: value.id, item2: value.rowVersion };
      });
    } else {
      ids = [{ item1: chart.id, item2: chart.rowVersion }];
    }
    SizeChartService.updateMultipleStatus({
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
              message: ValidationMsgs.sizeChart.sizeChartDeleted,
            })
          );
          getSizeChartMaster();
          getSizeChartDropdownData();
          setColumnFilteringOptions((prevData) => {
            let prevFilterData = prevData.filter((currentFilterObj) => {
              return currentFilterObj.field !== "id"
            })
            console.log(prevFilterData, "prevFilterData")
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
            setAlertMessage({ message: ValidationMsgs.sizeChart.sizeChartNotDeleted, type: "danger" })
          );
        }
        dispatch(setAddLoading(false))
      });
    setOpenDeleteModal(false);
  };

  const getSizeChartDropdownData = useCallback(() => {
    DropdownService.getDropdownValues("sizechart", true).then((response) => {
      setSizeChartOptions(response.data.data);
    });
  }, []);

  useEffect(() => {
    DropdownService.getDropdownValues("brand").then((response) => {
      setProductTypeOption(response.data.data);
    });

    DropdownService.getDropdownValues("adminuser").then((response) => {
      setUserNameValues(response.data.data);
    });
    getSizeChartDropdownData();
  }, [getSizeChartDropdownData]);

  const [moreFilterOptionValues, setMoreFilterOptionValues] = useState({
    vendor: [],
    createdBy: [],
    modifiedBy: [],
  });

  useEffect(() => {
    setMoreFilterOptionValues((prev) => {
      var temp = {
        vendor: [],
        createdBy: [],
        modifiedBy: [],
      };
      Data.map((values) => {
        var createdByAvail = temp.createdBy.find(
          (createdBy) => createdBy.value === values.createdBy
        );
        var modifiedByAvail = temp.modifiedBy.find(
          (modifiedBy) => modifiedBy.value === values.modifiedBy
        );
        if (!createdByAvail && values.createdBy) {
          temp = {
            ...temp,
            createdBy: [
              ...temp.createdBy,
              { label: values.createdName, value: values.createdBy },
            ],
          };
        }
        if (!modifiedByAvail && values.modifiedBy) {
          temp = {
            ...temp,
            modifiedBy: [
              ...temp.modifiedBy,
              { label: values.modifiedName, value: values.modifiedBy },
            ],
          };
        }
        return "";
      });
      return temp;
    });
  }, [Data]);

  const moreFilterOptions = [
    {
      name: "Name",
      columnName: "id",
      options: SizeChartOptions,
      type: "checkbox",
      conditionalSearch: true,
    },
    {
      name: "Brand",
      columnName: "brandId",
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
    },
  ];
  const { pathname } = useLocation();
  return (
    <>
      <title>Size Chart</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
        <div className="col-span-full w-full flex justify-between mb-8">
          <div className="col-span-full w-full flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
              Size Chart Master
            </h1>
            {(permission?.isEdit || permission?.isDelete) && <div className="flex flex-wrap sm:auto-cols-max gap-2">
              <Link
                to={"create"}
                className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                <span className="material-icons-outlined">add</span>
                <span className="ml-1">Add Size Chart</span>
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
            setPageIndex={(value) => setPaginationDataFunc("pageIndex", value)}
            setTablePageSize={(value) =>
              setPaginationDataFunc("pageSize", value)
            }
            // totalPages={totalPages}
            fetchData={getSizeChartMaster}
            sortingOptions={sortingOptions}
            setSortingOptions={setSortingOptionHandler}
            handleSort={handleSort}
            morefilter={true}
            // column filters
            filteringOptions={filteringOptions}
            setColumnFilteringOptions={setColumnFilteringOptions}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            CheckBoxAction={({ ...rest }) => (
              <CheckBoxAction
                setOpenDeleteModal={setOpenDeleteModal}
                setSizeChart={setSizeChart}
                {...rest}
              />
            )}
            moreFilterOption={moreFilterOptions}
            editColumnFilter={true}
            saveFilter={{ show: true, tabName: pathname + '_' + 'All' }}
          />
        </div>
      </div>

      <ConfirmDelete
        handleDelete={handleDelete}
        data={sizeChart}
        message={ValidationMsgs.sizeChart.sizeChartPermanentDelete}
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
      {
        viewHistoryModal && (
          <ViewHistory
            title={"View History"}
            openModal={viewHistoryModal}
            setOpenModal={setViewHistoryModal}
            getRecordHistory={getRecordHistory}
            rowId={RecordId}
            pageName={PageName.SizeChart}
          />
        )
      }
    </>
  );
};

export default List;
