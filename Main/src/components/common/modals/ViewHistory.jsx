/*Component Name: ViewHistory
Component Functional Details:ViewHistory\.
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher,Divyesh Shah
Modified Date: <Modified Date> */

import React, { useCallback, useState, } from "react";
import ReactTable from "../table/ReactTableServerSide";
import { DateTimeFormat } from "services/common/helper/Helper";
import { paginationDetails } from "global/Enum";
import SystemLogService from "services/admin/systemLog/SystemLogService";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { useDispatch } from "react-redux";

const ViewHistory = ({
  title,
  openModal,
  setOpenModal,
  confirmButtonName,
  handleConfirmation,
  cancelButtonName,
  cancelButtonAction,
  rowId,
  pageName,
  page,
  ...rest
}) => {
  const dispatch = useDispatch();

  const [Data, setData] = useState([]);
  const [sortingOptions, setSortingOptions] = useState([
    {
      field: "name",
      direction: 0,
      priority: 0,
    },
  ]);
  const [filteringOptions] = useState([]);
  const [paginationData, setPaginationData] = useState({ paginationDetails });
  const [pageIndex] = useState(1);
  const [pageSize] = useState(25);
  const [totalPages] = useState(1);

  const COLUMNS = [
    {
      id: "updatedBy",
      Header: "Updated By",
      accessor: "updatedBy",
      column_name: "updatedBy",
      disableSortBy: true,
      Cell: ({ value }) => {
        return value ? (
          <>
            <div >{value} </div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "updatedDate",
      Header: "Updated Date",
      accessor: "updatedDate",
      column_name: "updatedDate",
      disableSortBy: true,
      Cell: ({ value }) => {
        return value ? (
          <>
            {DateTimeFormat(value).time}
            <div >{DateTimeFormat(value).date} </div>
            <div className="text-[#707070] text-xs font-normal">
            </div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "property",
      Header: "Property",
      accessor: "property",
      column_name: "property",
      disableSortBy: true,
      Cell: ({ value }) => {
        if (value === "RecStatus") { value = "Status" }
        return value ? (
          <>
            <div >{value} </div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "oldValue",
      Header: "oldValue",
      accessor: "oldValue",
      column_name: "oldValue",
      disableSortBy: true,
      Cell: ({ value }) => {
        if (value === "A") { value = "Active" } else if (value === "I") { value = "InActive" } else if (value === "D") { value = "Draft" } else if (value === "R") { value = "Archive" }
        return value ? (
          <>
            <div >{value} </div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "newValue",
      Header: "newValue",
      accessor: "newValue",
      column_name: "newValue",
      disableSortBy: true,
      Cell: ({ value }) => {
        if (value === "A") { value = "Active" } else if (value === "I") { value = "InActive" } else if (value === "D") { value = "Draft" } else if (value === "R") { value = "Archive" }

        return value ? (
          <>
            <div >{value} </div>
          </>
        ) : (
          "-"
        );
      },
    },
  ]
  const setPaginationDataFunc = (key, value) => {
    setPaginationData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const systemchangeloglistforRow = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true))

      SystemLogService.ChangeloglistrowSystemLog({
        rowId: rowId,
        page: page ? `${page}Ready` : pageName,
      }).then((response) => {
        setData(response.data.data);
        dispatch(setAddLoading(false))
      }).catch(() => {
        dispatch(setAddLoading(false))
      })
    },
    [rowId, pageName, page]
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
  const handleSort = (sortValue) => { };

  return (
    <>
      <div
        id="viewhistoryModal"
        aria-hidden="true"
        className={`${!openModal && "hidden"} overflow-y-auto overflow-x-hidden fixed inset-0 justify-center items-center h-modal max-h-screen z-30 `}
      >
        <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow max-h-screen overflow-y-auto">
            <div className="relative w-full max-w-4xl">
              <div className="flex justify-between items-start p-5 rounded-t border-b sticky top-0 left-0 bg-white z-20">
                <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl">
                  {title}
                </h3>
                <button
                  onClick={() => setOpenModal((prev) => !prev)}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  data-modal-toggle="viewhistoryModal"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
              <ReactTable
                COLUMNS={COLUMNS}
                DATA={Data}
                {...paginationData}
                pageIndex={pageIndex}
                pageSize={pageSize}
                totalPages={totalPages}
                setTablePageSize={(value) =>
                  setPaginationDataFunc("pageSize", value)
                }
                fetchData={systemchangeloglistforRow}
                sortingOptions={sortingOptions}
                setSortingOptions={setSortingOptionHandler}
                handleSort={handleSort}
                filteringOptions={filteringOptions}
                displaySearch={false}
                disableSortBy= {true}
                tablePadding={"P-0"}
                filters={false}
                hiddenColumns={["rowSelection"]}
                expandedRows={true}

              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewHistory;
