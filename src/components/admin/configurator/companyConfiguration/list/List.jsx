/*Component Name: company configuration
Component Functional Details: Here we are listing company configuration data .
Created By: chandan 
Created Date: 06/09/2022 
Modified By:chandan
Modified Date: 06/10/2022 */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import CompanyConfiguration from "services/admin/companyConfiguration/CompanyConfigurationService";
import { DateTimeFormat } from "services/common/helper/Helper";
import ReactTable from "components/common/table/ReactTableServerSide";
import Image from "components/common/formComponent/Image";
import {
  RecStatusValueForForm,
  paginationDetails,
  defaultImage,
} from "global/Enum";
import { useDispatch, useSelector } from "react-redux";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import DropdownService from "services/common/dropdown/DropdownService";

const List = () => {
  const permission = useSelector(store => store.permission);
  const [Data, setData] = useState([]);
  const dispatch = useDispatch();
  const [Users, setUsers] = useState([]);

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

  const COLUMNS = [
    {
      id: "Logo",
      Header: "Logo",
      accessor: "companyLogoURL",
      column_name: "Logo",
      disableSortBy: true,
      disableShowHide: true,
      Cell: ({ value, row }) => {
        return value && value !== "" ? (
          <>
            <div className="flex items-center">
              <NavLink to={"edit/" + row.original.id}>
                <Image
                  src={value}
                  className="w-20" containerheight={"h-20"}
                />
              </NavLink>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center">
              <Image src={defaultImage} className="w-20" containerheight={"h-20"} />
            </div>
          </>
        );
      },
    },
    {
      id: "companyName",
      Header: "COMPANY NAME",
      accessor: "shortName",
      column_name: "companyName",
      disableShowHide: true,
      Cell: ({ value, row }) => {
        return row ? (
          <>
            <div
              className="w-full flex justify-start items-center group"
              style={{ width: "200px" }}
            >
              <div>
                <NavLink to={"edit/" + row.original.id}>
                  <div className="text-sm font-normal">
                    {value ? value : "-"}
                  </div>
                </NavLink>
              </div>
            </div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "fullname",
      Header: "Full Name",
      accessor: "fullName",
      column_name: "fullname",
    },
    {
      id: "email",
      Header: "Email",
      accessor: "email",
      column_name: "email",
    },
    {
      id: "phone",
      Header: "Phone",
      accessor: "phone",
      column_name: "phone",
    },
    {
      id: "module",
      Header: "modules",
      accessor: "module",
      column_name: "module",
    },
    {
      id: "Created Date",
      Header: "Created Date",
      accessor: "createdDate",
      column_name: "createdDate",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div>{DateTimeFormat(value).date} </div>
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
      id: "Created By",
      Header: "Created By",
      accessor: "createdName",
      column_name: "createdName",
    },
    {
      id: "Updated Date",
      Header: "Updated Date",
      accessor: "modifiedDate",
      column_name: "modifiedDate",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div>{DateTimeFormat(value).date} </div>
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
      id: "Updated By",
      Header: "Updated By",
      accessor: "modifiedName",
      column_name: "modifiedName",
    },
  ];

  const getCompanyData = useCallback(
    (pageIndex = 1) => {
      dispatch(setAddLoading(true))
      CompanyConfiguration.getCompanyConfiguration({
        args: {
          pageSize: paginationData.pageSize,
          pageIndex: paginationData.pageIndex,
          sortingOptions,
          filteringOptions: [...filteringOptions, {
            field: "recStatus",
            operator: 0,
            value: "A"
          }],
        },
      }).then((response) => {
        setData(response.data.data.items);
        dispatch(setAddLoading(false))

        setPaginationData((prevState) => ({
          ...prevState,
          pageIndex: response.data.data.pageIndex,
          pageSize: response.data.data.pageSize,
          totalCount: response.data.data.totalCount,
          totalPages: response.data.data.totalPages,
          hasPreviousPage: response.data.data.hasPreviousPage,
          hasNextPage: response.data.data.hasNextPage,
        }));
      });
    },
    [filteringOptions,
      paginationData.pageSize,
      sortingOptions,
      paginationData.pageIndex,]
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

  const setPaginationDataFunc = (key, value) => {
    setPaginationData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  useEffect(() => {
    DropdownService.getDropdownValues(
      "adminuser"
    ).then((res) => {
      if (res.data.success && res.data.data) {
        setUsers(() => {
          return res.data.data;
        });
      }
    });
  }, [])

  const moreFilterOptions = useMemo(
    () => [
      // {
      //   name: "Name",
      //   options: QuantityDiscount,
      //   columnName: "id",
      //   type: "checkbox",
      //   conditionalSearch: true,
      // },
      {
        name: "Created By",
        options: Users,
        columnName: "createdBy",
        type: "checkbox",
      },
      {
        name: "Created Date",
        columnName: "createddate",
        options: [],
        type: "date",
      },
      {
        name: "Updated By",
        options: Users,
        columnName: "modifiedBy",
        type: "checkbox",
      },
      {
        name: "Updated Date",
        columnName: "modifiedDate",
        options: [],
        type: "date",
      },
      {
        name: "Status",
        columnName: "recStatus",
        options: RecStatusValueForForm,
        type: "radio",
        conditionalSearch: true,
      },
      // {
      //   name: "Filter By",
      //   columnName: "filter_by",
      //   type: "filter_by",
      //   conditionalSearch: true,
      // },
    ],
    [filteringOptions, Users]
  );
  const { pathname } = useLocation();
  return (
    <>
      {/* <Messages /> */}
      <title>Company Configuration</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          <div className="grow flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
              Company Configuration
            </h1>
          </div>
          {(permission?.isEdit || permission?.isDelete) && <div className="flex flex-wrap space-x-2">
            <NavLink
              to={"create"}
              className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              <span className="material-icons-outlined">add</span>
              <span className="ml-1">Add Company Configuration</span>
            </NavLink>
          </div>}
        </div>
        <div className="col-span-full w-full bg-white shadow-xxl rounded-md mb-8 relative">
          <ReactTable
            COLUMNS={COLUMNS}
            DATA={Data}
            hasNextPage={paginationData.hasNextPage}
            hasPreviousPage={paginationData.hasPreviousPage}
            pageIndex={paginationData.pageIndex}
            setPageIndex={(value) => setPaginationDataFunc("pageIndex", value)}
            pageSize={paginationData.pageSize}
            setTablePageSize={(value) =>
              setPaginationDataFunc("pageSize", value)
            }
            totalCount={paginationData.totalCount}
            totalPages={paginationData.totalPages}
            fetchData={getCompanyData}
            sortingOptions={sortingOptions}
            setSortingOptions={setSortingOptionHandler}
            handleSort={handleSort}
            displayColumnFilter={[
              {
                columnName: "recStatus",
                name: "Status",
                options: RecStatusValueForForm,
              },
            ]}
            editColumnFilter={true}
            morefilter={true}
            moreFilterOption={moreFilterOptions}
            // column filters
            filteringOptions={filteringOptions}
            setColumnFilteringOptions={setColumnFilteringOptions}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            hiddenColumns={useMemo(() => ['rowSelection'], [])}
            saveFilter={{ show: true, tabName: pathname + '_' + 'companyConfiguration' }}
          />
        </div>
      </div>
    </>
  );
};

export default List;
