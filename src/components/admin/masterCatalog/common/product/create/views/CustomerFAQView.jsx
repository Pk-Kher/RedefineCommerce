/*Component Name: PricingView
Component Functional Details: User can create or update PricingView master details from here.
Created By: <Your Name>
Created Date: <Creation Date>
Modified By: chandan
Modified Date: <Modified Date> */

import React, { useState, useCallback } from "react";
import { paginationDetails } from "global/Enum";
import ReactTableServerSide from "components/common/table/ReactTableServerSide";
import { DateTimeFormat, scrollTop } from "services/common/helper/Helper";
import CustomerFaqsService from "services/admin/masterCatalog/store/product/CustomerFaqsService";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { useDispatch } from "react-redux";
import { useMemo } from "react";

const CustomerFAQView = ({
  displayFieldElement,
  fetchFieldProperty,
  fields,
  values,
  productId,
  requiredFields,
  tab,
  setActiveTab,
  index,
}) => {
  const dispatch = useDispatch();

  const COLUMNS = [
    {
      id: "Questions",
      Header: "Questions",
      accessor: "question",
      Footer: "Questions",
      column_name: "questions",
    },
    {
      id: "Answers",
      Header: "Answers",
      accessor: "answer",
      Footer: "Answers",
      column_name: "answers",
    },
    {
      id: "createdDate",
      Header: "CREATED Date",
      accessor: "createdDate",
      Footer: "CREATED",
      column_name: "createdDate",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div >{DateTimeFormat(value).date} </div>
            <div className="text-[#707070] text-xs font-normal">
              {DateTimeFormat(value).time}
            </div>
          </>
        ) : (
          "-"
        );
      },
    },

    {
      id: "createdBy",
      Header: "Created BY",
      accessor: "createdName",
      Footer: "Created BY",
      column_name: "createdBy",
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

  const getCustomerFaqsData = useCallback(
    (pageIndex = 1) => {
      dispatch(setAddLoading(true))

      CustomerFaqsService.getCustomerFaqs({
        args: {
          pageSize: paginationData.pageSize,
          pageIndex: paginationData.pageIndex,
          sortingOptions,
          filteringOptions,
        },
        productId: productId
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
        dispatch(setAddLoading(false))

      }).catch(() => {
        dispatch(setAddLoading(false))

      })
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
          <div className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2">
            {tab.label}
          </div>
          <div >
            <span
              href="/"
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
          <div className=" max-h-screen border-t border-neutral-200">
            <ReactTableServerSide
              COLUMNS={COLUMNS}
              DATA={Data}
              hasNextPage={paginationData.hasNextPage}
              hasPreviousPage={paginationData.hasPreviousPage}
              pageIndex={paginationData.pageIndex}
              setPageIndex={(value) =>
                setPaginationDataFunc("pageIndex", value)
              }
              pageSize={25}
              setTablePageSize={(value) =>
                setPaginationDataFunc("pageSize", value)
              }
              // totalCount={paginationData.totalCount}
              fetchData={getCustomerFaqsData}
              sortingOptions={sortingOptions}
              setSortingOptions={setSortingOptionHandler}
              hiddenColumns={["rowSelection"]}
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

export default CustomerFAQView;
