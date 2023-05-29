import React, { useState, useEffect, useCallback, useMemo } from "react";
import ReactTable from "components/common/table/ReactTableServerSide";
import { useDispatch } from "react-redux";
import { paginationDetails } from "global/Enum";
import StoreService from "services/admin/store/StoreService";
import { defaultImage } from "global/Enum";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import Image from "components/common/formComponent/Image";

const TopStore = () => {
  const [Data, setData] = useState([]);
  const dispatch = useDispatch();
  const [paginationData, setPaginationData] = useState({
    ...paginationDetails,
  });
  const [filteringOptions, setColumnFilteringOptions] = useState([]);
  const [sortingOptions, setSortingOptions] = useState([
    {
      field: "name",
      direction: 0,
      priority: 0,
    },
  ]);

  const setSortingOptionHandler = (column, direction) => {
    setSortingOptions([
      {
        field: column,
        direction: direction,
        priority: 0,
      },
    ]);
  };

  const getTopStoreData = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true));
      StoreService.getTopStoreData({
        args: {
          pagingStrategy: 0,
          sortingOptions,
          filteringOptions,
        },
      }).then((response) => {
        setData(response.data.data.items);
        setPaginationData((prevState) => ({
          ...prevState,
          pageIndex: response.data.data.pageIndex,
          pageSize: response.data.data.pageSize,
        }));
        dispatch(setAddLoading(false));
      });
    },
    [filteringOptions, sortingOptions]
  );

  const COLUMNS = [
    {
      id: "",
      Header: "",
      accessor: "storeLogoUrl",
      column_name: "storeLogoUrl",
      disableSortBy: true,
      Cell: ({ value }) => {
        return value && value.length > 0 ? (
          <div className="flex justify-center">
            <div className="h-16 w-16 flex items-center justify-center overflow-hidden  box-content border bg-white">
              <Image
                src={value}
                containerheight={""}
                className="max-h-full"
              />
            </div>
          </div>
        ) : (
          <div className="flex -space-x-9 items-center">
            <img
              src={defaultImage}
              className="w-14 h-14  inline-flex text-center items-center justify-center"
            />
          </div>
        );
      },
    },
    {
      id: "source",
      Header: "SOURCE",
      accessor: "storeName",
      column_name: "storeName",
      disableSortBy: "true",
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
      id: "customerTotal",
      Header: "VISITORS",
      accessor: "customerTotal",
      column_name: "customerTotal",
      Cell: ({ value }) => {
        return value || value == 0 ? (
          <>
            <div className="font-semibold text-left">{value}K</div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "revenues",
      Header: "REVENUES",
      accessor: "revenues",
      column_name: "revenues",
      Cell: ({ value }) => {
        return value || value == 0 ? (
          <>
            <div className="text-green-500">${value}</div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "sales",
      Header: "SALES",
      accessor: "sales",
      column_name: "sales",
      Cell: ({ value }) => {
        return value || value == 0 ? (
          <>
            <div className="font-semibold text-left">{value}</div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "conversion",
      Header: "CONVERSION",
      accessor: "conversion",
      column_name: "conversion",
      Cell: ({ value }) => {
        return value || value == 0 ? (
          <>
            <div className="font-semibold text-left">{value}%</div>
          </>
        ) : (
          "-"
        );
      },
    },
  ];
  return (
    <>
      <title>TopStore</title>
      {/* <!-- topstore --> */}
      <div className="col-span-full xl:col-span-6 bg-white shadow-lg rounded-md">
        <div className="flex px-5 py-4 border-b-2 border-neutral-200 justify-between items-center">
          <div className="font-semibold text-base lg:text-xl text-gray-700 inline-block">
            Top 5 Store
          </div>
        </div>
        <div>
          <div className="">
            <ReactTable
              COLUMNS={COLUMNS}
              DATA={Data}
              fetchData={getTopStoreData}
              sortingOptions={sortingOptions}
              setSortingOptions={setSortingOptionHandler}
              setColumnFilteringOptions={setColumnFilteringOptions}
              hiddenColumns={useMemo(() => ["rowSelection"], [])}
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
export default TopStore;
