/*Component Name: ModuleRowWithPermissions.
Component Functional Details: User can create or update ModuleRowWithPermissions. master details from here.
Created By: chandan
Created Date: <Creation Date>
Modified By: chandan
Modified Date: <Modified Date> */

import React, { Fragment, useState, useEffect, useMemo } from "react";
import { useFormikContext } from "formik";

import Input from "components/common/formComponent/Input";
import CheckBoxComponent from "./CheckBoxComponent";

const ModuleRowWithPermission = ({
  ModuleSubModuleData,
  RolePermissionData,
  isSubModule,
  paddingLeft,
  recCount,
  isAddMode,
  tempModifiendPermission,
  settempModifiendPermission,
  child,
  Unmounted,
  setUnmounted

}) => {

  return (
    <>
      {ModuleSubModuleData?.map((modules, ModuleSubModuleDataIndex) => {
        return (
          <Fragment key={ModuleSubModuleDataIndex}>
            <Modules
              ModuleSubModuleDataIndex={ModuleSubModuleDataIndex}
              modules={modules}
              ModuleSubModuleData={ModuleSubModuleData}
              RolePermissionData={RolePermissionData}
              isSubModule={isSubModule}
              paddingLeft={paddingLeft}
              recCount={recCount}
              isAddMode={isAddMode}
              settempModifiendPermission={settempModifiendPermission}
              tempModifiendPermission={tempModifiendPermission}
              child={child}
              Unmounted={Unmounted}
              setUnmounted={setUnmounted}
            />
          </Fragment>
        );
      })}
    </>
  );
};

const Modules = ({
  modules,
  ModuleSubModuleData,
  RolePermissionData,
  ModuleSubModuleDataIndex,
  isSubModule,
  recCount,
  paddingLeft,
  isAddMode,
  settempModifiendPermission,
  tempModifiendPermission,
  child,
  Unmounted,
  setUnmounted
}) => {
  const [showChild, setShowChild] = useState(false);
  var isSubRows = modules.subRows && modules.subRows.length > 0;

  return (
    <>
      <tr className={`parent ${child ? '' : 'hidden'}`}>
        <td
          className={`whitespace-nowrap ${modules.parentId === 0 ? "bg-indigo-50" : "bg-white"
            } sticky left-0  `}
        >
          <div className="flex">
            <div
              className={`flex px-2 py-3 border-r border-r-indigo-500 whitespace-nowrap ${modules.parentId === 0 ? "bg-indigo-50" : "bg-white"
                } sticky left-0 `}
              style={{ width: "440px" }}
            >
              <div className="cursor-pointer transition-all variant-arrow variant-arrow " style={{ paddingLeft: paddingLeft }}>
                {modules.isNavigation && (
                  <span className={`material-icons-outlined text-md mr-3`} onClick={() => setShowChild((prev) => !prev)}>
                    {showChild ? "remove" : "add"}
                  </span>
                )}
              </div>
              <div
                className={`text-gray-800 w-72 font-semibold`}
              >
                {modules.name}
              </div>
              {isSubRows && (
                <span className="text-xs font-bold border border-gray-300 text-black-600 rounded-full text-center px-4 py-1 ml-3 flex justify-center items-center ">
                  {modules.subRows.length}
                </span>
              )}
            </div>

            {RolePermissionData.length > 0 &&
              RolePermissionData.map((role, roleIndex) => {
                return (
                  <Fragment key={roleIndex}>
                    <Role RolePermissionData={RolePermissionData} modules={modules} roleIndex={roleIndex} ModuleSubModuleDataIndex={ModuleSubModuleDataIndex} ModuleSubModuleData={ModuleSubModuleData} isAddMode={isAddMode} settempModifiendPermission={settempModifiendPermission} tempModifiendPermission={tempModifiendPermission} setShowChild={setShowChild} Unmounted={Unmounted}
                      setUnmounted={setUnmounted} />
                  </Fragment>
                );
              })}
          </div>
        </td>
      </tr>
      {modules.subRows && modules.subRows.length > 0 && (
        <>
          <ModuleRowWithPermission
            ModuleSubModuleData={modules.subRows}
            isSubModule={modules.subRows}
            RolePermissionData={RolePermissionData}
            paddingLeft={`${30 * recCount}px`}
            recCount={recCount + 1}
            settempModifiendPermission={settempModifiendPermission}
            tempModifiendPermission={tempModifiendPermission}
            child={showChild && child}
            setUnmounted={setUnmounted}
            Unmounted={Unmounted}
          />
        </>
      )}
    </>
  );
};

const Role = ({ RolePermissionData, modules, roleIndex, ModuleSubModuleDataIndex, ModuleSubModuleData, isAddMode, settempModifiendPermission, tempModifiendPermission, setShowChild, Unmounted, setUnmounted }) => {
  const { values, setFieldValue, setValues } = useFormikContext();
  const [enableAllCheckBox, setEnableAllCheckBox] = useState(false);
  // const [unCheckInnerCheckbox, setunCheckInnerCheckbox] = useState(false);
  // make dashboard default selected
  const disableDashboard = modules && modules.name === 'Dashboard' && modules.parentId === 0;
  useEffect(() => {
    if (disableDashboard) {
      setFieldValue(`RolePermissionData[${roleIndex}].modules.${(modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext'))}.${'enable'}`, true);
      setFieldValue(`RolePermissionData[${roleIndex}].modules.${(modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext'))}.${'permission'}`, 'delete');
      setFieldValue(`RolePermissionData[${roleIndex}].modules.${(modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext'))}.isNavigation`, modules.isNavigation);
      setFieldValue(`RolePermissionData[${roleIndex}].modules.${(modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext'))}.default`, false);
      let id = (modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext'))
      if (!tempModifiendPermission[roleIndex].some((obj) => obj.id === id)) {
        settempModifiendPermission((prevData) => {
          return {
            ...prevData,
            [roleIndex]: [...fetchOldData(prevData, roleIndex), { id: id, currentObj: values.RolePermissionData[roleIndex]?.modules[modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext')] }]
          }
        })
      }
    }
  }, []);

  const ActionList = useMemo(() => ["view", "edit", "delete"], []);

  const enableCheckBoxHandler = (innerChildId) => {
    if (disableDashboard) {
      return true;
    }
    const parentEnableCheckBox = RolePermissionData[roleIndex]?.modules[modules?.parentId + '_nav']?.enable;
    if (parentEnableCheckBox !== undefined) {
      return !parentEnableCheckBox;
    }
    else if (enableAllCheckBox !== undefined) {
      return !enableAllCheckBox
    }
    return true;
  }

  useEffect(() => {
    setEnableAllCheckBox(values.RolePermissionData[roleIndex]?.modules[(modules?.isNavigation ? (modules?.navId + '_nav') : (modules?.extId + '_ext'))]?.enable);
  }, [values.RolePermissionData[roleIndex]?.modules[(modules?.isNavigation ? (modules?.navId + '_nav') : (modules?.extId + '_ext'))]?.enable]);

  // enable child checkbox based on parent
  useEffect(() => {
    // this is for unchecking the default and permission button on the same tree
    if (!disableDashboard) {
      if (!values.RolePermissionData[roleIndex].modules[modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext')]?.enable) {
        setFieldValue(`RolePermissionData[${roleIndex}].modules.${(modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext'))}.default`, false);
        setFieldValue(`RolePermissionData[${roleIndex}].modules.${(modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext'))}.permission`, false);
      }

      if (modules?.parentId !== 0 && modules?.parentId !== undefined) {
        if (values.RolePermissionData[roleIndex]?.modules[modules?.parentId + '_nav']?.enable) {
          setFieldValue(`RolePermissionData[${roleIndex}].modules.${(modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext'))}.enable`, values.RolePermissionData[roleIndex]?.modules[modules?.parentId + '_nav']?.enable);
          setFieldValue(`RolePermissionData[${roleIndex}].modules.${(modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext'))}.isNavigation`, modules.isNavigation);
          let modulePer = RolePermissionData[roleIndex].modules[(modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext'))];
          setFieldValue(`RolePermissionData[${roleIndex}].modules.${(modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext'))}.permission`, (modulePer?.view ? "view" : (modulePer?.edit ? "edit" : (modulePer?.delete ? 'delete' : false))));

        } else {
          setFieldValue(`RolePermissionData[${roleIndex}].modules.${(modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext'))}.enable`, false);
          setFieldValue(`RolePermissionData[${roleIndex}].modules.${(modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext'))}.isNavigation`, modules.isNavigation);
          setFieldValue(`RolePermissionData[${roleIndex}].modules.${(modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext'))}.permission`, false);
        }
      } else {
        setFieldValue(`RolePermissionData[${roleIndex}].modules.${(modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext'))}.isNavigation`, modules.isNavigation);
      }
    }
  }, [values.RolePermissionData[roleIndex]?.modules[modules?.parentId + '_nav']?.enable, values.RolePermissionData[roleIndex]?.modules[modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext')]?.enable]);

  // this enables all nested child 
  useEffect(() => {
    if (modules.subRows && modules.subRows.length > 0) {
      let permissions = [];
      modules.subRows.map((module, index) => {
        if (module.subRows && module.subRows.length <= 0) {
          permissions = [
            ...permissions,
            RolePermissionData[roleIndex]?.modules[(module.isNavigation ? (module.navId + '_nav') : (module.extId + '_ext'))]?.permission,
          ];
        } else {
          permissions = [
            ...permissions,
            RolePermissionData[roleIndex]?.modules[(module.isNavigation ? (module.navId + '_nav') : (module.extId + '_ext'))]?.permission,
            ...recursiveCheckIfAllChildAreChecked(module.subRows)
          ];
        }

        if (modules.subRows.length - 1 === index) {
          setUnmounted && setUnmounted("final")
        }
      });

      const p = permissions.filter((item, i, ar) => ar.indexOf(item) === i);

      setUnmounted((prevData) => {
        if (prevData === "final" || prevData === "initial") {
          setFieldValue(`RolePermissionData[${roleIndex}].modules.${modules.isNavigation && (modules.navId + '_nav')}.${'permission'}`, (p.length === 1 && p[0] ? p[0] : ""));
          setFieldValue(`RolePermissionData[${roleIndex}].modules.${modules.isNavigation && (modules.navId + '_nav')}.isNavigation`, modules.isNavigation);
        }
        return prevData
      })
    }
  }, [RolePermissionData[roleIndex].modules]);

  const recursiveCheckIfAllChildAreChecked = (module) => {
    let permissions = [];
    module.map((value, index) => {
      if (value.subRows && value.subRows.length > 0) {
        permissions = [
          ...permissions,
          RolePermissionData[roleIndex]?.modules[(value.isNavigation ? (value.navId + '_nav') : (value.extId + '_ext'))]?.permission,
          ...recursiveCheckIfAllChildAreChecked(value.subRows, [])
        ];
      } else {
        permissions = [
          ...permissions,
          RolePermissionData[roleIndex]?.modules[(value.isNavigation ? (value.navId + '_nav') : (value.extId + '_ext'))]?.permission,
        ];
      }
    })
    return permissions;
  }

  const fetchOldData = (prevState, index) => {
    if (prevState[index]) {
      return prevState[index];
    } else {
      return [];
    }
  };

  const HandleOnChangeRadio = (e, modulesData, data) => {
    setUnmounted("processing")

    setFieldValue(`RolePermissionData[${roleIndex}].modules.${(modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext'))}.${'permission'}`, e.target.checked ? e.target.value : false);
    setFieldValue(`RolePermissionData[${roleIndex}].modules.${(modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext'))}.${'isNavigation'}`, modules.isNavigation);
    setFieldValue(`RolePermissionData[${roleIndex}].modules.${(modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext'))}.${'parentId'}`, modules.parentId);

    if (!tempModifiendPermission[roleIndex].some((obj) => obj.id === e.target.id)) {
      settempModifiendPermission((prevData) => ({
        ...prevData,
        [roleIndex]: [...fetchOldData(prevData, roleIndex), { id: e.target.id, currentObj: values.RolePermissionData[roleIndex]?.modules[modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext')] }]
      }))
    }

    if (data.RolePermissionData[roleIndex]?.modules[modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext')]?.permission || e.target.checked) {
      // this is going for the child modules addition inside tempModifiendPermission.
      const callSubmodule = (modulesData) => {
        modulesData && modulesData.subRows.length > 0 && modulesData.subRows.map((module, index) => {

          const moduleSubmoduleId = module.isNavigation ? (module.navId + '_nav') : (module.extId + '_ext')
          settempModifiendPermission((prevData) => {
            if (prevData !== undefined && !prevData[roleIndex].includes(moduleSubmoduleId)) {
              return {
                ...prevData,
                [roleIndex]: [...fetchOldData(prevData, roleIndex), { id: moduleSubmoduleId, currentObj: values.RolePermissionData[roleIndex]?.modules[modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext')] }]
              }
            } else {
              return prevData
            }
          })

          if (module.subRows && module.subRows.length > 0) {
            callSubmodule(module)
          }
        })
      }
      callSubmodule(modulesData)
    }

    if (modules.isNavigation && modules.subRows && modules.subRows.length > 0) {
      modules.subRows.map((module, index) => {
        setFieldValue(`RolePermissionData[${roleIndex}].modules.${(module.isNavigation ? (module.navId + '_nav') : (module.extId + '_ext'))}.${'permission'}`, e.target.checked ? e.target.value : false);
        setFieldValue(`RolePermissionData[${roleIndex}].modules.${(module.isNavigation ? (module.navId + '_nav') : (module.extId + '_ext'))}.${'isNavigation'}`, module.isNavigation);
        setFieldValue(`RolePermissionData[${roleIndex}].modules.${(module.isNavigation ? (module.navId + '_nav') : (module.extId + '_ext'))}.${'parentId'}`, module.parentId);

        if (module.subRows && module.subRows.length > 0) {
          checkAllCheckbox(module.subRows, e);
        }
      });
    } else {
      setFieldValue(`RolePermissionData[${roleIndex}].modules.${(modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext'))}.${'permission'}`, e.target.checked ? e.target.value : false);
      setFieldValue(`RolePermissionData[${roleIndex}].modules.${(modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext'))}.${'isNavigation'}`, modules.isNavigation);
      setFieldValue(`RolePermissionData[${roleIndex}].modules.${(modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext'))}.${'parentId'}`, modules.parentId);
    }
  }

  const HandleOnChangeCheckBox = (e, type, modulesData, data) => {
    setUnmounted("processing")

    if (type === "enable") {
      // setunCheckInnerCheckbox(!e.target.checked)
      setFieldValue(`RolePermissionData[${roleIndex}].modules.${(modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext'))}.${'enable'}`, e.target.checked);
      setFieldValue(`RolePermissionData[${roleIndex}].modules.${(module.isNavigation ? (module.navId + '_nav') : (module.extId + '_ext'))}.${'isNavigation'}`, module.isNavigation);
      setFieldValue(`RolePermissionData[${roleIndex}].modules.${(module.isNavigation ? (module.navId + '_nav') : (module.extId + '_ext'))}.${'parentId'}`, module.parentId);
    } else {
      setFieldValue(`RolePermissionData[${roleIndex}].modules.${(modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext'))}.${'default'}`, e.target.checked);
      setFieldValue(`RolePermissionData[${roleIndex}].modules.${(module.isNavigation ? (module.navId + '_nav') : (module.extId + '_ext'))}.${'isNavigation'}`, module.isNavigation);
      setFieldValue(`RolePermissionData[${roleIndex}].modules.${(module.isNavigation ? (module.navId + '_nav') : (module.extId + '_ext'))}.${'parentId'}`, module.parentId);
    }

    if (!tempModifiendPermission[roleIndex].some((obj) => obj.id === e.target.id)) {
      settempModifiendPermission((prevData) => {
        return {
          ...prevData,
          [roleIndex]: [...fetchOldData(prevData, roleIndex), { id: e.target.id, currentObj: values.RolePermissionData[roleIndex]?.modules[modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext')] }]
        }
      })
    }

    if (data.RolePermissionData[roleIndex]?.modules[modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext')]?.permission || e.target.checked) {
      // this is going for the child modules addition inside tempModifiendPermission.

      const callSubmodule = (modulesData) => {
        modulesData && modulesData.subRows.length > 0 && modulesData.subRows.map((module, index) => {

          const moduleSubmoduleId = module.isNavigation ? (module.navId + '_nav') : (module.extId + '_ext')
          settempModifiendPermission((prevData) => {
            if (prevData !== undefined && !prevData[roleIndex].includes(moduleSubmoduleId)) {
              return {
                ...prevData,
                [roleIndex]: [...fetchOldData(prevData, roleIndex), { id: moduleSubmoduleId, currentObj: values.RolePermissionData[roleIndex]?.modules[modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext')] }]
              }
            } else {
              return prevData
            }
          })

          if (module.subRows && module.subRows.length > 0) {
            callSubmodule(module)
          }
        })
      }
      callSubmodule(modulesData)
    }
  }

  const checkAllCheckbox = (modules, e) => {
    modules.map((module, index) => {
      setFieldValue(`RolePermissionData[${roleIndex}].modules.${(module.isNavigation ? (module.navId + '_nav') : (module.extId + '_ext'))}.${'permission'}`, e.target.checked ? e.target.value : false);
      setFieldValue(`RolePermissionData[${roleIndex}].modules.${(module.isNavigation ? (module.navId + '_nav') : (module.extId + '_ext'))}.${'isNavigation'}`, module.isNavigation);
      setFieldValue(`RolePermissionData[${roleIndex}].modules.${(module.isNavigation ? (module.navId + '_nav') : (module.extId + '_ext'))}.${'parentId'}`, module.parentId);

      if (module.subRows && module.subRows.length > 0) {
        checkAllCheckbox(module.subRows, e);
      }
    });
  }

  return (
    <div className="flex items-center gap-y-2 justify-between px-4 py-5 border-r" style={{ width: "275px" }}>
      {RolePermissionData.length > 0 &&
        "modules" in RolePermissionData[roleIndex] &&
        (
          <>
            {modules.parentId === 0 &&
              <>
                <span className="w-7 flex align-middle justify-around">
                  <CheckBoxComponent
                    enableDefaultField={true}
                    name={`RolePermissionData[${roleIndex}].modules.${(modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext'))}.enable`}
                    disabled={disableDashboard}
                    id={`${(modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext'))}`}
                    onChange={(e) => HandleOnChangeCheckBox(e, "enable", modules, values)}
                  />
                </span>
                <span className="w-6 flex align-middle justify-around">
                  <CheckBoxComponent
                    enableDefaultField={true}
                    name={`RolePermissionData[${roleIndex}].modules.${(modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext'))}.default`}
                    disabled={enableCheckBoxHandler()}
                    id={`${(modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext'))}`}
                    onChange={(e) => HandleOnChangeCheckBox(e, "default", modules, values)}
                  />
                </span>
              </>}
            {
              modules.parentId !== 0 && <>
                <span className={`w-7 flex align-middle justify-around`}>
                </span>
                <span className={`w-7 flex align-middle justify-around`}>
                </span>
              </>
            }

            {ActionList.map((Permission, PermissionIndex) => {
              const disabled = enableCheckBoxHandler(modules?.isNavigation ? (modules?.navId + '_nav') : (modules?.extId + '_ext'));
              const valuePermissions = RolePermissionData[roleIndex]?.modules[(modules?.isNavigation ? (modules?.navId + '_nav') : (modules?.extId + '_ext'))]?.['permission'];
              return (
                <Fragment key={PermissionIndex}>
                  <span className={`${PermissionIndex === 0 ? ' w-4' : PermissionIndex === 1 ? 'w-2' : 'w-2'} flex align-middle justify-around`}>
                    <label className={"inline-flex"}>
                      <Input
                        type="checkbox"
                        name={`RolePermissionData[${roleIndex}].modules.${(modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext'))}.${'permission'}`}
                        className={`table-item form-checkbox cursor-pointer ${(disabled) && "opacity-50 bg-gray-100"}`}
                        id={`${(modules.isNavigation ? (modules.navId + '_nav') : (modules.extId + '_ext'))}`}
                        disabled={disabled}
                        value={Permission}
                        checked={(valuePermissions === Permission)}
                        onChange={(e) => { HandleOnChangeRadio(e, modules, values) }}
                      />
                    </label>
                  </span>
                </Fragment>
              );
            })}
          </>
        )
      }
    </div >
  );
}

export default ModuleRowWithPermission;





