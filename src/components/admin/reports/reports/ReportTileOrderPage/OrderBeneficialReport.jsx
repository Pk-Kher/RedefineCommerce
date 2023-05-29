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
import OrderService from "services/admin/reports/order/orderServices";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { ValidationMsgs } from "global/ValidationMessages";
import Messages from "components/common/alerts/messages/Index";
import { NavLink } from "react-router-dom";
import Pagination from "components/common/table/Pagination";
import { Fragment } from "react";

const OrderBeneficialReport = () => {
  const dispatch = useDispatch();
  const toDatePicker = useRef(null);
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

  const getOrderBeneficialReport = useCallback(
    (pageIndex) => {
      if (store?.value) {
        dispatch(setAddLoading(true));
        OrderService.getOrderBeneficialReport({
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
          setData(response?.data?.data);
          setPaginationData((prevState) => ({
            ...prevState,
            pageIndex: response?.data?.data?.details?.pageIndex,
            pageSize: response?.data?.data?.details?.pageSize,
            totalCount: response?.data?.data?.details?.totalCount,
            totalPages: response?.data?.data?.details?.totalPages,
            hasPreviousPage: response?.data?.data?.details?.hasPreviousPage,
            hasNextPage: response?.data?.data?.details?.hasNextPage,
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
    OrderService.ExportOrderBenificialReport({
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
    getOrderBeneficialReport();
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

  const onStartDateChangeHandler = (date) => {
    setstartDate(date);
    toDatePicker.current.input.click();
  };

  const onEndDateChangeHandler = (date) => {
    setendDate(date);
  };

  const onClick = () => {
    getOrderBeneficialReport();
  };

  return (
    <>
      <title> Order beneficial report</title>
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
              Order beneficial report
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
          <div className="overflow-x-auto  border-t border-neutral-200">
            <table className="table-auto w-full text-sm text-[#191919] font-semibold">
              <thead className="text-sm font-bold uppercase text-[#b3b3b3] border-b border-neutral-200">
                <tr>
                  <th className="px-2 first:pl-5 py-4">
                    <div className="font-semibold text-left flex items-center">
                      <span>Product Name</span>
                    </div>
                  </th>
                  <th className="px-2 first:pl-5 py-4">
                    <div className="font-semibold text-left flex items-center justify-center">
                      <span>Quantity</span>
                    </div>
                  </th>
                  <th className="px-2 first:pl-5 py-4">
                    <div className="font-semibold text-left flex items-center justify-end">
                      <span>{`Unit Cost (${CurrencySymbolByCode.USD})`}</span>
                    </div>
                  </th>
                  <th className="px-2 first:pl-5 py-4">
                    <div className="font-semibold text-left flex items-center justify-end">
                      <span>{`Total (${CurrencySymbolByCode.USD})`}</span>
                    </div>
                  </th>
                  <th className="px-2 first:pl-5 py-4">
                    <div className="font-semibold text-left flex items-center justify-end">
                      <span>{`Our Cost (${CurrencySymbolByCode.USD})`}</span>
                    </div>
                  </th>
                  <th className="px-2 first:pl-5 py-4">
                    <div className="font-semibold text-left flex items-center justify-end">
                      <span>{`Profit (${CurrencySymbolByCode.USD})`}</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {Data?.details?.items.map((data, index) => {
                  let totalQuantity = 0;
                  let totalUnitCost = 0;
                  let total = 0;
                  let totalOurCost = 0;
                  let totalProfit = 0;
                  return (
                    <Fragment key={index}>
                      <tr className="bg-slate-100">
                        <td className="px-2 first:pl-5 py-3 group" colSpan="6">
                          <div>
                            (Order # : {data?.order} | Order Total:
                            {CurrencySymbolByCode.USD}
                            {data?.orderTotal} | Order Cost:
                            {CurrencySymbolByCode.USD}
                            {data?.orderCost} | Shipping Cost:
                            {CurrencySymbolByCode.USD}
                            {data?.shippingCost} | Shipping:
                            {CurrencySymbolByCode.USD}
                            {data?.shipping}| Profit:{CurrencySymbolByCode.USD}
                            {data?.profit})
                          </div>
                        </td>
                      </tr>
                      {data?.orderbeneficialchildviewmodel?.map((subRow) => {
                        totalQuantity += subRow?.quantity;
                        totalUnitCost += subRow?.unitCost;
                        total += subRow?.total;
                        totalOurCost += subRow?.ourCost;
                        totalProfit += subRow?.profit;
                        return (
                          <>
                            <tr>
                              <td className="px-2 first:pl-5 py-3 group">
                                <div>{subRow?.productName}</div>
                              </td>
                              <td className="px-2 first:pl-5 py-3">
                                <div className="text-center">
                                  {subRow?.quantity}
                                </div>
                              </td>
                              <td className="px-2 first:pl-5 py-3">
                                <div className="text-right">
                                  {subRow?.unitCost.toFixed(2)}
                                </div>
                              </td>
                              <td className="px-2 first:pl-5 py-3">
                                <div className="text-right">
                                  {subRow?.total.toFixed(2)}
                                </div>
                              </td>
                              <td className="px-2 first:pl-5 py-3">
                                <div className="text-right">
                                  {subRow?.ourCost.toFixed(2)}
                                </div>
                              </td>
                              <td className="px-2 first:pl-5 py-3">
                                <div className="text-right">
                                  {subRow?.profit.toFixed(2)}
                                </div>
                              </td>
                            </tr>
                          </>
                        );
                      })}
                      <tr>
                        <td className="px-2 first:pl-5 py-3 group">
                          <div className="text-right">Total</div>
                        </td>
                        <td className="px-2 first:pl-5 py-3">
                          <div className="text-center">{totalQuantity}</div>
                        </td>
                        <td className="px-2 first:pl-5 py-3">
                          <div className="text-right">
                            {CurrencySymbolByCode.USD}
                            {totalUnitCost.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-2 first:pl-5 py-3">
                          <div className="text-right">
                            {CurrencySymbolByCode.USD}
                            {total.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-2 first:pl-5 py-3">
                          <div className="text-right">
                            {CurrencySymbolByCode.USD}
                            {totalOurCost.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-2 first:pl-5 py-3">
                          <div className="text-right">
                            {CurrencySymbolByCode.USD}
                            {totalProfit.toFixed(2)}
                          </div>
                        </td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          {Data?.details?.totalCount === 0 && (
            <p className="flex justify-center items-center p-5 rounded-t border-b sticky top-0 left-0 text-red-600 bg-white">
              No data found as of now.
            </p>
          )}
          {/* <div className=""> */}
          {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between"> */}
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
              fetchData={getOrderBeneficialReport}
            />
          )}
          {/* </div> */}
          {/* </div> */}
        </div>
      </div>
    </>
  );
};

export default OrderBeneficialReport;

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
