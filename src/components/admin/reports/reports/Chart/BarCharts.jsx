import React, { useState, useRef, forwardRef } from "react";
import { BarChart, XAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { subDays } from "date-fns";
import DatePicker from "react-datepicker";
const BarCharts = ({
  title,
  data,
  dateFilter = false,
  startDate,
  setstartDate,
  endDate,
  setendDate,
  ...rest
}) => {
  const toDatePicker = useRef();

  const onStartDateChangeHandler = (date) => {
    setstartDate(date);
    toDatePicker.current.input.click();
  };

  const onEndDateChangeHandler = (date) => {
    setendDate(date);
  };

  const CustomDatePicker = ({
    onChangeHandler,
    defaultDate,
    minDate,
    maxDate,
    refDatePicker,
  }) => {
    const CustomInput = forwardRef(({ value, onClick, disabledLogo }, ref) => (
      <button
        type="button"
        className={`w-full h-10 bg-white border text-left border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md ${"className"}`}
        onClick={onClick}
        ref={ref}
      >
        {value}
        {!disabledLogo && (
          <div className="absolute top-0 right-0 px-3 py-2 ">
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
          </div>
        )}
      </button>
    ));
    return (
      <>
        <div className="w-52">
          <DatePicker
            dateFormat={"MM - dd - yyyy"}
            selected={defaultDate}
            onChange={onChangeHandler}
            minDate={subDays(minDate, 0)}
            maxDate={subDays(maxDate, 0)}
            customInput={<CustomInput disabledLogo={false} />}
            ref={refDatePicker}
          />
        </div>
      </>
    );
  };

  return (
    <>
      <div className="col-span-full lg:col-span-full xl:col-span-4 w-full">
        <div className="w-full bg-white shadow-lg rounded-md">
          <div className="flex flex-wrap justify-between items-center px-5 py-4 border-b-2 border-neutral-200">
            <div className="grow font-semibold text-base lg:text-xl text-gray-700">
              {title}
            </div>
            <div className="flex flex-wrap justify-between items-center">
              {dateFilter && (
                <>
                  <CustomDatePicker
                    onChangeHandler={onStartDateChangeHandler}
                    defaultDate={startDate}
                    maxDate={endDate}
                  />
                  <div className="mx-2">to</div>
                  <CustomDatePicker
                    onChangeHandler={onEndDateChangeHandler}
                    defaultDate={endDate}
                    minDate={startDate}
                    refDatePicker={toDatePicker}
                  />
                </>
              )}
            </div>
          </div>
          <div className="text-center p-3">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                width={700}
                height={300}
                data={data}
                margin={{
                  top: 10,
                  right: 30,
                  left: 20,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeLinecap="3 3" />
                <XAxis dataKey="name" />
                {rest.children}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default BarCharts;
