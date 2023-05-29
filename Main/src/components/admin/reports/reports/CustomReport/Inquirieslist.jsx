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
import Status from "../../../../common/displayStatus/Status";
import { subDays } from "date-fns";
import { NavLink } from "react-router-dom";
import { serverError, DateTimeFormat } from "services/common/helper/Helper";
import "react-datepicker/dist/react-datepicker.css";
import CustomreportServices from "services/admin/reports/customReports/CustomReports";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { ValidationMsgs } from "global/ValidationMessages";
import Messages from "components/common/alerts/messages/Index";
import VarientProductModal from "components/admin/masterCatalog/common/product/create/forms/VarientProductModal";
import InquiriesListReplyEmailModal from "components/admin/reports/reports/CustomReport/InquiriesListReplyEmailModal";


const Inquirieslist = () => {
  const dispatch = useDispatch();
  const toDatePicker = useRef();
  const [Data, setData] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const [startDate, setstartDate] = useState(new Date());
  const [endDate, setendDate] = useState(new Date());
  const [store, setStore] = useState({});
  const [dataForVarientProducts, setdataForVarientProducts] = useState([]);
  const [EmailDataId, setEmailDataId] = useState("");
  const [EmailAPI, setEmailAPI] = useState();
  const [ShowReplyEmailModel, SetShowReplyEmailModel] = useState(false);
  const [openVarientModal, setOpenVarientModal] = useState({
    name: "",
    data: [{}],
    toShow: false,
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
  const getInquiriesList = useCallback(
    (pageIndex) => {
      if (store?.value) {
        dispatch(setAddLoading(true));
        CustomreportServices.getInquiriesList({
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
    CustomreportServices.exportInquiriesList({
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
    getInquiriesList();
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
    getInquiriesList();
  };

  const getVarientDataFunc = (currentRowData, pageIndex) => {
    setOpenVarientModal(() => ({
      data: [currentRowData],
      toShow: true,
    }));
  };

  const COLUMNS = [
    {
      id: "name",
      Header: "Name",
      accessor: "name",
      column_name: "name",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div className="text-left">{value}</div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "email",
      Header: "Email",
      accessor: "email",
      column_name: "email",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div className="text-left">{value}</div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "subject",
      Header: "Subject",
      accessor: "subject",
      column_name: "subject",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div className="text-left">{value}</div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "createdDate",
      Header: "Date",
      accessor: "createdDate",
      column_name: "createdDate",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div>{DateTimeFormat(value).date} </div>
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
      id: "view",
      Header: "View",
      accessor: "view",
      column_name: "view",
      Cell: ({ value, row }) => {
        return (
          <>
            <a className="text-indigo-500">
              <span
                className="material-icons-outlined cursor-pointer"
                onClick={() => {
                  getVarientDataFunc(row?.original);
                }}
              >
                visibility
              </span>
            </a>
          </>
        );
      },
    },
    {
      id: "reply",
      Header: "Reply",
      accessor: "reply",
      column_name: "reply",
      Cell: ({ row, value }) => {
        return (
          <>
            <a className="text-indigo-500 cursor-pointer">
              <span
                className="material-icons-outlined"
                onClick={() => {
                  SetShowReplyEmailModel(true);
                  setEmailDataId(row?.original);
                }}
              >
                send
              </span>
            </a>
          </>
        );
      },
    },
  ];

  const viewColumn = [
    {
      id: "name",
      Header: "Name",
      accessor: "name",
      column_name: "name",
      disableSortBy: true,
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
      id: "email",
      Header: "Email",
      accessor: "email",
      column_name: "email",
      disableSortBy: true,
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
      id: "subject",
      Header: "Subject",
      accessor: "subject",
      column_name: "subject",
      disableSortBy: true,
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
      id: "address",
      Header: "address",
      accessor: "address",
      column_name: "address",
      disableSortBy: true,
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
      id: "city",
      Header: "city",
      accessor: "city",
      column_name: "city",
      disableSortBy: true,
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
      id: "county",
      Header: "county",
      accessor: "county",
      column_name: "county",
      disableSortBy: true,
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
      id: "state",
      Header: "state",
      accessor: "state",
      column_name: "state",
      disableSortBy: true,
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
      id: "zipCode",
      Header: "zipCode",
      accessor: "zipCode",
      column_name: "zipCode",
      disableSortBy: true,
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
      id: "phone",
      Header: "phone",
      accessor: "phone",
      column_name: "phone",
      disableSortBy: true,
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
      id: "comment",
      Header: "comment",
      accessor: "comment",
      column_name: "comment",
      disableSortBy: true,
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
      id: "Created Date",
      Header: "Created Date",
      accessor: "createdDate",
      column_name: "createdDate",
      disableSortBy: true,
      Cell: ({ value }) => {
        return value ? (
          <>
            <div>{DateTimeFormat(value).date} </div>
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
      id: "created_by",
      Header: "Created By",
      accessor: "createdName",
      column_name: "createdName",
      disableSortBy: true,
    },
    {
      id: "Updated Date",
      Header: "Updated Date",
      accessor: "modifiedDate",
      column_name: "modifiedDate",
      disableSortBy: true,
      Cell: ({ value }) => {
        return value ? (
          <>
            <div>{DateTimeFormat(value).date} </div>
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
      id: "updated_by",
      Header: "Updated By",
      accessor: "modifiedName",
      column_name: "modifiedName",
      disableSortBy: true,
    },
    {
      id: "status",
      Header: "Status",
      accessor: "recStatus",
      column_name: "recStatus",
      disableSortBy: true,
      Cell: ({ value }) => {
        return <Status type={value} />;
      },
    },
  ];

  return (
    <>
      <title>Inquiries list</title>
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
              Inquiries list
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
          <div className="p-6 flex items-center justify-between">
            <div className="text-xl leading-snug text-gray-800 font-semibold">
              Summary for sales on :
              <span className="font-bold">{store.label}</span>
            </div>
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
              DATA={Data}
              {...paginationData}
              setTablePageSize={(value) =>
                setPaginationDataFunc("pageSize", value)
              }
              fetchData={getInquiriesList}
              sortingOptions={sortingOptions}
              setSortingOptions={setSortingOptionHandler}
              handleSort={handleSort}
              setColumnFilteringOptions={setColumnFilteringOptions}
              filteringOptions={filteringOptions}
              hiddenColumns={["rowSelection"]}
              displaySearch={false}
              filters={false}
            />
          </div>
        </div>
      </div>
      <VarientProductModal
        title={"View"}
        openModal={openVarientModal}
        setOpenModal={setOpenVarientModal}
        COLUMNS={viewColumn}
        DATA={openVarientModal.data}
        setdataForVarientProducts={setdataForVarientProducts}
      />
      <InquiriesListReplyEmailModal
        setEmailAPI={setEmailAPI}
        EmailDataId={EmailDataId}
        filteringOptions={filteringOptions}
        SetShowReplyEmailModel={SetShowReplyEmailModel}
        ShowReplyEmailModel={ShowReplyEmailModel}
        storeId={store?.value}
      />
    </>
  );
};

export default Inquirieslist;

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
