import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import ReactTable from "components/common/table/ReactTableServerSide";
import { DateTimeFormat, serverError } from "services/common/helper/Helper";
import { paginationDetails, RecStatusValuebyName } from "global/Enum";
import DropdownService from "services/common/dropdown/DropdownService";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { ValidationMsgs } from "global/ValidationMessages";
import Messages from "components/common/alerts/messages/Index";
import Actions from "./Action";
import Select from "components/common/formComponent/Select";
import BasicModal from "components/common/modals/Basic";
import NewsLetterServices from "services/admin/newsletter/NewsLetterServices";

const List = () => {
  const [Data, setData] = useState([]);
  const dispatch = useDispatch();
  const [userNameValues, setUserNameValues] = useState([]);
  const [openAddActionModal, setOpenAddActionModal] = useState(false);
  const [openBasicModal, setOpenBasicModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [shippingMethod, setShippingMethod] = useState(null);
  const [StoreList, setStoreList] = useState([]);
  const [StoreDefaultFilter, setStoreDefaultFilter] = useState(0);
  const [storeFilter, setStoreFilter] = useState(0);
  // const [editId, setEditId] = useState(null);
  const [ModalInfo, setModalInfo] = useState({});

  const handleShowModal = () => {
    setOpenAddActionModal((prev) => !prev);
  };
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

  const getStoreDropdownData = useCallback(() => {
    DropdownService.getDropdownValues("store").then((res) => {
      if (res.data.success) {
        setStoreList(() => {
          return res.data.data;
        });
        if (res.data.data.length > 0) {
          setStoreDefaultFilter(res.data.data[0].value);
        }
      }
    });
  }, []);

  useEffect(() => {
    getStoreDropdownData();
  }, [getStoreDropdownData]);

  const handleSort = (sortValue) => { };

  const getSubscribeMethod = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true));
      NewsLetterServices.getSubscribeList({
        args: {
          pageSize: paginationData.pageSize,
          pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
          sortingOptions,
          filteringOptions,
        },
        storeId: storeFilter == 0 ? StoreDefaultFilter : storeFilter,
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
      filteringOptions,
      paginationData.pageSize,
      sortingOptions,
      paginationData.pageIndex, storeFilter
    ]
  );

  const statusChangedHandler = (data) => {
    setOpenBasicModal(false);
    dispatch(setAddLoading(true))


    NewsLetterServices.updateStatus({
      id: data.changeStatus,
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.newsletter.unsubscribe,
            })
          );
          getSubscribeMethod()
          setOpenBasicModal(false);
          dispatch(setAddLoading(false))
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
            message: ValidationMsgs.newsletter.notunsubscribe,
          })
        );
        setOpenBasicModal(false);
        dispatch(setAddLoading(false))
      });
  };


  useEffect(() => {
    getSubscribeMethod()
  }, [storeFilter])

  const COLUMNS = [
    {
      id: "email",
      Header: "Email",
      accessor: "email",
      column_name: "email",
      disableShowHide: true,
      Cell: ({ value, row }) => {
        return row ? (
          <>
            <div>{value}</div>
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
      Cell: ({ value }) => {
        return value ? (
          <>
            <div
              className="w-full flex justify-start items-center group"
              style={{ width: "100px" }}
            >
              <div>{value}</div>
            </div>
          </>
        ) : (
          ""
        );
      },
    },
    {
      id: "createdDate",
      Header: "created Date",
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
      id: "createdName",
      Header: "Created By",
      accessor: "createdName",
      column_name: "createdName",
    },
    {
      id: "Updated Date",
      Header: "Updated Date",
      accessor: "modifiedDate",
      column_name: "modifiedDate",
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
      id: "Updated By",
      Header: "Updated By",
      accessor: "modifiedName",
      column_name: "modifiedName",
    },
    {
      id: "isSubscribe",
      Header: "Status",
      accessor: "isSubscribe",
      column_name: "isSubscribe",
      Cell: ({ value }) => {
        // return <Status type={value} />;
        return (<>{value == true ?
          <div className="text-xs inline-block font-medium border border-green-300 bg-green-100 text-green-600 rounded-md text-center px-2.5 py-1 w-28" >Subscribed</div>
          :
          <div className="text-xs inline-block font-medium border border-red-300 bg-red-100 text-red-600 rounded-md text-center px-2.5 py-1 w-28">Unsubscribed</div>
        }
        </>
        )
      },
    },
    {
      id: "action",
      Header: "",
      accessor: "id",
      column_name: "action",
      Cell: ({ value, row }) => {
        return (
          <>
            {row.original.isSubscribe == true ?
              <Actions
                handleShowModal={handleShowModal}
                id={value}
                row={row}
                setBasicModalInfo={setModalInfo}
                setOpenBasicModal={setOpenBasicModal}
                setOpenAddActionModal={setOpenAddActionModal}
                setShippingMethod={setShippingMethod}
              // setEditId={setEditId}
              />
              : ""
            }
          </>
        );
      },
      disableSortBy: true,
      disableShowHide: true,
    },
  ];

  return (
    <>
      <title>Newsletter</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="col-span-full w-full flex justify-between mb-8">
          <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
            Newsletter
          </h1>
          <Select
            options={StoreList}
            classNames="w-52 -top-1"
            placeholder="Select Store"
            name={'store'}
            defaultValue={storeFilter || StoreDefaultFilter}
            // onChange={(data) => {
            //   setStoreFilter(data ? data.value : "");
            // }}
            onChange={(e) => {
              if (e) {
                setStoreFilter(e.value);
              } else {
                setStoreFilter("none");
              }
            }}
          />
        </div>
        {!openAddActionModal && <Messages />}
        <div className="col-span-full w-full bg-white shadow-xxl rounded-md mb-8 relative">
          <ReactTable
            COLUMNS={COLUMNS}
            DATA={Data}
            {...paginationData}
            setTablePageSize={(value) =>
              setPaginationDataFunc("pageSize", value)
            }
            fetchData={getSubscribeMethod}
            sortingOptions={sortingOptions}
            setSortingOptions={setSortingOptionHandler}
            handleSort={handleSort}
            setColumnFilteringOptions={setColumnFilteringOptions}
            editColumnFilter={true}
            setSelectedRows={setSelectedRows}
            selectedRows={selectedRows}
            filteringOptions={filteringOptions}
            moreFilter={true}
            hiddenColumns={useMemo(() => ["rowSelection"], [])}
          />
          <BasicModal
            handleConfirmation={statusChangedHandler}
            openModal={openBasicModal}
            setOpenModal={setOpenBasicModal}
            {...ModalInfo}
          />
        </div>
      </div>
    </>
  );
};
export default List;
