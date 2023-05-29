/*Component Name: CustomerReviewsView.jsx
Component Functional Details: Basic Information tab field display
Created By: Vikas Patel
Created Date: 11-May-2022
Modified By: Shrey Patel
Modified Date: 01/23/2023 */

import React, { useState, useCallback } from "react";
import ReactTable from "components/common/table/ReactTableServerSide";
import { useDispatch } from "react-redux";
import { paginationDetails } from "global/Enum";
import StarRating from "components/common/others/admin/Rating";
import Status from "components/common/displayStatus/Status";
import CustomerReviewService from "services/admin/masterCatalog/store/product/CustomerReviewService";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { DateTimeFormat, scrollTop } from "services/common/helper/Helper";

const CustomerReviewsView = ({
  displayFieldElement,
  fetchFieldProperty,
  fields,
  values,
  requiredFields,
  tab,
  setActiveTab,
  index,
  productId
}) => {
  const dispatch = useDispatch();
  const [starsSelected, selectStar] = useState(0);

  // const dispatch = useDispatch();
  const COLUMNS = [
    {
      id: "customerName",
      Header: "CUSTOMER NAME",
      accessor: "customerName",
      Footer: "CUSTOMER NAME",
      column_name: "customerName",
    },
    {
      id: "customerEmail",
      Header: "CUSTOMER Email",
      accessor: "customerEmail",
      Footer: "CUSTOMER Email",
      column_name: "customerEmail",
    },
    {
      id: "comment",
      Header: "Comments",
      accessor: "comment",
      Footer: "Comments",
      column_name: "comment",
    },
    {
      id: "Rating",
      Header: "Rating",
      accessor: "rating",
      Footer: "Rating",
      column_name: "rating",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div className="first:pr-2 flex-center justify-center">
              <StarRating value={value} />
            </div>
          </>
        ) : (
          ""
        );
      },
    },
    {
      id: "reviewDate",
      Header: "Date",
      accessor: "reviewDate",
      Footer: "reviewDate",
      column_name: "reviewDate",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div >{DateTimeFormat(value).date}</div>
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
      id: "recStatus",
      Header: "Approved Status",
      accessor: "status",
      Footer: "Status",
      column_name: "recStatus",
      Cell: ({ value }) => {
        if (value !== undefined) {
          return <Status type={value} />;
        } else {
          return "";
        }
      },
    },
  ];

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

  const getCustomerReviewsData = () => {
    dispatch(setAddLoading(true))
    CustomerReviewService.getProductReviewById(productId).then((response) => {
      setData(response?.data?.data);
      dispatch(setAddLoading(false))
    }).catch(() => {
      dispatch(setAddLoading(false))
    })
  };

  return (
    <>
      <div className="px-6 py-12 border-b-4 border-neutral-200 last:border-b-0">
        <div className="flex items-center justify-between">
          <div
            className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2"
          >
            {tab.label}
          </div>
          <div >
            <span
              className="text-indigo-500 cursor-pointer"
              onClick={() => {
                setActiveTab(index);
                scrollTop();
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
              // setPageIndex={(value) =>
              //   setPaginationDataFunc("pageIndex", value)
              // }
              pageSize={paginationData.paginationDetails.pageSize}
              // setTablePageSize={(value) =>
              //   setPaginationDataFunc("pageSize", value)
              // }
              totalCount={paginationData.totalCount}
              fetchData={getCustomerReviewsData}
              sortingOptions={sortingOptions}
              // setSortingOptions={setSortingOptionHandler}
              hiddenColumns={["rowSelection"]}
              // handleSort={handleSort}
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
