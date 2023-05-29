import React, { useState, useCallback, useEffect } from "react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import CKEditorFour from "components/common/formComponent/CKEditor";

import DropDownComponent from "components/common/formComponent/Dropdown";
import { Link, useNavigate, useParams } from "react-router-dom";
import Messages from "components/common/alerts/messages/Index";
import LogoLocationDetails from "./subComponents/LogoLocationDetails";
import LogoLocationServices from "services/admin/logolocation/LogoLocationService";
import LogoLocationModel from "./subComponents/AddLogoLocationModel";
// import { ErrorMessage, useFormikContext } from "formik";
import { RecStatusValue, RecStatusValuebyName } from "global/Enum";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { ValidationMsgs } from "global/ValidationMessages";
import { serverError } from "services/common/helper/Helper";
import { useDispatch, useSelector } from "react-redux";
import CategoryService from "services/admin/category/CategoryService";
import CreateFileHeader from "components/common/CreateFileHeader";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const Create = () => {
  const permission = useSelector(store => store.permission);
  let navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);
  const isAddMode = !id;
  const [data, setData] = useState({});
  const [CategoryData, setCategoryData] = useState([]);
  const [OldBrands, setOldBrands] = useState([]);

  const [isDisabledAddLogoLocation, setisDisabledAddLogoLocation] =
    useState("");

  const [openAddlogoLocationModal, setopenAddlogoLocationModal] = useState({
    show: false,
    data: null,
  });

  const [LogoLocationsDetails, setLogoLocationsDetails] = useState([]);

  useEffect(() => {
    CategoryService.getAllParentCategory()
      .then((response) => {
        setCategoryData(() => {
          return response.data.data;
        });
      })
      .catch((err) => { });
  }, []);


  const getLogoLocationData = useCallback(
    () => {
      dispatch(setAddLoading(true))

      LogoLocationServices.getLogoLocationByID(id)
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

        }, [])
    }
  )

  const fetchLogolocationDetails = useCallback(() => {
    dispatch(setAddLoading(true))

    LogoLocationServices.getLogoLocationsDetails(id, {
      pageIndex: 0,
      pageSize: 0,
      pagingStrategy: 0,
      sortingOptions: [
        {
          field: "string",
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
      .then((res) => {
        var response = res.data;

        if (response.success) {
          setLogoLocationsDetails(response?.data.items);
        }
        dispatch(setAddLoading(false))

      })
      .catch((err) => {
        console.log("error while fetching logolocation details", err);
        dispatch(setAddLoading(false))

      });

    setopenAddlogoLocationModal((prevState) => ({
      ...prevState,
      show: false,
    }));

  }, [id]);

  useEffect(() => {
    if (id) {
      getLogoLocationData()
      setisDisabledAddLogoLocation(id);
    }
  }, [id]);

  const createLogoLocation = (fields, resetForm) => {
    dispatch(setAddLoading(true))

    LogoLocationServices.createLogoLocation({ ...fields, ...location })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.logoLocationDetails.logoLocationCreated,
            })
          );
          resetForm({});
          navigate(
            `/admin/MasterCatalog/Configuration/logolocation/edit/${response.data.data.id}`
          );
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
            message: ValidationMsgs.logoLocationDetails.logoLocationNotCreated,
          })
        );
        dispatch(setAddLoading(false))

      });
  };

  const CreateAndUpdateLogoLocationBrandField = (fields, resetForm) => {
    dispatch(setAddLoading(true))

    const { browser, ...allLocation } = location

    const logolocationdetailxbrandlist = fields.brandId.map((currentBrandId) => {
      return {
        "brandId": currentBrandId,
        "status": "A"
      }
    })

    OldBrands && OldBrands.map((oldBrandId) => {
      const isFoundBrandId = logolocationdetailxbrandlist.find(currentBrandObj => currentBrandObj.brandId == oldBrandId);
      if (!isFoundBrandId) {
        logolocationdetailxbrandlist.push({
          "brandId": oldBrandId,
          "status": "R"
        })
      }
    })

    const ourFields = {
      "id": openAddlogoLocationModal?.data || fields?.logoLocationDetailsId,
      ...allLocation,
      logolocationdetailxbrandlist
    }
    // console.log(ourFields, fields);
    // return;
    LogoLocationServices.updateAndUpdateBrandField(ourFields)
      .then((response) => {
        if (response.data.success) {
          handleShowAddlogoLocation();

          // dispatch(
          //   setAlertMessage({
          //     type: "success",
          //     message: ValidationMsgs.logoLocationDetails.logoLocationBrandDetailsUpdated,
          //   })
          // );
          fetchLogolocationDetails()
          setopenAddlogoLocationModal((prevState) => ({
            ...prevState,
            show: false,
          }));
          resetForm({});
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
          dispatch(setAddLoading(false))

        }
      })
      .catch((errors) => {
        console.log("errors Brands fields not updated ", errors)
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.logoLocationDetails.logoLocationBrandDetailsNotUpdated,
          })
        );
        dispatch(setAddLoading(false))

      });
  };

  const updateLogoLocation = (fields) => {
    dispatch(setAddLoading(true))

    fields.id = Number(id);
    LogoLocationServices.updateLogoLocation({ ...fields, ...location })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.logoLocationDetails.logoLocationUpdated,
            })
          );
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
            message: ValidationMsgs.logoLocationDetails.logoLocationNotUpdated,
          })
        );
        dispatch(setAddLoading(false))
      });
  };

  const onSubmit = (fields, { resetForm }) => {
    if (isAddMode) {
      createLogoLocation(fields, resetForm);
    } else {
      updateLogoLocation(fields, resetForm);
    }
  };

  const HandleCancel = () => {
    navigate("/admin/MasterCatalog/Configuration/logolocation");
  };

  const handleShowAddlogoLocation = (data) => {
    setopenAddlogoLocationModal((prevState) => ({
      ...prevState,
      show: !prevState.show,
      data: data?.id,
    }));
  };

  const initialValues = {
    categoryId: data?.categoryId || "",
    description: data?.description || "",
    recStatus: data?.recStatus || RecStatusValuebyName.Active,
    ProductTypeId: data?.ProductTypeId || 1,
    SubProductTypeId: data?.SubProductTypeId || 1,
    rowVersion: data?.rowVersion || null,
  };

  const validationSchema = Yup.object({
    categoryId: Yup.string().required(ValidationMsgs.common.categoryIdRequired),
    recStatus: Yup.string().required(ValidationMsgs.common.recStatusRequired),
  });

  return (
    <>
      <title>
        {isAddMode === true ? "Create Logo Location" : "Edit Logo Location"}
      </title>
      <>
        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          validateOnMount={true}
        >
          {({ setFieldValue, errors, values, validateForm }) => {
            return (
              <FormikForm>
                <main className="responsive">
                  <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
                    {/* Page header */}
                    <CreateFileHeader url={"/admin/MasterCatalog/Configuration/logolocation"} module={`${isAddMode ? 'Create' : 'Edit'} Logo Location Master`} errors={errors} saveButtonName={'Save & Add Logo Location'} validateForm={validateForm} />

                    <Messages />

                    <div className="grid grid-cols-12 gap-6">
                      <div className="col-span-full xl:col-span-9">
                        <div className="w-full flex flex-wrap justify-between items-center">
                        </div>
                        <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                          <div className="block uppercase tracking-wide text-gray-500 mb-5 text-lg font-bold">
                            General Information
                          </div>
                          <div className="w-full mb-6 last:mb-0 relative">
                            <div className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                              Category
                              <span className="text-rose-500 text-2xl leading-none">
                                *
                              </span>
                            </div>

                            <DropDownComponent
                              label="categoryId"
                              options={CategoryData}
                              isMulti={false}
                              name="categoryId"
                              placeholder="Select Category"
                              className="bg-white hover:border-neutral-300"
                              defaultValue={values.categoryId}
                            />
                          </div>

                          <div className="w-full mb-6 last:mb-0 relative">
                            <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                              Description
                            </label>

                            <CKEditorFour
                              name={"description"}
                              // onChange={onChangeHandler}
                              id="description"
                              maxLength={300}
                              defaultValue={values.description}
                              loading={initialValues.description}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col col-span-full xl:col-span-3">
                        <div className="w-full bg-white shadow-xxl rounded-md p-6 mb-6">
                          <div >
                            <div className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2">
                              Logo Location Status
                            </div>
                            <DropDownComponent
                              options={RecStatusValue}
                              isMulti={false}
                              name={"recStatus"}
                              className="bg-white  hover:border-neutral-300"
                              defaultValue={values?.recStatus}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </main>
              </FormikForm>
            );
          }}
        </Formik>

        <div className="sm:px-6 lg:px-8 grid grid-cols-12 gap-6">
          <div className="col-span-full xl:col-span-9">
            <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 mb-6">
              <div className="p-6 w-full flex flex-wrap sm:auto-cols-max justify-between gap-2">
                <div className="w-full flex flex-wrap justify-between items-center mb-2">
                  <div className="block uppercase tracking-wide text-gray-500 text-lg font-bold">
                    Logo Locations
                    <span className="text-rose-500 text-2xl leading-none">
                      *
                    </span>
                  </div>
                  {(permission?.isEdit || permission?.isDelete) && <div className="inline-block">
                    <button
                      type="button"
                      title=""
                      data-modal-toggle="addcatalogModal"
                      className="btn bg-indigo-500 hover:bg-indigo-600 text-white disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-gray-500"
                      onClick={() => handleShowAddlogoLocation()}
                      disabled={!isDisabledAddLogoLocation}
                    >
                      <span className="material-icons-outlined">
                        add_circle_outline
                      </span>
                      <span className="ml-1">Add Logo Location</span>
                    </button>
                  </div>}
                </div>
              </div>


              {isAddMode === true ? (
                <div className="flex flex-wrap uppercase font-bold text-sm mb-4 ml-8 text-rose-500 ">
                  <span className="text-rose-500 text-2xl leading-none">*</span>
                  Create Logo Location First To Add Logo Location Detail Data
                </div>
              ) : (
                <LogoLocationDetails
                  handleShowAddlogoLocation={handleShowAddlogoLocation}
                  id={id}
                  getLogoLocationData={getLogoLocationData}
                  LogoLocationsDetails={LogoLocationsDetails}
                  fetchLogolocationDetails={fetchLogolocationDetails}
                  CreateAndUpdateLogoLocationBrandField={CreateAndUpdateLogoLocationBrandField}
                  setOldBrands={setOldBrands}
                  OldBrands={OldBrands}
                  setopenAddlogoLocationModal={setopenAddlogoLocationModal}
                />
              )}
            </div>

            {openAddlogoLocationModal.show && (
              <LogoLocationModel
                handleShowAddlogoLocation={handleShowAddlogoLocation}
                logoLocationDetailsId={openAddlogoLocationModal?.data}
                logoLocationId={id}
                fetchLogolocationDetails={fetchLogolocationDetails}
                LogoLocationsDetails={LogoLocationsDetails}
                CreateAndUpdateLogoLocationBrandField={CreateAndUpdateLogoLocationBrandField}
                setOldBrands={setOldBrands}
                OldBrands={OldBrands}
              />
            )}
          </div>
        </div>
      </>
    </>
  );
};

export default Create;
