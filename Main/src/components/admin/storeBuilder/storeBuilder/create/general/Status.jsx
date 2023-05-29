import React from "react";
import { useFormikContext } from "formik";
import Toggle from "components/common/formComponent/Toggle";
import { RecStatusValuebyName } from "global/Enum";

const Status = () => {
  const { setFieldValue, values } = useFormikContext();
  return (
    <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 mb-6 p-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6">
          <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
            Active :{" "}
            <span className="text-rose-500 text-xl leading-none">*</span>
          </label>
          <Toggle
            name={"recStatus"}
            defaultValue={values.recStatus === RecStatusValuebyName.Active}
            id="recStatus"
            onChange={(e) => {
              setFieldValue(
                "recStatus",
                e.target.checked
                  ? RecStatusValuebyName.Active
                  : RecStatusValuebyName.Inactive
              );
            }}
          />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
            Hide Logo :{" "}
            <span className="text-rose-500 text-xl leading-none">*</span>
          </label>
          <Toggle
            name={"islogo"}
            defaultValue={values.islogo}
            id="islogo"
            onChange={(e) => {
              setFieldValue("islogo", e.target.checked);
            }}
          />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
            hide store name :{" "}
            <span className="text-rose-500 text-xl leading-none">*</span>
          </label>
          <Toggle
            name={"isstorename"}
            defaultValue={values.isstorename}
            id="isstorename"
            onChange={(e) => {
              setFieldValue("isstorename", e.target.checked);
            }}
          />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
            display category menu :{" "}
            <span className="text-rose-500 text-xl leading-none">*</span>
          </label>
          <Toggle
            name={"iscategorymenu"}
            defaultValue={values.iscategorymenu}
            id="iscategorymenu"
            onChange={(e) => {
              setFieldValue("iscategorymenu", e.target.checked);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Status;
