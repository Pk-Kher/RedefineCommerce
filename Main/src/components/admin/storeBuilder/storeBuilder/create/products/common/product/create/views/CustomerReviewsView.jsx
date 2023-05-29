/*Component Name: CustomerReviewsView.jsx
Component Functional Details: Basic Information tab field display
Created By: Vikas Patel
Created Date: 11-May-2022
Modified By: Shrey Patel
Modified Date: June/27/2022 */

import React, { useState, useCallback } from "react";
import ReactTable from "components/common/table/ReactTableServerSide";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import Messages from "components/common/alerts/messages/Index";
import { paginationDetails, RecStatusValuebyName } from "global/Enum";
import { DateTimeFormat, getClientInfo } from "services/common/helper/Helper";
import StarRating from "components/common/others/admin/Rating";
import Status from "components/common/displayStatus/Status";
import { useMemo } from "react";

const CustomerReviewsView = ({
  displayFieldElement,
  fetchFieldProperty,
  fields,
  values,
  requiredFields,
  tab,
  setActiveTab,
  index,
}) => {


  const [starsSelected, selectStar] = useState(0);

  const [CustomerReviewsId, setCustomerReviewsId] = useState(null);
  const [ModelInfo, setModalInfo] = useState({});
  const [openBasicModal, setOpenBasicModal] = useState(false);

  const dispatch = useDispatch();
  const COLUMNS = [
    {
      id: "customername",
      Header: "CUSTOMER NAME",
      accessor: "customername",
      Footer: "CUSTOMER NAME",
      column_name: "customername",
      Cell: () => {
        return values ? (
          <>
            <div className="">{values.customername} </div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "customeremail",
      Header: "CUSTOMER Email",
      accessor: "customeremail",
      Footer: "CUSTOMER Email",
      column_name: "customeremail",
      Cell: () => {
        return values ? (
          <>
            <div className="">{values.customeremail} </div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "comments",
      Header: "Comments",
      accessor: "comments",
      Footer: "Comments",
      column_name: "comments",
      Cell: ({ }) => {
        return values ? (
          <>
            <div className="">{values.comments}</div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "Rating",
      Header: "Rating",
      accessor: "rating",
      Footer: "Rating",
      column_name: "rating",
      Cell: ({ }) => {
        return (
          <div className="">
            <StarRating
              totalStars={5}
              starsSelected={starsSelected}
              selectStar={selectStar}
            />
          </div>
        );
      },
    },
    {
      id: "createdDate",
      Header: "CREATED Date",
      accessor: "createdDate",
      Footer: "CREATED",
      column_name: "createdDate",
      Cell: ({ }) => {
        return values ? (
          <>
            <div className="">{values.createdDate}</div>
            {/* <div className="">{DateTimeFormat(value).date} </div>
            <div className="text-[#707070] text-xs font-normal">
              {DateTimeFormat(value).time}
            </div> */}
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "recStatus",
      Header: "Status",
      accessor: "recStatus",
      Footer: "Status",
      column_name: "recStatus",
      Cell: ({ value }) => {
        if (value !== undefined) {
          return <Status type={value.recStatus} />;
        } else {
          return "-";
        }
      },
    },
  ]

  const [loading, setLoading] = useState(false);
  const [Data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({
    paginationDetails,
  });

  const [sortingOptions, setSortingOptions] = useState([
    {
      field: "firstname",
      direction: 0,
      priority: 0,
    },
  ]);

  const [selectedRows, setSelectedRows] = useState([]);
  const [filteringOptions, setColumnFilteringOptions] = useState([]);

  // Need to change the Service as per the Page API
  const getCustomerReviewssData = useCallback(
    (pageIndex = 1) => {
      //   setLoading(true);
      //   CustomerReviewssService.getAttributes({
      //     args: {
      //       pageSize: paginationData.pageSize,
      //       pageIndex: paginationData.pageIndex,
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
      //     setLoading(false);
      //   });
    },
    [filteringOptions, paginationData.pageSize, sortingOptions]
  );
  const setSortingOptionHandler = (column, direction) => {
    setSortingOptions([
      {
        field: column,
        direction: direction,
        priority: 0,
      },
    ]);
  };

  const setPaginationDataFunc = (key, value) => {
    setPaginationData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleSort = (sortValue) => { };

  return (
    <>
      <div className="px-6 py-12 border-b-4 border-neutral-200 last:border-b-0">
        <div className="flex items-center justify-between">
          <div
            className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2"
          >
            {tab.label}
          </div>
          <div className="">
            <span
              className="text-indigo-500 cursor-pointer"
              onClick={() => {
                setActiveTab(index);
              }}
            >
              Edit
            </span>
          </div>
        </div>

        <div className=" w-full ">
          <div className="overflow-x-auto max-h-screen border-neutral-200">
            <ReactTable
              COLUMNS={COLUMNS}
              DATA={Data}
              hasNextPage={paginationData.hasNextPage}
              hasPreviousPage={paginationData.hasPreviousPage}
              pageIndex={paginationData.pageIndex}
              setPageIndex={(value) =>
                setPaginationDataFunc("pageIndex", value)
              }
              pageSize={paginationData.paginationDetails.pageSize}
              setTablePageSize={(value) =>
                setPaginationDataFunc("pageSize", value)
              }
              totalCount={paginationData.totalCount}
              fetchData={getCustomerReviewssData}
              sortingOptions={sortingOptions}
              setSortingOptions={setSortingOptionHandler}
              hiddenColumns={["rowSelection"]}
              loading={loading}
              handleSort={handleSort}
              filteringOptions={filteringOptions}
              setColumnFilteringOptions={setColumnFilteringOptions}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              displaySearch={false}

            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerReviewsView;
