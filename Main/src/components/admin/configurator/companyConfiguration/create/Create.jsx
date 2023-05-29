
/*Component Name: company configuration create
Component Functional Details: Here we are creating company configuration data .
Created By: Chandan 
Created Date: 06/09/2022 
Modified By: Chandan
Modified Date: 06/09/2022 */

import React, { useEffect, useState, Fragment, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { Form as FormikForm, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import Input from "components/common/formComponent/Input";
import Dropdown from "components/common/formComponent/Dropdown";
import Checkbox from "components/common/formComponent/Checkbox";
import ModuleService from "services/admin/module/ModuleService";
import Messages from "components/common/alerts/messages/Index";
import CompanyConfigurationService from "services/admin/companyConfiguration/CompanyConfigurationService";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { RecStatusValuebyName, blobFolder } from "global/Enum";
import { logoutTime } from "dummy/Dummy";
import { ValidationMsgs } from "global/ValidationMessages";
import ImageFile from "components/common/formComponent/ImageFile";
import CreateFileHeader from "components/common/CreateFileHeader";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { serverError } from "services/common/helper/Helper";
import { storeCompanyConfigurationData } from "redux/CompanyConfiguration/CompanyConfigurationActions";

const CompanyConfiguration = () => {
  const { id } = useParams();
  const isAddMode = !id;
  const [modules, setModules] = useState([]);
  const [data, setData] = useState({});
  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);
  const Company = useSelector((store) => store?.CompanyConfiguration)
  const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

  const FolderPath = `/${blobFolder.temp}/${Company?.id}/${blobFolder.companyConfiguration}`

  const getCompanyConfigurationData = useCallback(() => {
    if (!isAddMode) {
      dispatch(setAddLoading(true))

      CompanyConfigurationService.getCompanyConfigurationById(id)
        .then((res) => {
          var response = res.data;
          if (response.success) {
            setData({
              id: response.data.id,
              fullName: response.data.fullName,
              shortName: response.data.shortName,
              companyLogoURL: response.data.companyLogoURL,
              email: response.data.email,
              phone: response.data.phone,
              logoutTime: response.data.logoutTime,
              twoFactorEnabled: response.data.twoFactorEnabled,
              mS365Enabled: response.data.mS365Enabled,
              moduleId: response.data.moduleId,
              rowVersion: response.data.rowVersion,
              moduleData: response.data.moduleId
            });

            dispatch(setAddLoading(false))

          }
        })
        .catch((err) => { });
    }
  }, []);

  useEffect(() => {
    getCompanyConfigurationData();
  }, [getCompanyConfigurationData]);

  const initialValues = {
    companyConfigurationData: {
      id: data?.id || 0,
      fullName: data?.fullName || "",
      shortName: data?.shortName || "",
      email: data?.email || "",
      phone: data?.phone || "",
      logoutTime: data?.logoutTime || "",
      companyLogoURL: data?.companyLogoURL || "",
      twoFactorEnabled: data?.twoFactorEnabled || false,
      mS365Enabled: data?.mS365Enabled || false,
      moduleId: data?.moduleId || [],
      recStatus: data?.recStatus || RecStatusValuebyName.Active,
      rowVersion: data?.rowVersion || null,
    },
    moduleData: data.moduleData || []
  };

  useEffect(() => {
    ModuleService.getNestedModules().then((module) => {
      setModules(module.data.data);
    });
  }, []);

  function createCompanyConfiguration(fields, resetForm) {
    dispatch(setAddLoading(true))

    let companyModuleAccess = []

    fields.moduleData.map((moduleIdsData) => {
      const oldModuleDataFromBackend = modules.filter(mD => mD.id == moduleIdsData);
      companyModuleAccess.push({
        "moduleId": moduleIdsData,
        "recStatus": "A",
        ...oldModuleDataFromBackend[0]
      })
    })

    fields.companyConfigurationData["companyModuleAccess"] = companyModuleAccess

    CompanyConfigurationService.createCompanyConfiguration({
      companyConfigurationModel: { ...fields.companyConfigurationData, ...location },
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              view: true,
              message: "Company Configuration created successfully.",
              type: "success",
            })
          );
          resetForm({});
          dispatch(setAddLoading(false))

        } else {
          dispatch(
            setAlertMessage({
              view: true,
              message: serverError(response),
              type: "danger",
            })
          );
          dispatch(setAddLoading(false))
        }
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            view: true,
            message: errors.response.data.Errors.Error,
            type: "danger",
          })
        );
        dispatch(setAddLoading(false))
      });
  }

  function updateCompanyConfiguration(fields, resetForm) {
    dispatch(setAddLoading(true))

    let companyModuleAccess = []

    fields.moduleData.map((moduleIdsData) => {
      const oldModuleDataFromBackend = modules.filter(mD => mD.id == moduleIdsData);

      companyModuleAccess.push({
        "moduleId": moduleIdsData,
        "recStatus": "A",
        ...oldModuleDataFromBackend[0]
      })
    })

    fields.companyConfigurationData["companyModuleAccess"] = companyModuleAccess

    CompanyConfigurationService.updateCompanyConfiguration({
      companyConfigurationModel: {
        ...fields.companyConfigurationData
        , ...location
      },
    })
      .then((response) => {
        if (response.data.success && response.data.data) {
          dispatch(
            setAlertMessage({
              view: true,
              message: "Company Configuration is updated .",
              type: "success",
            })
          );
          if (response?.data?.data?.id === Company?.id) {
            dispatch(storeCompanyConfigurationData({ ...Company, ...response.data.data }));
          }
          getCompanyConfigurationData();
        } else {
          dispatch(
            setAlertMessage({
              view: true,
              type: "danger",
              message: `Company is not updated`,
            })
          );
          dispatch(setAddLoading(false))

        }
      })
      .catch((errors) => {
        console.log("errors ", errors)
        dispatch(
          setAlertMessage({
            view: true,
            type: "danger",
            message: `Company is not updated`,
          })
        );
        dispatch(setAddLoading(false))

      });
  }

  const submitHandler = (fields, { resetForm }) => {
    if (isAddMode) {
      createCompanyConfiguration(fields, resetForm);
    } else {
      updateCompanyConfiguration(fields, resetForm);
    }
  };

  const schema = Yup.object()
    .shape({
      companyConfigurationData: Yup.object()
        .shape({
          fullName: Yup.string().required(
            ValidationMsgs.companyConfiguration.fullNameRequired
          ),
          shortName: Yup.string().required(
            ValidationMsgs.companyConfiguration.shortNameRequired
          ),
          companyLogoURL: Yup.string().required(
            ValidationMsgs.companyConfiguration.logoRequired
          ),
          email: Yup.string()
            .email(ValidationMsgs.companyConfiguration.email)
            .required(ValidationMsgs.companyConfiguration.emailRequired),
          phone: Yup.string()
            .required(ValidationMsgs.common.phoneRequired)
            .matches(
              /^(\+\d{1,3}[- ]?)?\d{10}$/,
              ValidationMsgs.common.phoneMatches
            ),
          logoutTime: Yup.string().required(
            ValidationMsgs.companyConfiguration.logoutTimeRequired
          ),
          twoFactorEnabled: Yup.boolean(),
          mS365Enabled: Yup.boolean(),
        })
    })
    .test("myCustomTest", null, (obj) => {
      if (obj.companyConfigurationData.twoFactorEnabled || obj.companyConfigurationData.mS365Enabled) {
        return true; // everything is fine
      }

      return new Yup.ValidationError(
        ValidationMsgs.companyConfiguration.loginType,
        null,
        "myCustomFieldName"
      );
    });

  return (
    <>
      <title>
        {isAddMode === true
          ? "Add Company Configurator"
          : "Edit Company Configurator"}
      </title>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={submitHandler}
        validationSchema={schema}
        validateOnMount={true}
      >
        {({ errors, touched, setFieldValue, values, validateForm }) => {
          return (
            <FormikForm>
              <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
                <CreateFileHeader url="/admin/configurator/companyConfiguration" module={isAddMode ? "Add Company Configurator" : "Edit Company Configurator"} validateForm={validateForm} />
                <Messages />
                <div className="bg-white shadow-lg rounded-md mb-8">
                  <section className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="w-full mb-6 last:mb-0">
                        <label
                          className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                          htmlFor="full_name"
                        >
                          {"Full Name"}
                          <span className="text-rose-500 text-2xl leading-none">
                            {"*"}
                          </span>
                        </label>
                        <div>
                          <Input type={"text"} name="companyConfigurationData.fullName" id="full_name" />
                        </div>
                      </div>
                      <div className="w-full mb-6 last:mb-0">
                        <label
                          className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                          htmlFor=""
                        >
                          {"Short Name"}
                          <span className="text-rose-500 text-2xl leading-none">
                            {"*"}
                          </span>
                        </label>
                        <div>
                          <Input
                            type={"text"}
                            name={"companyConfigurationData.shortName"}
                            id={"short_name"}
                          />
                        </div>
                      </div>
                      <div className="w-full mb-6 last:mb-0">
                        <label
                          className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                          htmlFor=""
                        >
                          {"Email"}
                          <span className="text-rose-500 text-2xl leading-none">
                            {"*"}
                          </span>
                        </label>
                        <div>
                          <Input type={"email"} name={"companyConfigurationData.email"} id={"email"} />
                        </div>
                      </div>
                      <div className="w-full mb-6 last:mb-0">
                        <label
                          className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                          htmlFor=""
                        >
                          {"Phone"}
                          <span className="text-rose-500 text-2xl leading-none">
                            {"*"}
                          </span>
                        </label>
                        <div>
                          <Input type={"text"} name={"companyConfigurationData.phone"} id={"phone"} />
                        </div>
                      </div>
                      <div className="w-full">
                        <label
                          className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                          htmlFor="business-id"
                        >
                          {"Company Logo"}
                          <span className="text-rose-500 text-2xl leading-none">
                            {"*"}
                          </span>
                        </label>
                        <div className="flex flex-wrap gap-6">
                          <div className="grow">
                            <ImageFile
                              id="companyConfigurationData.companyLogoURL"
                              type={`file`}
                              folderpath={`${FolderPath}`}
                              className="sr-only"
                              buttonName="Add"
                              name={`companyConfigurationData.companyLogoURL`}
                              onChange={(value) =>
                                setFieldValue("companyConfigurationData.companyLogoURL", value)
                              }
                              url={values.companyConfigurationData.companyLogoURL}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="w-full mb-6 last:mb-0">
                        <label
                          className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                          htmlFor=""
                        >
                          Logout Time
                          <span className="text-rose-500 text-2xl leading-none">
                            *
                          </span>
                        </label>
                        <div>
                          <Dropdown
                            label={`Logout Time`}
                            name={`companyConfigurationData.logoutTime`}
                            options={logoutTime}
                            defaultValue={values.companyConfigurationData.logoutTime}
                          />
                        </div>
                      </div>
                      <div className={"w-full mb-6 last:mb-0"}>
                        <label
                          className={
                            "block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                          }
                          htmlFor=""
                        >
                          Login Type
                          <span
                            className={"text-rose-500 text-2xl leading-none"}
                          >
                            *
                          </span>
                        </label>
                        <div className={"flex flex-wrap gap-4"}>
                          <label className={"flex items-center"}>
                            <Checkbox
                              name={"companyConfigurationData.twoFactorEnabled"}
                              onChange={(e) => {
                                setFieldValue(
                                  `companyConfigurationData.twoFactorEnabled`,
                                  e.target.checked
                                );
                              }}
                              checked={values.companyConfigurationData.twoFactorEnabled}
                              // value={values.companyConfigurationData.twoFactorEnabled}
                              className={"form-checkbox"}
                            />
                            <span className={"text-sm font-medium "}>
                              {"Default"}
                            </span>
                          </label>

                          <label className={"flex items-center"}>
                            <Checkbox
                              name={"companyConfigurationData.mS365Enabled"}
                              onChange={(e) => {
                                setFieldValue(`companyConfigurationData.mS365Enabled`, e.target.checked);
                              }}
                              checked={values.companyConfigurationData.mS365Enabled}
                              // value={values.companyConfigurationData.mS365Enabled}
                              className={"form-checkbox ml-2"}
                            />
                            <span className={"text-sm font-medium"}>
                              {"Microsoft 365"}
                            </span>
                          </label>
                        </div>
                        {!values.companyConfigurationData?.mS365Enabled &&
                          !values.companyConfigurationData?.twoFactorEnabled &&
                          touched?.companyConfigurationData?.mS365Enabled &&
                          touched?.companyConfigurationData?.twoFactorEnabled && (
                            <span className={"text-red-500"}>
                              {ValidationMsgs.companyConfiguration.loginType}
                            </span>
                          )}
                      </div>
                    </div>
                  </section>
                </div>
                <div className={"bg-white shadow-lg rounded-md mb-8"}>
                  <section className={"p-6 space-y-6"}>
                    <div>
                      <div className={"mb-6 last:mb-0"}>
                        <div
                          className={
                            "block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                          }
                        >
                          {" Module Rights"}
                        </div>
                        <div className={"bg-white"}>
                          <div>
                            <table
                              className={
                                "table-auto w-full text-sm text-[#191919] font-semibold"
                              }
                            >
                              <tbody
                                className={
                                  "text-sm divide-y divide-neutral-200"
                                }
                              >
                                {modules.map((data, index) => {
                                  return (
                                    <StoreList
                                      key={index}
                                      index={index}
                                      data={data}
                                      values={values}
                                      setFieldValue={setFieldValue}
                                    />
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </FormikForm>
          );
        }}
      </Formik>
    </>
  );
};

export default CompanyConfiguration;

const StoreList = ({ index, data, values, setFieldValue }) => {
  const [WhichOneToShow, setWhichOneToShow] = useState([]);
  const handleShowSubmodules = (e, submoduleName) => {
    e.preventDefault();
    if (!WhichOneToShow.includes(submoduleName)) {
      const someArray = [...WhichOneToShow, submoduleName];
      setWhichOneToShow(someArray);
    }
  };

  const handleHideSubmodules = (e, submoduleName) => {
    e.preventDefault();
    const someArray = [...WhichOneToShow];
    someArray.splice(submoduleName, 1);
    setWhichOneToShow(someArray);
  };

  const setModulesValue = (modules, e) => {
    if (e.target.checked) {
      return [...modules, parseInt(e.target.value)];
    } else {
      var index = modules.indexOf(parseInt(e.target.value));
      if (index > -1) {
        modules.splice(index, 1); // 2nd parameter means remove one item only
      }
      return modules;
    }
  };

  return (
    <Fragment key={index}>
      <tr className={"bg-slate-50 main-parent"}>
        <td className={"px-2 first:pl-5 py-3 relative text-left"}>
          <span>{data.name}</span>
        </td>

        <td className={"px-2 first:pl-5 py-3 text-right relative"}>
          <div
            className={
              "transition-all variant-arrow variant-arrow"
            }
          >
            <span className={` flex align-right justify-end pr-3`}>
              <label className={"inline-flex"}>
                <Input
                  type="checkbox"
                  className={`table-item form-checkbox ${!false ? "cursor-pointer" : ""} `}
                  name={`moduleData.${data.name}`}
                  id={`${data.id}`}
                  checked={values.moduleData.includes(data.id)}
                  disabled={false}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFieldValue("moduleData", [...values.moduleData, Number(e.target.id)])
                    } else {
                      const restModuleId = values.moduleData
                      const index = restModuleId.indexOf(Number(e.target.id));
                      restModuleId.splice(index, 1);
                      setFieldValue("moduleData", [...restModuleId])
                    }
                  }}
                />
              </label>
            </span>
          </div>
        </td>
      </tr>
    </Fragment>
  );
};

