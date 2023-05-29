import React, { useEffect, useState, forwardRef } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ErrorMessage, useFormikContext } from "formik";
import FormErrorMessage from "components/common/alerts/FormErrorMessage";
import { format } from "date-fns";
import { useSelector } from "react-redux";
// formate mm/dd/yyyy
const DatePicker = ({
  className,
  name,
  defaultValue,
  onChange,
  dateFormat,
  disabledLogo,
  disabled = false,
  ...rest
}) => {
  const permission = useSelector(store => store.permission);
  const [currentDate, setcurrentDate] = useState(null);
  const { errors, setFieldValue } = useFormikContext();
  useEffect(() => {
    setcurrentDate(defaultValue ? new Date(defaultValue) : null);
  }, [defaultValue]);

  const onChangeHandler = (date) => {
    setcurrentDate(date);
    date = date === null ? "" : date;
    if (onChange instanceof Function) {
      onChange(date);
    } else if (setFieldValue instanceof Function) {
      setFieldValue(name, format(new Date(date), "MMM d, yyyy"));
    }
  };
  return (
    <>
      <div className="relative">
        <ReactDatePicker
          dateFormat={dateFormat ? dateFormat : "MM - dd - yyyy"}
          selected={currentDate}
          id={name}
          onChange={onChangeHandler}
          {...rest}
          customInput={<CustomInput disabledLogo={disabledLogo} />}
          disabled={disabled || (!permission?.isEdit && !permission?.isDelete)}
        // popperPlacement="top-end"
        />

      </div>
      {name && (
        <ErrorMessage name={name} component={FormErrorMessage} />
      )}
    </>
  );
};
export default React.memo(DatePicker);
const CustomInput = forwardRef(({ value, onClick, disabledLogo }, ref) => (
  <button type="button" className={`w-full h-10 bg-white border text-left border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md ${'className'}`} onClick={onClick} ref={ref}>

    {value}
    {!disabledLogo && <div className="absolute top-0 right-0 px-3 py-2 ">
      <svg
        className="h-6 w-6 text-gray-400 bg-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        ></path>
      </svg>
    </div>}
  </button>
));


