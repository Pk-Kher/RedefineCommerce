/*Component Name: Store Tiers listing
Component Functional Details: Here we are listing Store Tiers listing data.
Created By: Ankit 
Created Date: 22/09/2022
Modified By: chandan
Modified Date: 22/09/2022 */

import React, { useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactTable from "components/common/table/ReactTableServerSide";
import TierService from "services/admin/tier/TierService";
import { paginationDetails } from "global/Enum";
import TierActions from "./TierActions";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import { RecStatusValuebyName } from "global/Enum";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { ValidationMsgs } from "global/ValidationMessages";
import { serverError } from "services/common/helper/Helper";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { useMemo } from "react";

const StoreTiersList = forwardRef((props, ref) => {
  const storeId = props.storeId;
  const handleShowModal = props.handleShowModal;
  const dispatch = useDispatch();
  const [Data, setData] = useState([]);
  const location = useSelector((store) => store?.location);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [ModalInfo, setModalInfo] = useState({});

  const [paginationData, setPaginationData] = useState({
    paginationDetails,
  });

  const [sortingOptions, setSortingOptions] = useState([
    {
      field: "name",
      direction: 0,
      priority: 0,
    },
  ]);

  const COLUMNS = [
    {
      id: "tierName",
      Header: "Tier Name",
      accessor: "tierName",
      columnName: "tierName",
      Cell: ({ value }) => {
        if (!value) {
          return "";
        } else {
          return value;
        }
      }
    },
    {
      id: "tierValue",
      Header: "Tier Value",
      accessor: "tierValue",
      columnName: "tierValue",
      Cell: ({ value }) => {
        if (!value) {
          return "";
        } else {
          return value;
        }
      }
    },
    {
      id: "action",
      Header: "Action",
      accessor: "id",
      columnName: "action",
      Cell: ({ value, row }) => {
        return (
          <TierActions
            tierRow={row}
            handleShowModal={handleShowModal}
            setOpenDeleteModal={setOpenDeleteModal}
            setModalInfo={setModalInfo}
          />
        );
      },
      disableSortBy: true,
      disableShowHide: true
    }
  ];

  const handleUpdateTierStatus = (tierData) => {
    dispatch(setAddLoading(true))

    const object = {
      id: tierData.id,
      status: RecStatusValuebyName.Archived,
      rowVersion: tierData.rowVersion,
    };

    TierService.updateTierById({
      ...object,
      ...location,
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.tier.tierDeleted,
            })
          );

          getStoreTiersData();
        } else {
          dispatch(
            setAlertMessage({
              type: "danger",
              message: serverError(response),
            })
          );
        }
        dispatch(setAddLoading(false))

      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.tier.tierNotDeleted,
          })
        );
        dispatch(setAddLoading(false))

      });
    setOpenDeleteModal(false);
  };

  useImperativeHandle(ref, () => ({
    callGetStoreTiersDataFromParent() {
      getStoreTiersData();
    }
  }));

  const getStoreTiersData = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true))

      TierService.getTiersByStoreID(storeId, {
        args: {
          pageSize: paginationData.pageSize,
          pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
          sortingOptions
        },
      }).then((response) => {
        setData(response.data.data);
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

      });
    },
    [
      paginationData.pageSize,
      sortingOptions,
      paginationData.pageIndex,
      storeId
    ]
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

  return (
    <>
      <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 mb-6">
        <div className="w-full mb-6 last:mb-0">
          <div >
            <div className="overflow-x-auto max-h-screen">
              <div className="flex items-center justify-between p-6">
                <div className="block uppercase tracking-wide text-gray-500 text-base font-bold"> Tier Range </div>
              </div>
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
                sortingOptions={sortingOptions}
                setSortingOptions={setSortingOptionHandler}
                handleSort={handleSort}
                disableGlobalFilter={true}
                fetchData={getStoreTiersData}
                displaySearch={false}
                hiddenColumns={["rowSelection"]}
                tablePadding={true}
                filters={false}
              />
            </div>
          </div>
        </div>
      </div>

      <ConfirmDelete
        handleDelete={handleUpdateTierStatus}
        message={ValidationMsgs.tier.tierPermanentDelete}
        title={"Delete"}
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
        {...ModalInfo}
      />
    </>
  );
});

export default StoreTiersList;
