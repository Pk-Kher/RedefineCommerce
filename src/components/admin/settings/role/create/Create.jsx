import React, { useState, useEffect, useCallback } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form as FormikForm, FieldArray } from "formik";
import RoleServices from "services/admin/role/RoleServices";
import { ValidationMsgs } from "global/ValidationMessages";
import RoleNameInputField from "./subComponents/RoleNameInputFieldCompo";
import ViewEditDeleteSection from "./subComponents/ViewEditDeleteSection";
import ModuleRowWithPermission from "./subComponents/ModuleRowWithPermission";
import { useSelector, useDispatch } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import Messages from "components/common/alerts/messages/Index";
import { serverError } from "services/common/helper/Helper";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const Create = () => {
  const permission = useSelector(store => store.permission);
  let newRole = {
    roleName: "",
    modules: {},
  }
  const [isExistEmptyRole, setisExistEmptyRole] = useState(false);
  const [moduleSubmodule, setmoduleSubmodule] = useState([]);
  const [RolePermissionData, setRolePermissionData] = useState([{
    roleName: "",
    modules: {},
  }]);
  const navigate = useNavigate();
  const [Unmounted, setUnmounted] = useState("initial");

  const location = useSelector((store) => store?.location);
  const CompanyId = useSelector((store) => store?.CompanyConfiguration?.id)
  const CurrentUserObject = useSelector((store) => store?.user)
  const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

  const dispatch = useDispatch();

  const [tempModifiendPermission, settempModifiendPermission] = useState({ 0: [] });

  const { id } = useParams();
  const isAddMode = !id;

  const schema = Yup.object().shape({
    RolePermissionData: Yup.array()
      .of(
        Yup.object().shape({
          roleName: Yup.string()
            .required(ValidationMsgs.profile.myAccount.roleNameRequired)
            .min(4, ValidationMsgs.profile.myAccount.maxRoleCharacter),
        })
      )
      .required(ValidationMsgs.profile.myAccount.roleMustNeed)
      .min(1, ValidationMsgs.profile.myAccount.minRole),
  });

  const newRoleWithpermission = []
  const newRoleWithNewPermissionOnly = []

  const createRole = () => {
    dispatch(setAddLoading(true))

    const { browser, ...AllLocationData } = location

    Object.values(tempModifiendPermission).map((multipleRoleObject, index) => {
      const newRoleObj = {
        roleName: newRoleWithpermission[index].roleName,
        recStatus: "A",
        modules: [],
      }

      multipleRoleObject.map((singleTempModifiendPermission) => {
        const ourData = newRoleWithpermission[index].modules.filter((singleNewRoleWithpermission) => {
          return (singleNewRoleWithpermission.moduleId == singleTempModifiendPermission.id)
        })

        if (ourData.length > 0) {
          ourData[0].moduleId = ourData[0].moduleId.split("_")[0]
          ourData[0].moduleId = Number(ourData[0].moduleId)
          newRoleObj.modules.push(ourData[0])
        }
      })
      return newRoleWithNewPermissionOnly.push(newRoleObj)
    })

    RoleServices.createRolePermission({
      adminRolePermissionModel: {
        ...AllLocationData,
        adminRolePermission: newRoleWithNewPermissionOnly.map((roleObject) => roleObject)
      },
    }).then((roleResponse) => {
      if (roleResponse.data.success && roleResponse.data.data) {
        dispatch(
          setAlertMessage({
            type: "success",
            message: ValidationMsgs.profile.myAccount.roleCreated,
          })
        );

        dispatch(setAddLoading(false))
        navigate("/admin/Settings/roles")
      } else {
        dispatch(
          setAlertMessage({ type: "danger", message: serverError(roleResponse) })
        );

        dispatch(setAddLoading(false))
        navigate("/admin/Settings/roles")
      }
    }).catch((errors) => {
      if (errors) {
        dispatch(
          setAlertMessage({
            message: ValidationMsgs.profile.myAccount.roleNotCreated,
            type: "danger",
          })
        );

        dispatch(setAddLoading(false))
        navigate("/admin/Settings/roles")
      }
    });
  }

  const updateRole = () => {

    dispatch(setAddLoading(true))

    const { browser, ...AllLocationData } = location

    Object.values(tempModifiendPermission).map((multipleRoleObject, index) => {

      multipleRoleObject.map((singleTempModifiendPermission) => {
        const ourData = newRoleWithpermission[0].modules.filter((singleNewRoleWithpermission) => {
          return (singleNewRoleWithpermission.moduleId == singleTempModifiendPermission.id);
        })

        if (ourData.length > 0) {
          ourData[0].moduleId = ourData[0].moduleId.split("_")[0]
          ourData[0].moduleId = Number(ourData[0].moduleId)
          newRoleWithNewPermissionOnly.push(ourData[0])
        }
      })
    })

    RoleServices.updateRolePermission({
      adminRolePermissionModel: {
        ...AllLocationData,
        roleId: Number(id),
        roleName: newRoleWithpermission[0].roleName,
        recStatus: "A",
        modules: [...newRoleWithNewPermissionOnly],
      },
    }).then((roleResponse) => {
      if (roleResponse.data.success && roleResponse.data.data) {
        dispatch(
          setAlertMessage({
            type: "success",
            message: ValidationMsgs.profile.myAccount.roleUpdated,
          })
        );

        dispatch(setAddLoading(false))

      } else {
        dispatch(
          setAlertMessage({ type: "danger", message: serverError(roleResponse) })
        );

        dispatch(setAddLoading(false))
      }
      settempModifiendPermission({ 0: [] })
      getRolePermissionData()
    })
      .catch((errors) => {
        if (errors) {
          console.log("errors ", errors)
          dispatch(
            setAlertMessage({
              message: "Error While Updating Role",
              type: "danger",
            })
          );

          dispatch(setAddLoading(false))
          settempModifiendPermission({ 0: [] })
        }
      });
  }

  const submitHandler = (values, { resetForm }) => {
    values.RolePermissionData.map((RolePermissionData, roleIndex) => {
      if (newRoleWithpermission.length < values.RolePermissionData.length) {
        newRoleWithpermission.push({
          roleName: "",
          recStatus: "A",
          modules: [],
        })
      }

      const newelyAddedRolePermission = Object.entries(RolePermissionData.modules)

      newelyAddedRolePermission.map((ourModuleData, index) => {
        const permission = ourModuleData[1]
        newRoleWithpermission[roleIndex]["roleName"] = RolePermissionData.roleName
        const indexOfOldmodule = newRoleWithpermission[roleIndex]["modules"].findIndex((module) => {
          return (module.moduleId == ourModuleData[0] && module.isNavigation == ourModuleData[1].isNavigation);
        });

        if (indexOfOldmodule < 0) {
          newRoleWithpermission[roleIndex].modules.push(
            {
              "moduleId": ourModuleData[0],
              "isEnable": permission["enable"] || false,
              "isDefault": permission["default"] || false,
              "isView": permission["permission"] === "view" ? true : false,
              "isDelete": permission["permission"] === "delete" ? true : false,
              "isEdit": permission["permission"] === "edit" ? true : false,
              "parentId": permission.parentId || 0,
              "isNavigation": permission.isNavigation,
              "rowVersion": "",
              "recStatus": "A"
            })
        } else {
          newRoleWithpermission[roleIndex].modules[indexOfOldmodule] =
          {
            "moduleId": ourModuleData[0],
            "isEnable": permission["enable"] || false,
            "isDefault": permission["default"] || false,
            "isView": permission["permission"] === "view" ? true : false,
            "isDelete": permission["permission"] === "delete" ? true : false,
            "isEdit": permission["permission"] === "edit" ? true : false,
            "parentId": permission.parentId || 0,
            "isNavigation": permission.isNavigation,
            "rowVersion": "",
            "recStatus": "A"
          }
        }
      })
    })

    // resetForm();
    if (isAddMode) {
      createRole()
      // resetForm({})
    } else {
      updateRole()
    };
  }

  const handleCloneRoleColumn = (FormikRolesArray) => {
    if (tempModifiendPermission) {
      settempModifiendPermission((prevData) => {
        return {
          ...prevData,
          [Object.keys(tempModifiendPermission).length]: []
        }
      })
    }

    const { form } = FormikRolesArray;
    const allRolePermissionData = form.values.RolePermissionData;
    const AlreadyAEmptyRole = () => {
      const isExisting = allRolePermissionData.find(
        (roleObj) => roleObj.roleName === null || roleObj.roleName === "" || roleObj.roleName.length < 4
      );
      setisExistEmptyRole(isExisting);
      return isExisting;
    };

    if (!AlreadyAEmptyRole()) {
      FormikRolesArray.push(newRole);
    }
  };

  const handleDeleteRole = (FormikRolesArray, objToDelete) => {
    const { form } = FormikRolesArray;
    const RoleArrayObject = form.values.RolePermissionData;

    const indexOfObject = RoleArrayObject.findIndex((object) => {
      return object.roleName === objToDelete.roleName;
    });

    if (RoleArrayObject.length > 1) {
      const newRoleData = RoleArrayObject.splice(indexOfObject, 1);
      form.setFieldValue({ RolePermissionData: newRoleData });
    }
  };

  useEffect(() => {
    if (CompanyId) {
      RoleServices.getAdminModules({
        pageSearchArgs: {
          pageIndex: 0,
          pageSize: 0,
          pagingStrategy: 0,
        },
        companyConfigurationId: CompanyId,
        isSuperUser: CurrentUserObject?.isSuperUser || false
      }).then((response) => {
        setmoduleSubmodule(response.data.data.items);
      });
    }
  }, [CompanyId]);

  const getRolePermissionData = useCallback(() => {
    // !isAddMode means "edit mode"
    if (!isAddMode) {
      RoleServices.getAdminRolePermission({
        args: {
          pageIndex: 0,
          pageSize: 0,
          pagingStrategy: 0,
        },
        roleId: id,
      }).then((response) => {
        if (response?.data?.data?.items.length > 0) {
          if (response.data.data.items[0].roleName) {
            newRole.roleName = response.data.data.items[0].roleName;

            response.data.data.items[0].modules.map((module, index) => {
              if (module.actionList.view) {
                module.actionList["permission"] = 'view';
              } else if (module.actionList.edit) {
                module.actionList["permission"] = 'edit';
              } else if (module.actionList.delete) {
                module.actionList["permission"] = 'delete';
              }
              module.actionList["parentId"] = module.parentId

              if (module.isNavigation) {
                module.actionList["navId"] = module.moduleId
              } else {
                module.actionList["extId"] = module.moduleId
              }
              module.actionList["isNavigation"] = module.isNavigation
              newRole.modules[`${module.moduleId}${module.isNavigation ? "_nav" : "_ext"}`] = module.actionList
            })
            setRolePermissionData([newRole])
          }
        }
      })
    }
  }, [])

  useEffect(() => {
    getRolePermissionData()
  }, []);

  useEffect(() => {
    if (moduleSubmodule?.length <= 0) {
      dispatch(setAddLoading(true))
    } else {
      dispatch(setAddLoading(false))
    }
  }, [moduleSubmodule]);

  return (
    <>
      <title>{isAddMode ? "Create Role" : "Edit Role"}</title>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ModuleSubModuleData: moduleSubmodule,
          RolePermissionData: RolePermissionData,
        }}
        validationSchema={schema}
        onSubmit={submitHandler}
      >
        {({ errors, touched, setFieldValue, values, handleSubmit }) => {
          return (
            <>
              <FormikForm>
                <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
                  <div className="flex mb-8 justify-between">
                    <div className="flex items-center">
                      <NavLink
                        to="/admin/Settings/roles"
                        className="btn border-neutral-200 hover:border-neutral-400 text-gray-500 hover:text-gray-700 flex items-center mr-2"
                      >
                        <span className="material-icons-outlined">west</span>
                      </NavLink>
                      <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
                        Account Administration
                      </h1>
                    </div>
                    {(permission?.isEdit || permission?.isDelete) &&
                      <div className="flex flex-wrap space-x-2">
                        <NavLink
                          to="/admin/Settings/roles"
                          className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
                        >
                          Cancel
                        </NavLink>
                        <button
                          disabled={GlobalLoading}
                          className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(GlobalLoading) ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}
                          type="submit"
                        >
                          <div className={`w-full flex justify-center align-middle `}>
                            {GlobalLoading && (
                              <span className="spinner-border spinner-border-sm mr-2"></span>
                            )}
                            Save
                          </div>
                        </button>
                      </div>
                    }
                  </div>
                  {/* end of header part of the component {Account Adminstration} { cancel and save} */}
                  <Messages />

                  {/* MAIN section of the component*/}
                  <div className="col-span-full w-full">
                    <div className="bg-white shadow-xxl">
                      <div className="overflow-x-auto h-auto">
                        {/* this FieldArray will automatically loop through Available Roles */}
                        <FieldArray
                          name="RolePermissionData"
                          render={(FormikRolesArray) => {
                            const {
                              RolePermissionData,
                              ModuleSubModuleData,
                            } = FormikRolesArray.form.values;

                            return (
                              <table className="table-auto w-full table-sticky border-collapse">
                                <thead>
                                  <tr className="text-xs font-semibold text-gray-500 sticky inset-0 bottom-auto">
                                    <RoleNameInputField
                                      RolePermissionData={RolePermissionData}
                                      handleCloneRoleColumn={
                                        handleCloneRoleColumn
                                      }
                                      handleDeleteRole={handleDeleteRole}
                                      FormikRolesArray={FormikRolesArray}
                                      isExistEmptyRole={isExistEmptyRole}
                                      isAddMode={isAddMode}
                                    />
                                  </tr>
                                  <tr className="text-xs font-semibold text-gray-500 sticky inset-0 bottom-auto">
                                    <ViewEditDeleteSection
                                      RolePermissionData={RolePermissionData}
                                    />
                                  </tr>
                                </thead>

                                <tbody>
                                  <ModuleRowWithPermission
                                    ModuleSubModuleData={ModuleSubModuleData}
                                    RolePermissionData={RolePermissionData}
                                    recCount={1}
                                    isAddMode={isAddMode}
                                    tempModifiendPermission={tempModifiendPermission}
                                    settempModifiendPermission={settempModifiendPermission}
                                    // gParentId={gParentId}
                                    // setgParentId={setgParentId}
                                    child={true}
                                    Unmounted={Unmounted}
                                    setUnmounted={setUnmounted}

                                  />
                                </tbody>
                              </table>
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </FormikForm>
            </>
          );
        }}
      </Formik>
    </>
  );
};

export default Create;
