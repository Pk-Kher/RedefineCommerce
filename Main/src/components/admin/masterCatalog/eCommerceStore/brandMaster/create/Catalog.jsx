import React, { useState, useEffect, useCallback } from "react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import Input from "components/common/formComponent/Input";
import FileComponent from "components/common/formComponent/File";
import { useDispatch, useSelector } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import axios from "axios";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import { blobFolder, RecStatusValuebyName } from "global/Enum";
import { ValidationMsgs } from "global/ValidationMessages";
import { serverError } from "services/common/helper/Helper";
import ImageFile from "components/common/formComponent/ImageFile";
import CatalogService from "services/admin/masterCatalog/store/brand/CatalogService";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import ToolTipComponent from "components/common/ToolTips";
import { ToolTipsMessages } from "global/ToolTipsMessages";

const Catalog = ({ vendorId, vendors, brandId, isAddMode, id }) => {
  const permission = useSelector(store => store.permission);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [catalogData, setCatalogData] = useState([]);
  const [editCatalogData, setEditCatalogData] = useState([]);
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [catalogId, setCatalogId] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);

  const CompanyId = useSelector((store) => store?.CompanyConfiguration.id)
  const FolderPath = `/${blobFolder.temp}/${CompanyId}/${blobFolder.brand}${!id ? "/0" : `/${id}`}/catalog`

  useEffect(() => {
    setVendorOptions(() => {
      return vendors.filter((value) => vendorId.includes(value.value))
    });
  }, [vendorId, vendors]);

  const getCatalog = useCallback(() => {
    if (!isAddMode) {
      dispatch(setAddLoading(true))

      CatalogService.getCatalog({
        args: {
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
          filteringOptions: [],
        },
        brandId: brandId
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
    if (!unmounted && brandId) {
      getCatalog();
    }
    return () => {
      unmounted = true;
      source.cancel("Cancelling in cleanup");
    };
  }, [brandId, isAddMode, getCatalog]);

  const validationSchema = Yup.object({
    displayOrder: Yup.number().typeError(ValidationMsgs.masterCatalog.Store.catalog.displayOrderTypeError).required(),
    catalogFileName: Yup.string().required(
      ValidationMsgs.masterCatalog.Store.catalog.catalogFileNameRequired
    ),
    catalogLogo: Yup.string().required(
      ValidationMsgs.masterCatalog.Store.catalog.catalogLogoRequired
    ),
    catalogFile: Yup.string().required(
      ValidationMsgs.masterCatalog.Store.catalog.catalogFileRequired
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
    setCatalogId(id);
    dispatch(setAddLoading(true))

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

    CatalogService.createCatalog({
      ...fields,
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
        }
        dispatch(setAddLoading(false))

      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({ message: ValidationMsgs.catalog.catalogNotCreated, type: "danger" })
        );
        dispatch(setAddLoading(false))

      });
    window.scroll(0, 0);
  };

  const updateCatalog = (fields, resetForm) => {
    dispatch(setAddLoading(true))

    CatalogService.updateCatalog({
      ...fields,
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
          resetForm({});
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
        }
        dispatch(setAddLoading(false))

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

    var ids = [];
    if (data.length > 0) {
      ids = data.map((value) => {
        return { item1: data[value.id], item2: data[value.rowVersion] };
      });
    } else {
      ids = [{ item1: data.id, item2: data.rowVersion }];
    }
    CatalogService.updateStatus({
      args: {
        idsRowVersion: ids,
        status: RecStatusValuebyName.Archived,
        ...location,
      },
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
              message: serverError(response),
            })
          );
        }
        dispatch(setAddLoading(false))

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
            <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 mb-6">
              <div className="w-full mb-6 last:mb-0">
                <div className="flex items-center justify-between p-6">
                  <label className="flex flex-wrap uppercase tracking-wide text-gray-500 text-base font-bold">
                    Catalog Changes
                    <div className="flex items-center">
                      <ToolTipComponent
                        id="BrandCatalogChange"
                        message={ToolTipsMessages.BrandTooltips.BrandCatalogChange}
                      />
                    </div>
                  </label>
                  {permission?.isEdit &&
                    <div >
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
                    {catalogData.length > 0 && (
                      <table className="table-auto w-full text-sm text-[#191919] font-semibold">
                        <thead className="text-sm font-bold uppercase text-[#b3b3b3] border-b border-neutral-200 border-t">
                          <tr>
                            <th className="px-2 first:pl-5 py-4">
                              <div className="font-semibold text-left max-w-max flex items-center">
                                <span>Catalog Name</span>
                              </div>
                            </th>
                            <th className="px-2 first:pl-5 py-4">
                              <div className="font-semibold text-left max-w-max flex items-center">
                                <span>Catalog Logo</span>
                              </div>
                            </th>
                            <th className="px-2 first:pl-5 py-4">
                              <div className="font-semibold text-left flex items-center">
                                <span>Upload Catalog</span>
                              </div>
                            </th>
                            {(permission?.isEdit || permission?.isDelete) && <th className="px-2 first:pl-5 py-4">Action</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {catalogData.map((values, index) => {
                            let catalogFileUrl = values.catalogFile.split('/')
                            return (
                              <tr key={index}>
                                <td className="px-2 first:pl-5 py-3">
                                  {values.catalogFileName}
                                </td>
                                <td className="px-2 first:pl-5 py-3 truncate">
                                  <div className="truncate w-32 text-indigo-500 hover:text-indigo-600">
                                    <img src={`${process.env.REACT_APP_API_BLOB}${values.catalogLogo}`} alt={values.catalogFileName} />


                                  </div>
                                </td>
                                <td className="px-2 first:pl-5 py-3 truncate">
                                  <div className="truncate w-32 text-indigo-500 hover:text-indigo-600">
                                    <a
                                      href={`${process.env.REACT_APP_API_BLOB}${values.catalogFile}`}
                                      className="font-medium text-sky-500 text-ellipsis "
                                      title={catalogFileUrl ? catalogFileUrl[catalogFileUrl.length - 1] : ""}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {catalogFileUrl ? catalogFileUrl[catalogFileUrl.length - 1] : ""}
                                    </a>
                                  </div>
                                </td>

                                {(permission?.isEdit || permission?.isDelete) && <td className="px-2 first:pl-5 py-3">
                                  <div className="relative text-center">
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
                                          setCatalog(values);
                                          setOpenDeleteModal((prev) => !prev);
                                        }}>
                                        <span className="material-icons-outlined">
                                          close
                                        </span>
                                      </button>}
                                  </div>
                                </td>}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                    {isAddMode && (
                      <div className="flex flex-wrap uppercase font-bold text-sm mb-4 ml-8 text-rose-500">
                        <span className="text-rose-500 text-2xl leading-none">
                          *
                        </span>
                        Add Brand First To Add Catalog Data
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showCatalogModal && (
        <Formik
          enableReinitialize={true}
          initialValues={{
            id: editCatalogData.id || 0,
            brandId: brandId,
            displayOrder: editCatalogData.displayOrder || 0,
            catalogFileName: editCatalogData.catalogFileName || "",
            rowVersion: editCatalogData.rowVersion || null,
            catalogFile: editCatalogData.catalogFile || "",
            catalogLogo: editCatalogData.catalogLogo || "",
            recStatus: editCatalogData.recStatus || RecStatusValuebyName.Active,
          }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ setFieldValue, errors, values }) => {
            let catalogFileUrl = values.catalogFile.split('/')
            return (
              <FormikForm>
                <div
                  id="ManageLocationModal"
                  className={`overflow-y-auto overflow-x-hidden fixed inset-0 z-40 justify-center items-center h-modal max-h-screen`}
                >
                  <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="relative px-4 w-full max-w-2xl h-full md:h-auto">
                      <div className="relative bg-white rounded-lg shadow  max-h-screen overflow-y-auto">
                        <div className="flex justify-between items-start p-5 rounded-t border-b  sticky top-0 left-0 bg-white">
                          <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl ">
                            {catalogId ? "Edit Catalog" : "Add Catalog"}
                          </h3>
                          <button
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
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
                              Display Order :
                            </label>
                            <Input
                              type="text"
                              name={"displayOrder"}
                              onKeyPress={(event) => {
                                if (!/^\d*\.?\d*$/.test(event.key)) {
                                  event.preventDefault();
                                }
                              }}
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
                              name="catalogFileName"
                              placeholder="Catalog Name"
                            />
                          </div>

                          <div className="mb-4">
                            <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                              Catalog Logo
                              <span className="text-rose-500 text-2xl leading-none">
                                *
                              </span>
                              :
                            </label>
                            <ImageFile
                              type="file"
                              className="sr-only"
                              name="catalogLogo"
                              id="catalogLogo"
                              buttonName="Add"
                              onChange={(value) => {
                                setFieldValue("catalogLogo", value);
                              }}
                              folderpath={`${FolderPath}`}
                              url={values.catalogLogo}
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
                              name="catalogFile"
                              filePath={'files'}
                              value={catalogFileUrl ? catalogFileUrl[catalogFileUrl.length - 1] : ""}
                              onChange={(imgUrl) => {
                                setFieldValue("catalogFile", imgUrl);
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200 ">
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
                            type="submit"
                            className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                          >
                            Save
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
      )}
      <ConfirmDelete
        handleDelete={deleteCatalog}
        data={catalog}
        module={"Catalog"}
        title={"Delete"}
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
      />
    </>
  );
};

export default React.memo(Catalog);
