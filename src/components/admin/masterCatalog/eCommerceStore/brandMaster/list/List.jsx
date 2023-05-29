import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactTable from "../../../../../common/table/ReactTableServerSide";
import { Link, NavLink, useParams } from "react-router-dom";
import CheckBoxAction from "./CheckBoxAction";
import BrandService from "services/admin/masterCatalog/store/brand/BrandService";
import Status from "../../../../../common/displayStatus/Status";
import Image from "components/common/formComponent/Image";
import Actions from "./Actions";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import BasicModal from "components/common/modals/Basic";
import Messages from "components/common/alerts/messages/Index";
import { defaultImage, paginationDetails, RecStatusValuebyName, PageName, RecStatusValueForForm } from "global/Enum";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { DateTimeFormat, serverError } from "services/common/helper/Helper";
import DropdownService from "services/common/dropdown/DropdownService";
import { useDispatch, useSelector } from "react-redux";
import ViewHistory from "components/common/modals/ViewHistory";
import { ValidationMsgs } from "global/ValidationMessages";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const List = () => {
  const dispatch = useDispatch();
  const { storeType, storeName, storeId } = useParams();
  const location = useSelector((store) => store?.location);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [brand, setBrand] = useState(null);
  const [basicModalInfo, setModalInfo] = useState({});
  const [openBasicModal, setOpenBasicModal] = useState(false);
  const [viewHistoryModal, setViewHistoryModal] = useState(false);
  const [RecordId, setRecordId] = useState(null);

  const COLUMNS = [
    {
      id: "image",
      Header: "Image",
      accessor: "colorLogoUrl",
      column_name: "image",
      disableSortBy: true,
      disableShowHide: true,
      Cell: ({ value, row }) => {
        return value && value !== "" ? (
          <>
            <div className="flex items-center">
              <NavLink
                to={`/admin/MasterCatalog/${storeType}/${storeName}/${storeId}/brands/edit/${row.original.id}`}
              >
                <Image src={value} className="w-20" containerheight={"h-20"} />
              </NavLink>
            </div>
          </>
        ) : (value?.row?.bandWLogoUrl && value?.row?.bandWLogoUrl !== "" ? (
          <>
            <div className="flex items-center">
              <NavLink
                to={`/admin/MasterCatalog/${storeType}/${storeName}/${storeId}/brands/edit/${row.original.id}`}
              >
                <Image src={value?.row?.bandWLogoUrl} className="w-20" containerheight={"h-20"} />
              </NavLink>
            </div>
          </>
        ) :
          <>
            <div className="flex items-center">
              <div className="w-40 max-h-40 shrink-0 p-1 sm:p-1 ">
                <Image src={defaultImage} className="w-20" containerheight={"h-20"} />
              </div>
            </div>
          </>
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
              className="w-full flex justify-start items-center group"
              style={{ width: "200px" }}
            >
              <div >
                <Link to={`/admin/MasterCatalog/${storeType}/${storeName}/${storeId}/brands/edit/${row.original.id}`}>{value}</Link>

              </div>
            </div>
          </>
        ) : (
          ""
        );
      },
    },
    {
      id: "productCount",
      Header: "# of Products",
      accessor: "productCount",
      column_name: "productCount",
    },
    {
      id: "vendorsName",
      Header: "Vendors",
      accessor: "vendorsName",
      column_name: "vendorsName",
      disableSortBy: true,
      Cell: ({ value }) => {
        return value ? (
          <div className="flex flex-wrap gap-1">
            {value.map((name, index) => {
              return name ? (
                <span
                  key={index}
                  className="text-xs inline-flex font-medium border border-neutral-200 bg-slate-100 text-gray-500 rounded-md text-center px-2.5 py-1"
                >
                  {name}
                </span>
              ) : (
                ""
              );
            })}
          </div>
        ) : (
          ""
        );
      },
    },
    {
      id: "Created Date",
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
            id={value}
            row={row}
            setBrand={setBrand}
            setOpenDeleteModal={setOpenDeleteModal}
            setModalInfo={setModalInfo}
            setOpenBasicModal={setOpenBasicModal}
            setViewHistoryModal={setViewHistoryModal}
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

  const [vendors, setVendors] = useState([]);
  const getVendorDropdownData = useCallback(() => {
    DropdownService.getDropdownValues("vendor").then((res) => {
      if (res.data.success && res.data.data) {
        setVendors(() => {
          // let temp = {};
          // Object.keys(res.data.data).map((value, key) => {
          //   temp = { ...temp, [value]: res.data.data[value] };
          //   return "";
          // });
          return res.data.data;
        });
      }
    });
  }, []);
  useEffect(() => {
    getVendorDropdownData();
  }, [getVendorDropdownData]);

  const getBrandData = useCallback(
    (pageIndex) => {
      console.log("getBrandData called ")
      dispatch(setAddLoading(true))

      BrandService.getBrands({
        args: {
          pageSize: paginationData.pageSize,
          pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
          sortingOptions,
          filteringOptions,
        },
        storeID: storeId
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

      }).catch(() => {
        dispatch(setAddLoading(false))
      })
    },
    [
      filteringOptions,
      paginationData.pageSize,
      sortingOptions,
      paginationData.pageIndex,
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
    dispatch(setAddLoading(true))

    if (data?.id) {
      BrandService.updateStatus({
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
                message: ValidationMsgs.brand.brandStatusUpdated,
              })
            );
            getBrandData();
          } else {
            dispatch(
              setAlertMessage({
                view: true,
                type: "danger",
                message: serverError(response),
              })
            );
          }
          dispatch(setAddLoading(false))

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
              setAlertMessage({ message: ValidationMsgs.brand.brandStatusNotUpdated, type: "danger" })
            );
          }
          dispatch(setAddLoading(false))

        });
    }
    setOpenBasicModal(false);
  };

  const handleDelete = (brand) => {
    dispatch(setAddLoading(true))

    var ids = [];
    if (brand.length > 0) {
      ids = brand.map((value) => {
        return { item1: value.id, item2: value.rowVersion };
      });
    } else {
      ids = [{ item1: brand.id, item2: brand.rowVersion }];
    }
    BrandService.updateMultipleStatus({
      args: {
        idsRowVersion: ids,
        status: RecStatusValuebyName.Archived,
        ...location,
      },
    })
      .then((response) => {
        dispatch(setAddLoading(false))

        if (response.data.data) {
          dispatch(
            setAlertMessage({
              view: true,
              type: "success",
              message: ValidationMsgs.brand.brandDeleted,
            })
          );
          getBrandData();
          getBrandDropdownData();
          setColumnFilteringOptions((prevData) => {
            let prevFilterData = prevData.filter((currentFilterObj) => {
              return currentFilterObj.field !== "id"
            })
            console.log(prevFilterData, "prevFilterData")
            return prevFilterData
          })
        } else {
          dispatch(
            setAlertMessage({
              view: true,
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
            setAlertMessage({ message: ValidationMsgs.brand.brandNotCreated, type: "danger" })
          );
        }
        dispatch(setAddLoading(false))

      });
    setOpenDeleteModal(false);
  };
  const getRecordHistory = (id) => {
    // setViewHistoryModal(true);
  };

  const [BrandOption, setBrandOption] = useState([]);

  const getBrandDropdownData = useCallback(() => {
    DropdownService.getDropdownValues("storebrand", true, storeId).then((response) => {
      setBrandOption(() => {
        // return Object.keys(response.data.data).map((value, key) => {
        //   return { label: response.data.data[value], value: value };
        // });
        return response.data.data;
      });
    });
  }, [])

  useEffect(() => {
    getBrandDropdownData();
  }, [getBrandDropdownData]);

  const [moreFilterOptionValues, setMoreFilterOptionValues] = useState({
    vendor: [],
    createdBy: [],
    modifiedBy: [],
  });

  useEffect(() => {
    setMoreFilterOptionValues((prev) => {
      var temp = {
        vendor: [],
        createdBy: [],
        modifiedBy: [],
      };
      Data.map((values) => {
        var createdByAvail = temp.createdBy.find(
          (createdBy) => createdBy.value === values.createdBy
        );
        var modifiedByAvail = temp.modifiedBy.find(
          (modifiedBy) => modifiedBy.value === values.modifiedBy
        );
        if (!createdByAvail && values.createdBy) {
          temp = {
            ...temp,
            createdBy: [
              ...temp.createdBy,
              { label: values.createdByName, value: values.createdBy },
            ],
          };
        }
        if (!modifiedByAvail && values.modifiedBy) {
          temp = {
            ...temp,
            modifiedBy: [
              ...temp.modifiedBy,
              { label: values.modifiedByName, value: values.modifiedBy },
            ],
          };
        }
        return "";
      });
      return temp;
    });
  }, [Data]);

  const moreFilterOptions = useMemo(
    () => [
      {
        name: "Name",
        options: BrandOption,
        columnName: "id",
        type: "checkbox",
        conditionalSearch: true,
      },
      {
        name: "Vendor",
        columnName: "vendorId",
        options: vendors,
        type: "checkbox",
      },
      // {
      //   name: "Created By",
      //   options: moreFilterOptionValues.createdBy,
      //   columnName: "createdBy",
      //   type: "checkbox",
      // },
      {
        name: "Created Date",
        columnName: "createddate",
        options: [],
        type: "date",
      },
      // {
      //   name: "Updated By",
      //   options: moreFilterOptionValues.modifiedBy,
      //   columnName: "modifiedBy",
      //   type: "checkbox",
      // },
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
      // {
      //   name: "Filter By",
      //   columnName: "filter_by",
      //   type: "filter_by",
      //   conditionalSearch: true,
      // },
    ],
    [moreFilterOptionValues, BrandOption, vendors]
  );

  return (
    <>
      <title>Brand Master</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          <div className="col-span-full w-full flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
              Brand Master
            </h1>
          </div>
        </div>
        <Messages />
        <div className="col-span-full w-full bg-white shadow-xxl rounded-md mb-8 relative">
          <ReactTable
            COLUMNS={COLUMNS}
            DATA={Data}
            {...paginationData}
            setTablePageSize={(value) =>
              setPaginationDataFunc("pageSize", value)
            }
            fetchData={getBrandData}
            sortingOptions={sortingOptions}
            setSortingOptions={setSortingOptionHandler}
            handleSort={handleSort}
            // column filters
            editColumnFilter={true}
            filteringOptions={filteringOptions}
            setColumnFilteringOptions={setColumnFilteringOptions}
            // radioFilterOptions={[
            //   {
            //     columnName: "recStatus",
            //     name: "Status",
            //     options: RecStatusValue,
            //   },
            // ]}
            // checkBoxFilterOptions={[
            //   {
            //     columnName: "vendorId",
            //     name: "Vendor",
            //     icon: 'filter_alt',
            //     iconPosition: 'left',
            //     search: true,
            //     options: vendors,
            //   },
            // ]}
            CheckBoxAction={useCallback(
              ({ ...rest }) => (
                <CheckBoxAction
                  setBrand={setBrand}
                  setSelectedRows={setSelectedRows}
                  setOpenDeleteModal={setOpenDeleteModal}
                  {...rest}
                />
              ),
              []
            )}
            setSelectedRows={setSelectedRows}
            moreFilterOption={moreFilterOptions}
            selectedRows={selectedRows}
          /*             dropdownFilterOptions={[
                  {
                    columnName: "recStatus",
                    name: "Status",
                    options: { 0: "Select", ...RecStatusValue },
                  },
                ]} */
          // sortingColumns={[
          //   { name: "Name A-Z", direction: "0", column_name: "name" },
          //   { name: "Name Z-A", direction: "1", column_name: "name" },
          //   {
          //     name: "Created (Oldest First)",
          //     direction: "0",
          //     column_name: "createddate",
          //   },
          //   {
          //     name: "Created (Newest First)",
          //     direction: "1",
          //     column_name: "createddate",
          //   },
          //   {
          //     name: "Updated (Oldest First)",
          //     direction: "0",
          //     column_name: "modifieddate",
          //   },
          //   {
          //     name: "Updated (Newest First)",
          //     direction: "1",
          //     column_name: "modifieddate",
          //   },
          //   {
          //     name: "Status A-Z",
          //     direction: "0",
          //     column_name: "recstatus",
          //   },
          //   {
          //     name: "Status Z-A",
          //     direction: "1",
          //     column_name: "recstatus",
          //   },
          // ]}
          />
        </div>
      </div>
      <ConfirmDelete
        handleDelete={handleDelete}
        data={brand}
        message="Deleting this Brand will permanently remove this record from your account. This can't be undone"
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
      {viewHistoryModal && (
        <ViewHistory
          title={"View History"}
          openModal={viewHistoryModal}
          setOpenModal={setViewHistoryModal}
          getRecordHistory={getRecordHistory}
          rowId={RecordId}
          pageName={PageName.Brand}
        />
      )}
    </>
  );
};

export default List;
