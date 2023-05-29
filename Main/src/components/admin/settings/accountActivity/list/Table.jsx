import React, { useCallback, useState, useEffect } from "react";
import { format } from "date-fns";
import ReactTable from "../../../../common/table/ReactTableServerSide";
import { DateTimeFormat, serverError } from "services/common/helper/Helper";
import { paginationDetails } from 'global/Enum';
import UserService from "services/admin/user/UserService";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import DropdownService from "services/common/dropdown/DropdownService";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { ValidationMsgs } from "global/ValidationMessages";
import Messages from "components/common/alerts/messages/Index";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { useMemo } from "react";

const Table = () => {
  const user = useSelector((state) => state.user);
  const [users, setUser] = useState([])
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);

  const COLUMNS = [
    {
      id: "user",
      Header: "User",
      accessor: "user",
      column_name: "user",
      disableShowHide: true,
    },
    {
      id: "browser",
      Header: "Browser",
      accessor: "browser",
      column_name: "browser",
    },
    {
      id: "created_at",
      Header: "Date",
      accessor: "logdate",
      column_name: "logdate",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div >{DateTimeFormat(value).date} </div>
            <div className="text-[#707070] text-xs font-normal">
              {format(new Date(value), "hh:mm a")}
            </div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "activity",
      Header: "Activity",
      accessor: "type",
      column_name: "type",
    },
    {
      id: "ip_address",
      Header: "IP Address",
      accessor: "ipAddress",
      column_name: "ip_address",
    },
    {
      id: "location",
      Header: "Location",
      accessor: "location",
      column_name: "location",
    },
  ];
  const [Data, setData] = useState([]);
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
      field: "logdate",
      direction: 1,
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
  useEffect(() => {
    DropdownService.getDropdownValues('adminuser', false, 0).then((response) => {
      if (response.data.data) {
        setUser(response.data.data);
      }
    }).catch(() => {

    })
  }, [])

  const [selectedRows, setSelectedRows] = useState([]);
  const [filteringOptions, setColumnFilteringOptions] = useState(() => {
    return !id ? [{ "field": "userId", "operator": 0, "value": user.id }] : []
  });
  const getUserData = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true))

      UserService.accountActivity({
        args: {
          pageSize: paginationData.pageSize,
          pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
          sortingOptions,
          filteringOptions: id ? [...filteringOptions, { "field": "userId", "operator": 0, "value": id ? id : user.id }] : filteringOptions
        },
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
    [
      filteringOptions,
      paginationData.pageSize,
      sortingOptions,
      paginationData.pageIndex,
    ]
  );

  const downloadAccountData = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true))
      UserService.downloadAccountActivity({
        newargs: {
          pageSize: paginationData.pageSize,
          pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
          sortingOptions: [],
          filteringOptions
        },
        otherdata: {
          browser: location.browser,
          location: location.location,
          ipAddress: location.ipAddress,
          macAddress: location.macAddress
        }
      }).then((response) => {
        if (response.data.success) {
          // FileSaver.saveAs(response.data.data, "export.csv");
          window.location.href = response.data.data;
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.product.export.exportSuccess,
            })
          );
        }
        dispatch(setAddLoading(false))
      }).catch(err => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.product.export.exportFailed,
          })
        );
        dispatch(setAddLoading(false))
      });
    },
    [filteringOptions, paginationData.pageSize, sortingOptions, paginationData.pageIndex]
  );

  const handleSort = (sortValue) => { };
  const { pathname } = useLocation();
  return (
    <>
      <Messages />
      <ReactTable
        COLUMNS={COLUMNS}
        DATA={Data}
        {...paginationData}
        setTablePageSize={(value) =>
          setPaginationDataFunc("pageSize", value)
        }
        fetchData={getUserData}
        sortingOptions={sortingOptions}
        setSortingOptions={setSortingOptionHandler}
        handleSort={handleSort}
        // column filters
        filteringOptions={filteringOptions}
        moreFilterOption={[
          // {
          //   name: "User",
          //   options: users,
          //   columnName: "user",
          //   type: "checkbox",
          //   conditionalSearch: true,
          // },
          // {
          //   name: "Browser",
          //   options: [],
          //   columnName: "browser",
          //   type: "checkbox",
          //   conditionalSearch: true,
          // },

          // {
          //   name: "IP Address",
          //   options: [],
          //   columnName: "ipAddress",
          //   type: "checkbox",
          //   conditionalSearch: true,
          // },
          // {
          //   name: "Location",
          //   options: [],
          //   columnName: "location",
          //   type: "checkbox",
          //   conditionalSearch: true,
          // },
          {
            name: "Date",
            options: [],
            columnName: "logdate",
            type: "date",
            conditionalSearch: true,
          },
        ]}
        setColumnFilteringOptions={setColumnFilteringOptions}
        editColumnFilter={true}
        refreshTable={true}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        // download={true}
        extraFilter={[{ Component: Download, downloadAccountData }]}
        dropdownFilterOptions={!id ? [
          {
            columnName: "userId",
            name: "userId",
            options: [
              { value: user.id, label: "My Log" },
              { value: "0", label: "Team Log" }
            ],
            defaultValue: filteringOptions.length == 0 ? "0" : user.id
          },
        ] : []}
        hiddenColumns={useMemo(() => ['rowSelection'], [])}
        saveFilter={{ show: true, tabName: pathname + '_' + 'accountActivity' }}

      />
    </>
  );
};

export default Table;

const Download = ({ downloadAccountData }) => {

  return (
    <>
      <div className="relative inline-flex">
        <button
          onClick={() => { downloadAccountData() }}
          className="flex flex-wrap rounded-md items-center text-sm px-3 py-2 bg-white border border-neutral-200 hover:border-neutral-300 text-gray-500 hover:text-gray-600"
          title={`Download Log File`}
        >
          <span className="material-icons-outlined">download</span>
          <span className="ml-1">Download</span>
        </button>
      </div>
    </>
  );
};
