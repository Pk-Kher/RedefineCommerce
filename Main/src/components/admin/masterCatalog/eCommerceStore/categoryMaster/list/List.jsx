import React, { useCallback, useMemo, useState, useEffect } from "react";
import { format } from "date-fns";
import ReactTable from "../../../../../common/table/ReactTableServerSide";
import { NavLink, useParams } from "react-router-dom";
import CategoryService from "services/admin/masterCatalog/store/categoryMaster/CategoryMasterService";
import CheckBoxAction from "./CheckBoxAction";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import BasicModal from "components/common/modals/Basic";
import Actions from "./Actions";
import Messages from "components/common/alerts/messages/Index";
// import DropdownService from "services/common/dropdown/DropdownService";
import { serverError } from "services/common/helper/Helper";
import ViewHistory from "components/common/modals/ViewHistory";
import {
  paginationDetails,
  RecStatusValue,
  RecStatusValueForForm,
  RecStatusValuebyName,
  PageName
} from "global/Enum";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { useDispatch, useSelector } from "react-redux";
import { DateTimeFormat } from "services/common/helper/Helper";
import { ValidationMsgs } from "global/ValidationMessages";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const List = () => {
  const { storeType, storeName, storeId } = useParams();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [ModalInfo, setModalInfo] = useState({});
  const [openBasicModal, setOpenBasicModal] = useState(false);
  const [category, setCategory] = useState(null);
  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);
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

  const getCategoryData = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true))

      CategoryService.getCategoriesWithTreeview({
        args: {
          pageSize: paginationData.pageSize,
          pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
          sortingOptions,
          filteringOptions,
        },
        storeId: storeId,
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
      // paginationData.pageSize,
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
                  to={`/admin/MasterCatalog/${storeType}/${storeName}/${storeId}/category/edit/${row.original.id}`}>
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
      id: "createddate",
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
      id: "Created By",
      Header: "Created By",
      accessor: "createdByName",
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
      id: "Updated By",
      Header: "Updated By",
      accessor: "modifiedByName",
      column_name: "modifiedByName",
      Cell: ({ value }) => {
        return (
          <>
            <div >{value} </div>
          </>
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
    dispatch(setAddLoading(true))

    var ids = [];
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
    dispatch(setAddLoading(true))

    const object = {
      id: data.id,
      status: data.changeStatus,
      rowVersion: data.rowVersion,
    };
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
        setOpenBasicModal(false);
        dispatch(setAddLoading(false))
      });
  };

  /*  useEffect(() => {
     DropdownService.getDropdownValues("brand", "true").then((response) => {
       setBrandOption(response.data.data);
     });
     DropdownService.getDropdownValues("vendor", "true").then((response) => {
       setVendorOption(response.data.data);
     });
     setStatusObj(RecStatusValueForForm);
     setNavId(Object.values(NumericList(0, 50, 1)));
   }, []); */

  const moreFilterOptions = [
    {
      name: "Status",
      columnName: "recStatus",
      options: StatusObj,
      type: "radio",
    },
  ]

  return (
    <>
      <title>All Categories</title>
      <div className="px-4 sm:px-6 py-8 w-full mx-auto">
        <div className="grid grid-cols-12">
          <div className="col-span-full w-full flex justify-between mb-8">
            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
              Category Master
            </h1>
          </div>
        </div>
        <Messages />
        <div className="col-span-full w-full bg-white shadow-xxl rounded-md mb-8">
          <ReactTable
            COLUMNS={COLUMNS}
            DATA={Data}
            {...paginationData}
            fetchData={getCategoryData}
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
            actionRelativeCl={false}
          />
        </div>
      </div>
      <ConfirmDelete
        handleDelete={handleDelete}
        data={category}
        message="Deleting these Category will permanently remove this record from your account. This can't be undone."
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
