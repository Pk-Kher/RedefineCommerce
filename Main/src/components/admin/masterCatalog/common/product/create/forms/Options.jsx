/*Component Name: Options
Component Functional Details: Product Options file.
Created By: Vikas Patel
Created Date: 18th May 2022
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import Input from "components/common/formComponent/Input";

const Options = ({
  displayFieldElement,
  fields,
  values,
  setFormSubmit,
  activeTab,
  index,
}) => {
  const formRef = useRef();
  useEffect(() => {
    if (activeTab == index) {
      setFormSubmit(formRef.current);
    }
  }, [formRef, setFormSubmit, activeTab]);

  const submitHandler = (values) => {
    //console.log(values);
  };
  const schema = Yup.object({
    options: displayFieldElement(fields, "options")
      ? Yup.string().required("Product Options are required")
      : null,
  });
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          options: "",
        }}
        validationSchema={schema}
        onSubmit={submitHandler}
        innerRef={formRef}
      >
        {({ errors, touched, setFieldValue, values }) => {
          return (
            <FormikForm>
              <div className="panel-01 tab-content p-6">
                {displayFieldElement(fields, "options") && (
                  <>
                    <div className="mb-6 last:mb-0 pt-6">
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                        Options{" "}
                        <span className="text-rose-500 text-2xl leading-none">
                          *
                        </span>
                      </div>

                      <Input
                        type={"text"}
                        name={`options`}
                        placeholder="ERP Name / NAV Name"
                        id="options"
                        className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}
                      />
                    </div>
                  </>
                )}
              </div>
            </FormikForm>
          );
        }}
      </Formik>
    </>
  );
};

export default Options;
