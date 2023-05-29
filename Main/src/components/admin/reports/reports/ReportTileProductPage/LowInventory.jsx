import React, { useState, useEffect, useCallback, useMemo } from "react";
import ReactTable from "components/common/table/ReactTableServerSide";
import { useDispatch, useSelector } from "react-redux";
import { paginationDetails } from "global/Enum";
import Select from "components/common/formComponent/Select";
import DropdownService from "services/common/dropdown/DropdownService";
import ProductService from "services/admin/reports/product/productServices";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { ValidationMsgs } from "global/ValidationMessages";
import { serverError } from "services/common/helper/Helper";
import Messages from "components/common/alerts/messages/Index";
import { NavLink } from "react-router-dom";

const LowInventory = () => {
  const dispatch = useDispatch();
  const [Data, setData] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const [store, setStore] = useState(0);

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

  const getLowInventory = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true));
      ProductService.lowInventory({
        args: {
          pageSize: paginationData.pageSize,
          pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
          sortingOptions,
          filteringOptions,
        },
        storeID: store === "none" ? 0 : store,
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
      paginationData.pageIndex,
      store,
    ]
  );

  const Export = (pageIndex) => {
    dispatch(setAddLoading(true));
    ProductService.exportLowInventory({
      args: {
        pageIndex: 0,
        pageSize: paginationData.pageSize,
        pagingStrategy: 0,
        sortingOptions,
        filteringOptions,
      },
      storeID: store === "none" ? 0 : store,
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
          setStore(res?.data?.data[0]?.value);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (store) {
      getLowInventory();
    }
  }, [store]);

  useEffect(() => {
    getStoreDropdownData();
  }, [getStoreDropdownData]);

  const COLUMNS = [
    {
      id: "srno",
      Header: "SR NO.",
      accessor: "srno",
      column_name: "srno",
      Cell: ({ value, row }) => {
        return value ? (
          <>
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
      id: "storeName",
      Header: "STORE NAME",
      accessor: "storeName",
      column_name: "storeName",
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
      id: "quantity",
      Header: "QUANTITY",
      accessor: "quantity",
      column_name: "quantity",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div className="font-semibold text-left">{value}</div>
          </>
        ) : (
          0
        );
      },
    },
  ];
  return (
    <>
      <title> Low inventory</title>
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
              Low inventory
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="text-indigo-500" onClick={Export}>
              Export
            </button>
            <Select
              onChange={(e) => {
                if (e) {
                  setStore(e.value);
                } else {
                  setStore("none");
                }
              }}
              isClearable={false}
              defaultValue={store}
              classNames={"w-[200px]"}
              options={storeData}
              isMulti={false}
            />
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
            fetchData={getLowInventory}
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
    </>
  );
};

export default LowInventory;
