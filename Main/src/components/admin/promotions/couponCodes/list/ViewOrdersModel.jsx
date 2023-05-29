/*Component Name: ViewOrdersModel
Component Functional Details: User can create or update List master details from here.
Created By: Shrey Patel
Created Date: 07/14/22
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useState } from "react";
import { ViewOrdersData } from "dummy/Dummy";
import ReactTable from "components/common/table/ReactTableServerSide";
import { useMemo } from "react";
// import { paginationDetails } from "global/Enum";

const ViewOrdersModel = ({ handleLogoLocationModel }) => {

  const [Data, setData] = useState(ViewOrdersData);
  // const [filteringOptions, setColumnFilteringOptions] = useState([]);
  // const [selectedRows, setSelectedRows] = useState([]);
  // const [paginationData, setPaginationData] = useState({
  //   paginationDetails,
  // });
  const [sortingOptions, setSortingOptions] = useState([
    {
      field: "name",
      direction: 0,
      priority: 0,
    },
  ]);

  // pageSize: paginationData.pageSize,
  //       pageIndex: pageIndex,
  //       sortingOptions,
  //     filteringOptions,

  const handleSort = (sortValue) => { };

  const COLUMNS = [
    {
      id: "orders",
      Header: "Orders",
      accessor: "orders",
      column_name: "orders",
      Cell: ({ value, row }) => {
        if (!value) {
          return "-";
        } else {
          return (
            <>
              <div className="text-indigo-600 font-semibold text-left w-24 items-center">
                #{value}
              </div>
              <div className="text-[#707070] text-xs font-normal w-44">
                {value}
              </div>
            </>
          );
        }
      },
    },
    {
      id: "orddate",
      Header: "Order Date",
      accessor: "orddate",
      column_name: "orddate",
      Cell: ({ value }) => {
        if (!value) {
          return "-";
        } else {
          return (
            <div className="font-semibold text-left w-20 flex">{value}</div>
          );
        }
      },
    },
    {
      id: "amount",
      Header: "Amount",
      accessor: "amount",
      column_name: "amount",
      Cell: ({ value }) => {
        if (!value) {
          return "-";
        } else {
          return (
            <div className="font-semibold text-left w-20 flex">{value}</div>
          );
        }
      },
    },
    {
      id: "customerName",
      Header: "Customer Name",
      accessor: "customerName",
      column_name: "customerName",
      Cell: ({ value }) => {
        if (!value) {
          return "-";
        } else {
          return (
            <div className="font-semibold text-left w-20 flex">{value}</div>
          );
        }
      },
    },
  ];

  // const getVendorData = useCallback((pageIndex = 1) => {
  //   dispatch(setAddLoading(true))

  //   VendorService.getVendors({
  //     args: {
  //       pageSize: paginationData.pageSize,
  //       pageIndex: pageIndex,
  //       sortingOptions,
  //       filteringOptions,
  //     },
  //   }).then((response) => {
  //     setData(response.data.data.items);

  //     setPaginationData((prevState) => ({
  //       ...prevState,
  //       pageIndex: response.data.data.pageIndex,
  //       pageSize: response.data.data.pageSize,
  //       totalCount: response.data.data.totalCount,
  //       totalPages: response.data.data.totalPages,
  //       hasPreviousPage: response.data.data.hasPreviousPage,
  //       hasNextPage: response.data.data.hasNextPage,
  //     }));
  //     dispatch(setAddLoading(false))

  //   }).catch(() => {
  //     dispatch(setAddLoading(false))
  //   })
  // })

  return (
    <div
      id="ManageLocationModal"
      className=" overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center h-modal max-h-screen"
    >
      <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
        <div className="relative w-full max-w-2xl">
          <div className="relative bg-white rounded-lg shadow ">
            <div className="flex justify-between items-start p-5 rounded-t ">
              <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl ">
                View Orders
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                data-modal-toggle="managestoreModal"
                onClick={handleLogoLocationModel}
              >
                <svg
                  className="w-5 h-5 z-[1]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* <div className="items-center justify-end rounded-b border-t border-gray-200 "> */}
            {/* <div className="bg-white" x-data="{ open: false }"> */}
            {/* <div className="overflow-auto"> */}
            <ReactTable
              COLUMNS={COLUMNS}
              DATA={Data}
              hasNextPage={false}
              hasPreviousPage={false}
              pageIndex={0}
              setPageIndex={(value) => value}
              pageSize={Data.length}
              setTablePageSize={(value) => value}
              handleSort={handleSort}
              sortingOptions={sortingOptions}
              footer={true}
              fetchData={() => { }}
              hiddenColumns={["rowSelection"]}
              pageName={`VendorLink`}
              displaySearch={false}
              tablePadding={`-mt-12`}

            />
            {/* </div> */}
            {/* </div> */}

            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrdersModel;
