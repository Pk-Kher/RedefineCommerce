import React, { useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { paginationDetails } from "global/Enum";
import ReactDragDropTable from "components/common/table/ReactDragDropTable";
import Actions from "./Actions"
import ModuleService from "services/admin/module/ModuleService";
import { useDispatch, useSelector } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import Messages from "components/common/alerts/messages/Index";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import { ValidationMsgs } from "global/ValidationMessages";
import NavigationService from "services/admin/module/NavigationService";
import ExtensionService from "services/admin/module/ExtensionService";
import BasicModal from "components/common/modals/Basic";
import Status from "components/common/displayStatus/Status";
import { serverError } from "services/common/helper/Helper";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const List = () => {
  const dispatch = useDispatch();

  const permission = useSelector(store => store.permission);
  const [module, setModule] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openBasicModal, setOpenBasicModal] = useState(false);

  const CurrentUserObject = useSelector((store) => store?.user)

  const COLUMNS = [
    {
      id: "name",
      Header: "Name",
      accessor: "name",
      column_name: "name",
      isVisible: false,
      disableShowHide: true,
      disableSortBy: true,
      Cell: ({ value, row }) => {
        return row ? (
          <>
            <div
              className="w-full flex justify-start items-center group"
              style={{ width: "200px" }}
            >
              <div>
                <NavLink
                  to={row.isNavigation ? "/admin/configurator/Modules/Navigation/edit/" + row.navId : '/admin/configurator/Modules/Extension/edit/' + row.extId}
                >
                  <div className="font-semibold">{value}</div>
                </NavLink>
              </div>
            </div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "is_display",
      Header: "Is Display",
      accessor: "is_display",
      column_name: "is_display",
    },
    {
      id: "accesscode",
      Header: "Access Code",
      accessor: "accesscode",
      column_name: "accesscode",
    },
    {
      id: "menu_icon",
      Header: "Menu Icon",
      accessor: "menuicon",
      Cell: ({ value, row }) => {
        return <span className="material-icons-outlined">{value}</span>
      }
    },
    {
      id: "status",
      Header: "Status",
      accessor: "recStatus",
      Cell: ({ value, row }) => {
        return <Status type={value} />
      }
    },
    {
      id: "action",
      Header: "",
      accessor: "action",
      Cell: ({ value, row }) => {
        return <Actions
          setModule={setModule}
          setOpenDeleteModal={setOpenDeleteModal}
          setOpenBasicModal={setOpenBasicModal}
          id={value}
          row={row}
        />
      },
      width: "w-10"
    },
  ];
  const [Data, setData] = useState([]/* sampleProduct.AttributesData.imageData */);
  const [sortingOptions/* , setSortingOptions */] = useState([
    {
      field: "sequence",
      direction: 0,
      priority: 0,
    },
  ]);
  const [filteringOptions/* , setColumnFilteringOptions */] = useState([]);
  const [paginationData, setPaginationData] = useState({ ...paginationDetails });
  const location = useSelector((store) => store?.location);

  const setPaginationDataFunc = (key, value) => {
    setPaginationData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const CompanyId = useSelector((store) => store?.CompanyConfiguration?.id)

  const getModuleData = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true))

      ModuleService.getModules({
        pageSearchArgs: {
          pageSize: paginationData.pageSize,
          pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
          sortingOptions,
          filteringOptions,
        },
        companyConfigurationId: CompanyId,
        isSuperUser: CurrentUserObject?.isSuperUser || false
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

      })
        .catch(errors => {
          dispatch(setAddLoading(false))
        });
    },
    [
      paginationData.pageSize,
      paginationData.pageIndex,
      filteringOptions,
      sortingOptions,
      CompanyId
    ]
  );

  const orderChangeHandler = (index, data) => {
    dispatch(setAddLoading(true))

    const newSequenceIndex = index + 1

    ModuleService.changeSequence({
      changeModuleSequenceModel: {
        id: (data.isNavigation ? data.navId : data.extId),
        rowVersion: "",
        ...location,
        oldSequence: data.sequence,
        newSequence: newSequenceIndex,
        isNavigation: data.isNavigation
      }
    }).then((response) => {
      if (response.data.data) {
        dispatch(
          setAlertMessage({
            type: "success",
            message: ValidationMsgs.navigation.sequenceChanged,
          })
        );
        getModuleData();
      } else {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: serverError(response),
          })
        );
      }
      dispatch(setAddLoading(false))

    }).catch(() => {
      dispatch(
        setAlertMessage({
          type: "danger",
          message: ValidationMsgs.navigation.sequenceNotChanged,
        })
      )
      dispatch(setAddLoading(false))
    });
  }

  const statusChangedHandler = (data) => {
    dispatch(setAddLoading(true))
    if (data?.isNavigation && data.navId) {

      NavigationService.updateMultipleStatus({
        args: {
          idsRowVersion: [
            {
              item1: data.navId,
              item2: data.rowVersion,
            }
          ],
          status: data.changeStatus,
          ...location
        }
      }).then((response) => {
        if (response.data.data) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: (data.changeStatus !== 'R' ? ValidationMsgs.navigation.statusUpdated : ValidationMsgs.navigation.delete),
            })
          );
          getModuleData();
        } else {
          dispatch(
            setAlertMessage({
              type: "success",
              message: (data.changeStatus !== 'R' ? ValidationMsgs.navigation.statusNotUpdated : ValidationMsgs.navigation.notDelete),
            })
          );
          dispatch(setAddLoading(false))

        }
      }).catch((errors) => {
        if (errors.response.data.Errors.Error) {
          dispatch(
            setAlertMessage({
              message: errors.response.data.Errors.Error,
              type: "danger",
            })
          );
        } else {
          dispatch(
            setAlertMessage({ message: (data.changeStatus !== 'R' ? ValidationMsgs.navigation.statusNotUpdated : ValidationMsgs.navigation.notDelete), type: "danger" })
          );
        }
      })
      setOpenBasicModal(false);
      dispatch(setAddLoading(false))

    } else if (data.extId) {

      ExtensionService.updateMultipleStatus({
        args: {
          idsRowVersion: [
            {
              item1: data.extId,
              item2: data.rowVersion,
            }
          ],
          status: data.changeStatus,
          ...location
        }
      }).then((response) => {
        if (response.data.data) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: (data.changeStatus !== 'R' ? ValidationMsgs.extension.statusUpdated : ValidationMsgs.extension.delete),
            })
          );
          getModuleData();
        } else {
          dispatch(
            setAlertMessage({
              type: "success",
              message: (data.changeStatus !== 'R' ? ValidationMsgs.extension.statusNotUpdated : ValidationMsgs.extension.notDelete),
            })
          );
          dispatch(setAddLoading(false))
        }
      }).catch((errors) => {
        if (errors.response.data.Errors.Error) {
          dispatch(
            setAlertMessage({
              message: errors.response.data.Errors.Error,
              type: "danger",
            })
          );
        } else {
          dispatch(
            setAlertMessage({ message: (data.changeStatus !== 'R' ? ValidationMsgs.navigation.statusNotUpdated : ValidationMsgs.navigation.notDelete), type: "danger" })
          );
        }
        dispatch(setAddLoading(false))
      })
      setOpenBasicModal(false);
    }
  };

  return (
    <>
      {/* <Messages /> */}
      <title>Module</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          <div className="col-span-full w-full flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
              Module
            </h1>
            {(permission?.isEdit || permission?.isDelete) && <div className="flex flex-wrap sm:auto-cols-max gap-2">
              <NavLink
                to={"Navigation/create"}
                className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                <span className="material-icons-outlined">add</span>
                <span className="ml-1">Add Navigation</span>
              </NavLink>
              <NavLink
                to={"Extension/create"}
                className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                <span className="material-icons-outlined">add</span>
                <span className="ml-1">Add Extension</span>
              </NavLink>
            </div>}
          </div>
        </div>
        <Messages />
        <div className="col-span-full w-full bg-white shadow-xxl rounded-md mb-8 relative">
          <ReactDragDropTable
            DATA={Data}
            COLUMNS={COLUMNS}
            displaySearch={false}
            fetchData={getModuleData}
            {...paginationData}
            setTablePageSize={(value) =>
              setPaginationDataFunc("pageSize", value)
            }
            orderChangeHandler={orderChangeHandler}
          />
        </div>

        <ConfirmDelete
          handleDelete={statusChangedHandler}
          data={module}
          module={"Module"}
          title={"Delete"}
          openDeleteModal={openDeleteModal}
          setOpenDeleteModal={setOpenDeleteModal}
        />

        <BasicModal
          handleConfirmation={statusChangedHandler}
          openModal={openBasicModal}
          setOpenModal={setOpenBasicModal}
          {...module}
        />
      </div>
    </>
  );
};

export default List;
