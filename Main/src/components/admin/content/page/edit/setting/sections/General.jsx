import React, { useState } from "react";
import Input from "components/common/formComponent/Input";
import { useFormikContext } from "formik";
import Checkbox from "components/common/formComponent/Checkbox";
import Select from "components/common/formComponent/Select";
import { pageEditPasswordExpirationTime } from "dummy/Dummy";
import ReactTooltip from "react-tooltip";
import Dropdown from "components/common/formComponent/Dropdown";

const General = () => {
  const { setFieldValue, values } = useFormikContext();
  return (
    <div className="px-5 py-4 bg-white mb-6">
      <button className="flex items-center justify-between w-full group mb-1">
        <div className="text-lg text-gray-800 font-bold">General</div>
      </button>
      <div >
        <div className="pt-6 mb-6">
          <label className="tracking-wide text-gray-700 text-sm font-bold mb-2 flex items-center">
            Internal page name{" "}
            <span className="text-rose-500 text-2xl leading-none">*</span>
            <span
              data-tip
              data-for="page-url-tip"
              className="material-icons-outlined ml-2 text-sm"
            >
              info
            </span>
            <ReactTooltip id="page-url-tip" type="dark" effect="solid">
              <span>Internal Name Used For Organization</span>
            </ReactTooltip>
          </label>
          <Input
            type="text"
            name="title"
            placeholder=""
            className="bg-gray-100 text-gray-700 border-gray-200 rounded focus:outline-none focus:bg-white"
          />
        </div>
        <div className="mb-6">
          <div className="m-0">
            <label className="flex items-center font-medium text-sm">
              <Checkbox
                name="passRequired"

                label="Require a password to view the page"
                checked={values?.passRequired == "Y" ? true : false}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFieldValue("passRequired", "Y");
                  } else {
                    setFieldValue("passRequired", "N");
                  }
                }}
              />
            </label>
          </div>
          <div
            className={`mt-6 ${values.passRequired == "Y" ? "" : "hidden"}`}
          >
            <div className="mb-6">
              <label className="tracking-wide text-gray-700 text-sm font-bold mb-2 flex items-center">
                Password{" "}
                <span className="text-rose-500 text-2xl leading-none">*</span>
              </label>
              <Input
                type="password"
                name="password"
                placeholder=""
                className="bg-gray-100 text-gray-700 border-gray-200 rounded focus:outline-none focus:bg-white"
              />
            </div>
            <div className="mb-6">
              <label className="tracking-wide text-gray-700 text-sm font-bold mb-2 flex items-center">
                Password Expiration
              </label>
              <Dropdown
                isMulti={false}
                isClearable={false}
                defaultValue={values?.passExpiryPeriod}
                name="passExpiryPeriod"
                className={`w-full`}
                options={pageEditPasswordExpirationTime}
              />
            </div>
          </div>
        </div>
        <div className="mb-6">
          <label className="tracking-wide text-gray-700 text-sm font-bold mb-2 flex items-center uppercase">
            Tag
          </label>
          <Input
            type="text"
            name="tag"
            placeholder=""
            className="bg-gray-100 text-gray-700 border-gray-200 rounded focus:outline-none focus:bg-white"
          />
        </div>
        <div className="mb-6">
          <label className="tracking-wide text-gray-700 text-sm font-bold mb-2 flex items-center">
            Author
          </label>
          <Input
            type="text"
            name="author"
            placeholder=""
            className="bg-gray-100 text-gray-700 border-gray-200 rounded focus:outline-none focus:bg-white"
          />
        </div>
        <div className="mb-6">
          <label className="text-gray-500 inline-flex items-center">
            <Checkbox
              name="isHomePage"
              label="Is Home Page"
              id="isHomePage"
              checked={values?.isHomePage == "Y" ? true : false}
              onChange={(e) => {
                setFieldValue("isHomePage", e.target.checked ? "Y" : "N");
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default General;
