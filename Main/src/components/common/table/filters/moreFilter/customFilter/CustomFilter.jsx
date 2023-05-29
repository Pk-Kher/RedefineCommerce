/*Component Name: CustomFilter
Component Functional Details:  CustomFilter .
Created By: PK Kher
Created Date: 6-21-2022
Modified By: PK Kher
Modified Date: 6-21-2022 */

import React, { useState, useRef } from "react";
import Create from "./Create";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import { ValidationMsgs } from "global/ValidationMessages";
import Transition from "utils/Transition";

const CustomFilter = ({ name, type, setColumnFilteringOptions, openDropdown, ...rest }) => {
  const schema = Yup.object().shape({
    name: Yup.string().required(ValidationMsgs.customFilter.name),
    customFilters: Yup.array()
      .of(
        Yup.object().shape({
          field: Yup.string().required(ValidationMsgs.customFilter.field),
          operator: Yup.string().required(ValidationMsgs.customFilter.operator),
        })
      )
      .min(1, ValidationMsgs.customFilter.filterLength),
  });
  const submitHandler = (field, { resetForm }) => {
    // console.log(field);
    resetForm({});
  };
  return (
    <Transition
      className={`bg-white border-y border-b-0 border-neutral-200 max-h-96 overflow-y-auto`}
      show={openDropdown}
      enter="transition ease-out duration-200 transform"
      enterStart="opacity-0 -translate-y-2"
      enterEnd="opacity-100 translate-y-0"
      leave="transition ease-out duration-200"
      leaveStart="opacity-100"
      leaveEnd="opacity-0"
    >
      <Formik
        enableReinitialize={true}
        initialValues={{
          name: "",
          customFilters: [],
        }}
        onSubmit={submitHandler}
        validationSchema={schema}
      >
        {({ errors, setFieldValue, values }) => {
          return (
            <FormikForm>
              <div>
                <ul className="mt-4">
                  <li className="pt-1 px-3">
                    <div className="flex items-center justify-between">
                      <div className="text-indigo-500 hover:text-indigo-600 cursor-pointer">
                        {" "}
                        All
                      </div>
                      <span ></span>
                      {values.customFilters.length > 0 && (
                        <div>
                          <button
                            type="submit"
                            className="btn btn-inline-block w-6 h-6 text-indigo-500"
                          >
                            <span className="material-icons-outlined cursor-pointer">
                              save
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                  <FilterList />
                </ul>
                <Create />
              </div>
            </FormikForm>
          );
        }}
      </Formik>
    </Transition>
  );
};

export default CustomFilter;

const FilterList = () => {
  const [enableEdit, setEnableEdit] = useState(false);
  const [filterName, setFilterName] = useState("Brand");
  const ref = useRef();
  const enableEditHandler = () => {
    setEnableEdit(() => true);
    ref.current.focus();
  };
  const saveCustomFilterName = () => {
    setEnableEdit(false);
    // console.log(filterName);
  };
  const deleteFilter = (id) => {
    // console.log(id);
  };
  return (
    <li className="pt-1 px-3">
      <div className="flex items-center justify-between">
        <span >
          <input
            ref={ref}
            name="name"
            id={"name"}
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className={` ${enableEdit
              ? "bg-white border border-neutral-200 rounded-md hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg"
              : "text-indigo-500 hover:text-indigo-600 border-0 cursor-pointer"
              }`}
            disabled={!enableEdit}
          />
        </span>
        <div>
          {enableEdit ? (
            <span
              className="inline-block w-6 h-6 text-indigo-500 material-icons-outlined cursor-pointer"
              onClick={saveCustomFilterName}
            >
              save
            </span>
          ) : (
            <span
              className="inline-block w-6 h-6 text-indigo-500 material-icons-outlined cursor-pointer"
              onClick={enableEditHandler}
            >
              {" "}
              edit
            </span>
          )}

          <span
            className="inline-block w-6 h-6 text-rose-500 material-icons-outlined cursor-pointer"
            onClick={() => deleteFilter(1)}
          >
            delete
          </span>
        </div>
      </div>
    </li>
  );
};
