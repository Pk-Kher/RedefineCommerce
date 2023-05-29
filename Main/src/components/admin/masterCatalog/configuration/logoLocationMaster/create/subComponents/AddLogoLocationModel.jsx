import React, { useEffect, useState, useCallback } from "react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import { blobFolder, RecStatusValuebyName } from "global/Enum";
import Input from "components/common/formComponent/Input";
import LogoLocationServices from "services/admin/logolocation/LogoLocationService";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { ValidationMsgs } from "global/ValidationMessages";
import { useDispatch, useSelector } from "react-redux";
import ImageFile from "components/common/formComponent/ImageFile";
import ToggleButton from "components/common/formComponent/ToggleButton";
import { serverError } from "services/common/helper/Helper";
import BrandsList from "./BrandsList";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const AddLogoLocationModel = ({
  handleShowAddlogoLocation,
  logoLocationDetailsId,
  logoLocationId,
  fetchLogolocationDetails,
  CreateAndUpdateLogoLocationBrandField,
  setOldBrands,
  OldBrands,
}) => {
  const permission = useSelector(store => store.permission);
  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);
  const CompanyId = useSelector((store) => store?.CompanyConfiguration.id)
  const FolderPath = `/${blobFolder.temp}/${CompanyId}/${blobFolder.logoLocation}${!logoLocationId ? "/0" : `/${logoLocationId}`}/Details`
  const [data, setData] = useState(null);
  const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

  useEffect(() => {
    if (logoLocationDetailsId) {
      dispatch(setAddLoading(true))

      LogoLocationServices.getLogoLocationDetailsByID(logoLocationDetailsId)
        .then((res) => {
          var response = res.data;
          if (response.success) {
            setData({ ...response.data });
            setOldBrands(response.data.brands);
          }
          dispatch(setAddLoading(false))

        })
        .catch((err) => {
          console.log("error while fetching particular vendor", err);
          dispatch(setAddLoading(false))
        });
    }
  }, [logoLocationDetailsId]);

  const CreateLogoLocationDetails = (fields, resetForm) => {
    dispatch(setAddLoading(true))

    LogoLocationServices.createLogoLocationDetails({
      ...fields,
      ...location,
    })
      .then((response) => {
        if (response.data.success) {
          handleShowAddlogoLocation();
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.logoLocationDetails.logoLocationDetailsCreated,
            })
          );
          CreateAndUpdateLogoLocationBrandField({ ...fields, logoLocationDetailsId: response.data.data.id }, resetForm, OldBrands)
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
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.logoLocationDetails.logoLocationDetailsNotCreated,
          })
        );
        dispatch(setAddLoading(false))
      });
  };

  const UpdateLogoLocationDetails = (fields, resetForm) => {
    dispatch(setAddLoading(true))

    const { brandId, ...restFields } = fields
    LogoLocationServices.updateLogoLocationDetails({
      ...restFields,
      ...location,
    })
      .then((response) => {
        if (response.data.success) {
          handleShowAddlogoLocation();
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.logoLocationDetails.logoLocationDetailsUpdated,
            })
          );
          CreateAndUpdateLogoLocationBrandField(fields, resetForm, OldBrands)
          fetchLogolocationDetails()
          // setGlobalLoading(false);
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
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.logoLocationDetails.logoLocationDetailsNotUpdated,
          })
        );
        dispatch(setAddLoading(false))
      });
  };

  const onSubmit = (fields, { resetForm }) => {

    if (logoLocationDetailsId) {
      fields.recStatus = "A";

      UpdateLogoLocationDetails(fields, resetForm);
    } else {
      CreateLogoLocationDetails(fields, resetForm);
    }
  };

  const initialValues = {
    id: data?.id || 0,
    name: data?.name || "",
    imageUrl: data?.imageUrl || "",
    threeDImageURL: data?.threeDImageURL || "",
    threeDLogoLocationClass: data?.threeDLogoLocationClass || "",
    price: data?.price || 0,
    cost: data?.cost || 0,
    logoLocationId: logoLocationId || 0,
    brandId: data?.brands || [],
    recStatus: data?.recStatus || RecStatusValuebyName.Active,
    rowVersion: data?.rowVersion || null,
    brandGuidelines: data?.brandGuidelines || false
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(
      ValidationMsgs.logoLocationDetails.nameRequired
    ),
    imageUrl: Yup.string().required(
      ValidationMsgs.logoLocationDetails.imageUrlRequired
    ),
    price: Yup.number().typeError(ValidationMsgs.logoLocationDetails.priceMatches)
      .required(ValidationMsgs.logoLocationDetails.priceRequired).min(0, ValidationMsgs.logoLocationDetails.priceMin),
    cost: Yup.number().typeError(ValidationMsgs.logoLocationDetails.costMatches)
      .required(ValidationMsgs.logoLocationDetails.costRequired)
      .min(0, ValidationMsgs.logoLocationDetails.costMin),
  });

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue, errors, values, resetForm }) => {
          return (
            <FormikForm>
              <div
                id="addLogolocationModal"
                aria-hidden="true"
                className="overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-4 z-30 justify-center items-center h-modal md:h-full md:inset-0"
              >
                <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="relative px-4 w-full max-w-2xl h-full md:h-auto">
                    <div className="relative bg-white rounded-lg shadow max-h-screen overflow-y-auto">
                      <div className="flex justify-between items-start p-5 rounded-t border-b sticky top-0 left-0 bg-white">
                        <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl">
                          Add Logo Location Detail
                        </h3>
                        <button
                          type="button"
                          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                          data-modal-toggle="addLogolocationModal"
                          onClick={handleShowAddlogoLocation}
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
                        <div className="grid grid-cols-12 gap-6">
                          <div className="col-span-full xl:col-span-6">
                            <div>
                              <label
                                className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                                htmlFor="somename"
                              >
                                Enter Logo Location Name
                                <span className="text-rose-500 text-lg leading-none">
                                  *
                                </span>
                              </label>
                              <Input type="text" name="name" maxLength={60} />
                            </div>
                          </div>
                          <div className="col-span-full xl:col-span-6">
                            <div>
                              <label
                                className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                                htmlFor="somename"
                              >
                                3D Logo Location Class
                              </label>
                              <Input
                                type="text"
                                maxLength={100}
                                name="threeDLogoLocationClass"
                              />
                            </div>
                          </div>
                          <div className="col-span-full xl:col-span-6">
                            <div>
                              <label
                                className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                                htmlFor="imageUrl"
                              >
                                Location Image
                                <span className="text-rose-500 text-lg leading-none">
                                  *
                                </span>
                              </label>

                              <div>
                                <ImageFile
                                  id="imageUrl"
                                  type={`file`}
                                  folderpath={`${FolderPath}`}
                                  className="sr-only"
                                  buttonName="Add"
                                  name={`imageUrl`}
                                  onChange={(value) =>
                                    setFieldValue("imageUrl", value)
                                  }
                                  url={values.imageUrl}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-span-full xl:col-span-6">
                            <div>
                              <label
                                className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                                htmlFor="threeDImageURL"
                              >
                                3D Image
                              </label>

                              <div>
                                <ImageFile
                                  id="threeDImageURL"
                                  type={`file`}
                                  folderpath={`${FolderPath}`}
                                  className="sr-only"
                                  buttonName="Add"
                                  name={`threeDImageURL`}
                                  onChange={(value) =>
                                    setFieldValue("threeDImageURL", value)
                                  }
                                  url={values.threeDImageURL}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-span-full xl:col-span-6">
                            <div>
                              <label
                                className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                                htmlFor="somename"
                              >
                                Price
                                <span className="text-rose-500 text-lg leading-none">
                                  *
                                </span>
                              </label>
                              <Input
                                type="number"
                                name="price"
                                onKeyPress={(event) => {
                                  if (!/^\d*\.?\d*$/.test(event.key)) {
                                    event.preventDefault();
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-span-full xl:col-span-6">
                            <div>
                              <label
                                className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                                htmlFor="somename"
                              >
                                Cost
                                <span className="text-rose-500 text-lg leading-none">
                                  *
                                </span>
                              </label>
                              <Input
                                type="number"
                                name="cost"
                                onKeyPress={(event) => {
                                  if (!/^\d*\.?\d*$/.test(event.key)) {
                                    event.preventDefault();
                                  }
                                }}
                              />
                            </div>
                          </div>

                          <div className="col-span-full xl:col-span-6">
                            <div className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                              Following Brand Guidelines
                            </div>
                            <div
                              className="flex items-center"
                              x-data="{ checked: true }"
                            >
                              <ToggleButton
                                id="followingBrand"
                                onChange={(e) => setFieldValue('brandGuidelines', e.target.checked)}
                                defaultValue={values.brandGuidelines}
                                name="followingBrand"
                                on="Yes"
                                off="No"
                              />
                            </div>
                          </div>

                          <div className="col-span-full">
                            <label
                              className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                              htmlFor="somename"
                            >
                              Brand Logo Location{" "}
                            </label>
                            <BrandsList logoLocationDetailsId={logoLocationDetailsId} />
                          </div>
                        </div>
                      </div>
                      {(permission?.isEdit || permission.isDelete || true) && <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200">
                        <button
                          data-modal-toggle="addLogolocationModal"
                          type="button"
                          className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
                          onClick={handleShowAddlogoLocation}
                        >
                          Cancel
                        </button>
                        <button
                          data-modal-toggle="addLogolocationModal"
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
                      </div>}
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

export default AddLogoLocationModel;
