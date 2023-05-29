import React from "react";

const Input = ({
  className,
  name,
  defaultValue,
  displayError = true,
  ...res
}) => {

  return (
    <>
      <input
        type="text"
        name={name}
        value={defaultValue ?? ''}
        {...res}
        className={className ? className : ""}
      />

    </>
  );
};

export default Input;
