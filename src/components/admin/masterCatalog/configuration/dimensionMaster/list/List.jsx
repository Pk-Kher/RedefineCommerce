import React, { useState, useCallback } from "react";
import ReactTable from "components/common/table/ReactTableServerSide";
import Actions from "./Actions";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import CheckBoxAction from "./CheckBoxAction";
import Status from "components/common/displayStatus/Status";
import DimensionService from "services/admin/dimension/DimensionService";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import BasicModal from "components/common/modals/Basic";
import Messages from "components/common/alerts/messages/Index";
import {
  RecStatusValue,
  RecStatusValuebyName,
  RecStatusValueForForm,
  PageName
} from "global/Enum";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { paginationDetails } from "global/Enum";
import { DateTimeFormat, serverError } from "services/common/helper/Helper";
import DropdownService from "services/common/dropdown/DropdownService";
import { useEffect } from "react";
import ViewHistory from "components/common/modals/ViewHistory";
import CategoryService from 'services/admin/category/CategoryService';
import { ValidationMsgs } from "global/ValidationMessages";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { useMemo } from "react";

const List = () => {
  const permission = useSelector(store => store.permission);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [ModalInfo, setModalInfo] = useState({});
  const [openBasicModal, setOpenBasicModal] = useState(false);
  const [viewHistoryModal, setViewHistoryModal] = useState(false);
  const [dimension, setDimension] = useState(null);
  const [RecordId, setRecordId] = useState(null);
  const [CategoryOption, setCategoryOption] = useState([]);
  const [StatusObj, setStatusObj] = useState([]);

  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);
  const COLUMNS = [
    {
      id: "Name",
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
              style={{ width: "100px" }}
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
      id: "gender",
      Header: "GENDER",
      accessor: "gender",
      Footer: "GENDER",
      column_name: "gender",
    },
    {
      id: "productType",
      Header: "Product Type",
      accessor: "productType",
      Footer: "Product Type",
      column_name: "productType",
    },
    {
      id: "subProductType",
      Header: "sub product type",
      accessor: "subProductType",
      Footer: "sub product type",
      column_name: "subProductType",
    },
    {
      id: "Length",
      Header: "Length",
      accessor: "length",
      Footer: "Length",
      column_name: "LENGTH",
    },
    {
      id: "width",
      Header: "WIDTH",
      accessor: "width",
      Footer: "WIDTH",
      column_name: "width",
    },
    {
      id: "height",
      Header: "HEIGHT",
      accessor: "height",
      Footer: "HEIGHT",
      column_name: "height",
    },
    {
      id: "volume",
      Header: "VOLUME",
      accessor: "volume",
      Footer: "VOLUME",
      column_name: "volume",
    },
    {
      id: "createdDate",
      Header: "CREATED date",
      accessor: "createdDate",
      Footer: "CREATED",
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
      Footer: "Created By",
      column_name: "createdName",
    },
    {
      id: "UPDATED DATE",
      Header: "UPDATED DATE",
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
      id: "Updated By",
      Header: "Updated By",
      accessor: "modifiedName",
      Footer: "Updated By",
      column_name: "modifiedName",
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
            setDimension={setDimension}
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

  const [Data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({ ...paginationDetails });
  const setPaginationDataFunc = (key, value) => {
    setPaginationData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };
  const [sortingOptions, setSortingOptions] = useState([
    {
      field: "firstname",
      direction: 0,
      priority: 0,
    },
  ]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filteringOptions, setColumnFilteringOptions] = useState([]);

  const getDimensionData = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true))

      DimensionService.getDimensions({
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
      paginationData.pageIndex
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

  const handleSort = (sortValue) => { };

  const statusChangedHandler = (data) => {
    setOpenBasicModal(false);
    dispatch(setAddLoading(true))


    DimensionService.updateStatus({
      args: {
        id: data.id,
        status: data.changeStatus,
        rowVersion: data.rowVersion,
        ...location,
      },
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.dimension.dimensionStatusUpdated,
            })
          );
          getDimensionData();
          setOpenBasicModal(false);

        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
          setOpenBasicModal(false);
          dispatch(setAddLoading(false))

        }
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.dimension.dimensionStatusNotUpdated,
          })
        );
        setOpenBasicModal(false);
        dispatch(setAddLoading(false))

      });
  };

  const handleDelete = (dimension) => {
    dispatch(setAddLoading(true))

    var ids = [];
    if (Array.isArray(dimension)) {
      ids = dimension.map((value) => {
        return { item1: value.id, item2: value.rowVersion };
      });
    } else {
      ids = [{ item1: dimension.id, item2: dimension.rowVersion }];
    }
    DimensionService.updateMultipleStatus({
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
              type: "success",
              message: ValidationMsgs.dimension.dimensionDeleted,
            })
          );
          getDimensionData();
          getDimensionDropdownData();
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
        if (errors.response.data.Errors.Error) {
          dispatch(
            setAlertMessage({
              message: errors.response.data.Errors.Error,
              type: "danger",
            })
          );
        } else {
          dispatch(
            setAlertMessage({ message: ValidationMsgs.dimension.dimensionNotDeleted, type: "danger" })
          );
        }
        dispatch(setAddLoading(false))

      });
    setOpenDeleteModal(false);
  };
  const [Users, setUsers] = useState([]);
  const [DimensionOption, setDimensionOption] = useState([]);

  const getDimensionDropdownData = useCallback(() => {
    DropdownService.getDropdownValues("dimension", true).then((res) => {
      if (res.data.success && res.data.data) {
        setDimensionOption(() => {
          return res.data.data;
        });
      }
    });
  }, [])


  useEffect(() => {
    DropdownService.getDropdownValues("adminuser").then((res) => {
      if (res.data.success && res.data.data) {
        setUsers(() => {
          return res.data.data;

        });
      }
    });

    CategoryService.getCategoryDropdownOptions(-1).then((res) => {
      if (res.data.success && res.data.data) {
        setCategoryOption(() => {
          return res.data.data;
        });
      }
    });

    setStatusObj(RecStatusValueForForm);
    getDimensionDropdownData()
  }, [getDimensionDropdownData]);


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
      options: DimensionOption,
      columnName: "id",
      type: "checkbox",
      conditionalSearch: true,
    },
    {
      name: "Gender",
      columnName: "categoryId",
      options: CategoryOption,
      type: "checkbox",
      conditionalSearch: true,
    },
    {
      name: "Created Date",
      columnName: "createdDate",
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
      options: StatusObj,
      type: "radio",
    },
  ]
  const { pathname } = useLocation();
  return (
    <>
      <title>Dimension List</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
        {/* <div className="grid grid-cols-12 mb-10"> */}
        <div className="col-span-full w-full flex justify-between mb-8">
          <div className="col-span-full w-full flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
              Dimension Master
            </h1>
            {(permission?.isEdit || permission?.isDelete) && <div className="flex flex-wrap sm:auto-cols-max gap-2">
              <Link
                to={"create"}
                className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                <span className="material-icons-outlined">add</span>
                <span className="ml-1">Add Dimension</span>
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
            fetchData={getDimensionData}
            sortingOptions={sortingOptions}
            setSortingOptions={setSortingOptionHandler}
            handleSort={handleSort}
            // column filters
            filteringOptions={filteringOptions}
            setColumnFilteringOptions={setColumnFilteringOptions}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            CheckBoxAction={({ ...rest }) => (
              <CheckBoxAction
                setOpenDeleteModal={setOpenDeleteModal}
                setDimension={setDimension}
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
            morefilter={true}
            moreFilterOption={moreFilterOptions}
            saveFilter={{ show: true, tabName: pathname + '_' + 'All' }}
          // sortingColumns={sortingColumns}

          />
        </div>
        {/* </div> */}
      </div>
      <ConfirmDelete
        handleDelete={handleDelete}
        message={ValidationMsgs.dimension.dimensionPermanentDelete}
        title={"Delete"}
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
        data={dimension}
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
          pageName={PageName.Dimension}
        />
      )}
    </>
  );
};

export default List;
