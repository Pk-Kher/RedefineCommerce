import React, { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { paginationDetails, RecStatusValuebyName, defaultImage, CurrencySymbolByCode } from 'global/Enum';
import ReactTable from "components/common/table/ReactTableServerSide";
import { Link, useParams } from 'react-router-dom';
import Status from 'components/common/displayStatus/Status';
import Actions from 'components/common/others/admin/Action';
import ConfirmDelete from 'components/common/modals/ConfirmDelete';
import BasicModal from "components/common/modals/Basic";
import ViewRemainingAttributes from "./ViewRemainingAttributes";
import ProductService from 'services/admin/masterCatalog/store/product/ProductService';
import { useSelector, useDispatch } from 'react-redux';
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import { ValidationMsgs } from 'global/ValidationMessages';
import Messages from "components/common/alerts/messages/Index";


const StoreProductTab = forwardRef((props, ref) => {
   const { id } = useParams();
   const [loading, setLoading] = useState(false);
   const [openDeleteModal, setOpenDeleteModal] = useState(false);
   const [product, setProduct] = useState(null);
   // const [modalInfo, setModalInfo] = useState({});
   const [openBasicModal, setOpenBasicModal] = useState(false);
   const [viewRemainingAttributesModal, setViewRemainingAttributesModal] = useState(false);
   const location = useSelector((store) => store?.location);
   const dispatch = useDispatch();
   const [productsData, setProductsData] = useState([]);
   const [filteringOptions, setColumnFilteringOptions] = useState([]);
   const [selectedRows, setSelectedRows] = useState([]);
   const [paginationData, setPaginationData] = useState({
      ...paginationDetails,
   });
   const setPaginationDataFunc = (key, value) => {
      setPaginationData((prevState) => ({
         ...prevState,
         [key]: value
      }));
   };
   const [sortingOptions, setSortingOptions] = useState([
      {
         field: "name",
         direction: 0,
         priority: 0
      },
   ]);
   const setSortingOptionHandler = (column, direction) => {
      setSortingOptions([
         {
            field: column,
            direction: direction,
            priority: 0
         },
      ]);
   };

   useImperativeHandle(ref, () => ({
      callGetProductDataFromParent() {
         getProductData();
      }
   }));

   const getProductData = useCallback((pageIndex) => {
      setLoading(true);
      ProductService.getStoreProductsForStoreBuilder({
         args: {
            pageSize: paginationData.pageSize,
            pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
            sortingOptions,
            filteringOptions
         },
         storeId: id
      }).then((response) => {
         const productResponse = response.data.data;
         setProductsData(productResponse.items);
         setPaginationData((prevState) => ({
            ...prevState,
            pageIndex: productResponse?.pageIndex,
            pageSize: productResponse?.pageSize,
            totalCount: productResponse?.totalCount,
            totalPages: productResponse?.totalPages,
            hasPreviousPage: productResponse?.hasPreviousPage,
            hasNextPage: productResponse?.hasNextPage
         }));
         setLoading(false);
      });
   }, [filteringOptions, paginationData.pageSize, sortingOptions, paginationData.pageIndex, id]);

   const COLUMNS = [
      {
         id: "image",
         Header: "Product Image",
         accessor: "productImage",
         column_name: "productImage",
         isVisible: false,
         disableShowHide: true,
         Cell: ({ value, row }) => {
            return row ? (
               <>
                  <div className="flex -space-x-9 items-center relative" style={{ width: "100px" }}>
                     {Array.isArray(row.original.productImage) ?
                        row?.original?.productImage.map((img, index) => {
                           return (
                              <>
                                 <img key={row.original.id} className="w-14 h-14 rounded-full box-content" src={`${process.env.REACT_APP_API_BLOB}${img}`} alt="no image" />
                              </>
                           )
                        }) : <img className="w-14 h-14 rounded-full box-content" src={`${process.env.REACT_APP_API_BLOB}${value}`} alt="no image" />
                     }
                     {(row.original.subRows !== undefined && row.original.subRows.length !== 0) &&
                        <span className="w-14 h-14 rounded-full box-content bg-neutral-200 inline-flex items-center justify-center">+{row.original.subRows.length}</span>
                     }
                  </div>
               </>
            ) : (
               <div className="flex -space-x-9 items-center relative">
                  <img src={defaultImage} className="w-14 h-14 rounded-full box-content bg-neutral-200 inline-flex items-center justify-center" />
               </div>
            );
         },
      },
      {
         id: "name",
         Header: "Product Name",
         accessor: "name",
         column_name: "name",
         Cell: ({ value, row }) => {
            return row ? (
               <>
                  <div
                     className="w-full flex justify-start items-center group"
                     style={{ width: "200px" }}
                  >
                     <div className="">
                        {(row.original.subRows !== undefined && row.original.subRows.length !== 0) ?
                           <Link to={`/admin/StoreBuilder/${id}/products/edit/${row.original.id}`}>{value}</Link> :
                           value
                        }
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
         column_name: "sku",
         Cell: ({ value }) => {
            if (!value) {
               return "";
            } else {
               return value;
            }
         },
      },
      {
         id: "quantity",
         Header: "Quantity",
         accessor: "quantity",
         column_name: "quantity",
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
         Header: "Customer Price",
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
         id: "recStatus",
         Header: "status",
         accessor: "recStatus",
         column_name: "recStatus",
         Cell: ({ value }) => {
            return <Status type={value} />;
         },
      },
      {
         id: "action",
         Header: "",
         accessor: "id",
         column_name: "action",
         Cell: ({ value, row }) => {
            return (
               <>
                  {(row.original.subRows !== undefined && row.original.subRows.length !== 0) &&
                     <Actions
                        row={row}
                        editUrl={`/admin/StoreBuilder/${id}/products/edit/${row.original.id}`}
                        openDeleteModal={openDeleteModal}
                        setOpenDeleteModal={setOpenDeleteModal}
                        setDeleteData={setProduct}
                        setModalInfo={setProduct}
                        setOpenBasicModal={setOpenBasicModal}
                        moduleName={'Product'}
                        setViewRemainingAttributesModal={setViewRemainingAttributesModal}
                        setMoreAttributes={setProduct}
                     />
                  }
               </>
            );
         },
         disableSortBy: true,
         disableShowHide: true,
      }
   ]

   const statusChangedHandler = (data) => {
      var statusNotUpdated = data?.changeStatus === RecStatusValuebyName.Archived ? ValidationMsgs.product.notDeleted : ValidationMsgs.product.statusNotUpdated
      ProductService.updateProductStatus({
         args: {
            id: data.id,
            rowVersion: data.rowVersion,
            status: data.changeStatus,
            ...location
         }
      }).then((response) => {
         if (response.data.data) {
            dispatch(
               setAlertMessage({
                  view: true,
                  type: "success",
                  message: data?.changeStatus === RecStatusValuebyName.Archived ? ValidationMsgs.product.Deleted : ValidationMsgs.product.statusUpdated,
               })
            );
            getProductData();
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
   };

   return (
      <>
         <Messages />
         <div className="mt-6">
            <div className=" w-full flex flex-wrap justify-between items-center mb-2">
               <div className="block uppercase tracking-wide text-gray-500 text-lg font-bold">Product Store</div>
            </div>
            <div className="mt-5">
               <ReactTable
                  COLUMNS={COLUMNS}
                  DATA={productsData}
                  {...paginationData}
                  setTablePageSize={(value) =>
                     setPaginationDataFunc("pageSize", value)
                  }
                  fetchData={getProductData}
                  sortingOptions={sortingOptions}
                  setSortingOptions={setSortingOptionHandler}
                  loading={loading}
                  filteringOptions={filteringOptions}
                  setColumnFilteringOptions={setColumnFilteringOptions}
                  setSelectedRows={setSelectedRows}
                  selectedRows={selectedRows}
                  expandedRows={true}
                  tablePadding={'px-4 pb-4'}
                  displaySearch={'right'}
               />
            </div>
         </div>
         <ConfirmDelete
            handleDelete={statusChangedHandler}
            data={product}
            message="Deleting this Product will permanently remove this record from your account. This can't be undone"
            openDeleteModal={openDeleteModal}
            setOpenDeleteModal={setOpenDeleteModal}
            // {...modalInfo}
            title={"Delete"}
         />
         <BasicModal
            handleConfirmation={statusChangedHandler}
            openModal={openBasicModal}
            setOpenModal={setOpenBasicModal}
            {...product}
         />
         {viewRemainingAttributesModal && (
            <ViewRemainingAttributes
               title={"Add More Colors"}
               openModal={viewRemainingAttributesModal}
               setOpenModal={setViewRemainingAttributesModal}
               rowId={product}
               storeId={id}
               pageName={'Products'}
               getProductData={getProductData}
               parentStoreID={props.parentStoreID}
            />
         )}
      </>
   )
});
export default StoreProductTab