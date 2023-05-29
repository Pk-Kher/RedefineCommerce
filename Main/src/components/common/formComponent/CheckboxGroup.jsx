import React from "react";
import { Field, ErrorMessage } from "formik";
import FormErrorMessage from "components/common/alerts/FormErrorMessage";
const CheckboxGroup = ({ label, name, options, align, ...rest }) => {
  return (
    <>
      <div
        className={`flex ${align === "vertical" ? "flex-col" : "flex-wrap"
          } gap-2`}
      >
        <Field name={name} {...rest}>
          {({ field }) => {
            return options.map((option, index) => {
              return (
                <label
                  className=" items-center leading-none"
                  htmlFor={option.value + "_" + name}
                  key={index}
                >
                  <input
                    className="form-checkbox"
                    type="checkbox"
                    name={name}
                    id={option.value + "_" + name}
                    {...field}
                    value={option.value}
                    checked={field.value.includes(option.value)}
                  />
                  <span className="ml-1">{option.label}</span>
                </label>
              );
            });
          }}
        </Field>

      </div>
      <ErrorMessage
        name={name}
        component={FormErrorMessage}
        className="d-block"
      />
    </>
  );
};

export default CheckboxGroup;
