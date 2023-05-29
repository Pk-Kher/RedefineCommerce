import React, { useCallback, useState, } from "react";
import ReactTable from "components/common/table/ReactTableServerSide";
import { paginationDetails, defaultImage } from "global/Enum";
import ProductService from 'services/admin/masterCatalog/store/product/ProductService';
import { useDispatch } from "react-redux";
import { serverError } from "services/common/helper/Helper";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { ValidationMsgs } from "global/ValidationMessages";
import { useMemo } from "react";

const ViewRemainingAttributes = ({
  title,
  openModal,
  setOpenModal,
  confirmButtonName,
  handleConfirmation,
  cancelButtonName,
  cancelButtonAction,
  rowId,
  storeId,
  pageName,
  page,
  getProductData,
  parentStoreID,
  ...rest
}) => {
  const [loading, setLoading] = useState(false);
  const [productAttributesData, setProductAttributesData] = useState([]);
  const [filteringOptions, setColumnFilteringOptions] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const dispatch = useDispatch();
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

  const getproductAttributesData = useCallback((pageIndex) => {
    setLoading(true);
    ProductService.getProductRemainingAttributes(
      rowId, storeId
    ).then((response) => {
      const productAttributesResponse = response.data;
      setProductAttributesData(productAttributesResponse.data);
      setPaginationData((prevState) => ({
        ...prevState,
        pageIndex: productAttributesResponse?.pageIndex,
        pageSize: productAttributesResponse?.pageSize,
        totalCount: productAttributesResponse?.totalCount,
        totalPages: productAttributesResponse?.totalPages,
        hasPreviousPage: productAttributesResponse?.hasPreviousPage,
        hasNextPage: productAttributesResponse?.hasNextPage
      }));
      setLoading(false);
    });
  }, [filteringOptions, paginationData.pageSize, sortingOptions, paginationData.pageIndex, rowId, storeId]);

  const addSelectedProductAttributes = () => {
    setLoading(true);
    const selectedRowsData = selectedRows;

    let selectedColorIDs = [];
    if (selectedRowsData.length == 0) {
      alert("Please select atleast one attribute");
    } else {
      setOpenModal((prev) => !prev);
      selectedRowsData.map(
        (selectedRow, index) => {
          selectedColorIDs.push(selectedRow.original.id);
        }
      );
      let appendAttributesObject = {
        "productAndAttributeList": [
          {
            "productId": rowId,
            "attributeOptionId": selectedColorIDs
          }
        ],
        "parentStoreId": parentStoreID,
        "childStoreID": storeId
      };
      ProductService.appendSelectedAttributes(appendAttributesObject).then((response) => {
        if (response?.data?.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.storeBuilder.products.cloneCreated
            })
          );
          setLoading(false);
          getProductData();
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
          setLoading(false);
        }
      }).catch((errors) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.storeBuilder.products.cloneNotCreated
          })
        );
        setLoading(false);
      });
    }
  }

  const COLUMNS = [
    {
      id: "image",
      Header: "Attribute Image",
      accessor: "productImage",
      column_name: "productImage",
      isVisible: false,
      disableShowHide: true,
      Cell: ({ value, row }) => {
        return row ? (
          <>
            <div className="flex -space-x-9 items-center relative" style={{ width: "100px" }}>
              <img className="w-14 h-14 rounded-full box-content" src={`${process.env.REACT_APP_API_BLOB}${value}`} alt="no image" />
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
      Header: "Attribute Name",
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
    }
  ]

  return (
    <>
      <div
        id="viewMoreAttributesModal"
        aria-hidden="true"
        className={`${!openModal && "hidden"} overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center h-modal max-h-screen`}
      >
        <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow max-h-screen overflow-y-auto">
            <div className="relative w-full max-w-4xl">
              <div className="flex justify-between items-start p-5 rounded-t border-b sticky top-0 left-0 bg-white">
                <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl">
                  {title}
                </h3>
                <button
                  onClick={() => setOpenModal((prev) => !prev)}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  data-modal-toggle="viewMoreAttributesModal"
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
                DATA={productAttributesData}
                {...paginationData}
                setTablePageSize={(value) =>
                  setPaginationDataFunc("pageSize", value)
                }
                fetchData={getproductAttributesData}
                sortingOptions={sortingOptions}
                setSortingOptions={setSortingOptionHandler}
                loading={loading}
                filteringOptions={filteringOptions}
                setColumnFilteringOptions={setColumnFilteringOptions}
                setSelectedRows={setSelectedRows}
                selectedRows={selectedRows}
                expandedRows={false}
                tablePadding={'px-4 pb-4'}
                displaySearch={'right'}
              />
            </div>
            <div className="w-full mt-6">
              <button className="btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white" onClick={addSelectedProductAttributes}>Add Selected Colors</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewRemainingAttributes;
