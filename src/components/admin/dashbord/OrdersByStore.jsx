import React, { useState, useEffect, useCallback, useMemo } from "react";
import ReactTable from "components/common/table/ReactTableServerSide";
import DropdownService from "services/common/dropdown/DropdownService";
import Select from "components/common/formComponent/Select";
import { paginationDetails } from "global/Enum";
import OrderService from "services/admin/order/OrderService";
import { DateTimeFormat } from "services/common/helper/Helper";
import { NavLink } from "react-router-dom";

const OrdersByStore = ({ hidden, setHidden }) => {
  // const [hidden, setHidden] = useState(false);
  const [Data, setData] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const [paginationData, setPaginationData] = useState({
    ...paginationDetails,
  });
  const [filteringOptions, setColumnFilteringOptions] = useState([]);
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
  const getOrdersByStore = useCallback(
    (pageIndex) => {
      if (store?.value) {
        OrderService.getOrdersByStoreData({
          args: {
            pagingStrategy: 0,
            sortingOptions,
            filteringOptions,
          },
          storeId: store?.value,
        }).then((response) => {
          setData(response.data.data.items);
          setPaginationData((prevState) => ({
            ...prevState,
            pageIndex: response.data.data.pageIndex,
            pageSize: response.data.data.pageSize,
          }));
        });
      }
    },
    [filteringOptions, sortingOptions, store]
  );

  useEffect(() => {
    if (store && store?.value) {
      getOrdersByStore();
    }
  }, [store]);

  const getStoreDropdownData = useCallback(() => {
    DropdownService.getDropdownValues("store").then((res) => {
      if (res.data.success) {
        setStoreData(() => {
          return res?.data?.data;
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

  const COLUMNS = [
    {
      id: "orderNo",
      Header: "ORDER NO.",
      accessor: "id",
      column_name: "orderNo",
      disableSortBy: true,
      Cell: ({ value, row }) => {
        return value ? (
          <>
            <div>
              <NavLink to={"/admin/Order/Orders/edit/" + row.original.id}>
                <div className="font-medium text-indigo-500">#{value}</div>
              </NavLink>
            </div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "items",
      Header: "ITEMS",
      accessor: "totalItems",
      column_name: "items",
      disableSortBy: true,
      Cell: ({ value }) => {
        return value || value === 0 ? (
          <>
            <div className="font-semibold text-left">{value} Items</div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "total",
      Header: "TOTAL",
      accessor: "orderTotal",
      column_name: "total",
      disableSortBy: true,
      Cell: ({ value }) => {
        return value ? (
          <>
            <div className="font-semibold text-left">${value}</div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "date",
      Header: "DATE",
      accessor: "orderDate",
      column_name: "date",
      disableSortBy: true,
      Cell: ({ value }) => {
        return value ? (
          <>
            <div className="font-semibold text-left">
              {DateTimeFormat(value).date}
            </div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "printLabel",
      Header: "PRINT LABEL",
      accessor: "printLabel",
      column_name: "printLabel",
      disableSortBy: true,
      Cell: ({ value, row }) => {
        return value ? (
          <>
            <div className="text-xs inline-flex font-medium border border-green-300 bg-green-100 text-green-600 rounded-md text-center px-2.5 py-1">
              {value}
            </div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "captureOrder",
      Header: "CAPTURE ORDER",
      accessor: "captureOrder",
      column_name: "captureOrder",
      disableSortBy: true,
      Cell: ({ value }) => {
        return value ? (
          <>
            <div className="text-xs inline-flex font-medium border border-blue-300 bg-indigo-100 text-blue-600 rounded-md text-center px-2.5 py-1 ">
              {value}
            </div>
          </>
        ) : (
          "-"
        );
      },
    },
  ];

  return (
    <>
      <title>OrdersByStore</title>
      {/* <!-- OrdersByStore --> */}
      <div className="col-span-full xl:col-span-6 bg-white shadow-lg rounded-md">
        <div className="flex px-5 py-4 border-b-2 border-neutral-200 justify-between items-center">
          <div className="font-semibold text-base lg:text-xl text-gray-700 inline-block">
            Orders By Store : <span>{store?.label}</span>
          </div>
          <div className=" inline-flex CurrentItem">
            <div className="relative inline-flex w-full">
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
        </div>
        <div>
          <div className="overflow-x-auto">
            <ReactTable
              COLUMNS={COLUMNS}
              DATA={Data}
              {...paginationData}
              setTablePageSize={(value) =>
                setPaginationDataFunc("pageSize", value)
              }
              fetchData={getOrdersByStore}
              sortingOptions={sortingOptions}
              setSortingOptions={setSortingOptionHandler}
              hiddenColumns={useMemo(() => ['rowSelection'], [])}
              displaySearch={false}
              filters={false}
              tablePadding={"0"}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default OrdersByStore;
