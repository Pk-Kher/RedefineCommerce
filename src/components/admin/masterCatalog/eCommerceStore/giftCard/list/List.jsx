import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactTable from "components/common/table/ReactTableServerSide";
import GiftCardService from "services/admin/masterCatalog/store/giftCard/GiftCardService";
import { CurrencySymbolByCode, paginationDetails } from "global/Enum";
import { useParams } from "react-router-dom";
import Image from "components/common/formComponent/Image";
import { defaultImage } from "global/Enum";
import { DateTimeFormat } from "services/common/helper/Helper";
import Status from "components/common/displayStatus/Status";
import CheckBoxAction from "./CheckBoxAction";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import { RecStatusValueForForm } from "global/Enum";
import DropdownService from "services/common/dropdown/DropdownService";
import AddGiftCardModal from "../create/AddGiftCardModal";
import { RecStatusValuebyName } from "global/Enum";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { ValidationMsgs } from "global/ValidationMessages";
import { serverError } from "services/common/helper/Helper";
import Actions from "./Action";
import Messages from "components/common/alerts/messages/Index";
import BacicModal from "components/common/modals/Basic";

const List = () => {
  const [Data, setData] = useState([]);
  const dispatch = useDispatch();
  const { storeID } = useParams();
  const [selectedRows, setSelectedRows] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAddActionModal, setOpenAddActionModal] = useState(false);
  const [basicModalInfo, setBasicModalInfo] = useState({});
  const [openBasicModal, setOpenBasicModal] = useState(false);
  const [giftCard, setGiftCard] = useState(null);
  const [userNameValues, setUserNameValues] = useState([]);
  const [editId, setEditId] = useState(null);
  const [GiftCardId, setGiftCardId] = useState(null);
  const handleShowModal = () => {
    setOpenAddActionModal((prev) => !prev);
  };
  const location = useSelector((store) => store?.location);
  const [sortingOptions, setSortingOptions] = useState([
    {
      field: "name",
      direction: 0,
      priority: 0,
    },
  ]);
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

  const getGiftCardData = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true));
      GiftCardService.getGiftCards({
        args: {
          pageSize: paginationData.pageSize,
          pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
          sortingOptions,
          filteringOptions,
        },
        storeID: storeID,
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
        dispatch(setAddLoading(false));
      });
    },
    [
      filteringOptions,
      paginationData.pageSize,
      sortingOptions,
      paginationData.pageIndex,
    ]
  );

  const multipleDelete = (giftCard) => {
    var ids = [];
    if (giftCard.length > 0) {
      ids = giftCard.map((value) => {
        return { item1: value.id, item2: value.rowVersion };
      });
    } else {
      ids = [{ item1: giftCard.id, item2: giftCard.rowVersion }];
    }
    console.log(ids, "ids");
    dispatch(setAddLoading(true));

    GiftCardService.updateMultipleStatus({
      args: {
        idsRowVersion: ids,
        status: RecStatusValuebyName.Archived,
        ...location,
      },
    })
      .then((response) => {
        if (response.data.data) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.giftCard.giftCardDeleted,
            })
          );
          getGiftCardData();
        } else {
          dispatch(
            setAlertMessage({
              type: "danger",
              message: serverError(response),
            })
          );
          dispatch(setAddLoading(false));
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
          setAlertMessage({
            message: ValidationMsgs.giftCard.giftCardDeleted,
            type: "danger",
          });
        }
        dispatch(setAddLoading(false));
      });
    setOpenDeleteModal(false);
  };

  const statusChangedHandler = (data) => {
    if (data?.id) {
      dispatch(setAddLoading(true));

      GiftCardService.updateStatus({
        args: {
          id: data.id,
          rowVersion: data.rowVersion,
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
                message: ValidationMsgs.giftCard.giftCardStatusUpdated,
              })
            );
            getGiftCardData();
          } else {
            dispatch(
              setAlertMessage({
                view: true,
                type: "danger",
                message: serverError(response),
              })
            );
            dispatch(setAddLoading(false));
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
                message: ValidationMsgs.giftCard.giftCardStatusNotUpdated,
                type: "danger",
              })
            );
          }
          dispatch(setAddLoading(false));
        });
    }
    setOpenBasicModal(false);
  };

  useEffect(() => {
    DropdownService.getDropdownValues("adminuser").then((response) => {
      setUserNameValues(response.data.data);
    });
  }, []);

  const COLUMNS = [
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
              <div>
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
      id: "imageName",
      Header: "Image",
      accessor: "imageName",
      column_name: "imageName",
      disableShowHide: true,
      disableSortBy: true,
      Cell: ({ value, row }) => {
        return value !== null && value !== "" && value !== undefined ? (
          <>
            <div className="flex items-center ">
              <Image
                className="w-20"
                containerheight={"h-20"}
                src={value}
                alt={row.name}
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center ">
              <Image
                className="w-20"
                containerheight={"h-20"}
                src={defaultImage}
              />
            </div>
          </>
        );
      },
    },
    {
      id: "ourSKU",
      Header: "ourSKU",
      accessor: "ourSKU",
      column_name: "ourSKU",
      Cell: ({ value, row }) => {
        return value ? (
          <>
            <div>{value}</div>
          </>
        ) : (
          ""
        );
      },
    },
    {
      id: "End Date",
      Header: "End Date",
      accessor: "giftCardEnddate",
      column_name: "giftCardEnddate",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div>{DateTimeFormat(value).date} </div>
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
      id: "salePrice",
      Header: "salePrice",
      accessor: "salePrice",
      column_name: "salePrice",
      Cell: ({ value, row }) => {
        return value ? CurrencySymbolByCode.USD + parseFloat(value).toFixed(2) : "";
      },
    },
    {
      id: "createdDate",
      Header: "createdDate",
      accessor: "createdDate",
      column_name: "createdDate",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div>{DateTimeFormat(value).date} </div>
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
      id: "Created By",
      Header: "Created By",
      accessor: "createdName",
      column_name: "createdName",
    },
    {
      id: "Updated Date",
      Header: "Updated Date",
      accessor: "modifiedDate",
      column_name: "modifiedDate",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div>{DateTimeFormat(value).date} </div>
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
      id: "Updated By",
      Header: "Updated By",
      accessor: "modifiedName",
      column_name: "modifiedName",
    },
    {
      id: "status",
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
            setGiftCardId={setGiftCardId}
            setOpenDeleteModal={setOpenDeleteModal}
            setBasicModalInfo={setBasicModalInfo}
            setOpenBasicModal={setOpenBasicModal}
            setOpenAddActionModal={setOpenAddActionModal}
            setGiftCard={setGiftCard}
            setEditId={setEditId}
          />
        );
      },
      disableSortBy: true,
      disableShowHide: true,
    },
  ];

  const moreFilterOption = useMemo(() => [
    {
      name: "Created By",
      options: userNameValues,
      columnName: "createdBy",
      type: "checkbox",
    },
    {
      name: "Created Date",
      columnName: "createddate",
      options: [],
      type: "date",
    },
    {
      name: "Updated By",
      options: userNameValues,
      columnName: "modifiedBy",
      type: "checkbox",
    },
    {
      name: "Updated Date",
      columnName: "modifiedDate",
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
  ]);

  return (
    <>
      <title>Gift Card</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="col-span-full w-full flex justify-between mb-8">
          <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
            Gift Card
          </h1>
          <button
            className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
            type="button"
            onClick={() => {
              setEditId(null);
              handleShowModal();
            }}
          >
            <span className="material-icons-outlined"> add</span>
            <span className="ml-1">Add Gift Card</span>
          </button>
        </div>
        {!openAddActionModal && <Messages />}
        <div className="col-span-full w-full bg-white shadow-xxl rounded-md mb-8 relative">
          <ReactTable
            COLUMNS={COLUMNS}
            DATA={Data}
            {...paginationData}
            setTablePageSize={(value) =>
              setPaginationDataFunc("pageSize", value)
            }
            fetchData={getGiftCardData}
            sortingOptions={sortingOptions}
            setSortingOptions={setSortingOptionHandler}
            handleSort={handleSort}
            setColumnFilteringOptions={setColumnFilteringOptions}
            moreFilterOption={moreFilterOption}
            editColumnFilter={true}
            setSelectedRows={setSelectedRows}
            selectedRows={selectedRows}
            filteringOptions={filteringOptions}
            morefilter={true}
            CheckBoxAction={useCallback(
              ({ ...rest }) => (
                <CheckBoxAction
                  setGiftCard={setGiftCard}
                  setSelectedRows={setSelectedRows}
                  setOpenDeleteModal={setOpenDeleteModal}
                  {...rest}
                />
              ),
              []
            )}
          />
        </div>
      </div>
      <ConfirmDelete
        handleDelete={multipleDelete}
        data={giftCard}
        message={ValidationMsgs.giftCard.giftCardPermanentDelete}
        title={"Delete"}
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
      />
      <BacicModal
        handleConfirmation={statusChangedHandler}
        openModal={openBasicModal}
        setOpenModal={setOpenBasicModal}
        {...basicModalInfo}
      />
      {openAddActionModal && (
        <AddGiftCardModal
          handleShowModal={handleShowModal}
          getGiftCardData={getGiftCardData}
          idson={editId}
        />
      )}
    </>
  );
};
export default List;
