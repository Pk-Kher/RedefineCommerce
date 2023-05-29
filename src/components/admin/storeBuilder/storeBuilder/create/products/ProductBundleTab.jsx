/*Component Name: Bundle List for Store Builder
Component Functional Details: Bundle List for Store Builder
Created By: Ankit Sharma
Created Date: 11/17/2022
Modified By: Ankit Sharma
Modified Date: 11/17/2022 */

import React, { useCallback, useMemo, useState } from "react";
import ReactTable from 'components/common/table/ReactTableServerSide';
import { NavLink, useParams } from "react-router-dom";
import BundleService from "services/admin/bundle/BundleService";
import Actions from "components/common/others/admin/Action";
import { useDispatch, useSelector } from "react-redux";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import ViewHistory from "components/common/modals/ViewHistory";
import BasicModal from "components/common/modals/Basic";
import { PageName, paginationDetails, defaultImage, RecStatusValuebyName, CurrencySymbolByCode } from 'global/Enum';
import { ValidationMsgs } from "global/ValidationMessages";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import Image from "components/common/formComponent/Image";

const ProductBundleTab = () => {
   const [openDeleteModal, setOpenDeleteModal] = useState(false);
   const [bundle, setBundle] = useState(null);
   // const [ModelInfo, setModalInfo] = useState({});
   const [openBasicModal, setOpenBasicModal] = useState(false);
   const [viewHistoryModal, setViewHistoryModal] = useState(false);
   const location = useSelector((store) => store?.location);
   const dispatch = useDispatch();
   const { id } = useParams();
   const COLUMNS =  [
      {
         id: "images",
         Header: "Images",
         accessor: "productImage",
         column_name: "images",
         isVisible: false,
         disableShowHide: true,
         Cell: ({ value, row }) => {
            return value && value.length > 0 ? (
               <>
                  <div className={`flex -space-x-9 items-center`} style={{ width: "160px" }}>
                     {
                        Array.isArray(value) ? value.map((ProductMainImg, index) => {
                           return (
                              <>
                                 <div className="h-14 w-14 flex items-center justify-center overflow-hidden  rounded-full border bg-white">
                                    <Image className={"max-h-full"} src={ProductMainImg} alt="" />
                                 </div>
                              </>
                           )
                        })
                           :
                           <>
                              <div className="h-14 w-14 flex items-center justify-center overflow-hidden  rounded-full border bg-white">
                                 <Image src={value} className={"max-h-full"} />
                              </div>
                           </>
                     }
                     {(row.original.subRows !== undefined && row.original.subRows.length !== 0) &&
                        <span className="w-14 h-14 rounded-full box-content bg-neutral-200 inline-flex items-center justify-center">+{row?.original?.subRows?.length}</span>
                     }
                  </div>
               </>
            ) : (
               <>
                  <div className="h-14 w-14 flex items-center justify-center overflow-hidden  rounded-full border bg-white">
                     <Image src={defaultImage} className={"max-h-full"} />
                  </div>
               </>
            );
         },
         disableSortBy: true
      },
      {
         id: "name",
         Header: "Name",
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
                           to={
                              `/admin/StoreBuilder/store/${id}/bundle/edit/${row.original.id}`
                           }
                        >
                           <div className="font-semibold">
                              {value ? value : ""}
                           </div>
                        </NavLink>
                     </div>
                  </div>
               </>
            ) : (
               ""
            );
         },
      },
      {
         id: "ourSKU",
         Header: "SKU",
         accessor: "ourSKU",
         column_name: "ourSKU",
         Cell: ({ value }) => {
            if (!value) {
               return "";
            } else {
               return value;
            }
         },
      },
      {
         id: "salePrice",
         Header: "Sale Price",
         accessor: "salePrice",
         column_name: "salePrice",
         Cell: ({ value }) => {
            if (!value) {
               return "";
            } else {
               return CurrencySymbolByCode.USD + parseFloat(value).toFixed(2);
            }
         },
      },
      {
         id: "msrp",
         Header: "MSRP",
         accessor: "msrp",
         column_name: "msrp",
         Cell: ({ value }) => {
            if (!value) {
               return "";
            } else {
               return CurrencySymbolByCode.USD + parseFloat(value).toFixed(2);
            }
         },
      },
      {
         id: "action",
         Header: "Action",
         accessor: "id",
         column_name: "action",
         Cell: ({ value, row }) => {
            return !row.original.sale_price ? (
               <>
                  <Actions
                     row={row}
                     openDeleteModal={openDeleteModal}
                     setOpenDeleteModal={setOpenDeleteModal}
                     setDeleteData={setBundle}
                     setModalInfo={setBundle}
                     setOpenBasicModal={setOpenBasicModal}
                     editUrl={`/admin/StoreBuilder/store/${id}/bundle/edit/${row.original.id}`}
                     moduleName={'Bundle'}
                     setViewHistoryModal={setViewHistoryModal}
                     setRecordId={setBundle}
                  />
               </>
            ) : (
               ""
            );
         },
         disableSortBy: true
      }
   ]
   const [loading, setLoading] = useState(false);
   const [Data, setData] = useState([]);
   const [paginationData, setPaginationData] = useState({ ...paginationDetails });
   const [sortingOptions, setSortingOptions] = useState([
      {
         field: "firstname",
         direction: 0,
         priority: 0,
      },
   ]);
   const setPaginationDataFunc = (key, value) => {
      setPaginationData((prevState) => ({
         ...prevState,
         [key]: value,
      }));
   };
   const [selectedRows, setSelectedRows] = useState([]);
   const [filteringOptions, setColumnFilteringOptions] = useState([]);
   const getBundleData = useCallback(
      (pageIndex = 1) => {
         setLoading(true);
         BundleService.getBundles({
            args: {
               pageSize: paginationData.pageSize,
               pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
               sortingOptions,
               filteringOptions,
            },
            storeId: id,
         }).then((response) => {
            setData(response.data.data.items);
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
   const handleSort = (sortValue) => { };
   const statusChangedHandler = (data) => {
      var statusNotUpdated = data?.changeStatus === RecStatusValuebyName.Archived ? ValidationMsgs.bundle.notDelete : ValidationMsgs.bundle.statusNotUpdated;
      BundleService.updateStatus(
         {
            args: {
               id: data.id,
               rowVersion: data.rowVersion,
               status: data.changeStatus,
               ...location
            }
         }
      ).then((response) => {
         if (response.data.data) {
            dispatch(
               setAlertMessage({
                  view: true,
                  type: "success",
                  message: data?.changeStatus === RecStatusValuebyName.Archived ? ValidationMsgs.bundle.delete : ValidationMsgs.bundle.statusUpdated,
               })
            );
            getBundleData();
         } else {
            dispatch(
               setAlertMessage({
                  view: true,
                  type: "danger",
                  message: statusNotUpdated,
               })
            );
         }
      }).catch((errors) => {
         if (errors.response.data.errors) {
            dispatch(
               setAlertMessage({
                  message: errors.response.data.Errors.Error,
                  type: "danger",
               })
            );
         } else {
            dispatch(
               setAlertMessage({ message: statusNotUpdated, type: "danger" })
            );
         }
      });
      setOpenBasicModal(false);
   }
   return (
      <>
         <ReactTable
            COLUMNS={COLUMNS}
            DATA={Data}
            {...paginationData}
            setTablePageSize={(value) =>
               setPaginationDataFunc("pageSize", value)
            }
            fetchData={getBundleData}
            sortingOptions={sortingOptions}
            setSortingOptions={setSortingOptionHandler}
            loading={loading}
            handleSort={handleSort}
            // column filters
            filteringOptions={filteringOptions}
            setColumnFilteringOptions={setColumnFilteringOptions}
            editColumnFilter={false}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            expandedRows={useMemo(() => true, [])}
         />
         <ConfirmDelete
            handleDelete={statusChangedHandler}
            data={bundle}
            message="Deleting this Product will permanently remove this record from your account. This can't be undone"
            openDeleteModal={openDeleteModal}
            setOpenDeleteModal={setOpenDeleteModal}
            // {...ModelInfo}
            title={"Delete"}
         />
         <BasicModal
            handleConfirmation={statusChangedHandler}
            openModal={openBasicModal}
            setOpenModal={setOpenBasicModal}
            {...bundle}
         />
         {
            viewHistoryModal && (
               <ViewHistory
                  title={"View History"}
                  openModal={viewHistoryModal}
                  setOpenModal={setViewHistoryModal}
                  rowId={bundle}
                  pageName={PageName.Bundle}
               />
            )
         }
      </>
   );
};
export default ProductBundleTab;