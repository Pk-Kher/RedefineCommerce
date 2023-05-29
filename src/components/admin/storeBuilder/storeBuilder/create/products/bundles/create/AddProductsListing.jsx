import React, { useState, useCallback, useEffect } from 'react';
import { paginationDetails, defaultImage } from 'global/Enum';
import ReactTable from "components/common/table/ReactTableServerSide";
import { useParams } from 'react-router-dom';
import ProductService from 'services/admin/masterCatalog/store/product/ProductService';
import { useDispatch } from "react-redux";
import { serverError } from "services/common/helper/Helper";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import Messages from "components/common/alerts/messages/Index";
import { ValidationMsgs } from "global/ValidationMessages";
import { CurrencySymbolByCode } from "global/Enum";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";


const AddProductsListing = (props) => {
   const parentStoreID = props.parentStoreID;
   const childRef = props.childRef;
   const { id } = useParams();
   const brandIDs = props.selectedBrandValues;
   const dispatch = useDispatch();
   const [loading, setLoading] = useState(false);
   const [productsData, setProductsData] = useState([]);
   const [filteringOptions, setColumnFilteringOptions] = useState([]);
   const [selectedRows, setSelectedRows] = useState([]);
   // const [saveLoading, setSaveLoading] = useState(false);

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

   useEffect(() => {
      const brandIDS = props.selectedBrandValues;
      setColumnFilteringOptions([{
         "field": "brandid",
         "operator": 1,
         "value": brandIDS
      }]);
   }, [brandIDs]);

   const getProductData = useCallback((pageIndex) => {
      dispatch(setAddLoading(true))
      ProductService.getStoreProductsForStoreBuilder({
         args: {
            pageSize: paginationData.pageSize,
            pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
            sortingOptions,
            filteringOptions
         },
         storeId: parentStoreID
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
   }, [filteringOptions, paginationData.pageSize, sortingOptions, paginationData.pageIndex, parentStoreID, brandIDs]);

   const addSelectedProducts = (fields, resetForm) => {
      dispatch(setAddLoading(true))
      const selectedRowsData = selectedRows;

      const attributeIDsArray = selectedRowsData => {
         const res = [];
         const map = {};

         selectedRowsData.forEach(item => {
            const temp = {};
            if (item.original.productId == undefined) {
               if (!map[item.original.id]) {
                  let subRowAttrIDs = [];
                  item.original.subRows.forEach(subRow => {
                     subRowAttrIDs.push(subRow.id);
                  });
                  map[item.original.id] = subRowAttrIDs;
                  temp[item.original.id] = map[item.original.id];
                  res.push(temp);
               };
            } else if (item.original.productId) {
               if (!map[item.original.productId]) {
                  map[item.original.productId] = [];
                  temp[item.original.productId] = map[item.original.productId];
                  res.push(temp);
               };
               map[item.original.productId].push(item.original.id);
            }
         });
         setLoading(false);
         return res;
      };
      let attributeIDsObject = attributeIDsArray(selectedRowsData);

      attributeIDsObject.map(
         (uniqueParentProductID, uniqueParentProductIDIndex) => {
            let parentProductID = Object.keys(uniqueParentProductID)[0];
            let uniqueAttributeValues = [...new Set(uniqueParentProductID[parentProductID])];

            let cloneProductsObject = {
               "productAndAttributeList": [
                  {
                     "productId": parseInt(parentProductID),
                     "attributeOptionId": uniqueAttributeValues
                  }
               ],
               "parentStoreId": parentStoreID,
               "childStoreID": parseInt(id)
            }

            ProductService.createProductCloneForStoreBuilder(cloneProductsObject)
               .then((response) => {
                  if (response?.data?.success) {
                     dispatch(
                        setAlertMessage({
                           type: "success",
                           message: ValidationMsgs.storeBuilder.products.cloneCreated
                        })
                     );
                     dispatch(setAddLoading(false))
                     childRef.current.callGetProductDataFromParent();
                  } else {
                     dispatch(
                        setAlertMessage({ type: "danger", message: serverError(response) })
                     );
                     dispatch(setAddLoading(false))
                  }
               }).catch((errors) => {
                  dispatch(
                     setAlertMessage({
                        type: "danger",
                        message: ValidationMsgs.storeBuilder.products.cloneNotCreated
                     })
                  );
                  dispatch(setAddLoading(false))
               });
         }
      );
   }

   const COLUMNS = [
      {
         id: "id",
         Header: "ID",
         accessor: "id",
         column_name: "id",
      },
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
                                 <img className="w-14 h-14 rounded-full box-content" src={`${process.env.REACT_APP_API_BLOB}${img}`} alt="no image" key={index} />
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
                     <div className="">{value}</div>
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
   ]

   return (
      <div className="mt-6">
         <div className="w-full flex flex-wrap justify-between items-center mb-2">
            <div className="block uppercase tracking-wide text-gray-500 text-lg font-bold">Master Store Product Search Result</div>
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
         <div className="w-full mt-6">
            <a className="btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white" href="javascript:void(0);" onClick={addSelectedProducts}>Add Selected Product</a>
         </div>
         <Messages />
      </div>
   )
}

export default AddProductsListing