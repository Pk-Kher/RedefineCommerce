import React, {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useCallback,
} from "react";
import { useDispatch } from "react-redux";
import ReactTable from "components/common/table/ReactTableServerSide";
import { paginationDetails } from "global/Enum";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import Select from "components/common/formComponent/Select";
import DropdownService from "services/common/dropdown/DropdownService";
import DatePicker from "react-datepicker";
import { subDays } from "date-fns";
import { serverError } from "services/common/helper/Helper";
import "react-datepicker/dist/react-datepicker.css";
import ProductService from "services/admin/reports/product/productServices";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { ValidationMsgs } from "global/ValidationMessages";
import Messages from "components/common/alerts/messages/Index";
import { NavLink } from "react-router-dom";

const Top100SellingProducts = () => {
  const dispatch = useDispatch();
  const toDatePicker = useRef();
  const [Data, setData] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const [startDate, setstartDate] = useState(new Date());
  const [endDate, setendDate] = useState(new Date());
  const [store, setStore] = useState({
    label: "",
    value: "",
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
  const handleSort = (sortValue) => { };

  const getTop100SellingProducts = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true));
      ProductService.getTop100SellingProducts({
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
        dispatch(setAddLoading(false));
      });
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
    ProductService.exportTop100SellingProducts({
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
    getTop100SellingProducts();
  }, [store?.value]);

  const getStoreDropdownData = useCallback(() => {
    DropdownService.getDropdownValues("store").then((res) => {
      if (res?.data?.success && res?.data?.data) {
        setStoreData(() => {
          return res.data.data;
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
    getTop100SellingProducts();
  };

  const COLUMNS = [
    {
      id: "srno",
      Header: "SR NO.",
      accessor: "srno",
      column_name: "srno",
      Cell: ({ value, row }) => {
        return value ? (
          <>
            {/* <div className="font-semibold text-left">{row.index + 1}.</div> */}
            <div className="font-semibold text-left">{value}.</div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "productName",
      Header: "PRODUCT NAME",
      accessor: "productName",
      column_name: "productName",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div className="font-semibold text-left">{value}</div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "sku",
      Header: "SKU",
      accessor: "sku",
      column_name: "sku",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div className="font-semibold text-left">{value}</div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "totalQuantity",
      Header: "TOTAL QUANTITY",
      accessor: "totalQuentity",
      column_name: "totalQuantity",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div className="font-semibold text-left">{value}</div>
          </>
        ) : (
          "0"
        );
      },
    },
    {
      id: "totalOrder",
      Header: "TOTAL ORDER",
      accessor: "totalOrder",
      column_name: "totalOrder",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div className="font-semibold text-left">{value}</div>
          </>
        ) : (
          "-"
        );
      },
    },
  ];
  return (
    <>
      <title>Top 100 selling products</title>
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
              Top 100 selling products
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
          <div className="overflow-visible max-h-screen">
            <ReactTable
              COLUMNS={COLUMNS}
              DATA={Data}
              {...paginationData}
              setTablePageSize={(value) =>
                setPaginationDataFunc("pageSize", value)
              }
              fetchData={getTop100SellingProducts}
              sortingOptions={sortingOptions}
              setSortingOptions={setSortingOptionHandler}
              handleSort={handleSort}
              setColumnFilteringOptions={setColumnFilteringOptions}
              filteringOptions={filteringOptions}
              hiddenColumns={["rowSelection"]}
              extraFilter={[
                {
                  Component: ExtraComponent,
                  startDate,
                  endDate,
                  onStartDateChangeHandler,
                  onEndDateChangeHandler,
                  toDatePicker,
                  onClick,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Top100SellingProducts;

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
