import React, { useState } from "react";
// import Transition from "../../../../../utils/Transition";
import RadioButtonGroup from "./RadioButtonGroup";
import CheckboxGroup from "./CheckboxGroup";
import DatePicker from "./DatePicker";
import CustomFilter from "./customFilter/CustomFilter";
import CustomComponent from "./CustomComponent";

const Dropdown = ({
  name,
  type,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="relative border-b border-neutral-200">
        <button
          className="flex w-full flex-wrap justify-between items-center text-sm px-3 py-2 bg-white border-0"
          aria-haspopup="true"
          onClick={() => setOpen(!open)}
        >
          <span className="ml-1">{name}</span>

          {open ? <span className="material-icons-outlined">expand_less</span> : <span className="material-icons-outlined">expand_more</span>}
        </button>
        {/* <Transition
          className={`bg-white border-y border-b-0 border-neutral-200 max-h-96 overflow-y-auto md:overflow-visible`}
          show={open}
          enter="transition ease-out duration-200 transform"
          enterStart="opacity-0 -translate-y-2"
          enterEnd="opacity-100 translate-y-0"
          leave="transition ease-out duration-200"
          leaveStart="opacity-100"
          leaveEnd="opacity-0"
        > */}
        {(() => {
          switch (type) {
            case "radio":
              return (
                <RadioButtonGroup
                  name={name}
                  type={type}
                  openDropdown={open}
                  {...rest}
                />
              );
            case "checkbox":
              return (
                <CheckboxGroup
                  name={name}
                  type={type}
                  openDropdown={open}
                  {...rest}
                />
              );
            case "date":
              return (
                <DatePicker
                  name={name}
                  type={type}
                  openDropdown={open}
                  {...rest}
                />
              );
            case "filter_by":
              return (
                <CustomFilter
                  name={name}
                  type={type}
                  openDropdown={open}
                  {...rest}
                />
              );
            case "custom_component":
              return (
                <CustomComponent
                  name={name}
                  type={type}
                  openDropdown={open}
                  {...rest}
                />
              );
            default:
              return "";
          }
        })()}
        {/* </Transition> */}
      </div>
    </>
  );
};

export default React.memo(Dropdown);
