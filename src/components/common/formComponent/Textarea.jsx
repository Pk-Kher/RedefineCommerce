import React from "react";
import { Field, ErrorMessage } from "formik";
import FormErrorMessage from "components/common/alerts/FormErrorMessage";
import { useSelector } from "react-redux";

const Textarea = ({ className, name, defaultValue, disabled, ...res }) => {
  const permission = useSelector(store => store.permission);
  return (
    <>
      <Field
        component="textarea"
        rows="4"
        name={name}
        // defaultValue={defaultValue && defaultValue}
        {...res}
        disabled={disabled || (!permission?.isEdit && !permission?.isDelete)}
        className={`${className} block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}

      />
      {!defaultValue && (
        <ErrorMessage name={name} component={FormErrorMessage} />
      )}
    </>
  );
};

export default Textarea;
