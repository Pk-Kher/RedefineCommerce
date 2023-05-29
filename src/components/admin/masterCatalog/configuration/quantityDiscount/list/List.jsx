/*Component Name: List
Component Functional Details: User can create or update List of Quantity Discount from here.
Created By: Happy
Created Date: 31/5/22
Modified By: Divyesh
Modified Date: <Modified Date> */

import React, { useCallback, useState, useEffect, useMemo } from "react";
import ReactTable from "../../../../../common/table/ReactTableServerSide";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CheckBoxAction from "./CheckBoxAction";
import QuantityDiscountService from "services/admin/quantityDiscount/QuantityDiscountService";
import DropdownService from "services/common/dropdown/DropdownService";
import Status from "../../../../../common/displayStatus/Status";
import Actions from "./Actions";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import BasicModal from "components/common/modals/Basic";
import Messages from "components/common/alerts/messages/Index";
import { RecStatusValuebyName, RecStatusValueForForm } from "global/Enum";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { paginationDetails, PageName } from "global/Enum";
import { DateTimeFormat, serverError } from "services/common/helper/Helper";
import CloneModal from "./Clone";
import ViewHistory from "components/common/modals/ViewHistory";
import { ValidationMsgs } from "global/ValidationMessages";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const List = () => {
  const permission = useSelector(store => store.permission)
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openCloneModal, setOpenCloneModal] = useState(false);
  const [viewHistoryModal, setViewHistoryModal] = useState(false);
  const [Data, setData] = useState([]);
  const [quantity, setQuantity] = useState(null);
  const [ModelInfo, setModalInfo] = useState({});
  const [openBasicModal, setOpenBasicModal] = useState(false);
  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);
  const [vendors, setVendors] = useState([]);
  const [brands, setBrands] = useState([]);
  const [QuantityDiscount, setQuantityDiscount] = useState([]);
  const [Stores, setStores] = useState([]);
  const [Users, setUsers] = useState([]);
  const [RecordId, setRecordId] = useState(null);


  const getQuantityDiscountDropDownData = useCallback(() => {
    DropdownService.getDropdownValues(
      "quantityDiscount", true
    ).then((res) => {
      if (res.data.success && res.data.data) {
        setQuantityDiscount(() => {
          return res.data.data;

        });
      }
    });
  }, [])

  useEffect(() => {
    DropdownService.getDropdownValues(
      "store"
    ).then((res) => {
      if (res.data.success && res.data.data) {
        setStores(() => {
          return res.data.data;

        });
      }
    });

    DropdownService.getDropdownValues(
      "adminuser"
    ).then((res) => {
      if (res.data.success && res.data.data) {
        setUsers(() => {
          return res.data.data;

        });
      }
      // dispatch(setAddLoading(false))

    });
    DropdownService.getDropdownValues(
      "vendor"
    ).then((res) => {
      if (res.data.success && res.data.data) {
        setVendors(() => {
          return res.data.data;
        });
      }
    });
    DropdownService.getDropdownValues(
      "brand"
    ).then((res) => {
      if (res.data.success && res.data.data) {
        setBrands(() => {
          return res.data.data;

        });
      }
    });
    getQuantityDiscountDropDownData();
  }, [getQuantityDiscountDropDownData]);

  const COLUMNS = [
    {
      id: "quantityName",
      Header: "Quantity Name",
      accessor: "quantityName",
      column_name: "quantityName",
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
                    "/admin/MasterCatalog/Configuration/quantityDiscount/edit/" +
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
      id: "storeName",
      Header: "Store Name",
      accessor: "storeName",
      column_name: "storeName",
    },

    {
      id: "brandName",
      Header: "Brand Name",
      accessor: "brandName",
      column_name: "brandName",
    },
    {
      id: "vendorName",
      Header: "Vendor Name",
      accessor: "vendorName",
      column_name: "vendorName",
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
      id: "modifiedDate",
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
      id: "modifiedName",
      Header: "Updated By",
      accessor: "modifiedName",
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
        return value ? <Status type={value} /> : '';
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
            setQuantity={setQuantity}
            setOpenDeleteModal={setOpenDeleteModal}
            setOpenCloneModal={setOpenCloneModal}
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
  const [paginationData, setPaginationData] = useState({ ...paginationDetails });
  const [sortingOptions, setSortingOptions] = useState([
    {
      field: "name",
      direction: 0,
      priority: 0,
    },
  ]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filteringOptions, setColumnFilteringOptions] = useState([]);

  const getQuantityDiscountData = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true))

      QuantityDiscountService.getQuantityDiscounts({
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
  const moreFilterOptions = useMemo(
    () => [
      {
        name: "Name",
        options: QuantityDiscount,
        columnName: "id",
        type: "checkbox",
        conditionalSearch: true,
      },
      {
        name: "Store Name",
        options: Stores,
        columnName: "storeId",
        type: "checkbox",
        conditionalSearch: true,
      },
      {
        name: "Brand Name",
        columnName: "brandId",
        options: brands,
        type: "checkbox",
        conditionalSearch: true,
      },
      {
        name: "Vendor Name",
        columnName: "vendorId",
        options: vendors,
        type: "checkbox",
      },
      {
        name: "Created By",
        options: Users,
        columnName: "createdBy",
        type: "checkbox",
      },
      {
        name: "Created Date",
        columnName: "createddate",
        options: [],
        type: "date",
      },
      {
        name: "Updated By",
        options: Users,
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
    [filteringOptions, brands, vendors]
  );

  const handleSort = (sortValue) => { };

  const statusChangedHandler = (data) => {
    dispatch(setAddLoading(true))
    const object = {
      id: data.id,
      status: data.changeStatus,
      rowVersion: data.rowVersion,
    };

    QuantityDiscountService.updateStatus({
      args: {
        ...object,
        ...location,
      },
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.quantityDiscount.quantityDiscountStatusUpdated,
            })
          );
          getQuantityDiscountData();
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
            message: ValidationMsgs.quantityDiscount.quantityDiscountStatusNotUpdated,
          })
        );
        setOpenBasicModal(false);
        dispatch(setAddLoading(false))
      });
    setOpenBasicModal(false);
  };

  const handleDelete = (quantity) => {
    dispatch(setAddLoading(true))

    var ids = [];
    if (Array.isArray(quantity)) {
      ids = quantity.map((value) => {
        return { item1: value.id, item2: value.rowVersion };
      });
    } else {
      ids = [{ item1: quantity.id, item2: quantity.rowVersion }];
    }
    QuantityDiscountService.updateMultipleStatus({
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
              message: ValidationMsgs.quantityDiscount.quantityDiscountDeleted,
            })
          );
          getQuantityDiscountData();
          getQuantityDiscountDropDownData();
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
            setAlertMessage({ message: ValidationMsgs.quantityDiscount.quantityDiscountNotDeleted, type: "danger" })
          );
        }
        dispatch(setAddLoading(false))
      });
    setOpenDeleteModal(false);
  };
  const { pathname } = useLocation();
  return (
    <>
      <title>Quantity Discount Master</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          <div className="col-span-full w-full flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
              Quantity Discount Master
            </h1>
            <div className="flex flex-wrap sm:auto-cols-max gap-2">
              <NavLink
                to={'export'}
                className="btn shadow-none text-indigo-500 hover:text-indigo-600 font-semibold"
              >
                <span >Export</span>
              </NavLink>
              {(permission?.isEdit || permission?.isDelete) && <>
                <NavLink
                  to={'import'}
                  className="btn shadow-none text-indigo-500 hover:text-indigo-600 font-semibold"
                >
                  <span >Import</span>
                </NavLink>
                <NavLink
                  to={"create"}
                  className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                >
                  <span className="material-icons-outlined">add</span>{" "}
                  <span className="ml-1">Add Quantity Discount</span>
                </NavLink>
              </>}
            </div>
          </div>
        </div>
        <Messages />
        <div className="col-span-full w-full bg-white shadow-xxl rounded-md mb-8 relative">
          <ReactTable
            COLUMNS={COLUMNS}
            DATA={Data}
            {...paginationData}
            setTablePageSize={(value) =>
              setPaginationDataFunc("pageSize", value)
            }
            fetchData={getQuantityDiscountData}
            sortingOptions={sortingOptions}
            setSortingOptions={setSortingOptionHandler}
            handleSort={handleSort}
            // column filters
            editColumnFilter={true}
            filteringOptions={filteringOptions}
            setColumnFilteringOptions={setColumnFilteringOptions}
            CheckBoxAction={({ ...rest }) => (
              <CheckBoxAction
                setOpenDeleteModal={setOpenDeleteModal}
                setQuantity={setQuantity}
                {...rest}
              />
            )}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            moreFilterOption={moreFilterOptions}
            saveFilter={{ show: true, tabName: pathname + '_' + 'quantityDiscount' }}
          />
        </div>
      </div>
      <ConfirmDelete
        handleDelete={handleDelete}
        message={ValidationMsgs.quantityDiscount.quantityPermanentDelete}
        title={"Delete"}
        data={quantity}
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
      />

      <BasicModal
        handleConfirmation={statusChangedHandler}
        openModal={openBasicModal}
        setOpenModal={setOpenBasicModal}
        {...ModelInfo}
      />
      <CloneModal
        getQuantityDiscountData={getQuantityDiscountData}
        openCloneModal={openCloneModal}
        setOpenCloneModal={setOpenCloneModal}
        data={quantity}
      />
      {viewHistoryModal && (
        <ViewHistory
          title={"View History"}
          openModal={viewHistoryModal}
          setOpenModal={setViewHistoryModal}
          rowId={RecordId}
          pageName={PageName.QuantityDiscount}
        />
      )}
    </>
  );
};

export default List;
