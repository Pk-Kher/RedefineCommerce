import React, { useState } from "react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { useDispatch, useSelector } from "react-redux";
import DataPicker from "components/common/formComponent/DatePicker";
import Input from "components/common/formComponent/Input";

import CatalogServices from "services/admin/catalog/CatalogService";
import FileComponent from "components/common/formComponent/File";
import { RecStatusValuebyName, blobFolder } from "global/Enum";
import { useEffect } from "react";
import { ValidationMsgs } from "global/ValidationMessages";
import { serverError } from "services/common/helper/Helper";
import { useCallback } from "react";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const AddCatalogModal = ({
  catalogId,
  handleShowModel,
  vendorId,
  setShowMessage,
  setrefresh,
  id,
}) => {
  const compName = "Catalog";
  const [data, setData] = useState(null);
  const dispatch = useDispatch();
  const CompanyId = useSelector((store) => store?.CompanyConfiguration.id)
  const FolderPath = `${blobFolder.temp}/${CompanyId}/${blobFolder.vendor}${!id ? "/0" : `/${id}`}/catalog`
  const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

  useEffect(() => {
    if (catalogId) {
      getCataLogById();
    }
  }, [catalogId]);

  const initialValues = {
    catalogName: data?.catalogName || "",
    startDate: data?.startDate || "",
    endDate: data?.endDate || "",
    releasedDate: data?.releasedDate || "",
    id: catalogId || 0,
    displayInFront: data?.displayInFront || true,
    uploadCatalogURL: data?.uploadCatalogURL || "",
    uploadCatalogName: data?.uploadCatalogName || "",
    vendorId: vendorId || 0,
    isBrand: data?.isBrand || false,
    recStatus: data?.recStatus || RecStatusValuebyName.Active,
    rowVersion: data?.rowVersion || "",
  };

  const validationSchema = Yup.object({
    catalogName: Yup.string().required(
      ValidationMsgs.catalog.catalogNameRequired
    ),
    startDate: Yup.date().required(ValidationMsgs.catalog.startDate),
    endDate: Yup.date().required(ValidationMsgs.catalog.endDate).when("startDate",
      (startDate, yup) => startDate && yup.min(startDate, ValidationMsgs.catalog.endDateGreaterStart)),

    releasedDate: Yup.date().required(ValidationMsgs.catalog.releaseDate).when("endDate",
      (endDate, yup) => endDate && yup.min(endDate, ValidationMsgs.catalog.releaseDateGreaterEnd)),
    uploadCatalogURL: Yup.string().required(
      ValidationMsgs.catalog.uploadCatalogURLRequired
    ),
  });

  const CreateCatalog = (fields, resetForm) => {
    dispatch(setAddLoading(true))
    CatalogServices.createCatalog({ ...fields })
      .then((response) => {
        if (response.data.success) {
          // setisDesabledAddCatalog(response.data.data.id);
          handleShowModel();
          setrefresh(Math.random());
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.catalog.catalogCreated,
            })
          );
          // setGlobalLoading(false);
          resetForm({});
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
          // setGlobalLoading(false);
        }
        dispatch(setAddLoading(false))

      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.catalog.catalogNotCreated,
          })
        );
        dispatch(setAddLoading(false))

      });
  };

  const UpdateCatalog = (fields, resetForm) => {
    dispatch(setAddLoading(true))

    CatalogServices.updateCatalog({ ...fields })
      .then((response) => {
        if (response.data.success) {
          handleShowModel();
          setrefresh(Math.random());
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.catalog.catalogUpdated,
            })
          );
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
            type: "danger",
            message: ValidationMsgs.catalog.catalogNotUpdated,
          })
        );
        dispatch(setAddLoading(false))

      });
  };

  const getCataLogById = useCallback(() => {
    dispatch(setAddLoading(true))

    CatalogServices.getCatalogById(catalogId)
      .then((res) => {
        var response = res.data;
        if (response.success) {
          setData({ ...response.data });
        }
        dispatch(setAddLoading(false))
      })
      .catch((err) => {
        console.log("error while fetching particular vendor", err);
        dispatch(setAddLoading(false))

      });
  }, [])

  const onSubmit = (fields, { resetForm }) => {
    // setCatalogData(oldArrayOfCatalog);
    if (catalogId) {
      UpdateCatalog(fields, resetForm);
    } else {
      CreateCatalog(fields, resetForm);
    }

    handleShowModel();
    // resetForm();
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue, errors, values }) => {

          let catalogFileUrl = values.uploadCatalogURL.split('/')

          return (
            <FormikForm>
              <div
                id="ManageLocationModal"
                className=" overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center h-modal max-h-screen"
              >
                <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="relative w-full max-w-2xl">
                    <div className="relative bg-white rounded-lg shadow ">
                      <div className="flex justify-between items-start p-5 rounded-t border-b  sticky top-0 left-0 bg-white">
                        <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl ">
                          Add Catalog
                        </h3>
                        <button
                          type="button"
                          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
                          data-modal-toggle="managestoreModal"
                          onClick={handleShowModel}
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
                      <div className="p-6">
                        <div className="mb-2">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            Catalog Name
                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </label>
                          <Input
                            name="catalogName"
                            maxLength={50}
                          />
                        </div>

                        <div className="mb-4">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            Start Date
                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
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
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            End Date
                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </label>
                          <DataPicker
                            name={"endDate"}
                            defaultValue={values.endDate}
                            minDate={new Date(values.startDate)}
                            className={
                              "w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md"
                            }
                          />
                        </div>

                        <div className="mb-4">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"

                          >
                            Release Date
                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </label>

                          <DataPicker
                            name={"releasedDate"}
                            defaultValue={values.releasedDate}
                            minDate={new Date(values.endDate)}
                            className={"w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md"}
                          />
                        </div>

                        <div className="mb-4">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            Upload Catalog
                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </label>

                          <FileComponent
                            type="file"
                            className="w-full px-2 py-1 text-sm leading-7 bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md"
                            folderpath={`${FolderPath}`}
                            filePath="files"
                            isChangeDefaultName={true}
                            name="uploadCatalogURL"
                            value={catalogFileUrl ? catalogFileUrl[catalogFileUrl.length - 1] : ""}
                            onChange={(fileUrl) => {
                              fileUrl = fileUrl.replaceAll(process.env.REACT_APP_API_BLOB, "")
                              setFieldValue("uploadCatalogURL", fileUrl);
                            }}
                          />
                        </div>
                        <div className="mb-2">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            Catalog File Name
                          </label>
                          <Input
                            name="uploadCatalogName"
                            maxLength={50}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200 ">
                        <button
                          data-modal-toggle="ManageLocationModal"
                          type="button"
                          // disabled={!values.uploadCatalogURL}
                          className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
                          onClick={handleShowModel}
                        >
                          Cancel
                        </button>
                        <button
                          data-modal-toggle="ManageLocationModal"
                          disabled={GlobalLoading}
                          type="submit"
                          // disabled={!values.uploadCatalogURL}
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
    </>
  );
};

export default AddCatalogModal;
