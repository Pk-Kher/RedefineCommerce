/*Component Name: Third Party Services create
Component Functional Details: Here we are creating Third Party Services create data .
Created By: Divyesh 
Created Date: 03/01/2023
Modified By:
Modified Date: */

import React, { useState, useCallback, useEffect } from "react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import DropDownComponent from "components/common/formComponent/Dropdown";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import Input from "components/common/formComponent/Input";
import Messages from "components/common/alerts/messages/Index";
import CKEditor from "components/common/formComponent/CKEditor";
import { RecStatusValueForForm, RecStatusValuebyName } from "global/Enum";
import { ValidationMsgs } from "global/ValidationMessages";
import { useDispatch, useSelector } from "react-redux";
import { serverError } from "services/common/helper/Helper";
import ThirdPartyServices from "services/admin/thirdPartyServices/ThirdPartyServices";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import DropdownService from "services/common/dropdown/DropdownService";

const Create = () => {
  const permission = useSelector(store => store.permission);
  const compName = "ThirdPartyServices";
  let navigate = useNavigate();
  const { id } = useParams();
  const isAddMode = !id;
  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);
  const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);
  const [StoreData, setStoreData] = useState();
  const [ThirdPartyData, setThirdPartyData] = useState();


  const [data, setData] = useState({});

  const HandleCancel = () => {
    navigate("admin/configurator/thirdPartyServices");
  };

  const getStoreNameDropdownData = useCallback(() => {
    DropdownService.getDropdownValues(
      "store").then((res) => {
        if (res.data.success) {
          setStoreData(() => {
            return res.data.data;
          });
        }
      });
  }, []);

  const getThirdPartyDropdownData = useCallback(() => {
    DropdownService.getDropdownValues(
      "thirdpartyservice").then((res) => {
        if (res.data.success) {
          setThirdPartyData(() => {
            return res.data.data;
          });
        }
      });
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string().required(ValidationMsgs.thirdPartyService.nameRequired),
    thirdPartyServiceId: Yup.string().required(ValidationMsgs.thirdPartyService.thirdPartyServiceDropdown),
    storeId: Yup.string().required(ValidationMsgs.thirdPartyService.storeName),

  });

  const getThirdPartyServicesById = useCallback(() => {
    if (id) {
      dispatch(setAddLoading(true))

      ThirdPartyServices.getThirdPartyServicesById(id)
        .then((res) => {
          var response = res.data;
          if (response.success) {
            setData(response.data);
          }
          dispatch(setAddLoading(false))
        })
        .catch((err) => {
          dispatch(setAddLoading(false))
        });
    }
  }, [id]);

  useEffect(() => {
    getThirdPartyServicesById();
    getStoreNameDropdownData();
    getThirdPartyDropdownData();
  }, [getStoreNameDropdownData, getThirdPartyDropdownData])

  const createThirdPartyServices = (values, resetForm) => {
    dispatch(setAddLoading(true))

    ThirdPartyServices.createThirdPartyServices({ thirdPartyCredentialsModel: { ...values, ...location } })
      .then((response) => {
        if (response.data.success/*  && response.data.data */) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.thirdPartyService.thirdPartyCreated,
            })
          );
          dispatch(setAddLoading(false));
          return navigate(
            "/admin/configurator/thirdPartyServices/edit/" +
            response.data.data.id
          );
          // getThirdPartyServicesById();
          // resetForm({});
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
        }
        dispatch(setAddLoading(false));
      })
      .catch((errors) => {
        dispatch(setAlertMessage({ type: "danger", message: ValidationMsgs.thirdPartyService.thirdPartyNotCreated }));
        dispatch(setAddLoading(false));

      });
  };

  const updateThirdPartyServices = (values, resetForm) => {
    dispatch(setAddLoading(true))

    ThirdPartyServices.updateThirdPartyServices({ thirdPartyCredentialsModel: { ...values, ...location } })
      .then((response) => {
        if (response.data.success/*  && response.data.data */) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.thirdPartyService.thirdPartyUpdated,
            })
          );
          getThirdPartyServicesById();
          resetForm();
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
        }
        dispatch(setAddLoading(false))

      })
      .catch((errors) => {
        dispatch(setAlertMessage({ type: "danger", message: ValidationMsgs.thirdPartyService.thirdPartyNotUpdated }));
        dispatch(setAddLoading(false))

      });
  };


  const onSubmit = (fields, { resetForm }) => {
    if (isAddMode) {
      createThirdPartyServices(fields, resetForm);
    } else {
      updateThirdPartyServices(fields, resetForm);
    }
  };

  return (
    <>
      <title>{isAddMode === true ? "Add Third Party Services" : "Edit Third Party Services"}</title>

      <Formik
        enableReinitialize={true}
        initialValues={{
          id: data.id || 0,
          name: data?.name || "",
          thirdPartyServiceId: data?.thirdPartyServiceId || "",
          storeId: data?.storeId || "",
          url: data?.url || "",
          username: data?.username || "",
          password: data?.password || "",
          key: data?.key || "",
          secretkey: data?.secretkey || "",
          password: data?.password || "",
          redirectUrlToSite: data?.redirectUrlToSite || "",
          thankYouPageUrl: data?.thankYouPageUrl || "",
          certificate: data?.certificate || "",
          recStatus: data?.recStatus || RecStatusValuebyName.Active,
          description: data?.description || "",
          rowVersion: data?.rowVersion || null,
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        validateOnMount={true}
      >
        {({ setFieldValue, errors, values }) => {
          return (
            <main className="responsive">
              <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Page header */}
                <FormikForm>
                  <div className="flex mb-8 justify-between">
                    <div className="flex items-center">
                      <Link
                        to="/admin/configurator/thirdPartyServices"
                        className="btn border-neutral-200 hover:border-neutral-400 text-gray-500 hover:text-gray-700 flex items-center mr-2"
                      >
                        <span className="material-icons-outlined">west</span>
                      </Link>

                      <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
                        {isAddMode === true ? "Add Third Party Services" : "Edit Third Party Services"}
                      </h1>
                    </div>
                    {(permission?.isEdit || permission?.isDelete) && <div className="flex flex-wrap space-x-2">
                      <NavLink
                        to={"/admin/configurator/thirdPartyServices"}
                        className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </NavLink>
                      <button
                        disabled={GlobalLoading}
                        className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(GlobalLoading) ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}
                        type="submit"
                        onClick={() => {
                          dispatch(setAlertMessage({ type: "danger", message: serverError({ data: { errors: errors } }) }));
                        }}
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

                  <Messages />

                  <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-full xl:col-span-9">

                      <div className="w-full grid grid-cols-2 gap-6 bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                        <div className="w-full last:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                            >
                            Name
                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </label>
                          <Input type="text" name="name" maxLength={60} />
                        </div>
                        <div className="w-full last:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            Third Party Services
                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </label>
                          <DropDownComponent
                            label="Third Party Service Dropdown"
                            options={ThirdPartyData}
                            isMulti={false}
                            name={"thirdPartyServiceId"}
                            className="bg-white border hover:border-neutral-300"
                            defaultValue={values.thirdPartyServiceId}
                          />
                        </div>
                        <div className="w-full last:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            Store Name
                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </label>
                          <DropDownComponent
                            label="Store Name"
                            options={StoreData}
                            isMulti={false}
                            name={"storeId"}
                            className="bg-white border hover:border-neutral-300"
                            defaultValue={values.storeId}
                          />
                        </div>
                        <div className="w-full last:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            URL
                          </label>
                          <Input
                            type="text"
                            name="url"
                            maxLength={2048}
                          />
                        </div>
                        <div className="w-full last:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            User Name
                          </label>
                          <Input
                            type="text"
                            name="username"
                            maxLength={30}
                          />
                        </div>
                        <div className="w-full last:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            Password
                          </label>

                          <Input
                            type="password"
                            name="password"
                            maxLength={127}
                          />
                        </div>
                        <div className="w-full last:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            Key
                          </label>

                          <Input
                            type="text"
                            name="key"
                            maxLength={255}
                          />
                        </div>
                        <div className="w-full last:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            Secret Key
                          </label>

                          <Input
                            type="text"
                            name="secretkey"
                            maxLength={255}
                          />
                        </div>
                        <div className="w-full last:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            Redirect URL To Site
                          </label>

                          <Input
                            type="text"
                            name="redirectUrlToSite"
                            maxLength={2048}
                          />
                        </div>
                        <div className="w-full last:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            Thank You Page URL
                          </label>

                          <Input
                            type="text"
                            name="thankYouPageUrl"
                            maxLength={260}
                          />
                        </div>
                        <div className="w-full last:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            Certificate
                          </label>

                          <Input
                            type="text"
                            name="certificate"
                          />
                        </div>
                      </div>

                      <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                        <div className="w-full mb-6 last:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            Description
                          </label>
                          <CKEditor
                            type="simple"
                            name={"description"}
                            id="description"
                            maxLength={350}
                            defaultValue={values.description}
                            loading={data.description || ""}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col col-span-full xl:col-span-3">
                      <div className="w-full bg-white shadow-xxl rounded-md">
                        <div className="border-b-2 border-neutral-200 p-6">
                          <div
                            className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2">
                            Status
                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </div>

                          <DropDownComponent
                            label="Status"
                            options={RecStatusValueForForm}
                            isMulti={false}
                            name={"recStatus"}
                            className="bg-white border hover:border-neutral-300"
                            defaultValue={values.recStatus}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </FormikForm>
              </div>
            </main>
          );
        }}
      </Formik >
    </>
  );
};

export default Create;