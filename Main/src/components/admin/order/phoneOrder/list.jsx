import React, { useState, useCallback, useEffect } from "react";
import ReactTable from "components/common/table/ReactTableServerSide";
import { useDispatch, useSelector } from "react-redux";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import StoreService from "services/admin/store/StoreService";
import { defaultImage, paginationDetails } from "global/Enum";
import { Link } from "react-router-dom";
import Image from "components/common/formComponent/Image";
import CryptoJS from "crypto-js";

const List = () => {
  const dispatch = useDispatch();
  const [filteringOptions, setColumnFilteringOptions] = useState([]);
  const [Data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [encrptedData, setEncrptedData] = useState("");
  const [decrptedData, setDecrptedData] = useState("");

  const { id, firstname, email, lastname } = useSelector((store) => store?.user);

  const secretPass = "XkhZG4fW2t2W";
  const encryptData = () => {
    const data = CryptoJS.AES.encrypt(
      JSON.stringify({ id, firstname, email, lastname }),
      secretPass
    ).toString();
    setEncrptedData(data);
  };

  useEffect(() => {
    encryptData();
  }, []);

  const COLUMNS = [
    {
      id: "logoUrl",
      Header: "Image",
      accessor: "logoUrl",
      Footer: "Image",
      column_name: "logoUrl",
      disableSortBy: true,
      Cell: ({ value, row }) => {
        return value !== null && value !== "" && value !== undefined ? (
          <>
            <div className="flex items-center ">
              <Image
                className="w-20"
                containerheight={"h-20"}
                src={value}
                alt={row.name}
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center ">
              <Image
                className="w-20"
                containerheight={"h-20"}
                src={defaultImage}
              />
            </div>
          </>
        );
      },
    },
    {
      id: "store name",
      Header: "store NAME",
      accessor: "name",
      Footer: "NAME",
      column_name: "name",
      Cell: ({ value, row }) => {
        return row ? (
          <>
            <div
              className="w-full flex justify-start items-center group"
              style={{ width: "100px" }}
            >
              <div>{value}</div>
            </div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "storeType",
      Header: "store TYPE",
      accessor: "storeType",
      Footer: "NAME",
      column_name: "storeType",
      Cell: ({ value, row }) => {
        return value ? (
          <>
            <div
              className="w-full flex justify-start items-center group"
              style={{ width: "100px" }}
            >
              <div>{value.name}</div>
            </div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "Action",
      accessor: "url",
      Header: "Action",
      disableSortBy: true,
      Cell: ({ value, row }) => {
        return (
          <>
            <div
              className="w-full flex justify-start items-center group"
              style={{ width: "100px" }}
            >
              <div>
                <a
                  className="flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer"
                  href={`${value}?id=${encrptedData}`}
                  target="_blank"
                >
                  Log In
                </a>
              </div>
            </div>
          </>
        );
      },
    },
  ];

  const [paginationData, setPaginationData] = useState({
    ...paginationDetails,
  });
  const setPaginationDataFunc = (key, value) => {
    setPaginationData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };
  const [sortingOptions, setSortingOptions] = useState([
    {
      field: "firstname",
      direction: 0,
      priority: 0,
    },
  ]);
  const handleSort = (sortValue) => { };

  const setSortingOptionHandler = (column, direction) => {
    setSortingOptions([
      {
        field: column,
        direction: direction,
        priority: 0,
      },
    ]);
  };

  const getStoreData = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true));

      StoreService.getStores({
        args: {
          pageSize: paginationData.pageSize,
          pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
          sortingOptions,
          filteringOptions,
        },
      })
        .then((response) => {
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
        })
        .catch(() => {
          dispatch(setAddLoading(false));
        });
    },
    [
      filteringOptions,
      paginationData.pageSize,
      sortingOptions,
      paginationData.pageIndex,
    ]
  );
  return (
    <>
      <title>Phone Order</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
        <div className="col-span-full w-full flex justify-between mb-8">
          <div className="col-span-full w-full flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
              Draft / Phone Order
            </h1>
          </div>
        </div>
        <div className="col-span-full w-full bg-white shadow-xxl rounded-md mb-8 relative">
          <ReactTable
            COLUMNS={COLUMNS}
            DATA={Data}
            {...paginationData}
            setTablePageSize={(value) =>
              setPaginationDataFunc("pageSize", value)
            }
            fetchData={getStoreData}
            sortingOptions={sortingOptions}
            setSortingOptions={setSortingOptionHandler}
            handleSort={handleSort}
            // column filters
            editColumnFilter={false}
            filteringOptions={filteringOptions}
            setColumnFilteringOptions={setColumnFilteringOptions}
            setSelectedRows={setSelectedRows}
            selectedRows={selectedRows}
            hiddenColumns={["rowSelection"]}
          // saveFilter={{ show: true, tabName: 'All' }}

          />
        </div>
      </div>
    </>
  );
};
export default List;
