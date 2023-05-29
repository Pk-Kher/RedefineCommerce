import React from "react";
import { Field, ErrorMessage } from "formik";
import FormErrorMessage from "components/common/alerts/FormErrorMessage";
import { ValidateSpecialCharacter } from "services/common/helper/Helper";

const Input = ({
  className,
  name = "",
  defaultValue,
  displayError = true,
  values,
  setFieldValue /* = () => { } */,
  isDecimal, /* pass true for decimal inputs  */
  ...res
}) => {

  const handleInputChange = (values) => {
    let valueWithoutMinus = String(Math.abs(Number(values)))
    if (valueWithoutMinus.startsWith(0)) {
      valueWithoutMinus = valueWithoutMinus.substring(1);
    }
    setFieldValue(name, valueWithoutMinus)
  }

  return (
    <>
      <Field
        type="number"
        name={name}
        defaultValue={defaultValue && defaultValue}
        onKeyPress={(event) => { ValidateSpecialCharacter(event, isDecimal, values[name]); handleInputChange(event.target.value) }}
        // onChange={(e) => handleInputChange(e.target.value)}
        {...res}
        className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md ${className}`}
      />
      {!defaultValue && displayError === true && (
        <ErrorMessage name={name} component={FormErrorMessage} />
      )}
    </>
  );
};

export default Input;
