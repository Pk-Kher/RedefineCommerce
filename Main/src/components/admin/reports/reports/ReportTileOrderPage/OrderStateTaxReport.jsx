import React, {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useCallback,
} from "react";
import { useDispatch } from "react-redux";
import ReactTable from "components/common/table/ReactTableServerSide";
import { paginationDetails, CurrencySymbolByCode } from "global/Enum";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import Select from "components/common/formComponent/Select";
import DropdownService from "services/common/dropdown/DropdownService";
import DatePicker from "react-datepicker";
import { subDays } from "date-fns";
import { serverError } from "services/common/helper/Helper";
import "react-datepicker/dist/react-datepicker.css";
import OrderService from "services/admin/reports/order/orderServices";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { ValidationMsgs } from "global/ValidationMessages";
import Messages from "components/common/alerts/messages/Index";
import { NavLink } from "react-router-dom";

const OrderStateTaxReport = () => {
  const dispatch = useDispatch();
  const toDatePicker = useRef();
  const [Data, setData] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const [startDate, setstartDate] = useState(new Date());
  const [endDate, setendDate] = useState(new Date());
  const [store, setStore] = useState({});
  const [sortingOptions, setSortingOptions] = useState([
    {
      field: "name",
      direction: 0,
      priority: 0,
    },
  ]);
  const [filteringOptions, setColumnFilteringOptions] = useState([]);
  const [paginationData, setPaginationData] = useState({
    ...paginationDetails,
  });

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

  const getOrderStateTaxReport = useCallback(
    (pageIndex) => {
      if (store?.value) {
        dispatch(setAddLoading(true));
        OrderService.getOrderStateTaxReport({
          args: {
            pageSize: paginationData.pageSize,
            pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
            sortingOptions,
            filteringOptions,
          },
          storeId: store?.value ? store?.value : 0,
          startDate: startDate,
          endDate: endDate,
        }).then((response) => {
          setData(response.data.data);
          setPaginationData((prevState) => ({
            ...prevState,
            pageIndex: response.data.data.totalOrder.pageIndex,
            pageSize: response.data.data.totalOrder.pageSize,
            totalCount: response.data.data.totalOrder.totalCount,
            totalPages: response.data.data.totalOrder.totalPages,
            hasPreviousPage: response.data.data.totalOrder.hasPreviousPage,
            hasNextPage: response.data.data.totalOrder.hasNextPage,
          }));
          dispatch(setAddLoading(false));
        });
      }
    },
    [
      store,
      startDate,
      endDate,
      filteringOptions,
      paginationData.pageSize,
      sortingOptions,
      paginationData.pageIndex,
    ]
  );

  const Export = (pageIndex) => {
    dispatch(setAddLoading(true));
    OrderService.ExportOrderStateTaxReport({
      args: {
        pageIndex: 0,
        pageSize: paginationData.pageSize,
        pagingStrategy: 0,
        sortingOptions,
        filteringOptions,
      },
      storeId: store?.value ? store?.value : 0,
      startDate: startDate,
      endDate: endDate,
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.commonExport.success,
            })
          );
          window.location.href = response.data.data;
        } else {
          dispatch(
            setAlertMessage({
              type: "danger",
              message: serverError(response),
            })
          );
        }
        dispatch(setAddLoading(false));
      })
      .catch((error) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.commonExport.failed,
          })
        );
        dispatch(setAddLoading(false));
      });
  };

  useEffect(() => {
    getOrderStateTaxReport();
  }, [store?.value]);

  const getStoreDropdownData = useCallback(() => {
    DropdownService.getDropdownValues("store").then((res) => {
      if (res?.data?.success && res?.data?.data) {
        setStoreData(() => {
          return res.data.data;
          // return Object.keys(res.data.data).map((value, key) => {
          //   return { label: res.data.data[value], value: value }
          // })
        });
        if (res?.data?.data?.length > 0) {
          setStore(res?.data?.data[0]);
        }
      }
    });
  }, []);

  useEffect(() => {
    getStoreDropdownData();
  }, [getStoreDropdownData]);

  const onStartDateChangeHandler = (date) => {
    setstartDate(date);
    toDatePicker.current.input.click();
  };

  const onEndDateChangeHandler = (date) => {
    setendDate(date);
  };

  const onClick = () => {
    getOrderStateTaxReport();
  };

  const COLUMNS = [
    {
      id: "state",
      Header: "State",
      accessor: "state",
      column_name: "state",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div className="font-semibold text-left">{value}</div>
          </>
        ) : (
          "-"
        );
      },
      Footer: "Total",
    },
    {
      id: "orderTax",
      Header: `Order Tax (${CurrencySymbolByCode.USD})`,
      accessor: "orderTax",
      column_name: "orderTax",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div className="text-left">{value.toFixed(2)}</div>
          </>
        ) : (
          "0.00"
        );
      },
      Footer: () => {
        return (
          <>
            {CurrencySymbolByCode.USD}
            {Data?.totalTax?.totalOrderTax.toFixed(2)}
          </>
        );
      },
    },
    {
      id: "orderTotal",
      Header: `Order Total (${CurrencySymbolByCode.USD})`,
      accessor: "orderTotal",
      column_name: "orderTotal",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div className=" text-left">{value.toFixed(2)}</div>
          </>
        ) : (
          "0.00"
        );
      },
      Footer: () => {
        return (
          <>
            {CurrencySymbolByCode.USD}
            {Data?.totalTax?.totalOrderTotal.toFixed(2)}
          </>
        );
      },
    },
  ];
  return (
    <>
      <title>Order state tax report</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
        <div className="flex justify-between mb-8">
          <div className="flex items-center">
            <NavLink
              className="btn border-neutral-200 hover:border-neutral-400 text-gray-500 hover:text-gray-700 flex items-center mr-2"
              to={"/admin/reports"}
            >
              <span className="material-icons-outlined">west </span>
            </NavLink>
            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
              Order state tax report
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="text-indigo-500" onClick={Export}>
              Export
            </button>
            <Select
              onChange={(e) => {
                if (e) {
                  setStore((prevState) => ({
                    ...prevState,
                    label: e.label,
                    value: e.value,
                  }));
                } else {
                  setStore({});
                }
              }}
              isClearable={false}
              defaultValue={store?.value}
              classNames={"w-[200px]"}
              options={storeData}
              isMulti={false}
            />
          </div>
        </div>
        <Messages />
        <div className="bg-white shadow-xxl rounded-md mb-8">
          <div className="p-6 flex items-center justify-end">
            <div className="inline-flex flex-wrap justify-between items-center">
              <ExtraComponent
                startDate={startDate}
                endDate={endDate}
                onStartDateChangeHandler={onStartDateChangeHandler}
                onEndDateChangeHandler={onEndDateChangeHandler}
                toDatePicker={toDatePicker}
                onClick={onClick}
              />
            </div>
          </div>
          <div className="max-h-full">
            <ReactTable
              COLUMNS={COLUMNS}
              DATA={Data?.totalOrder?.items || []}
              {...paginationData}
              setTablePageSize={(value) =>
                setPaginationDataFunc("pageSize", value)
              }
              fetchData={getOrderStateTaxReport}
              sortingOptions={sortingOptions}
              setSortingOptions={setSortingOptionHandler}
              handleSort={handleSort}
              setColumnFilteringOptions={setColumnFilteringOptions}
              filteringOptions={filteringOptions}
              hiddenColumns={["rowSelection"]}
              footer={true}
              displaySearch={false}
              filters={false}
            // extraFilter={[
            //   {
            //     Component: ExtraComponent,
            //     startDate,
            //     endDate,
            //     onStartDateChangeHandler,
            //     onEndDateChangeHandler,
            //     toDatePicker,
            //     onClick,
            //   },
            // ]}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderStateTaxReport;

const CustomDatePicker = ({
  onChangeHandler,
  defaultDate,
  minDate,
  maxDate,
  refDatePicker,
}) => {
  const CustomInput = forwardRef(({ value, onClick, disabledLogo }, ref) => (
    <button
      type="button"
      className={`w-full h-10 bg-white border text-left border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md ${"className"}`}
      onClick={onClick}
      ref={ref}
    >
      {value}
      {!disabledLogo && (
        <div className="absolute top-0 right-0 px-3 py-2 ">
          <svg
            className="h-6 w-6 text-gray-400 bg-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
        </div>
      )}
    </button>
  ));

  return (
    <>
      <div className="w-52">
        <DatePicker
          dateFormat={"MM - dd - yyyy"}
          selected={defaultDate}
          onChange={onChangeHandler}
          minDate={subDays(minDate, 0)}
          maxDate={subDays(maxDate, 0)}
          customInput={<CustomInput disabledLogo={false} />}
          ref={refDatePicker}
        />
      </div>
    </>
  );
};

const ExtraComponent = ({
  startDate,
  endDate,
  onStartDateChangeHandler,
  onEndDateChangeHandler,
  toDatePicker,
  onClick,
}) => {
  return (
    <>
      <div className="flex items-center justify-end">
        <div className="inline-flex flex-wrap justify-between items-center gap-2">
          <CustomDatePicker
            onChangeHandler={onStartDateChangeHandler}
            defaultDate={startDate}
            maxDate={endDate}
          />
          <div className="mx-2">to</div>
          <CustomDatePicker
            onChangeHandler={onEndDateChangeHandler}
            defaultDate={endDate}
            minDate={startDate}
            refDatePicker={toDatePicker}
          />
        </div>
      </div>
      <div className="inline-flex flex-wrap justify-between items-center">
        <div className="ml-2">
          <button
            className="btn px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white"
            onClick={onClick}
          >
            Search
          </button>
        </div>
      </div>
    </>
  );
};
