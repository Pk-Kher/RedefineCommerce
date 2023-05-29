import React, { useCallback, useState } from "react";
import { format } from "date-fns";
import ReactTable from "../../../../../common/table/ReactTableServerSide";
import Status from "../../../../../common/displayStatus/Status";
import ImageComponent from "components/common/formComponent/Image";
import Actions from "./Action";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import BasicModal from "components/common/modals/Basic";
import Messages from "components/common/alerts/messages/Index";
import AddActionModal from "../create/AddTagModal";
import ProductTag from "services/admin/productTagMaster/ProductTagMaster";
import { useDispatch, useSelector } from "react-redux";
import { RecStatusValuebyName } from "global/Enum";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { ProductTagMaster } from "dummy/Dummy";
import ViewHistory from "components/common/modals/ViewHistory";
import { PageName, paginationDetails } from "global/Enum";
import { ValidationMsgs } from "global/ValidationMessages";
import { serverError } from "services/common/helper/Helper";
import { DateTimeFormat } from "services/common/helper/Helper";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { useMemo } from "react";

const List = () => {
  const permission = useSelector(store => store.permission);
  const dispatch = useDispatch();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [ProductTagId, setProductTagId] = useState(null);
  const [basicModalInfo, setBasicModalInfo] = useState({});
  const [openAddActionModal, setOpenAddActionModal] = useState(false);
  const [openBasicModal, setOpenBasicModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [viewHistoryModal, setViewHistoryModal] = useState(false);
  const [RecordId, setRecordId] = useState(null);

  const location = useSelector((store) => store?.location);
  const handleShowModal = () => {
    setOpenAddActionModal((prev) => !prev);
  };

  const COLUMNS = [
    {
      id: "imageName",
      Header: "Image",
      accessor: "imageName",
      column_name: "imageName",
      disableShowHide: true,
      disableSortBy: true,
      Cell: ({ value, row }) => {

        return value !== null ? (
          <>
            {/* <div
              onClick={() => {
                setEditId(row.original.id);`
                handleShowModal();
              }}
              className="w-24 max-h-40 shrink-0 p-1 sm:p-1object-fill border border-neutral-200"
            >
              <Image src={value} />
            </div> */}

            {/* <div className="flex items-center"> */}

            {/* </div> */}
            <div className="flex items-center h-40">
              <span
                onClick={() => {
                  setEditId(row.original.id);

                  handleShowModal();
                }}
              // className="cursor-pointer w-40 h-26 shrink-0 p-2 border border-neutral-200"
              >
                <ImageComponent src={value} className="w-40" containerheight={"h-20"} />
              </span>
            </div>
          </>
        ) : (
          ""
        );
      },
    },
    {
      id: "name",
      Header: "Name",
      accessor: "name",
      column_name: "name",
      disableShowHide: true,
      Cell: ({ value, row }) => {
        return row ? (
          <>
            <div
              className="w-full flex justify-start items-center group + cursor-pointer"
              style={{ width: "200px" }}
            >
              <div >
                <div
                  className="text-sm font-normal"
                  onClick={() => {
                    setEditId(row.original.id);
                    handleShowModal();
                  }}
                >
                  {value ? value : ""}
                </div>
              </div>
            </div>
          </>
        ) : (
          ""
        );
      },
    },
    {
      id: "storeName",
      Header: "STORE NAME",
      accessor: "storeName",
      column_name: "storeName",
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
      id: "tagPositionId",
      Header: "Image Position",
      accessor: "tagPositionId",
      column_name: "tagPositionId",
      // disableSortBy: true,
      Cell: ({ value }) => {
        return value ? (
          <>
            <div >
              {ProductTagMaster.map((pmt) => {
                return (pmt.value == value && pmt.label);
              })}
            </div>
          </>
        ) : (
          ""
        );
      },
    },
    {
      id: "createdDate",
      Header: "Created Date",
      accessor: "createdDate",
      column_name: "createdDate",
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
      id: "createdBy",
      Header: "Created By",
      accessor: "createdName",
      column_name: "createdName",
      Cell: ({ value }) => {
        if (!value) {
          return "";
        } else {
          return value;
        }
      },
    },
    {
      id: "modifiedDate",
      Header: "Update Date",
      accessor: "modifiedDate",
      column_name: "modifiedDate",
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
      id: "modifiedBy",
      Header: "Updated By",
      accessor: "modifiedName",
      column_name: "modifiedName",
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
      id: "recStatus",
      Header: "Status",
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
          <Actions
            handleShowModal={handleShowModal}
            id={value}
            row={row}
            setProductTagId={setProductTagId}
            setOpenDeleteModal={setOpenDeleteModal}
            setBasicModalInfo={setBasicModalInfo}
            setOpenBasicModal={setOpenBasicModal}
            setOpenAddActionModal={setOpenAddActionModal}
            setViewHistoryModal={setViewHistoryModal}
            setEditId={setEditId}
            setRecordId={setRecordId}

          />
        );
      },
      disableSortBy: true,
      disableShowHide: true,
    },
  ];
  const [Data, setData] = useState([]);
  const [sortingOptions, setSortingOptions] = useState([
    {
      field: "name",
      direction: 0,
      priority: 0,
    },
  ]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filteringOptions, setColumnFilteringOptions] = useState([]);
  const [paginationData, setPaginationData] = useState({
    ...paginationDetails,
  });
  const setPaginationDataFunc = (key, value) => {
    setPaginationData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const getProductTag = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true))

      ProductTag.getProductTag({
        args: {
          pageSize: paginationData.pageSize,
          pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
          sortingOptions,
          filteringOptions,
        },
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
      });
    },
    [
      filteringOptions,
      paginationData.pageSize,
      sortingOptions,
      paginationData.pageIndex
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
  const handleSort = (sortValue) => { };

  const statusChangedHandler = (data) => {
    if (data?.id) {
      dispatch(setAddLoading(true))

      ProductTag.updateMultipleStatus({
        args: {
          idsRowVersion: [
            {
              item1: data.id,
              item2: data.rowVersion,
            },
          ],
          status: data.changeStatus,
          ...location,
        },
      })
        .then((response) => {
          if (response.data.data) {
            dispatch(
              setAlertMessage({
                view: true,
                type: "success",
                message: ValidationMsgs.productTagMaster.productTagMasterStatusUpdated,
              })
            );
            getProductTag();
          } else {
            dispatch(
              setAlertMessage({
                view: true,
                type: "danger",
                message: serverError(response),
              })
            );
            dispatch(setAddLoading(false))
          }
        })
        .catch((errors) => {
          dispatch(
            setAlertMessage({
              view: true,
              type: "danger",
              message: ValidationMsgs.productTagMaster.productTagMasterStatusNotUpdated,
            })
          );

          dispatch(setAddLoading(false))
        });
    }
    setOpenBasicModal(false);
  };
  const handleDelete = (ProductTagId) => {
    dispatch(setAddLoading(true))

    ProductTag.updateMultipleStatus({
      args: {
        idsRowVersion: [
          {
            item1: ProductTagId.id,
            item2: ProductTagId.rowVersion,
          },
        ],
        status: RecStatusValuebyName.Archived,
        ...location,
      },
    })
      .then((response) => {
        if (response.data.data) {
          dispatch(
            setAlertMessage({
              view: true,
              type: "success",
              message: ValidationMsgs.productTagMaster.productTagMasterDeleted,
            })
          );
          getProductTag();
        } else {
          dispatch(
            setAlertMessage({
              view: true,
              type: "danger",
              message: serverError(response),
            })
          );

          dispatch(setAddLoading(false))
        }
      })
      .catch((error) => {
        dispatch(
          setAlertMessage({
            view: true,
            type: "danger",
            message: ValidationMsgs.productTagMaster.productTagMasterNotDeleted,

          })
        );

        dispatch(setAddLoading(false))
      });
    setOpenDeleteModal(false);
  };

  const getRecordHistory = (id) => {
    // setViewHistoryModal(true);
  };


  return (
    <>
      <title>Product Tag Master</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          <div className="col-span-full w-full flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
              Product Tag Master
            </h1>
            {(permission?.isEdit || permission?.isDelete) && <div className="flex flex-wrap sm:auto-cols-max gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  handleShowModal();
                }}
                className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                <span className="material-icons-outlined">add</span>
                <span className="ml-1">Add Tag</span>
              </button>
            </div>}
          </div>
        </div>
        {!openAddActionModal && <Messages />}
        <div className="col-span-full w-full bg-white shadow-xxl rounded-md mb-8 relative">
          <ReactTable
            COLUMNS={COLUMNS}
            DATA={Data}
            {...paginationData}
            hiddenColumns={["rowSelection"]}
            setTablePageSize={(value) => {
              setPaginationDataFunc("pageSize", value)
            }}
            fetchData={getProductTag}
            sortingOptions={sortingOptions}
            setSortingOptions={setSortingOptionHandler}
            handleSort={handleSort}
            // column filters
            editColumnFilter={false}
            filteringOptions={filteringOptions}
            setColumnFilteringOptions={setColumnFilteringOptions}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            morefilter={false}

          />
        </div>
      </div>
      <ConfirmDelete
        handleDelete={handleDelete}
        data={ProductTagId}
        message={ValidationMsgs.productTagMaster.productTagPermanentDelete}
        title={"Delete"}
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
      />
      <BasicModal
        handleConfirmation={statusChangedHandler}
        openModal={openBasicModal}
        setOpenModal={setOpenBasicModal}
        {...basicModalInfo}
      />
      {openAddActionModal && (
        <AddActionModal
          handleShowModal={handleShowModal}
          getProductTag={getProductTag}
          idson={editId}
        />
      )}
      {viewHistoryModal && (
        <ViewHistory
          title={"View History"}
          openModal={viewHistoryModal}
          setOpenModal={setViewHistoryModal}
          getRecordHistory={getRecordHistory}
          rowId={RecordId}
          pageName={PageName.ProductTagMaster}
        />
      )}
    </>

  );
};

export default List;
