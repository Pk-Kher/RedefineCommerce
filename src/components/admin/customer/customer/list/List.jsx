/*Component Name: List
Component Functional Details: User can create or update List of Customer master details from here.
Created By: Happy
Created Date: 06/01/22
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useEffect, useCallback, useState, useMemo } from "react";
import { format } from "date-fns";
import ReactTable from "components/common/table/ReactTableServerSide";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import CustomerService from "services/admin/customer/CustomerService";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import BasicModal from "components/common/modals/Basic";
import Messages from "components/common/alerts/messages/Index";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { DateTimeFormat } from "services/common/helper/Helper";
import Image from "components/common/formComponent/Image";
import { defaultImage, PageName, paginationDetails, RecStatusValuebyName, RecStatusValueForMorFilter } from "global/Enum";
import Select from "components/common/formComponent/Select";
import Actions from "components/common/others/admin/Action";
import CustomerImport from "components/common/others/admin/CustomerCompany/CustomerImport";
import ViewHistory from "components/common/modals/ViewHistory";
import { ValidationMsgs } from "global/ValidationMessages";
import { useSelector } from "react-redux";
import Status from "components/common/displayStatus/Status";
import { serverError } from 'services/common/helper/Helper';
import DropdownService from "services/common/dropdown/DropdownService";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import CustomerCreditService from "services/admin/customerCreadit/CustomerCreditService";

const List = () => {
  var FileSaver = require('file-saver');
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [viewHistoryModal, setViewHistoryModal] = useState(false);
  const [openBasicModal, setOpenBasicModal] = useState(false);
  const dispatch = useDispatch();
  const location = useSelector(store => store.location);
  const { storeName, storeType, storeId } = useParams();
  const [storeOptions, setStoreOptions] = useState([]);
  const [storeFilter, setStoreFilter] = useState("");
  const [customerOptions, setCustomerOptions] = useState([]);
  const permission = useSelector(store => store?.permission)
  const [openModal, setOpenModal] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);
  const [filteringOptions, setColumnFilteringOptions] = useState([]);
  const [initialColumnFilterOrder, setInitialColumnFilterOrder] = useState([]);

  const [Data, setData] = useState([]);

  const [sortingOptions, setSortingOptions] = useState([
    {
      field: "lastactive",
      direction: 1,
      priority: 0,
    },
  ]);

  const [paginationData, setPaginationData] = useState({
    ...paginationDetails,
  });

  const setPaginationDataFunc = (key, value) => {
    setPaginationData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const COLUMNS = [
    {
      id: "name",
      Header: "Customer Name",
      accessor: "name",
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
                <NavLink to={"/admin/Customer/customer/edit/" + row.original.id}>
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
      id: "storeLogo",
      Header: "stores",
      accessor: "storeLogo",
      column_name: "storeLogo",
      disableSortBy: true,
      Cell: ({ value, row }) => {
        return value !== null && value !== "" && value !== undefined ? (
          <>
            <div className="flex items-center">
              <Image src={value} className="w-20" containerheight={"h-20"} />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center">
              <Image src={defaultImage} className="w-20" containerheight={"h-20"} />
            </div>
          </>
        );
      },
    },
    {
      id: "isRegistered",
      Header: "Registered",
      accessor: "isRegistered",
      column_name: "isRegistered",
      Cell: ({ value }) => {
        return (
          <>
            <div >{value == 1 ? 'Yes' : 'No'}</div>
          </>
        );
      },
    },
    {
      id: "customerType",
      Header: "CUSTOMER TYPE",
      accessor: "customerType",
      column_name: "customerType",
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
      id: "email",
      Header: "Customer Email",
      accessor: "email",
      column_name: "email",
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
      id: "tags",
      Header: "Tags",
      accessor: "tags",
      column_name: "tags",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div className="bg-[#F7F7FA] text-xs w-28 py-1 text-center rounded-md inline-block text-[#bdbdc2]">
              {value}
            </div>
          </>
        ) : (
          ""
        );
      },
    },
    {
      id: "revenue",
      Header: "REVENUE",
      accessor: "revenue",
      column_name: "revenue",
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
      id: "orders",
      Header: "Orders",
      accessor: "orders",
      column_name: "orders",
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
      id: "sessions",
      Header: "Sessions",
      accessor: "sessions",
      column_name: "sessions",
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
      id: "recStatus",
      Header: "status",
      accessor: "recStatus",
      column_name: "recStatus",
      Cell: ({ value }) => {
        return <Status type={value} />;
      },
    },
    {
      id: "lastactive",
      Header: "Last Active",
      accessor: "lastactive",
      column_name: "lastactive",
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
      id: "action",
      Header: "",
      accessor: "id",
      column_name: "action",
      Cell: ({ value, row }) => {
        return (
          <Actions
            row={row}
            openDeleteModal={openDeleteModal}
            setOpenDeleteModal={setOpenDeleteModal}
            setDeleteData={setCustomer}
            setModalInfo={setCustomer}
            setOpenBasicModal={setOpenBasicModal}
            editUrl={`/admin/Customer/customer/edit/${row.original.id}`}
            moduleName={'Customer'}
            setViewHistoryModal={setViewHistoryModal}
            setRecordId={setCustomer}
          />
        );
      },
      disableSortBy: true,
      disableShowHide: true,
    },
  ];

  const getCustomerData = useCallback(
    (pageIndex = 1) => {
      dispatch(setAddLoading(true))
      CustomerService.getCustomers({
        args: {
          pageSize: paginationData.pageSize,
          pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
          sortingOptions,
          filteringOptions,
        }
      }).then((response) => {
        let responseData = response.data.data;
        setData(responseData.items);
        setPaginationData((prevState) => ({
          ...prevState,
          pageIndex: responseData.pageIndex,
          pageSize: responseData.pageSize,
          totalCount: responseData.totalCount,
          totalPages: responseData.totalPages,
          hasPreviousPage: responseData.hasPreviousPage,
          hasNextPage: responseData.hasNextPage,
        }));
        dispatch(setAddLoading(false))

      }).catch(() => {
        dispatch(setAddLoading(false))

      })
    },
    [
      paginationData.pageSize,
      sortingOptions,
      paginationData.pageIndex,
      filteringOptions
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

  const handleSort = useCallback((sortValue) => {
    // console.log(sortValue);
  });

  const statusChange = (customer) => {
    var success = customer.changeStatus !== RecStatusValuebyName.Archived ? ValidationMsgs.customer.customerStatus : ValidationMsgs.customer.customerDeleted;
    var fail = customer.changeStatus !== RecStatusValuebyName.Archived ? ValidationMsgs.customer.customerNotStatus : ValidationMsgs.customer.customerNotDeleted;

    dispatch(setAddLoading(true))

    CustomerService.updateStatus({
      args: {
        id: customer.id,
        status: customer.changeStatus,
        rowVersion: customer.rowVersion,
        ...location
      },
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: success,
            })
          );
          getCustomerData();
          getCustomerDropdownData();
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
              message: fail
            })
          );
          dispatch(setAddLoading(false))
        }
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: fail,
          })
        );
        dispatch(setAddLoading(false))

      });
    setOpenBasicModal(false);
  };

  const moreFilterOptions = useMemo(
    () => [
      {
        name: "Name",
        options: customerOptions,
        columnName: "id",
        type: "checkbox",
        conditionalSearch: true,
      },
      {
        name: "Store Name",
        options: storeOptions,
        columnName: "storeId",
        type: "checkbox",
        conditionalSearch: true,
      },
      {
        name: "Last Active Date",
        columnName: "lastactive",
        options: [],
        type: "date",
      },
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
        name: "Status",
        columnName: "recStatus",
        options: RecStatusValueForMorFilter,
        type: "radio",
        conditionalSearch: true,
      }],
    [customerOptions]
  );

  // const saveFilterOptionsHandler = () => {
  //   const saveFilterOptions = {
  //     'hiddenColumns': hiddenColumns,
  //     'filteringOptions': filteringOptions,
  //     'initialColumnFilterOrder': initialColumnFilterOrder,
  //     'activeTab': activeTab
  //   };
  // };

  const getCustomerDropdownData = useCallback(() => {
    DropdownService.getDropdownValues('customer', true).then((response) => {
      setCustomerOptions(response.data.data);
    }).catch(() => {
    });
  }, [])

  const ExportSampleFile = () => {
    CustomerCreditService.ExportSampleFile().then((response) => {
      if (response.data.success) {
        FileSaver.saveAs(response.data.data, "export.csv");
        // window.location.href = response.data.data;
        dispatch(
          setAlertMessage({
            type: "success",
            message: ValidationMsgs.product.export.exportSuccess,
          })
        );
      } else {
        dispatch(setAlertMessage({ type: "danger", message: serverError(response) }));
      }
      dispatch(setAddLoading(false))
    }).catch(() => {
    });
  }

  useEffect(() => {
    DropdownService.getDropdownValues('store').then((response) => {
      setStoreOptions(response.data.data);
    }).catch(() => {
    });
    getCustomerDropdownData();
  }, [getCustomerDropdownData])

  useEffect(() => {
    if (storeFilter) {
      setColumnFilteringOptions([{
        field: "storeId",
        operator: 0,
        value: storeFilter
      }]);
    }
  }, [storeFilter]);
  const { pathname } = useLocation();
  return (
    <>
      <title>Customer List</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          <div className="col-span-full w-full flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
              Customer List
            </h1>
            <div className="ml-328px "></div>
            {(permission?.isEdit || permission?.isDelete) &&
              <div className="flex flex-wrap sm:auto-cols-min gap-2">
                <button type="button" className="btn shadow-none text-indigo-500 hover:text-indigo-600 font-semibold mb-2" onClick={() => ExportSampleFile()} >
                  <span >Export Sample File</span>
                </button>
                <button type="button" className="btn shadow-none text-indigo-500 hover:text-indigo-600 font-semibold mb-2" onClick={() => setOpenModal(true)} >
                  <span >Import</span>
                </button>

                <Select
                  name=""
                  options={storeOptions}
                  defaultValue={storeFilter}
                  onChange={(data) => {
                    setStoreFilter(data ? data.value : "");
                  }}
                  classNames={'w-56'}
                />
                <NavLink
                  to={"create"}
                  className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                >
                  <span className="material-icons-outlined">add</span>
                  <span className="ml-1">Create Customer</span>
                </NavLink>
              </div>
            }
          </div>
        </div>
        <Messages />
        <div className="col-span-full w-full bg-white shadow-xxl rounded-md mb-8 relative">
          <ReactTable
            COLUMNS={COLUMNS}
            DATA={Data}
            {...paginationData}
            fetchData={getCustomerData}
            sortingOptions={sortingOptions}
            setSortingOptions={setSortingOptionHandler}
            handleSort={handleSort}
            setTablePageSize={(value) =>
              setPaginationDataFunc("pageSize", value)
            }
            // column filters
            editColumnFilter={true}
            filteringOptions={filteringOptions}
            setColumnFilteringOptions={setColumnFilteringOptions}
            hiddenColumns={useMemo(() => ['rowSelection'], [])}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            morefilter={true}
            moreFilterOption={moreFilterOptions}
            setInitialColumnFilterOrder={setInitialColumnFilterOrder}
            saveFilter={{ show: true, tabName: pathname + '_' + 'customer' }}
          // checkBoxFilterOptions={[
          //   {
          //     columnName: "type",
          //     name: "Tags",
          //     options: CustomerTags,
          //     icon: 'expand_more',
          //     iconPosition: 'right',
          //   },
          // ]}
          />
        </div>
      </div>
      <ConfirmDelete
        handleDelete={statusChange}
        data={customer}
        message="Deleting this Brand will permanently remove this record from your account. This can't be undone"
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
        title={"Delete"}
      />
      <BasicModal
        handleConfirmation={statusChange}
        openModal={openBasicModal}
        setOpenModal={setOpenBasicModal}
        {...customer}
      />

      <CustomerImport
        openModal={openModal}
        setOpenModal={setOpenModal}
      />

      {viewHistoryModal && (
        <ViewHistory
          title={"View History"}
          openModal={viewHistoryModal}
          setOpenModal={setViewHistoryModal}
          rowId={customer}
          pageName={PageName.Product}
        />
      )}
    </>
  );
};

export default List;
