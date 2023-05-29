/*Component Name: LifeCycle
Component Functional Details: User can create or update LifeCycle master details from here.
Created By: Keval Takodara
Created Date: 26th JULY, 2022
Modified By: Shrey Patel,Divyesh shah
Modified Date: 05/01/2023 */

import React, { useState, useEffect, forwardRef, useRef } from 'react';

// import { productActivityDropDownData } from 'global/Enum';
import Select from 'components/common/formComponent/Select';
import DatePicker from "react-datepicker";
import { subDays } from 'date-fns'
import "react-datepicker/dist/react-datepicker.css";
import { ChartInventoryData } from "dummy/Dummy";
import { CurrencySymbolByCode } from '../../../../../global/Enum'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LifeCycle = ({ productActivityDropDown = true, storeDropDown = true, ProductView = true, setFormSubmit, inventoryData, setEndToDate, setStartFromDate, chartData, EndToDate, StartFromDate, dropDownOption, dropDownSelectedValue, setdropDownSelectedValue, StoreDropDownOption, StoreDropDownSelectedValue, setStoreDropDownSelectedValue, setColumnFilteringOptions }) => {

    useEffect(() => {
        setFormSubmit && setFormSubmit(null)
    }, [])

    let today = new Date();
    const initialValues = {
        store_activity: '0',
        product_activity: '0',
        start_date: new Date(new Date().setDate(today.getDate() - 7)),
        end_date: new Date(new Date().setDate(today.getDate() + 1))
    };
    const toDatePicker = useRef();

    const [productInventoryData, setProductInventoryData] = useState([]);
    const [productOrderData, setProductOrderData] = useState([]);

    const DropDownCurrentVal = (value) => {
        setdropDownSelectedValue(value);
    };

    const StoreDropDownCurrentVal = (value) => {
        setStoreDropDownSelectedValue(value);
    };

    const onStartDateChangeHandler = (date) => {
        setStartFromDate(date);
        toDatePicker.current.input.click();
    };

    const onEndDateChangeHandler = (date) => {
        setEndToDate(date);
    };

    useEffect(() => {
        if (dropDownSelectedValue === '0') {
            setProductInventoryData(chartData);
        } else {
            if (chartData?.length > 0) {
                setProductOrderData(chartData);
            }
        }
    }, [dropDownSelectedValue, StartFromDate, EndToDate, chartData]);

    return (
        <>
            <div className="px-6 py-8 border-b-2 border-neutral-200">
                <div className="flex items-center justify-between mb-6">
                    <div className="text-xl tracking-wide text-gray-500 font-semibold">Life Cycle</div>
                    <div className="flex flex-wrap gap-2 items-center">
                        {productActivityDropDown && <ProductActivityDropDown dropDownOption={dropDownOption} StoreDropDownOption={StoreDropDownOption} StoreDropDownSelectedValue={StoreDropDownSelectedValue} storeDropDown={storeDropDown} DropDownCurrentVal={DropDownCurrentVal} StoreDropDownCurrentVal={StoreDropDownCurrentVal} dropDownSelectedValue={dropDownSelectedValue} />}

                        <CustomDatePicker onChangeHandler={onStartDateChangeHandler} defaultDate={StartFromDate} maxDate={EndToDate} />
                        <div >-</div>
                        <CustomDatePicker onChangeHandler={onEndDateChangeHandler} defaultDate={EndToDate} minDate={StartFromDate} refDatePicker={toDatePicker} />
                    </div>
                </div>
                <div className="text-center">
                    {
                        (dropDownSelectedValue == '0') ? <CustomLineChart data={productInventoryData} ProductView={ProductView} USD={CurrencySymbolByCode.USD} label="InventoryData" dropDownSelectedValue={dropDownSelectedValue} /> : <CustomLineChart data={productOrderData} USD={CurrencySymbolByCode.USD} ProductView={ProductView} label="OrderData" dropDownSelectedValue={dropDownSelectedValue} />
                    }
                </div>
            </div>
        </>
    );
};

export default LifeCycle;

const ProductActivityDropDown = ({ dropDownOption, StoreDropDownOption, DropDownCurrentVal, StoreDropDownCurrentVal, StoreDropDownSelectedValue, dropDownSelectedValue, storeDropDown }) => {
    return (
        <>
            {storeDropDown &&
                <div className="w-52">
                    <Select
                        label=""
                        defaultValue={StoreDropDownSelectedValue || '0'}
                        name="store_activity"
                        options={StoreDropDownOption}
                        onChange={(e) => {
                            if (e) {
                                StoreDropDownCurrentVal(e.value)
                            }
                            else {
                                StoreDropDownCurrentVal("");
                            }
                        }}
                    />
                </div>
            }
            <div className="w-52">
                <Select
                    label=""
                    defaultValue={dropDownSelectedValue || '0'}
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

const CustomLineChart = ({ data, ProductView, label, USD, dropDownSelectedValue }) => {
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
                    <XAxis dataKey="monthName" />
                    {ProductView ?
                        <>
                            <YAxis tickFormatter={value => {
                                let val = value;
                                return dropDownSelectedValue == 1 ? `${USD}${new Intl.NumberFormat("en").format(val)}` : `${new Intl.NumberFormat("en").format(val)}`;
                            }} />
                            <Tooltip formatter={function (value, name, props) {
                                if (props.dataKey == dropDownSelectedValue == 0 ? "inventory" : "orders") {
                                    return dropDownSelectedValue == 1 ? `${USD}${value}` : `${value}`;
                                }
                            }} />
                            <Legend />
                            {/* <Line type="" name="Year" dataKey="year" stroke="#000000" /> */}
                            <Line type="" name={dropDownSelectedValue == 0 ? "Inventory" : "Orders"} dataKey={dropDownSelectedValue == 0 ? "inventory" : "orders"} stroke="#8884d8" activeDot={{ r: 8 }} />
                        </>
                        :
                        <>
                            <YAxis tickFormatter={value => {
                                let val = value;
                                return `$${new Intl.NumberFormat("en").format(val)}`;
                            }} />
                            <Tooltip formatter={function (value, name, props) {
                                if (props.dataKey == "ordersAmount") {
                                    return `${USD}${value}`;
                                }
                            }} />
                            <Legend />
                            {/* <Line type="" name="Year" dataKey="year" stroke="#000000" /> */}
                            <Line type="" name="Orders Amount" dataKey="ordersAmount" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </>
                    }
                </LineChart>
            </ResponsiveContainer>
        </>
    );
}

