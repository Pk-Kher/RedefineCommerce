import React, { useState, useEffect, useRef } from "react";
import Select, { components } from "react-select";
import FormErrorMessage from "components/common/alerts/FormErrorMessage";
import { ErrorMessage, useFormikContext } from "formik";
import { useSelector } from "react-redux";

const Dropdown = ({
  options = [],
  defaultValue,
  classNames,
  label,
  name,
  isMulti,
  onChange,
  hidecheckbox,
  optionHoverColor,
  optionStyle,
  isClearable,
  isDisabled,
  ...res
}) => {
  const permission = useSelector(store => store.permission);
  const [dropdownValue, setDropdownValue] = useState([]);

  const [optionsData, setOptionsData] = useState([]);

  useEffect(() => {
    setOptionsData(() => {
      return options ? options : [] /* Object.keys(options).map((value, key) => {
        return { label: options[value], value: value };
      }) */;
    });
  }, [options, setOptionsData]);

  let defaultVal = useRef(defaultValue);

  useEffect(() => {
    if (defaultValue) {
      setDropdownValue(() => {
        let defaultV;
        if (!isMulti) {
          defaultV = optionsData.filter((option) => {
            return (
              (option.value ? option.value.toString() : option.value) ===
              defaultValue.toString()
            );
          });
        } else {
          defaultVal.current = defaultValue.map((value) =>
            value ? value.toString() : value
          );
          defaultV = optionsData.filter((option) => {
            return defaultVal.current.includes(
              option.value ? option.value.toString() : option.value
            );
          });
        }
        return defaultV.length > 0 ? (isMulti ? defaultV : defaultV[0]) : null;
      });
    } else {
      setDropdownValue(null);
    }
  }, [defaultValue, isMulti, optionsData]);

  const colourStyles = {
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        // backgroundColor: isFocused
        //   ? (optionHoverColor
        //     ? optionHoverColor
        //     : "#52525e")
        //   : !isMulti
        //     ? null
        //     : null,
        // color: isFocused ? "#fff" : /* "#333333" */"#6366f1",
        ...optionStyle,
      };
    },
  };

  const { setFieldValue, setFieldTouched } = useFormikContext();
  const onChangeHandler = (value, event) => {
    setFieldTouched(name);
    if (onChange instanceof Function) onChange(value, event);
    else if (setFieldValue instanceof Function) {
      setFieldValue(
        name,
        value ? (!isMulti ? (isNaN(Number(value.value)) ? value.value : Number(value.value)) : value.map((v) => isNaN(Number(v.value)) ? v.value : Number(v.value))) : ""
      );
    }

  };

  return (
    <>
      {
        /* options && options.length !== 0 ? */
        <Select
          isMulti={isMulti}
          isClearable={isClearable == false ? false : true}
          name={name}
          options={optionsData}
          className={`focus:border-0 ${isDisabled ? 'bg-slate-100' : ""} ${classNames}`}
          closeMenuOnSelect={!isMulti}
          components={{
            Option: (props) => (
              <Option
                {...props}
                isMulti={isMulti}
                dropdownValue={dropdownValue}
                hidecheckbox={hidecheckbox}
              />
            ),
            Input,
          }}
          hideSelectedOptions={false}
          styles={colourStyles}
          isSearchable={true}
          onChange={(value, event) => onChangeHandler(value, event)}
          value={dropdownValue}
          isDisabled={(!permission?.isEdit && !permission?.isDelete) || isDisabled}
          {...res}
        // defaultValue={() => {
        //   let defaultV = !isMulti ? options.filter((option) => {
        //     return option.value === defaultValue;
        //   }) : options.filter((option) => {
        //     return defaultValue.includes(parseInt(option.value));
        //   });
        //   return isMulti ? defaultV : defaultV[0];
        // }}
        /> /* : '' */
      }
      {name && <ErrorMessage name={name} component={FormErrorMessage} />}
    </>
  );
};

export default React.memo(Dropdown);

const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <label className="flex items-center p-0">
          {props.isMulti && props.hidecheckbox === false && (
            <input
              type="checkbox"
              defaultChecked={
                props.dropdownValue
                  ? props.dropdownValue.filter(
                    (value) => value.value === props.data.value
                  ).length > 0
                  : false
              }
              onChange={null}
              className="form-checkbox"
              id="1"
            />
          )}

          <span className="text-sm font-medium ml-2" style={props?.data?.style || {}}>{props.label}</span>
        </label>
      </components.Option>
    </div>
  );
};

const Input = (props) => {
  if (props.isHidden) {
    return <components.Input {...props} />;
  }

  return <components.Input {...props} type="" />;
};
