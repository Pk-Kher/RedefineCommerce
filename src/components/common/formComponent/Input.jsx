import React from "react";
import { Field, ErrorMessage } from "formik";
import FormErrorMessage from "components/common/alerts/FormErrorMessage";
import { useSelector } from "react-redux";
const Input = ({
  className,
  name,
  defaultValue,
  displayError = true,
  disabled,
  ...res
}) => {
  const permission = useSelector(store => store.permission);

  return (
    <>
      <Field
        type="text"
        name={name}
        defaultValue={defaultValue && defaultValue}
        {...res}
        className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md dropDownElem_unique ${disabled ? "bg-slate-100" : ""} ${className}`}
        autoComplete="new-password"
        disabled={disabled || (!permission?.isEdit && !permission?.isDelete)}
      />
      {!defaultValue && displayError === true && (
        <ErrorMessage name={name} component={FormErrorMessage} />
      )}
    </>
  );
};

export default Input;
