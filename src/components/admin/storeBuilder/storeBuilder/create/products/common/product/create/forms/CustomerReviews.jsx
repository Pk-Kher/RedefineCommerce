/*Component Name: CustomerReviews
Component Functional Details: User can create or update CustomerReviews master details from here.
Created By: Vikas Patel
Created Date: <Created Date>
Modified By: Shrey Patel
Modified Date: June/27/2022 */

import React, { useState, useCallback } from "react";
import ReactTable from "components/common/table/ReactTableServerSide";
import BasicModal from "components/common/modals/Basic";
import { format } from "date-fns";
import Actions from "components/common/others/admin/Action";
import Status from "components/common/displayStatus/Status";
import { useDispatch } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import Messages from "components/common/alerts/messages/Index";
import { paginationDetails, RecStatusValuebyName } from "global/Enum";
import { DateTimeFormat, getClientInfo } from "services/common/helper/Helper";
import StarRating from "components/common/others/admin/Rating";
import { ValidationMsgs } from "global/ValidationMessages";
import { useMemo } from "react";

const CustomerReviews = ({ values, readOnly }) => {
  const [ModelInfo, setModalInfo] = useState({});
  const [openBasicModal, setOpenBasicModal] = useState(false);

  const [starsSelected, selectStar] = useState(0);

  const COLUMNS = [
    {
      id: "customername",
      Header: "CUSTOMER NAME",
      accessor: "customername",
      Footer: "CUSTOMER NAME",
      column_name: "customername",
      Cell: () => {
        return values ? (
          <>
            <div className="">{values.customername} </div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "customeremail",
      Header: "CUSTOMER Email",
      accessor: "customeremail",
      Footer: "CUSTOMER Email",
      column_name: "customeremail",
      Cell: () => {
        return values ? (
          <>
            <div className="">{values.customeremail} </div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "comments",
      Header: "Comments",
      accessor: "comments",
      Footer: "Comments",
      column_name: "comments",
      Cell: ({ }) => {
        return values ? (
          <>
            <div className="">{values.comments}</div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "Rating",
      Header: "Rating",
      accessor: "rating",
      Footer: "Rating",
      column_name: "rating",
      Cell: ({ }) => {
        return values ? (
          <>
            <div className="first:pr-2 flex-center justify-center">
              <StarRating
                totalStars={5}
                starsSelected={starsSelected}
                selectStar={selectStar}
                values={values.rating}
              />
            </div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "createdDate",
      Header: "CREATED Date",
      accessor: "createdDate",
      Footer: "CREATED",
      column_name: "createdDate",
      Cell: ({ }) => {
        return values ? (
          <>
            <div className="">{values.createdDate}</div>
            {/* <div className="">{DateTimeFormat(value).date} </div>
            <div className="text-[#707070] text-xs font-normal">
              {DateTimeFormat(value).time}
            </div> */}
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "recStatus",
      Header: "Status",
      accessor: "recStatus",
      Footer: "Status",
      column_name: "recStatus",
      Cell: ({ }) => {
        if (values !== undefined) {
          return <Status type={values.recStatus} />;
        } else {
          return "-";
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
            row={values}
            moduleName="Customer Reviews"
            setModalInfo={setModalInfo}
            setOpenBasicModal={setOpenBasicModal}
          />
        );
      },
      disableSortBy: true,
      disableShowHide: true,
    },
  ]

  const [loading, setLoading] = useState(false);
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

  // Need to change the Service as per the Page API
  const getCustomerReviewssData = useCallback(
    (pageIndex = 1) => {
      //   setLoading(true);
      //   CustomerReviewssService.getAttributes({
      //     args: {
      //       pageSize: paginationData.pageSize,
      //       pageIndex: paginationData.pageIndex,
      //       sortingOptions,
      //       filteringOptions,
      //     },
      //   }).then((response) => {
      //     setData(response.data.data.items);
      //     setPaginationData((prevState) => ({
      //       ...prevState,
      //       pageIndex: response.data.data.pageIndex,
      //       pageSize: response.data.data.pageSize,
      //       totalCount: response.data.data.totalCount,
      //       totalPages: response.data.data.totalPages,
      //       hasPreviousPage: response.data.data.hasPreviousPage,
      //       hasNextPage: response.data.data.hasNextPage,
      //     }));
      //     setLoading(false);
      //   });
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

  const setPaginationDataFunc = (key, value) => {
    setPaginationData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleSort = (sortValue) => { };

  // Need to change the Service as per the Page API
  const statusChangedHandler = (data) => {
    // if (data?.id) {
    //   customerReview
    //     .updateStatus({
    //       args: {
    //         id: data.id,
    //         rowVersion: data.rowVersion,
    //         status: data.changeStatus,
    //         ...getClientInfo(),
    //       },
    //     })
    //     .then((response) => {
    //       if (response.data.data) {
    //         dispatch(
    //           setAlertMessage({
    //             view: true,
    //             type: "success",
    //             message: ValidationMsgs.masterCatalog.customerReview.statusUpdated,
    //           })
    //         );
    //         getCustomerReviewssData();
    //       } else {
    //         dispatch(
    //           setAlertMessage({
    //             view: true,
    //             type: "danger",
    //             message: serverError(response),
    //           })
    //         );
    //       }
    //     })
    //     .catch((errors) => {
    //       if (errors.response.data.Errors.Error) {
    //         dispatch(
    //           setAlertMessage({
    //             message: errors.response.data.Errors.Error,
    //             type: "danger",
    //           })
    //         );
    //       } else {
    //         dispatch(
    //           setAlertMessage({ message: ValidationMsgs.masterCatalog.customerReview.statusNotUpdated, type: "danger" })
    //         );
    //       }
    //     });
    // }
    setOpenBasicModal(false);
  };

  return (
    <>
      <title>Customer Reviews</title>
      <Messages />
      <div className=" w-full ">
        <div className="max-h-screen border-t border-neutral-200">
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
            fetchData={getCustomerReviewssData}
            sortingOptions={sortingOptions}
            setSortingOptions={setSortingOptionHandler}
            hiddenColumns={["rowSelection", (readOnly ? 'action' : '')]}
            loading={loading}
            handleSort={handleSort}
            filteringOptions={filteringOptions}
            setColumnFilteringOptions={setColumnFilteringOptions}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}

          />
        </div>
      </div>

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
