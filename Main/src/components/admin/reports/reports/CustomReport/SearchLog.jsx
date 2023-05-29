import React, {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useCallback,
} from "react";
import Select from "components/common/formComponent/Select";
import DropdownService from "services/common/dropdown/DropdownService";
import DatePicker from "react-datepicker";
import { subDays } from "date-fns";
import { NavLink } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

const SearchLog = () => {
  const toDatePicker = useRef();
  const [storeData, setStoreData] = useState([]);
  const [startDate, setstartDate] = useState(new Date());
  const [endDate, setendDate] = useState(new Date());
  const [store, setStore] = useState({
    label: "",
    value: "",
  });

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

  return (
    <>
      <title>Search Log</title>
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
              Search Log
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a className="text-indigo-500">Export</a>
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
              defaultValue={store?.value}
              classNames={"w-[200px]"}
              options={storeData}
              isMulti={false}
            />
          </div>
        </div>
        <div className="bg-white shadow-xxl rounded-md mb-8">
          <div className="p-6 flex items-center justify-end">
            <div className="inline-flex flex-wrap justify-between items-center">
              <CustomDatePicker
                onChangeHandler={onStartDateChangeHandler}
                defaultDate={startDate}
                maxDate={endDate}
              />
              <div className="mx-2">-</div>
              <CustomDatePicker
                onChangeHandler={onEndDateChangeHandler}
                defaultDate={endDate}
                minDate={startDate}
                refDatePicker={toDatePicker}
              />
              <div className="inline-flex flex-wrap justify-between items-center">
                <div className="ml-2">
                  <a className="btn px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white">
                    Search
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="overflow-x-auto max-h-screen border-t border-neutral-200 p-6">
            Coming soon
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchLog;
