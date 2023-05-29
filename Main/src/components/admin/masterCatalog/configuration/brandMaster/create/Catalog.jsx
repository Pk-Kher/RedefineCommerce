import React, { useState, useEffect, useCallback } from "react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";

import DataPicker from "components/common/formComponent/DatePicker";
import Input from "components/common/formComponent/Input";

import CatalogServices from "services/admin/catalog/CatalogService";
import FileComponent from "components/common/formComponent/File";
import ToggleButton from "components/common/formComponent/ToggleButton";
import Dropdown from "components/common/formComponent/Dropdown";
import { useDispatch, useSelector } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import ToolTips from "components/common/ToolTips";
import CatalogService from "services/admin/catalog/CatalogService";
import axios from "axios";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import { blobFolder, RecStatusValuebyName } from "global/Enum";
import { ValidationMsgs } from "global/ValidationMessages";
import { DateTimeFormat } from "services/common/helper/Helper";
import { serverError } from "services/common/helper/Helper";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const Catalog = ({ vendorId, vendors, brandId, isAddMode, id }) => {
  const permission = useSelector(store => store.permission);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [catalogData, setCatalogData] = useState([]);
  const [editCatalogData, setEditCatalogData] = useState([]);
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [catalogId, setCatalogId] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);
  const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

  const CompanyId = useSelector((store) => store?.CompanyConfiguration.id)
  const FolderPath = `${blobFolder.temp}/${CompanyId}/${blobFolder.brand}${!id ? "/0" : `/${id}`}/catalog`

  useEffect(() => {
    setVendorOptions(() => {
      // let vendor = {};
      // Object.keys(vendors).map((value, key) => {
      //   if (vendorId.includes(value)) {
      //     vendor = { ...vendor, [value]: vendors[value] };
      //   }
      //   return "";
      // });
      // return vendor;
      return vendors.filter((value) => vendorId.includes(value.value))
    });
  }, [vendorId, vendors]);

  const getCatalog = useCallback(() => {
    if (!isAddMode) {
      CatalogService.getCatalog(brandId, true, {
        pageIndex: 0,
        pageSize: 100,
        pagingStrategy: 0,
        sortingOptions: [
          {
            field: "modifiedDate",
            direction: 0,
            priority: 0,
          },
        ],
        filteringOptions: [
          {
            field: "string",
            operator: 0,
            value: "string",
          },
        ],
      })
        .then((response) => {
          if (response.data.success) {
            setCatalogData(response.data.data.items);
          }
          dispatch(setAddLoading(false))
        })
        .catch((err) => {
          dispatch(setAddLoading(false))
        });
    }
  }, [brandId, isAddMode]);

  useEffect(() => {
    let unmounted = false;
    let source = axios.CancelToken.source();
    if (!unmounted) {
      getCatalog();
    }
    return () => {
      unmounted = true;
      source.cancel("Cancelling in cleanup");
    };
  }, [brandId, isAddMode, getCatalog]);

  const validationSchema = Yup.object({
    vendorId: Yup.number()
      .typeError(ValidationMsgs.common.vendorIdTypeError)
      .required(ValidationMsgs.common.vendorIdRequired),
    catalogName: Yup.string().required(
      ValidationMsgs.catalog.catalogNameRequired
    ),
    startDate: Yup.string().required(ValidationMsgs.catalog.startDate),
    releasedDate: Yup.date().required(ValidationMsgs.catalog.releaseDate).when("startDate",
      (startDate, yup) => startDate && yup.min(startDate, ValidationMsgs.catalog.releaseDateGreaterStart)),
    uploadCatalogURL: Yup.string().required(
      ValidationMsgs.catalog.uploadCatalogURLRequired
    ),
  });

  useEffect(() => {
    if (!showCatalogModal) {
      setEditCatalogData([]);
    }
  }, [showCatalogModal]);

  const onSubmit = (fields, { resetForm }) => {
    if (catalogId) {
      updateCatalog(fields, resetForm);
    } else {
      storeCatalog(fields, resetForm);
    }
  };

  const editCatalog = (id) => {
    dispatch(setAddLoading(true))

    setCatalogId(id);
    CatalogService.getCatalogById(id)
      .then((response) => {
        if (response.data.success) {
          setEditCatalogData(response.data.data);
          setShowCatalogModal((prev) => !prev);
        }
        dispatch(setAddLoading(false))
      })
      .catch(() => {
        dispatch(setAddLoading(false))
      });
  };

  const storeCatalog = (fields, resetForm) => {
    dispatch(setAddLoading(true))

    CatalogServices.createCatalog({
      ...fields /* , startDate: format(fields.startDate, 'yyyy-MM-dd'), releasedDate: format(fields.startDate, 'yyyy-MM-dd') */,
      ...location
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              message: ValidationMsgs.catalog.catalogCreated,
              type: "success",
            })
          );
          getCatalog();
          setShowCatalogModal((prev) => !prev);
          resetForm({});
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
          dispatch(setAddLoading(false))
        }
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({ message: ValidationMsgs.catalog.catalogNotCreated, type: "danger" })
        );
        dispatch(setAddLoading(false))
      });
    dispatch(setAddLoading(false))

    window.scroll(0, 0);
  };

  const updateCatalog = (fields, resetForm) => {
    dispatch(setAddLoading(true))
    CatalogServices.updateCatalog({
      ...fields /* , startDate: format(fields.startDate, 'yyyy-MM-dd'), releasedDate: format(fields.startDate, 'yyyy-MM-dd') */,
      ...location
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              message: ValidationMsgs.catalog.catalogUpdated,
              type: "success",
            })
          );
          getCatalog();
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
          dispatch(setAddLoading(false));
        }
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            message: ValidationMsgs.catalog.catalogNotUpdated,
            type: "danger",
          })
        );
        dispatch(setAddLoading(false))
      });

    setShowCatalogModal((prev) => !prev);
  };

  const deleteCatalog = (data) => {
    dispatch(setAddLoading(true))

    CatalogService.updateStatus({
      id: data.id,
      rowVersion: data.rowVersion,
      status: RecStatusValuebyName.Archived,
      ...location
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.catalog.catalogDeleted,
            })
          );
          getCatalog();
        } else {
          dispatch(
            setAlertMessage({
              type: "danger",
              message: ValidationMsgs.catalog.catalogNotDeleted,
            })
          );
          dispatch(setAddLoading(false))
        }
      })
      .catch((error) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.catalog.catalogNotDeleted,
          })
        );
        dispatch(setAddLoading(false))
      });
  };

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-full xl:col-span-9">
            <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 mb-6 overflow-scroll">
              <div className="w-full mb-6 last:mb-0">
                <div className="flex items-center justify-between p-6">
                  <label className="flex flex-wrap uppercase tracking-wide text-gray-500 text-base font-bold">
                    Catalog Changes
                    <ToolTips
                      id="global"
                      className="z-60"
                      message="This allows user to update catalog name with on which date new catalog changes are made and on which date the catalog has been released"
                    />
                  </label>
                  {(permission?.isEdit || permission?.isDelete) && <div >
                    <button
                      type="button"
                      title="Add"
                      className="btn bg-indigo-500 hover:bg-indigo-600 text-white disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-gray-500"
                      disabled={isAddMode}
                      onClick={() => {
                        setShowCatalogModal((prev) => !prev);
                        setCatalogId(null);
                      }}
                    >
                      <span className="material-icons-outlined">
                        add_circle_outline
                      </span>
                      <span className="ml-1">Add Catalog</span>
                    </button>
                  </div>}
                </div>
                <div >
                  <div >
                    <table className="table-auto w-full text-sm text-[#191919] font-semibold">
                      {catalogData.length > 0 ? (
                        <>
                          <thead className="text-sm font-bold uppercase text-[#b3b3b3] border-b border-neutral-200 border-t">
                            <tr>
                              <th className="px-2 first:pl-5 py-4">
                                <div className="font-semibold text-left max-w-max flex items-center">
                                  <span>Display in Front</span>
                                </div>
                              </th>
                              <th className="px-2 first:pl-5 py-4">
                                <div className="font-semibold text-left max-w-max flex items-center">
                                  <span>Vendor Name</span>
                                </div>
                              </th>
                              <th className="px-2 first:pl-5 py-4">
                                <div className="font-semibold text-left max-w-max flex items-center">
                                  <span>Catalog Name</span>
                                </div>
                              </th>
                              <th className="px-2 first:pl-5 py-4">
                                <div className="font-semibold text-left flex items-center">
                                  <span>Start Date</span>
                                </div>
                              </th>
                              <th className="px-2 first:pl-5 py-4">
                                <div className="font-semibold text-left flex items-center">
                                  <span>Release Date</span>
                                </div>
                              </th>
                              <th className="px-2 first:pl-5 py-4">
                                <div className="font-semibold text-left flex items-center">
                                  <span>Upload Catalog</span>
                                </div>
                              </th>
                              <th className="px-2 first:pl-5 py-4">Action</th>
                            </tr>
                          </thead>
                        </>) : ''}

                      <tbody className="divide-y divide-slate-200">
                        {catalogData.map((values, index) => {
                          let catalogFileUrl = values.uploadCatalogURL.split('/')
                          return (
                            <tr key={index}>
                              <td className="px-2 first:pl-5 py-3">
                                <div >
                                  <div className="text-black-500 cursor-default ">
                                    {
                                      values.displayInFront ? <span className="material-icons-outlined">done</span> : <span className="material-icons-outlined">close</span>
                                    }
                                  </div>

                                </div>
                              </td>
                              <td className="px-2 first:pl-5 py-3">
                                {values.vendorName}
                              </td>
                              <td className="px-2 first:pl-5 py-3">
                                {values.catalogName}
                              </td>
                              <td className="px-2 first:pl-5 py-3">
                                {DateTimeFormat(values.startDate).date}
                              </td>
                              <td className="px-2 first:pl-5 py-3">
                                {DateTimeFormat(values.releasedDate).date}
                              </td>
                              <td className="px-2 first:pl-5 py-3 truncate">
                                <div className="truncate w-32 text-indigo-500 hover:text-indigo-600">
                                  <a
                                    href={`${process.env.REACT_APP_API_BLOB}/${values.uploadCatalogURL}`}
                                    className="font-medium text-sky-500 text-ellipsis "
                                    title={catalogFileUrl ? catalogFileUrl[catalogFileUrl.length - 1] : ""}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {catalogFileUrl ? catalogFileUrl[catalogFileUrl.length - 1] : ""}
                                  </a>
                                </div>
                              </td>
                              <td className="px-2 first:pl-5 py-3">
                                {(permission?.isEdit || permission?.isDelete) && <div className="relative text-center">
                                  <button
                                    type="button"
                                    title="Edit"
                                    className="text-indigo-500"
                                    onClick={editCatalog.bind(
                                      null,
                                      values.id
                                    )}
                                  >
                                    <span className="material-icons-outlined">
                                      edit
                                    </span>
                                  </button>
                                  {(values.recStatus !== 'R' && permission?.isDelete) &&
                                    <button
                                      type="button"
                                      title="Edit"
                                      className="text-rose-500"
                                      onClick={() => {
                                        setCatalogId(values);
                                        setOpenDeleteModal((prev) => !prev);
                                      }}>
                                      <span className="material-icons-outlined">
                                        close
                                      </span>
                                    </button>}
                                </div>}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {catalogData?.length <= 0 && <div className="flex flex-wrap uppercase font-bold text-sm mb-1 ml-8 text-rose-500">
                      <span className="text-rose-500 text-2xl mr-2 ">
                        *
                      </span>
                      No Data yet , please add some !
                    </div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        showCatalogModal && (
          <Formik
            enableReinitialize={true}
            initialValues={{
              id: editCatalogData.id || 0,
              brandId: brandId,
              displayInFront: editCatalogData.displayInFront ? true : false,
              vendorId: editCatalogData.vendorId || "",
              catalogName: editCatalogData.catalogName || "",
              startDate: editCatalogData.startDate || "",
              rowVersion: editCatalogData.rowVersion || null,
              releasedDate: editCatalogData.releasedDate || "",
              uploadCatalogURL: editCatalogData.uploadCatalogURL || "",
              uploadCatalogName: editCatalogData.uploadCatalogName || "",
              isBrand: editCatalogData.isBrand || true,
              recStatus: editCatalogData.recStatus || RecStatusValuebyName.Active,
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ setFieldValue, errors, values }) => {

              let catalogFileUrl = values.uploadCatalogURL.split('/')

              return (
                <FormikForm>
                  <div
                    id="ManageLocationModal"
                    className={`overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center h-modal max-h-screen`}
                  >
                    <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="relative px-4 w-full max-w-2xl h-full md:h-auto">
                        <div className="relative bg-white rounded-lg shadow max-h-screen overflow-y-auto">
                          <div className="flex justify-between items-start p-5 rounded-t border-b sticky top-0 left-0 bg-white">
                            <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl">
                              {catalogId ? "Edit Catalog" : "Add Catalog"}
                            </h3>
                            <button
                              type="button"
                              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                              data-modal-toggle="managestoreModal"
                              onClick={() => setShowCatalogModal((prev) => !prev)}
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
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="px-6">
                            {/* <Messages /> */}
                            <div className="mb-4">
                              <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                                Display In Front :
                              </label>
                              <ToggleButton
                                id={"displayInFront"}
                                name={"displayInFront"}
                                defaultValue={values.displayInFront}
                              />
                            </div>

                            <div className="mb-2">
                              <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                                Vendor
                                <span className="text-rose-500 text-2xl leading-none">
                                  *
                                </span>
                                :
                              </label>
                              <Dropdown
                                isMulti={false}
                                defaultValue={values.vendorId}
                                name={"vendorId"}
                                options={vendorOptions}
                              />
                            </div>

                            <div className="mb-2">
                              <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                                Catalog Name
                                <span className="text-rose-500 text-2xl leading-none">
                                  *
                                </span>
                                :
                              </label>
                              <Input
                                name="catalogName"
                                placeholder="Catalog Name"
                                maxLength={50}
                              />
                            </div>

                            <div className="mb-4">
                              <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                                Start Date
                                <span className="text-rose-500 text-2xl leading-none">
                                  *
                                </span>
                                :
                              </label>
                              <DataPicker
                                name={"startDate"}
                                defaultValue={values.startDate}
                                className={
                                  "w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md"
                                }
                              />
                            </div>

                            <div className="mb-4">
                              <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                                Release Date
                                <span className="text-rose-500 text-2xl leading-none">
                                  *
                                </span>
                                :
                              </label>
                              <DataPicker
                                name={"releasedDate"}
                                defaultValue={values.releasedDate}
                                minDate={new Date(values.startDate)}
                                className={"w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md"}
                              />
                            </div>

                            <div className="mb-4">
                              <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                                Upload Catalog
                                <span className="text-rose-500 text-2xl leading-none">
                                  *
                                </span>
                                :
                              </label>

                              <FileComponent
                                type="file"
                                className="w-full px-2 py-1 text-sm leading-7 bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md"
                                folderpath={`${FolderPath}`}
                                name="uploadCatalogURL"
                                filePath={'files'}
                                isChangeDefaultName={true}
                                value={catalogFileUrl ? catalogFileUrl[catalogFileUrl.length - 1] : ""}
                                onChange={(imgUrl) => {
                                  imgUrl = imgUrl.replaceAll(process.env.REACT_APP_API_BLOB, "")
                                  setFieldValue("uploadCatalogURL", imgUrl);
                                }}
                              />
                            </div>
                            <div className="mb-2">
                              <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                                Catalog File Name
                                :
                              </label>
                              <Input
                                name="uploadCatalogName"
                                placeholder="Catalog File Name"
                                maxLength={50}
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200">
                            <button
                              data-modal-toggle="ManageLocationModal"
                              type="button"
                              className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
                              onClick={() => setShowCatalogModal((prev) => !prev)}
                            >
                              Cancel
                            </button>
                            <button
                              data-modal-toggle="ManageLocationModal"
                              disabled={GlobalLoading}
                              type="submit"
                              className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(GlobalLoading) ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}
                            >
                              <div className={`w-full flex justify-center align-middle `}>
                                {GlobalLoading && (
                                  <span className="spinner-border spinner-border-sm mr-2"></span>
                                )}
                                Save
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </FormikForm>
              );
            }}
          </Formik>
        )
      }
      <ConfirmDelete
        handleDelete={deleteCatalog}
        data={catalogId}
        module={"Catalog"}
        title={"Delete"}
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
      />
    </>
  );
};

export default React.memo(Catalog);
