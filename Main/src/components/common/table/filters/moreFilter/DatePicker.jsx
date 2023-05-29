import RangeDatePicker from "components/common/formComponent/RangeDatePicker";
import React, { useState, useEffect } from "react";
import { DateTimeFormat } from "services/common/helper/Helper";
import Transition from "utils/Transition";

function DatePicker({
  name,
  mainFilter,
  setMainFilter,
  columnName = name.toLowerCase().replaceAll(" ", "_"),
  conditionalSearch = false,
  setmainColumnFilter,
  openDropdown,
  applyMoreFilter,
  setShow,
  ...rest
}) {
  const [dateValue, setDateValue] = useState([null, null]);
  const [tempdateValue, setTempDateValue] = useState([null, null]);
  // console.log(dateValue);
  // useEffect(() => {
  //   if (mainFilter[filterValueName] !== undefined) {
  //     setDateValue(mainFilter[filterValueName]);
  //   } else {
  //     setDateValue([null, null]);
  //   }
  // }, [mainFilter, filterValueName]);
  useEffect(() => {
    setDateValue(() => {
      var temp = mainFilter.filter((value) => {
        return value.field === columnName;
      });
      if (temp.length > 0) {
        return temp[0].value.split(",");
      } else {
        return [null, null];
      }
    });
  }, [mainFilter, columnName]);
  useEffect(() => {
    if (
      tempdateValue[0] !== "" &&
      tempdateValue[1] !== "" &&
      tempdateValue[1] !== null &&
      tempdateValue[0] !== null
    ) {
      setmainColumnFilter({
        field: columnName,
        operator: 1,
        value: [
          DateTimeFormat(tempdateValue[0]).date,
          DateTimeFormat(tempdateValue[1]).date,
        ].join(","),
      });
    } else {
      setmainColumnFilter({
        field: columnName,
        operator: 1,
        value: "",
      });
    }
  }, [tempdateValue, columnName, setmainColumnFilter]);
  const onChangeHandler = (date) => {
    setTempDateValue(date);
  };
  const clearCurrentFilter = () => {
    applyMoreFilter(columnName);
  }
  return (
    <Transition
      className={`bg-white border-y border-b-0 border-neutral-200 max-h-96 overflow-y-auto md:overflow-visible`}
      show={openDropdown}
      enter="transition ease-out duration-200 transform"
      enterStart="opacity-0 -translate-y-2"
      enterEnd="opacity-100 translate-y-0"
      leave="transition ease-out duration-200"
      leaveStart="opacity-100"
      leaveEnd="opacity-0"
    >
      <div className="py-5 px-3">
        <RangeDatePicker
          name={name}
          defaultStartDate={dateValue[0]}
          defaultEndDate={dateValue[1]}
          onChange={onChangeHandler}
        // {...(() => {
        //   if (tempdateValue[0] !== "" && tempdateValue[0] !== null) {
        //     // console.log(tempdateValue[0]);
        //     return {
        //       maxDate: new Date(tempdateValue[0]).setMonth(
        //         new Date(tempdateValue[0]).getMonth() + 1
        //       ),
        //     };
        //   } else {
        //     return {};
        //   }
        // })()}
        />
        <button className=" text-gray-500 hover:text-gray-700" type="button" onClick={clearCurrentFilter}>Clear</button>
      </div>
    </Transition>
  );
}

export default DatePicker;
