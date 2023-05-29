import React, { useCallback, useMemo, useState } from "react";
// import axios from "axios";
import { format } from "date-fns";
import ReactTable from "components/common/table/ReactTableServerSide";
import { NavLink, useParams } from "react-router-dom";
import CategoryService from "services/admin/storeBuilderCategories/CategoryService";
import CheckBoxAction from "./CheckBoxAction";
// import Messages from "components/common/alerts/messages/Index";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import BasicModal from "components/common/modals/Basic";
import Actions from "./Actions";
import Messages from "components/common/alerts/messages/Index";
import { serverError } from "services/common/helper/Helper";
import ViewHistory from "components/common/modals/ViewHistory";
import { ValidationMsgs } from "global/ValidationMessages";

import {
   paginationDetails,
   RecStatusValue,
   RecStatusValuebyName,
   PageName
} from "global/Enum";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { useDispatch, useSelector } from "react-redux";
import { DateTimeFormat } from "services/common/helper/Helper";
const Category = ({ isAddMode, setFormSubmit, index, activeTab, generalTabData, setactiveTab }) => {
   const { id } = useParams();
   const [openDeleteModal, setOpenDeleteModal] = useState(false);
   const [ModalInfo, setModalInfo] = useState({});
   const [openBasicModal, setOpenBasicModal] = useState(false);
   const [category, setCategory] = useState(null);
   const dispatch = useDispatch();
   const location = useSelector((store) => store?.location);
   const [StatusObj, setStatusObj] = useState([]);
   const [viewHistoryModal, setViewHistoryModal] = useState(false);

   const [loading, setLoading] = useState(false);
   const [Data, setData] = useState([]);
   const [totalPages, setTotalPages] = useState(1);
   const [paginationData, setPaginationData] = useState({ ...paginationDetails });
   const [sortingOptions, setSortingOptions] = useState([{
      field: "name",
      direction: 0,
      priority: 0
   }]);
   const [selectedRows, setSelectedRows] = useState([]);
   const [filteringOptions, setColumnFilteringOptions] = useState([]);
   const [RecordId, setRecordId] = useState(null);

   const getCategoryData = useCallback(
      (pageIndex) => {
         setLoading(true);
         CategoryService.getCategoriesWithTreeview({
            args: {
               pageSize: paginationData.pageSize,
               pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
               sortingOptions,
               filteringOptions
            },
            storeId: id
         }).then((response) => {
            setData(response.data.data.items);
            // setData(CategoryData)
            setPaginationData((prevState) => ({
               ...prevState,
               pageIndex: response.data.data.pageIndex,
               pageSize: response.data.data.pageSize,
               totalCount: response.data.data.totalCount,
               totalPages: response.data.data.totalPages,
               hasPreviousPage: response.data.data.hasPreviousPage,
               hasNextPage: response.data.data.hasNextPage
            }));
            setLoading(false);
         });
      },
      [
         filteringOptions,
         paginationData.pageSize,
         sortingOptions,
         paginationData.pageIndex,
         id
      ]
   );

   const COLUMNS = [{
      id: "name",
      Header: "Title",
      accessor: "name",
      column_name: "name",
      isVisible: false,
      disableShowHide: true,
      Cell: ({ value, row }) => {
         return row ? (
            <>
               <div
                  className="w-full flex justify-start items-center group"
                  style={{ width: "200px" }}
               >
                  <div className="">
                     <NavLink
                        to={"/admin/StoreBuilder/" + id + "/categories/edit/" + row.original.id}
                     >
                        <div className="font-semibold">{value}</div>
                     </NavLink>
                  </div>
               </div>
            </>
         ) : (
            ""
         );
      }
   },
   {
      id: "of_products",
      Header: "# Products",
      accessor: "of_products",
      column_name: "of_products",
      Cell: ({ value }) => {
         return <div className="">{value}</div>;
      }
   },
   {
      id: "createddate",
      Header: "Created date",
      accessor: "createdDate",
      column_name: "createddate",
      Cell: ({ value }) => {
         return value ? (
            <>
               <div className="">{DateTimeFormat(value).date}</div>
               <div className="text-[#707070] text-xs font-normal">
                  {format(new Date(value), "hh:mm a")}
               </div>
            </>
         ) : (
            ""
         );
      }
   },
   {
      id: "created_by",
      Header: "Created By",
      accessor: "createdByName",
      column_name: "createdName",
      Cell: ({ value }) => {
         return (
            <>
               <div className="">{value}</div>
            </>
         );
      }
   },
   {
      id: "modifiedDate",
      Header: "Updated Date",
      accessor: "modifiedDate",
      column_name: "modifiedDate",
      Cell: ({ value }) => {
         return value ? (
            <>
               <div className="">{DateTimeFormat(value).date}</div>
               <div className="text-[#707070] text-xs font-normal">
                  {format(new Date(value), "hh:mm a")}
               </div>
            </>
         ) : (
            ""
         );
      }
   },
   {
      id: "modifiedName",
      Header: "Updated By",
      accessor: "modifiedByName",
      column_name: "modifiedBy",
      Cell: ({ value }) => {
         return (
            <>
               <div className="">{value}</div>
            </>
         );
      }
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
               storeId={id}
               setCategory={setCategory}
               row={row}
               openDeleteModal={openDeleteModal}
               setOpenDeleteModal={setOpenDeleteModal}
               setModalInfo={setModalInfo}
               setOpenBasicModal={setOpenBasicModal}
               setViewHistoryModal={setViewHistoryModal}
               setRecordId={setRecordId}
            />
         );
      },
      disableSortBy: true,
      disableShowHide: true
   }]

   const getRecordHistory = (id) => {
      // setViewHistoryModal(true);
   };

   const setPaginationDataFunc = (key, value) => {
      setPaginationData((prevState) => ({
         ...prevState,
         [key]: value
      }));
   };

   const setSortingOptionHandler = (column, direction) => {
      setSortingOptions([{
         field: column,
         direction: direction,
         priority: 0
      }]);
   };
   const handleSort = (sortValue) => { };

   const handleDelete = (category) => {
      var ids = [];
      if (category.length > 0) {
         ids = category.map((value) => {
            return { item1: value.id, item2: value.rowVersion };
         });
      } else {
         ids = [{ item1: category.id, item2: category.rowVersion }];
      }
      CategoryService.updateMultipleStatus({
         args: {
            idsRowVersion: ids,
            status: RecStatusValuebyName.Archived,
            ...location,
         }
      }).then((response) => {
         if (response.data.data) {
            dispatch(
               setAlertMessage({
                  view: true,
                  type: "success",
                  message: ValidationMsgs.category.categoryDeleted
               })
            );
            getCategoryData();
         } else {
            dispatch(
               setAlertMessage({
                  view: true,
                  type: "danger",
                  message: serverError(response)
               })
            );
         }
      }).catch((errors) => {
         if (errors.response.data.Errors.Error) {
            dispatch(
               setAlertMessage({
                  message: errors.response.data.Errors.Error,
                  type: "danger"
               })
            );
         } else {
            dispatch(
               setAlertMessage({ message: ValidationMsgs.category.categoryNotDeleted, type: "danger" })
            );
         }
      });
      setOpenDeleteModal(false);
   };

   const statusChangedHandler = (data) => {
      const object = {
         id: data.id,
         status: data.changeStatus,
         rowVersion: data.rowVersion
      };
      CategoryService.updateStatus({
         args: { ...object, ...location }
      }).then((response) => {
         if (response?.data?.success) {
            dispatch(
               setAlertMessage({
                  type: "success",
                  message: ValidationMsgs.category.categoryStatusUpdated
               })
            );
            getCategoryData();
            setOpenBasicModal(false);
         } else {
            dispatch(
               setAlertMessage({
                  type: "danger",
                  message: serverError(response)
               })
            );
            setOpenBasicModal(false);
         }
      }).catch((errors) => {
         dispatch(
            setAlertMessage({
               type: "danger",
               message: ValidationMsgs.category.categoryStatusNotUpdated
            })
         );
         setOpenBasicModal(false);
      });
   };

   const moreFilterOptions = [{
      name: "Status",
      options: StatusObj,
      type: "radio"
   }];

   return (
      <>
         <title>All Categories</title>
         <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
            <div className="grid grid-cols-12">
               <div className="col-span-full w-full flex justify-between mb-8">
                  <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
                     Categories
                  </h1>
                  <div className="flex flex-wrap sm:auto-cols-max gap-2">
                     {/* <NavLink
                        to={"/admin/StoreBuilder/" + id + "/categories/create"}
                        className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                     >
                        <span className="material-icons-outlined">add</span>
                        <span className="ml-1">Add Category</span>
                     </NavLink> */}
                  </div>
               </div>
            </div>
            <Messages />
            <div className="col-span-full w-full bg-white shadow-xxl rounded-md mb-8 relative">
               <ReactTable
                  COLUMNS={COLUMNS}
                  DATA={Data}
                  {...paginationData}
                  setTablePageSize={(value) => {
                     setPaginationDataFunc("pageSize", value);
                  }}
                  totalPages={totalPages}
                  fetchData={getCategoryData}
                  sortingOptions={sortingOptions}
                  setSortingOptions={setSortingOptionHandler}
                  loading={loading}
                  handleSort={handleSort}
                  morefilter={true}
                  moreFilterOption={moreFilterOptions}
                  // column filters
                  filteringOptions={filteringOptions}
                  setColumnFilteringOptions={setColumnFilteringOptions}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  CheckBoxAction={({ ...rest }) => (
                     <CheckBoxAction
                        setOpenDeleteModal={setOpenDeleteModal}
                        setCategory={setCategory}
                        {...rest}
                     />
                  )}
                  editColumnFilter={true}
                  displayColumnFilter={[{
                     columnName: "recStatus",
                     name: "Status",
                     options: RecStatusValue
                  }]}
                  expandedRows={useMemo(() => true, [])}
               />
            </div>
         </div>
         <ConfirmDelete
            handleDelete={handleDelete}
            data={category}
            message={ValidationMsgs.category.categoryPermanentDelete}
            title={"Delete"}
            openDeleteModal={openDeleteModal}
            setOpenDeleteModal={setOpenDeleteModal}
         />
         <BasicModal
            handleConfirmation={statusChangedHandler}
            openModal={openBasicModal}
            setOpenModal={setOpenBasicModal}
            {...ModalInfo}
         />

         {viewHistoryModal && (
            <ViewHistory
               title={"View History"}
               openModal={viewHistoryModal}
               setOpenModal={setViewHistoryModal}
               getRecordHistory={getRecordHistory}
               rowId={RecordId}
               pageName={PageName.Category}
            />
         )}
      </>
   );
};

export default Category;
