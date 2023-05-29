import React, { useEffect } from "react";
import { useFormikContext } from "formik";
import Input from "components/common/formComponent/Input";

const CheckBoxComponent = ({
  enableDefaultField,
  name,
  disabled,
  ...rest
}) => {
  return (
    <>
      <label className={"inline-flex"}>
        <Input
          name={name}
          type="checkbox"
          disabled={disabled}
          className={`table-item form-checkbox checkboxCheck cursor-pointer ${(disabled) && "opacity-50 bg-gray-100"} ${!enableDefaultField && "hidden"}`}
          {...rest}
        />
      </label>
    </>
  );
};

export default CheckBoxComponent;
