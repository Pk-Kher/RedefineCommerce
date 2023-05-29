import React, { useEffect, useState, forwardRef } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ErrorMessage, useFormikContext } from "formik";
import FormErrorMessage from "components/common/alerts/FormErrorMessage";
// formate mm/dd/yyyy
const DatePicker = ({ className, name, defaultStartDate, defaultEndDate, onChange, dateFormat, disabledLogo, ...rest }) => {
    const [dateRange, setDateRange] = useState([
        defaultStartDate ? new Date(defaultStartDate) : null,
        defaultEndDate ? new Date(defaultEndDate) : null
    ]);
    const [startDate, endDate] = dateRange;
    useEffect(() => {
        setDateRange(() => {
            return [
                defaultStartDate ? new Date(defaultStartDate) : null,
                defaultEndDate ? new Date(defaultEndDate) : null
            ]
        });
    }, [defaultStartDate, defaultEndDate]);
    const { setFieldValue } = useFormikContext();
    const onChangeHandler = (date) => {
        setDateRange(date)
        date = date === null ? '' : date;
        if (onChange instanceof Function) {
            onChange(date);
        } else if (setFieldValue instanceof Function) {
            // date = date.filter(value => value !== null);
            setFieldValue(name, date);
        }
    }
    return (
        <>
            <div className="relative mb-2">
                <ReactDatePicker
                    dateFormat={dateFormat ? dateFormat : 'MM _ dd _ yyyy'}
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={onChangeHandler}
                    className={`w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md ${className}`}
                    customInput={<CustomInput disabledLogo={disabledLogo} />}
                    {...rest}

                />
            </div>
            {name && <ErrorMessage name={name} component={FormErrorMessage} />}
        </>
    );
};

export default React.memo(DatePicker);

const CustomInput = forwardRef(({ value, onClick, disabledLogo }, ref) => (
    <button type="button" className={`w-full h-10 bg-white border text-left border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md ${'className'}`} onClick={onClick} ref={ref}>

        {value.replaceAll("-", " to ").replaceAll("_", "-")}
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
