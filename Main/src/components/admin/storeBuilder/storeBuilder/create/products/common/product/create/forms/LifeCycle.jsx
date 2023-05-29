/*Component Name: LifeCycle
Component Functional Details: User can create or update LifeCycle master details from here.
Created By: Keval Takodara
Created Date: 26th JULY, 2022
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useState, useEffect, forwardRef, useRef } from 'react';

import { productActivityDropDownData } from 'global/Enum';
import Select from 'components/common/formComponent/Select';
import { DateTimeFormat } from "services/common/helper/Helper";
import DatePicker from "react-datepicker";
import { subDays, subMonths } from 'date-fns'
import "react-datepicker/dist/react-datepicker.css";
import { ChartOrderData, ChartInventoryData } from "dummy/Dummy";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LifeCycle = ({ productActivityDropDown = true }) => {

    const initialValues = {
        product_activity: '0',
        start_date: new Date(),
        end_date: new Date()
    };
    const toDatePicker = useRef();
    const [dropDownOption, setdropDownOption] = useState(productActivityDropDownData);
    const [dropDownSelectedValue, setdropDownSelectedValue] = useState(initialValues?.product_activity);
    const [startDate, setstartDate] = useState(initialValues?.start_date);
    const [endDate, setendDate] = useState(initialValues?.end_date);

    const [productInventoryData, setProductInventoryData] = useState([]);
    const [productOrderData, setProductOrderData] = useState([]);

    const DropDownCurrentVal = (value) => {
        setdropDownSelectedValue(value);
    };

    const onStartDateChangeHandler = (date) => {
        setstartDate(date);
        toDatePicker.current.input.click();
    };

    const onEndDateChangeHandler = (date) => {
        setendDate(date);
    };

    useEffect(() => {
        if (dropDownSelectedValue === '0') {
            setProductInventoryData(ChartInventoryData);
        } else {
            setProductOrderData(ChartOrderData);
        }
    }, [dropDownSelectedValue, startDate, endDate]);

    return (
        <>
            <div className="px-6 py-8 border-b-2 border-neutral-200">
                <div className="flex items-center justify-between mb-6">
                    <div className="tracking-wide text-gray-500 text-base font-bold">Life Cycle</div>
                    <div className="flex flex-wrap gap-2 items-center">
                        {productActivityDropDown && <ProductActivityDropDown dropDownOption={dropDownOption} DropDownCurrentVal={DropDownCurrentVal} />}

                        <CustomDatePicker onChangeHandler={onStartDateChangeHandler} defaultDate={startDate} maxDate={endDate} />
                        <div className="">-</div>
                        <CustomDatePicker onChangeHandler={onEndDateChangeHandler} defaultDate={endDate} minDate={startDate} refDatePicker={toDatePicker} />
                    </div>
                </div>
                <div className="text-center">
                    {
                        (dropDownSelectedValue === '0') ? <CustomLineChart data={productInventoryData} label="InventoryData" /> : <CustomLineChart data={productOrderData} label="OrderData" />
                    }
                </div>
            </div>
        </>
    );
};

export default LifeCycle;

const ProductActivityDropDown = ({ dropDownOption, DropDownCurrentVal }) => {
    return (
        <>
            <div className="w-52">
                <Select
                    label=""
                    defaultValue={'0'}
                    name="product_activity"
                    options={dropDownOption}
                    onChange={(e) => {
                        if (e) {
                            DropDownCurrentVal(e.value)
                        }
                        else {
                            DropDownCurrentVal("");
                        }
                    }}
                />
            </div>
        </>
    );
};

const CustomDatePicker = ({ onChangeHandler, defaultDate, minDate, maxDate, refDatePicker }) => {
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
}

const CustomLineChart = ({ data, label }) => {
    return (
        <>
            <h2>{label}</h2>
            <ResponsiveContainer width="100%" aspect={2}>
                <LineChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid stroke="#f4f7fa" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="" dataKey="2022" stroke="#000000" activeDot={{ r: 8 }} />
                    <Line type="" dataKey="2021" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </>
    );
}

