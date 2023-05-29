/*Component Name: CustomerReviews
Component Functional Details: User can create or update CustomerReviews master details from here.
Created By: Vikas Patel
Created Date: <Created Date>
Modified By: Shrey Patel
Modified Date: 1/23/2023 */

import React, { useState, useCallback } from "react";
import ReactTable from "components/common/table/ReactTableServerSide";
import BasicModal from "components/common/modals/Basic";
import Actions from "components/common/others/admin/Action";
import Status from "components/common/displayStatus/Status";
import { paginationDetails } from "global/Enum";
import StarRating from "components/common/others/admin/Rating";
import { useDispatch, useSelector } from "react-redux";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import CustomerReviewService from "services/admin/masterCatalog/store/product/CustomerReviewService";
import { DateTimeFormat, serverError } from "services/common/helper/Helper";
import { ValidationMsgs } from "global/ValidationMessages";
import ProductService from "services/admin/masterCatalog/store/product/ProductService";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import ConfirmDelete from "components/common/modals/ConfirmDelete";

const CustomerReviews = ({ values, readOnly, productId }) => {
  const dispatch = useDispatch();
  const AdminId = useSelector(store => store.user.id);
  const [ModelInfo, setModalInfo] = useState({});
  const [openBasicModal, setOpenBasicModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [CustomerReviews, setDeleteData] = useState(null);

  // const [starsSelected, selectStar] = useState(0);

  const COLUMNS = [
    {
      id: "customerName",
      Header: "CUSTOMER NAME",
      accessor: "customerName",
      Footer: "CUSTOMER NAME",
      column_name: "customerName",
    },
    {
      id: "customerEmail",
      Header: "CUSTOMER Email",
      accessor: "customerEmail",
      Footer: "CUSTOMER Email",
      column_name: "customerEmail",
    },
    {
      id: "comment",
      Header: "Comments",
      accessor: "comment",
      Footer: "Comments",
      column_name: "comment",
    },
    {
      id: "Rating",
      Header: "Rating",
      accessor: "rating",
      Footer: "Rating",
      column_name: "rating",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div className="first:pr-2 flex-center justify-center">
              <StarRating value={value} size="30px" avgRating={value} />
            </div>
          </>
        ) : (
          ""
        );
      },
    },
    {
      id: "reviewDate",
      Header: "Date",
      accessor: "reviewDate",
      Footer: "reviewDate",
      column_name: "reviewDate",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div >{DateTimeFormat(value).date}</div>
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
      Header: "Approved Status",
      accessor: "status",
      Footer: "Status",
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
            moduleName="Customer Reviews"
            setModalInfo={setModalInfo}
            setDeleteData={setDeleteData}
            openDeleteModal={openDeleteModal}
            setOpenDeleteModal={setOpenDeleteModal}
            setOpenBasicModal={setOpenBasicModal}
          />
        );
      },
      disableSortBy: true,
      disableShowHide: true,
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

  const getCustomerReviewsData = () => {
    dispatch(setAddLoading(true))
    CustomerReviewService.getProductReviewById(productId).then((response) => {
      setData(response?.data?.data);
      dispatch(setAddLoading(false))
    }).catch(() => {
      dispatch(setAddLoading(false))
    })
  };

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

  const statusChangedHandler = (data) => {
    ProductService
      .StatusUpdateCustomerReview({
        approvedByid: AdminId,
        ratingId: data?.reviewId || CustomerReviews.reviewId,
        aproveStatus: data?.changeStatus || CustomerReviews.changeStatus
      })
      .then((response) => {
        if (response.data.data) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: data?.changeStatus ? ValidationMsgs.masterCatalog.customerReviews.statusUpdated : ValidationMsgs.masterCatalog.customerReviews.deleted,
            })
          );
          getCustomerReviewsData();
        } else {
          dispatch(
            setAlertMessage({
              type: "danger",
              message: serverError(response),
            })
          );
        }
      })
      .catch((errors) => {
        if (errors.response.data.Errors.Error) {
          dispatch(
            setAlertMessage({
              message: errors.response.data.Errors.Error,
              type: "danger",
            })
          );
        } else {
          dispatch(
            setAlertMessage({
              type: "danger",
              message: data?.changeStatus ? ValidationMsgs.masterCatalog.customerReviews.statusNotUpdated : ValidationMsgs.masterCatalog.customerReviews.notDeleted
            })
          );
        }
      });
    setOpenBasicModal(false);
  };

  return (
    <>
      <title>Customer Reviews</title>
      <div className="col-span-full w-full bg-white rounded-md mb-8">
        <ReactTable
          COLUMNS={COLUMNS}
          DATA={Data}
          hasNextPage={paginationData.hasNextPage}
          hasPreviousPage={paginationData.hasPreviousPage}
          pageIndex={paginationData.pageIndex}
          setPageIndex={(value) => setPaginationDataFunc("pageIndex", value)}
          pageSize={paginationData.paginationDetails.pageSize}
          setTablePageSize={(value) =>
            setPaginationDataFunc("pageSize", value)
          }
          totalCount={paginationData.totalCount}
          fetchData={getCustomerReviewsData}
          sortingOptions={sortingOptions}
          setSortingOptions={setSortingOptionHandler}
          hiddenColumns={["rowSelection", (readOnly ? 'action' : '')]}
          handleSort={handleSort}
          filteringOptions={filteringOptions}
          setColumnFilteringOptions={setColumnFilteringOptions}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}

        />
      </div>

      <ConfirmDelete
        handleDelete={statusChangedHandler}
        data={Data}
        message={ValidationMsgs.brand.brandPermanentDelete}
        title={"Delete"}
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
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

export default CustomerReviews;
