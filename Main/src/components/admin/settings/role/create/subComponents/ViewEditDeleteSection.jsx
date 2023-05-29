import React, { Fragment } from "react";
import { useFormikContext } from "formik";

const ViewEditDeleteSection = () => {
  const { values } = useFormikContext();

  return (
    <td className="flex ">
      <div className="whitespace-nowrap bg-white sticky left-0">
        <div
          className="px-2 w-full py-1 border-r border-b border-r-indigo-500"
          style={{ width: "440px" }}
        >
          &nbsp;
        </div>
      </div>

      {values.RolePermissionData.map((role, index) => {
        return (
          <div key={index}
            className="flex border-t py-1 align-middle justify-around border-r border-b"
            style={{ width: "275px" }}
          >
            <span className="font-normal">Enable</span>
            <span className="font-normal">Default</span>
            <span className="font-normal">View</span>
            <span className="font-normal">Edit</span>
            <span className="font-normal">Delete</span>
          </div>
        );
      })}
    </td>
  );
};

export default ViewEditDeleteSection;
