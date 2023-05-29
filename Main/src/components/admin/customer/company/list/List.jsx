/*Component Name: Routes
Component Functional Details: User can create or update Routes Company details from here.
Created By: chandan
Created Date: 06/06/22
Modified By: chandan
Modified Date: 06/06/22 */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactTable from "components/common/table/ReactTableServerSide";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CompanyInformationService from "services/admin/companyInformation/CompanyInformationServices";
import Actions from "./Actions";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import BasicModal from "components/common/modals/Basic";
import Messages from "components/common/alerts/messages/Index";
import Status from "components/common/displayStatus/Status";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { DateTimeFormat, serverError } from "services/common/helper/Helper";
import Image from "components/common/formComponent/Image";
import { defaultImage, RecStatusValuebyName, RecStatusValueForForm, paginationDetails } from "global/Enum";
import { ValidationMsgs } from "global/ValidationMessages";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import DropdownService from "services/common/dropdown/DropdownService";

const List = () => {
  const dispatch = useDispatch();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [CompanyId, setCompanyId] = useState(null);
  const [ModelInfo, setModalInfo] = useState({});
  const [openBasicModal, setOpenBasicModal] = useState(false);
  const [Data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filteringOptions, setColumnFilteringOptions] = useState([]);
  const location = useSelector((store) => store?.location);
  const [userNameValues, setUserNameValues] = useState([]);
  const [corporateName, setcorporateName] = useState([]);
  const [CompanyData, setCompanyData] = useState([]);

  const [paginationData, setPaginationData] = useState({
    ...paginationDetails,
  });

  const setPaginationDataFunc = (key, value) => {
    setPaginationData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const COLUMNS = [
    {
      id: "corporateName",
      Header: "Company Name",
      accessor: "corporateName",
      column_name: "corporateName",
      disableShowHide: true,
      Cell: ({ value, row }) => {
        return row ? (
          <>
            <div
              className="w-full flex justify-start items-center group"
              style={{ width: "200px" }}
            >
              <div >
                <NavLink to={"/admin/customer/company/edit/" + row.original.id}>
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
      id: "stores",
      Header: "Stores",
      accessor: "storeLogoUrl",
      column_name: "stores",
      disableSortBy: true,
      Cell: ({ value, row }) => {

        return value && value.length > 0 ? (
          <>
            <div className="flex -space-x-9 items-center" style={{ width: "100px" }}>
              {
                Array.isArray(value) ? value.map((ProductMainImg, index) => {
                  return (
                    <img className="w-14 h-14 rounded-full box-content" src={`${process.env.REACT_APP_API_BLOB}${ProductMainImg}`} alt="" />
                  )
                }) : <>
                  <img className="w-14 h-14 rounded-full box-content" src={`${process.env.REACT_APP_API_BLOB}${value}`} alt="" />
                </>
              }
              {(row.original.subRows !== undefined && row.original.subRows.length !== 0) &&
                <div>
                  <span className="w-14 h-14 rounded-full box-content bg-neutral-200 inline-flex items-center justify-center">+{row?.original?.subRows?.length}</span>
                </div>
              }
            </div>
          </>
        ) : (
          <>
            <div className="flex -space-x-9 items-center relative">
              <img className="w-14 h-14 shrink-0 mr-2 sm:mr-3 bg-sky-400/10 rounded-full text-center" src={`${process.env.REACT_APP_API_BLOB}${defaultImage}`} alt="No Image" />
            </div>
          </>
        );
      },
    },
    {
      id: "revenue",
      Header: "REVENUE",
      accessor: "revenue",
      column_name: "revenue",
    },
    {
      id: "orders",
      Header: "Orders",
      accessor: "orders",
      column_name: "orders",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div >{value}</div>
          </>
        ) : (
          ""
        );
      },
    },
    {
      id: "lastactiveDate",
      Header: "Last Active",
      accessor: "lastactiveDate",
      column_name: "lastactiveDate",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div >{DateTimeFormat(value).date} </div>
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
      Header: "Status",
      accessor: "recStatus",
      column_name: "recStatus",
      Cell: ({ value }) => {
        if (value !== undefined) {
          return <Status type={value} />;
        } else {
          return "";
        }
      },
    },
    {
      id: "action",
      Header: "",
      accessor: "id",
      column_name: "action",
      Cell: ({ value, row }) => {
        return (
          <Actions
            id={value}
            row={row}
            setCompanyId={setCompanyId}
            setOpenDeleteModal={setOpenDeleteModal}
            setModalInfo={setModalInfo}
            setOpenBasicModal={setOpenBasicModal}
          />
        );
      },
      disableSortBy: true,
      disableShowHide: true,
    },
  ];

  const [sortingOptions, setSortingOptions] = useState([
    {
      field: "name",
      direction: 0,
      priority: 0,
    },
  ]);

  const getCompanyData = useCallback(
    (pageIndex = 1) => {
      dispatch(setAddLoading(true))

      CompanyInformationService.getCompany({
        args: {
          pageSize: paginationData.pageSize,
          pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
          sortingOptions,
          filteringOptions,
        }
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

  const statusChangedHandler = (data) => {
    dispatch(setAddLoading(true))

    CompanyInformationService.updateCompanyStatusById({
      args: {
        id: data.id,
        status: data.changeStatus,
        rowVersion: data.rowVersion,
        ...location
      },
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              view: true,
              type: "success",
              message: ValidationMsgs.company.statusUpdated,
            })
          );
          getCompanyData();
          setOpenBasicModal(false);
        } else {
          dispatch(
            setAlertMessage({
              view: true,
              type: "danger",
              message: serverError(response),
            })
          );
          setOpenBasicModal(false);
          dispatch(setAddLoading(false))

        }
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            view: true,
            type: "danger",
            message: ValidationMsgs.company.statusNotUpdated,
          })
        );
        setOpenBasicModal(false);
        dispatch(setAddLoading(false))

      });
    setOpenBasicModal(false);
  };


  const handleDelete = (CompanyData) => {
    dispatch(setAddLoading(true))

    CompanyInformationService.updateCompanyStatusById({
      args: {
        id: CompanyData.id,
        status: RecStatusValuebyName.Archived,
        rowVersion: CompanyData.rowVersion,
        ...location
      },
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              view: true,
              type: "success",
              message: ValidationMsgs.company.deleted,
            })
          );
          getCompanyData();
          setOpenDeleteModal(false);
        } else {
          dispatch(
            setAlertMessage({
              view: true,
              type: "danger",
              message: serverError(response),
            })
          );
          setOpenDeleteModal(false);
          dispatch(setAddLoading(false))

        }
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            view: true,
            type: "danger",
            message: ValidationMsgs.company.notDeleted,
          })
        );
        setOpenDeleteModal(false);
        dispatch(setAddLoading(false))

      });
    setOpenDeleteModal(false);
  };

  useEffect(() => {
    DropdownService.getDropdownValues("adminuser").then((response) => {
      setUserNameValues(response.data.data);
    });
  },
    []);

  const moreFilterOptions = [
    // {
    //   name: "Status",
    //   options: RecStatusValueForForm,
    //   type: "radio",
    // },
    {
      name: "Company Name",
      options: corporateName,
      columnName: "id",
      type: "checkbox",
      conditionalSearch: true,
    },
    {
      name: "Last Active Date",
      columnName: "lastactiveDate",
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
    //   options: VendorOption,
    //   type: "radio",
    //   conditionalSearch: true,
    // },
  ]

  const { pathname } = useLocation();
  return (
    <>
      <title>Company List</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          <div className="col-span-full w-full flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
              Company List
            </h1>
            <div className="flex flex-wrap sm:auto-cols-max gap-2">
              <NavLink
                to={"create"}
                className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                <span className="material-icons-outlined">add</span>{" "}
                <span className="ml-1">Create Company</span>
              </NavLink>
            </div>
          </div>
        </div>
        <Messages />
        <div className="col-span-full w-full bg-white shadow-xxl rounded-md mb-8 relative">
          <ReactTable
            COLUMNS={COLUMNS}
            DATA={Data}
            {...paginationData}
            setPageIndex={(value) => setPaginationDataFunc("pageIndex", value)}
            setTablePageSize={(value) =>
              setPaginationDataFunc("pageSize", value)
            }

            fetchData={getCompanyData}
            sortingOptions={sortingOptions}
            setSortingOptions={setSortingOptionHandler}
            handleSort={handleSort}
            // column filters
            editColumnFilter={true}
            filteringOptions={filteringOptions}
            setColumnFilteringOptions={setColumnFilteringOptions}
            hiddenColumns={useMemo(() => ['rowSelection'], [])}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            morefilter={true}
            moreFilterOption={moreFilterOptions}
            saveFilter={{ show: true, tabName: pathname + '_' + 'company' }}

          />
        </div>
      </div>
      <ConfirmDelete
        handleDelete={handleDelete}
        message="Deleting this Brand will permanently remove this record from your account. This can't be undone"
        title={"Delete"}
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
        data={CompanyId}
      />
      <BasicModal
        handleConfirmation={statusChangedHandler}
        openModal={openBasicModal}
        setOpenModal={setOpenBasicModal}
        {...ModelInfo}
      />
    </>
  );
};

export default List;
