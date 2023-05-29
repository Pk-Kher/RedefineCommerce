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
import { DateTimeFormat, serverError } from "services/common/helper/Helper";
import "react-datepicker/dist/react-datepicker.css";
import ProductServices from "services/admin/reports/product/productServices";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { ValidationMsgs } from "global/ValidationMessages";
import Messages from "components/common/alerts/messages/Index";
import { NavLink } from "react-router-dom";
import Pagination from "components/common/table/Pagination";
import { Fragment } from "react";

const ComparativeSalesByTimePeriod = () => {
  const dispatch = useDispatch();
  const p1ToDatePicker = useRef();
  const p2ToDatePicker = useRef();
  const [Data, setData] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const [p1StartDate, setP1StartDate] = useState(new Date());
  const [p1EndDate, setP1EndDate] = useState(new Date());
  const [p2StartDate, setP2StartDate] = useState(new Date());
  const [p2EndDate, setP2EndDate] = useState(new Date());
  const [store, setStore] = useState({});
  const [periodColumn, setPeriodColumn] = useState({
    salesStartDate: "-",
    salesEndDate: "-",
    OrdersStartDate: "-",
    OrdersEndDate: "-",
  });

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

  const getComparativeSalesByTimePeriod = useCallback(
    (pageIndex) => {
      if (store?.value) {
        dispatch(setAddLoading(true));
        ProductServices.getComparativeSalesByTimePeriod({
          args: {
            pageSize: paginationData.pageSize,
            pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
            sortingOptions,
            filteringOptions,
          },
          storeId: store?.value ? store?.value : 0,
          period1startDate: p1StartDate,
          period1endDate: p1EndDate,
          period2startDate: p2StartDate,
          period2endDate: p2EndDate,
        }).then((response) => {
          setData(response?.data?.data);
          setPaginationData((prevState) => ({
            ...prevState,
            pageIndex: response?.data?.data?.pageIndex,
            pageSize: response?.data?.data?.pageSize,
            totalCount: response?.data?.data?.totalCount,
            totalPages: response?.data?.data?.totalPages,
            hasPreviousPage: response?.data?.data?.hasPreviousPage,
            hasNextPage: response?.data?.data?.hasNextPage,
          }));
          dispatch(setAddLoading(false));
        });
      }
    },
    [
      store,
      p1StartDate,
      p1EndDate,
      p2StartDate,
      p2EndDate,
      filteringOptions,
      paginationData.pageSize,
      sortingOptions,
      paginationData.pageIndex,
    ]
  );

  const Export = (pageIndex) => {
    dispatch(setAddLoading(true));
    ProductServices.ExportComparativeSalesByTimePeriod({
      args: {
        pageIndex: 0,
        pageSize: paginationData.pageSize,
        pagingStrategy: 0,
        sortingOptions,
        filteringOptions,
      },
      storeId: store?.value ? store?.value : 0,
      period1startDate: p1StartDate,
      period1endDate: p1EndDate,
      period2startDate: p2StartDate,
      period2endDate: p2EndDate,
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
    getComparativeSalesByTimePeriod();
  }, [store?.value, paginationData?.pageSize]);

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

  const p1onStartDateChangeHandler = (date) => {
    setP1StartDate(date);
    p1ToDatePicker.current.input.click();
  };
  const p1onEndDateChangeHandler = (date) => {
    setP1EndDate(date);
  };

  const p2onStartDateChangeHandler = (date) => {
    setP2StartDate(date);
    p2ToDatePicker.current.input.click();
  };
  const p2onEndDateChangeHandler = (date) => {
    setP2EndDate(date);
  };

  const onClick = () => {
    getComparativeSalesByTimePeriod();
  };

  useEffect(() => {
    if (Data && Data.items && Data?.items.length > 0) {
      setPeriodColumn({
        salesStartDate: DateTimeFormat(Data?.items[0].p1From).date || "-",
        salesEndDate: DateTimeFormat(Data?.items[0].p1To).date || "-",
        OrdersStartDate: DateTimeFormat(Data?.items[0].p2From).date || "-",
        OrdersEndDate: DateTimeFormat(Data?.items[0].p2To).date || "-",
      });
    }
  }, [Data]);

  return (
    <>
      <title> Comparative sales by time period</title>
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
              Comparative sales by time period
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className="text-indigo-500" onClick={Export}>
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
          <div className="p-6 flex items-center justify-between">
            <ExtraComponent
              p1StartDate={p1StartDate}
              p1EndDate={p1EndDate}
              p1onStartDateChangeHandler={p1onStartDateChangeHandler}
              p1onEndDateChangeHandler={p1onEndDateChangeHandler}
              p2StartDate={p2StartDate}
              p2EndDate={p2EndDate}
              p2onStartDateChangeHandler={p2onStartDateChangeHandler}
              p2onEndDateChangeHandler={p2onEndDateChangeHandler}
              onClick={onClick}
              p1ToDatePicker={p1ToDatePicker}
              p2ToDatePicker={p2ToDatePicker}
            />
          </div>
          <div className="overflow-x-auto max-h-screen border-t border-neutral-200">
            <table className="table-auto w-full text-sm text-[#191919] ">
              <thead className="text-sm font-bold uppercase text-[#b3b3b3] divide-y border-b border-neutral-200">
                <tr>
                  <th className="px-2 first:pl-5 py-4">
                    <div className="text-left flex items-center">
                      <span>Store</span>
                    </div>
                  </th>
                  <th className="px-2 first:pl-5 py-4" colspan="3">
                    <div className=" text-left flex items-center">
                      <span>Sales</span>
                    </div>
                  </th>
                  <th className="px-2 first:pl-5 py-4" colspan="3">
                    <div className=" text-left flex items-center">
                      <span>Orders</span>
                    </div>
                  </th>
                </tr>
                <tr>
                  <th className="px-2 first:pl-5 py-4">
                    <div className=" text-left flex items-center">
                      <span></span>
                    </div>
                  </th>

                  <th className="px-2 first:pl-5 py-4">
                    <div className=" text-left flex items-center">
                      <span>{periodColumn.salesStartDate}</span>
                    </div>
                    <div className=" text-left flex items-center">
                      <span>{periodColumn.salesEndDate}</span>
                    </div>
                  </th>
                  <th className="px-2 first:pl-5 py-4">
                    <div className=" text-left flex items-center">
                      <span>{periodColumn.salesStartDate}</span>
                    </div>
                    <div className=" text-left flex items-center">
                      <span>{periodColumn.salesEndDate}</span>
                    </div>
                  </th>
                  <th className="px-2 first:pl-5 py-4">
                    <div className=" text-left flex items-center">
                      <span>P2 Vs P1</span>
                    </div>
                  </th>
                  <th className="px-2 first:pl-5 py-4">
                    <div className=" text-left flex items-center">
                      <span>{periodColumn.OrdersStartDate}</span>
                    </div>
                    <div className=" text-left flex items-center">
                      <span>{periodColumn.OrdersEndDate}</span>
                    </div>
                  </th>
                  <th className="px-2 first:pl-5 py-4">
                    <div className=" text-left flex items-center">
                      <span>{periodColumn.OrdersStartDate}</span>
                    </div>
                    <div className=" text-left flex items-center">
                      <span>{periodColumn.OrdersEndDate}</span>
                    </div>
                  </th>
                  <th className="px-2 first:pl-5 py-4">
                    <div className=" text-left flex items-center">
                      <span>P2 Vs P1</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {Data &&
                  Data.items &&
                  Data?.items.map((data, index) => {
                    return (
                      <Fragment key={index}>
                        <tr>
                          <td className="px-2 first:pl-5 py-3">
                            <div>{data?.storeName}</div>
                          </td>
                          <td className="px-2 first:pl-5 py-3">
                            <div>
                              {CurrencySymbolByCode.USD}
                              {data?.p1Sales.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-2 first:pl-5 py-3">
                            <div>
                              {CurrencySymbolByCode.USD}
                              {data?.p2Sales.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-2 first:pl-5 py-3">
                            <div>{`${data?.p2VsP1Sales.toFixed(2)}%`}</div>
                          </td>
                          <td className="px-2 first:pl-5 py-3">
                            <div>{data?.p1Orders}</div>
                          </td>
                          <td className="px-2 first:pl-5 py-3">
                            <div>{data?.p2Orders}</div>
                          </td>
                          <td className="px-2 first:pl-5 py-3">
                            <div>{`${data?.p2VsP1Orders.toFixed(2)}%`}</div>
                          </td>
                        </tr>
                      </Fragment>
                    );
                  })}
              </tbody>
            </table>
          </div>
          {Data?.totalCount === 0 && (
            <p className="flex justify-center items-center p-5 rounded-t border-b sticky top-0 left-0 text-red-600 bg-white">
              No data found as of now.
            </p>
          )}
          {/* <div className="col-span-full m-5 pt-5 sticky bottom-0 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              {paginationData?.totalCount > 0 && (
                <Pagination
                  totalCount={paginationData?.totalCount}
                  pageSize={paginationData?.pageSize}
                  totalPages={paginationData?.totalPages}
                  pageIndex={paginationData?.pageIndex}
                  setTablePageSize={(value) =>
                    setPaginationDataFunc("pageSize", value)
                  }
                  hasPreviousPage={paginationData?.hasPreviousPage}
                  hasNextPage={paginationData?.hasNextPage}
                  hasPageSize={true}
                  fetchData={getComparativeSalesByTimePeriod}
                />
              )}
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default ComparativeSalesByTimePeriod;

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
  p1StartDate,
  p1EndDate,
  p2StartDate,
  p2EndDate,
  p1onStartDateChangeHandler,
  p1onEndDateChangeHandler,
  p2onStartDateChangeHandler,
  p2onEndDateChangeHandler,
  p1ToDatePicker,
  p2ToDatePicker,
  onClick,
}) => {
  return (
    <>
      <div className="inline-flex flex-wrap justify-between items-center gap-2">
        <div>Period 1 : </div>
        <CustomDatePicker
          onChangeHandler={p1onStartDateChangeHandler}
          defaultDate={p1StartDate}
          maxDate={p1EndDate}
        />
        <div className="mx-2">to</div>
        <CustomDatePicker
          onChangeHandler={p1onEndDateChangeHandler}
          defaultDate={p1EndDate}
          minDate={p1StartDate}
          refDatePicker={p1ToDatePicker}
        />
      </div>
      <div className="inline-flex flex-wrap justify-between items-center gap-2">
        <div>Period 2 : </div>
        <CustomDatePicker
          onChangeHandler={p2onStartDateChangeHandler}
          defaultDate={p2StartDate}
          maxDate={p2EndDate}
        />
        <div className="mx-2">to</div>
        <CustomDatePicker
          onChangeHandler={p2onEndDateChangeHandler}
          defaultDate={p2EndDate}
          minDate={p2StartDate}
          refDatePicker={p2ToDatePicker}
        />
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
      </div>
    </>
  );
};
