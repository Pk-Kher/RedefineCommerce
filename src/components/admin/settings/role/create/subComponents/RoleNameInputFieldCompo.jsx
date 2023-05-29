import React, { Fragment } from "react";
import Input from "components/common/formComponent/Input";
import { useFormikContext } from "formik";

const RoleNameInputFieldCompo = ({
  FormikRolesArray,
  handleCloneRoleColumn,
  handleDeleteRole,
  isExistEmptyRole,
  isAddMode,
}) => {
  const { values } = useFormikContext();

  return (
    <td className="flex">
      <div
        className="whitespace-nowrap bg-white sticky left-0"
      >
        <div
          className="px-2 py-4 border-r relative border-indigo-500"
          style={{ width: "440px" }}
        >
          <div className="relative w-full">
            <div className="absolute h-10 mt-0 left-0 top-0 flex items-center">
              <svg
                className="h-4 pl-4 fill-current text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
              </svg>
            </div>

            <Input
              name={`Search`}
              id="search-toggle"
              className={`block text-gray-700  font-medium pl-10 pr-2 py-2 rounded-md`}
              placeholder="search"
            />
          </div>
          {isAddMode && (
            <button
              className="btn bg-indigo-500 hover:bg-indigo-600 text-white absolute -right-3 top-0 py-0 px-1"
              type={!isExistEmptyRole ? "button" : "submit"}
              onClick={() => handleCloneRoleColumn(FormikRolesArray)}
            >
              <span
                className="material-icons-outlined text-xs"
              // onClick={showResourceChildsHandler}
              >
                {true ? "add" : "remove"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* this div and its children are for cloneable components*/}
      {/* this gets multiplied and create a new clone  */}
      <Fragment>
        {values.RolePermissionData?.map((role, index) => {
          return (
            <div className="whitespace-nowrap box-borde box-border" key={index}>
              <div
                className="py-5 px-2 w-34 border-r text-left pb-0 mb-0"
                style={{ width: "275px" }}
              >
                <div className="flex justify-between items-center flex-wrap">
                  <label htmlFor="name" className="block text-xs font-normal">
                    Role Name
                  </label>
                  {values.RolePermissionData.length > 1 && (
                    <button
                      className="text-xs h-5 "
                      type="button"
                      onClick={() => handleDeleteRole(FormikRolesArray, role)}
                    >
                      <span className="material-icons-outlined text-sm h-5">
                        close
                      </span>
                    </button>
                  )}
                </div>

                <Input
                  name={`RolePermissionData[${index}].roleName`}
                  className="font-medium placeholder-gray-500 focus:ring-0 sm:text-sm appearance-none block  bg-gray-100 text-gray-500 border border-gray-200 rounded py-1 px-1 leading-tight focus:outline-none focus:bg-white "
                  id="rolename"
                  style={{ width: "255px" }}
                />
              </div>
            </div>
          );
        })}
      </Fragment>
    </td>
  );
};

export default RoleNameInputFieldCompo;
