import React, { Fragment, useEffect, useState, useRef, useMemo } from "react";
import { rights } from "dummy/Dummy";
import { useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import DropdownService from "services/common/dropdown/DropdownService";
import Select from "components/common/formComponent/Select";
import { useSelector } from "react-redux";
import Input from "components/common/formComponent/Input";

const UserPermission = ({ setUserId, setFormSubmit, ModuleSubModuleData, recCount, userPermissionData, SelectedRole, setSelectedRole, tempModifiendPermission, fetchDifferentRole, isReadOnly }) => {
  const [roles, setRoles] = useState([]);
  const [CurrentRole, setCurrentRole] = useState("None");
  const formRef = useRef();
  const { id } = useParams();

  useEffect(() => {
    setUserId && setUserId(id);
  }, [id]);

  useEffect(() => {
    if (userPermissionData?.roleName) {
      setCurrentRole(userPermissionData?.roleName || "None")
    }
  }, [userPermissionData?.roleName]);

  useEffect(() => {
    if (isReadOnly) {
      setFormSubmit(null);
    } else {
      setFormSubmit(formRef.current);
    }
  }, [formRef, setFormSubmit]);

  const validationSchema = Yup.object().shape({});

  useEffect(() => {
    DropdownService.getDropdownValues("adminrole")
      .then((res) => {
        if (res.data.success) {
          setRoles(() => {
            return res.data.data;
          });
        }
      })
      .catch((err) => { });
  }, []);

  return (
    <div className="grow">
      <div className="p-6 pr-0 w-full flex items-center justify-between gap-3">
        <h2 className="text-2xl text-gray-800 font-bold mb-3">
          User Permissions - <span>({CurrentRole})</span>
        </h2>
        <div className="w-56">
          <Select
            label="Roles"
            name="roleId"
            options={[{ value: "", label: "Select Role" }, ...roles]}
            onChange={(data) => { setSelectedRole(data.value); fetchDifferentRole(data.value) }}
            defaultValue={SelectedRole}
            isDisabled={isReadOnly}
          />
        </div>
      </div>

      <Formik
        enableReinitialize={true}
        initialValues={{ ModuleSubModuleData: ModuleSubModuleData }}
        onSubmit={() => { }}
        validationSchema={validationSchema}
        innerRef={formRef}
      >
        {({ errors, touched, setFieldValue, values, handleSubmit }) => {
          return (
            <>
              <Form>
                <table className="table-auto w-full text-sm text-[#191919]">
                  <tbody className="text-sm divide-y divide-neutral-200">
                    <UserPermissionModule
                      ModuleSubModuleData={values.ModuleSubModuleData}
                      mIndex={0}
                      paddingLeft={`${0 * recCount}px`}
                      recCount={recCount}
                      tempModifiendPermission={tempModifiendPermission}
                      setFieldValue={setFieldValue}
                      values={values}
                      isReadOnly={isReadOnly}
                    />
                  </tbody>
                </table>
              </Form>
            </>
          );
        }}
      </Formik>
    </div>
  )
}

const UserPermissionModule = ({ ModuleSubModuleData, ModuleSubModuleIndex, setSubtitle, recCount, isAddMode, setFieldValue, values, tempModifiendPermission, isReadOnly }) => {
  let currentUser = useSelector((store) => store?.user);

  useEffect(() => {
    setSubtitle && setSubtitle(
      `Add or Edit Permissions for { ${currentUser.firstname} ${currentUser.lastname} } { ${currentUser.email} } in company name`
    );
  }, [setSubtitle]);

  return (
    <>
      {ModuleSubModuleData && ModuleSubModuleData.map((ModuleSubModuleData, ModuleSubModuleDataIndex) => {
        ModuleSubModuleData["pId"] = `${ModuleSubModuleIndex ? ModuleSubModuleIndex + "_" : ""}${ModuleSubModuleDataIndex}`
        return (
          <Fragment key={ModuleSubModuleDataIndex}>
            <Modules
              ModuleSubModuleData={ModuleSubModuleData}
              ModuleSubModuleIndex={`${ModuleSubModuleIndex ? ModuleSubModuleIndex + "_" : ""}${ModuleSubModuleDataIndex}`}
              recCount={recCount}
              isAddMode={isAddMode}
              moduleRights={rights}
              setFieldValue={setFieldValue}
              values={values}
              tempModifiendPermission={tempModifiendPermission}
              id={`${ModuleSubModuleIndex ? ModuleSubModuleIndex + "_" : ""}${ModuleSubModuleDataIndex}`}
              isReadOnly={isReadOnly}
            />
          </Fragment>
        );
      })}
    </>
  );
};

const Modules = ({
  ModuleSubModuleData,
  ModuleSubModuleIndex,
  recCount,
  paddingLeft,
  moduleRights,
  tempModifiendPermission,
  setFieldValue,
  values,
  isReadOnly
}) => {
  const permission = useSelector(store => store.permission);

  const [showChild, setShowChild] = useState(false);
  const [isChecked, setisChecked] = useState({
    isChecked: false,
    currentBtn: ""
  });

  var isSubRows = ModuleSubModuleData.subRows && ModuleSubModuleData.subRows.length > 0;

  const handleRadioChange = (e, setFieldValue, values, ModuleSubModuleData, ModuleSubModuleIndex, right, all) => {

    if (all === "all") {
      const findNestedObject = (userRolePermission) => {
        if (userRolePermission.subRows && userRolePermission.subRows.length > 0) {
          userRolePermission.subRows.map((modSubData) => {

            const currentRadioId = modSubData.pId
            const [firstElem, ...rest] = currentRadioId ? currentRadioId.split("_") : []
            let ourMultilevelSubmodule = rest.map((m_s_index) => `.subRows[${m_s_index}]`).join('')
            const elementsIndex = tempModifiendPermission.findIndex(element => element.id == currentRadioId)

            const action = {
              isView: false,
              isEdit: false,
              isDelete: false,
            }

            setFieldValue(`ModuleSubModuleData[${firstElem}]${ourMultilevelSubmodule}.actions[0][${right}]`, true)
            if (isChecked.isChecked && isChecked.currentBtn == right) {
              setFieldValue(`ModuleSubModuleData[${firstElem}]${ourMultilevelSubmodule}.actions[0][${right}]`, false)
            }

            if (right === "view") {
              setisChecked((prevState) => ({
                isChecked: !isChecked.isChecked,
                currentBtn: "view"
              }))

              setFieldValue(`ModuleSubModuleData[${firstElem}]${ourMultilevelSubmodule}.actions[0][${"edit"}]`, false)
              setFieldValue(`ModuleSubModuleData[${firstElem}]${ourMultilevelSubmodule}.actions[0][${"delete"}]`, false)

              action.isView = true

              action.isEdit = false
              action.isDelete = false
            } if (right === "edit") {
              setisChecked((prevState) => ({
                isChecked: !isChecked.isChecked,
                currentBtn: "edit"
              }))


              setFieldValue(`ModuleSubModuleData[${firstElem}]${ourMultilevelSubmodule}.actions[0][${"view"}]`, false)
              setFieldValue(`ModuleSubModuleData[${firstElem}]${ourMultilevelSubmodule}.actions[0][${"delete"}]`, false)

              action.isEdit = true

              action.isView = false
              action.isDelete = false
            } if (right === "delete") {
              setisChecked((prevState) => ({
                isChecked: !isChecked.isChecked,
                currentBtn: "delete"
              }))

              setFieldValue(`ModuleSubModuleData[${firstElem}]${ourMultilevelSubmodule}.actions[0][${"view"}]`, false)
              setFieldValue(`ModuleSubModuleData[${firstElem}]${ourMultilevelSubmodule}.actions[0][${"edit"}]`, false)

              action.isDelete = true

              action.isView = false
              action.isEdit = false
            }

            // this will add these moduleSubmoduleData inside temp arrayVariable for api parameter.
            if (tempModifiendPermission.some((obj) => obj.id == currentRadioId)) {

              tempModifiendPermission[elementsIndex].modules = { ...tempModifiendPermission[elementsIndex].modules, ...action }
              tempModifiendPermission[elementsIndex] = { ...tempModifiendPermission[elementsIndex] }

            } else {
              tempModifiendPermission.push({
                id: currentRadioId,
                modules: {
                  "rolePermissionID": modSubData.rolePermissionId,
                  "moduleId": modSubData.isNavigation ? modSubData.navId : modSubData.extId,
                  "parentId": modSubData.parentId,
                  "isNavigation": modSubData.isNavigation,
                  "rowVersion": "",
                  "recStatus": "A",
                  ...action,
                }
              })
            }

            if (modSubData.submodule && modSubData.submodule.length > 0) {
              findNestedObject(modSubData.submodule)
            }
          })
        }
      }

      findNestedObject(ModuleSubModuleData)

    } else {
      const currentRadioId = e.target.id

      const [firstElem, ...rest] = currentRadioId.split("_")
      let ourMultilevelSubmodule = rest.map((m_s_index) => `.subRows[${m_s_index}]`).join('')

      const action = {
        isView: false,
        isEdit: false,
        isDelete: false,
      }

      setFieldValue(`ModuleSubModuleData[${firstElem}]${ourMultilevelSubmodule}.actions[0][${right}]`, e.target.checked)
      const elementsIndex = tempModifiendPermission.findIndex(element => element.id == currentRadioId)

      // if (e.target.checked) {
      if (right === "view") {
        setFieldValue(`ModuleSubModuleData[${firstElem}]${ourMultilevelSubmodule}.actions[0][${"edit"}]`, false)
        setFieldValue(`ModuleSubModuleData[${firstElem}]${ourMultilevelSubmodule}.actions[0][${"delete"}]`, false)
        action.isView = e.target.checked

        action.isEdit = false
        action.isDelete = false
      } else if (right === "edit") {
        setFieldValue(`ModuleSubModuleData[${firstElem}]${ourMultilevelSubmodule}.actions[0][${"view"}]`, false)
        setFieldValue(`ModuleSubModuleData[${firstElem}]${ourMultilevelSubmodule}.actions[0][${"delete"}]`, false)
        action.isEdit = e.target.checked

        action.isView = false
        action.isDelete = false
      } else if (right === "delete") {
        setFieldValue(`ModuleSubModuleData[${firstElem}]${ourMultilevelSubmodule}.actions[0][${"view"}]`, false)
        setFieldValue(`ModuleSubModuleData[${firstElem}]${ourMultilevelSubmodule}.actions[0][${"edit"}]`, false)
        action.isDelete = e.target.checked

        action.isView = false
        action.isEdit = false
      }

      if (tempModifiendPermission.some((obj) => obj.id == currentRadioId)) {

        tempModifiendPermission[elementsIndex].modules = { ...tempModifiendPermission[elementsIndex].modules, ...action }
        tempModifiendPermission[elementsIndex] = { ...tempModifiendPermission[elementsIndex] }

      } else {
        tempModifiendPermission.push({
          id: currentRadioId,
          modules: {
            "rolePermissionID": ModuleSubModuleData.rolePermissionId,
            "moduleId": ModuleSubModuleData.isNavigation ? ModuleSubModuleData.navId : ModuleSubModuleData.extId,
            "parentId": ModuleSubModuleData.parentId,
            "isNavigation": ModuleSubModuleData.isNavigation,
            "rowVersion": "",
            "recStatus": "A",
            ...action,
          }
        })
      }
    }
  };

  const checkedPrefilled = (right, ConstructedClass, ModuleSubModuleIndex, ModuleSubModuleData) => {
    try {
      return ModuleSubModuleData.actions[0][right]
    } catch (error) {
      return false
    }
  }

  let tempConstructedClass = ModuleSubModuleIndex.split("_")
  let ConstructedClass = ""

  tempConstructedClass.map((ourModuleSubModuleTempIndex, index) => {
    if (index === 0) {
      ConstructedClass = `module-${ourModuleSubModuleTempIndex}`
    } else {
      ConstructedClass = `${ConstructedClass}_submodule-${ourModuleSubModuleTempIndex}`
    }
  })

  return (
    <>
      <tr className={`main-parent ${ModuleSubModuleData.parentId === 0 ? "bg-indigo-50 font-semibold" : "bg-white"
        } `}>
        <td className="px-2 first:pl-1 py-1 text-center relative w-8" >
          <div className="leading-none w-8 h-6 cursor-pointer transition-all variant-arrow" style={{ marginLeft: paddingLeft }} >
            {isSubRows && (
              <span className="material-icons-outlined select-none" onClick={() => setShowChild((prev) => !prev)}>
                {showChild ? "remove" : "add"}
              </span>
            )}
          </div>
        </td>
        <td className="px-2 first:pl-5 py-3 relative text-left">
          <strong>{ModuleSubModuleData.name}</strong>
        </td>
        {
          ModuleSubModuleData.isNavigation ? <>
            {moduleRights.map((right, i) => {
              return (
                <td className="px-2 first:pl-5 py-3 text-center relative" key={i}>
                  <button
                    type="button"
                    className={`text-xs inline-flex font-medium border border-neutral-200 bg-slate-100 text-gray-500 rounded-md text-center px-2.5 py-1 cursor-pointer`}
                    id={ModuleSubModuleData.name + "_" + ModuleSubModuleIndex}
                    onClick={(e) => { handleRadioChange(e, setFieldValue, values, ModuleSubModuleData, ModuleSubModuleIndex, right, "all"); }}
                    disabled={isReadOnly || (!permission?.isEdit && !permission?.isDelete)}
                  >
                    {right == "edit" ? "View/Edit" : right.toUpperCase()}
                  </button>
                </td>
              );
            })}
          </> : <>
            {rights.map((right, index) => {
              return (
                <td
                  className="px-2 first:pl-5 py-3 text-center relative"
                  key={index}
                >
                  <span className={` flex align-middle justify-around`}>
                    <label className={"inline-flex"}>
                      <Input
                        type="checkbox"
                        className={`table-item form-checkbox ${!isReadOnly ? "cursor-pointer" : ""} `}
                        name={ConstructedClass}
                        id={ModuleSubModuleIndex}
                        checked={checkedPrefilled(right, ConstructedClass, ModuleSubModuleIndex, ModuleSubModuleData)}
                        disabled={isReadOnly}
                        onChange={(e) => handleRadioChange(e, setFieldValue, values, ModuleSubModuleData, ModuleSubModuleIndex, right)}
                      />
                    </label>
                  </span>

                </td>
              );
            })}
          </>
        }
      </tr>

      {ModuleSubModuleData.subRows && ModuleSubModuleData.subRows.length > 0 && showChild && (
        <>
          <UserPermissionModule
            ModuleSubModuleData={ModuleSubModuleData.subRows}
            ModuleSubModuleIndex={ModuleSubModuleIndex}
            paddingLeft={`${30 * recCount} px`}
            recCount={recCount + 1}
            tempModifiendPermission={tempModifiendPermission}
            setFieldValue={setFieldValue}
            values={values}
            isReadOnly={isReadOnly}
          />
        </>
      )}
    </>
  );
};

export default UserPermission
