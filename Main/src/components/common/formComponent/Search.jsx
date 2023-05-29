import React, { useState, useEffect, useRef } from "react";
import Select, { components } from "react-select";
import FormErrorMessage from "components/common/alerts/FormErrorMessage";
import { ErrorMessage, useFormikContext } from "formik";

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
  ...res
}) => {
  const [dropdownValue, setDropdownValue] = useState([]);

  const [optionsData, setOptionsData] = useState([]);

  useEffect(() => {
    setOptionsData(() => {
      return Object.keys(options).map((value, key) => {
        return { label: options[value], value: value };
      });
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
        backgroundColor: isFocused
          ? optionHoverColor
            ? optionHoverColor
            : "rgb(79 70 229)"
          : !isMulti
          ? null
          : null,
        color: isFocused ? "#fff" : "#333333",
        ...optionStyle,
      };
    },
  };

  const { setFieldValue } = useFormikContext();
  const onChangeHandler = (value, event) => {
    if (onChange instanceof Function) onChange(value, event);
    else if (setFieldValue instanceof Function) {
      setFieldValue(
        name,
        value ? (!isMulti ? value.value : value.map((v) => v.value)) : ""
      );
    }
  };

  return (
    <>
      {
        <Select
          isMulti={isMulti}
          isClearable={isClearable == false ? false : true}
          name={name}
          options={optionsData}
          className={`${classNames}`}
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
            Control,
            DropdownIndicator,
            IndicatorSeparator,
          }}
          hideSelectedOptions={false}
          styles={colourStyles}
          isSearchable={true}
          onChange={(value, event) => onChangeHandler(value, event)}
          value={dropdownValue}
          {...res}
        />
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
          <div className="flex justify-between w-full">
            <span className="text-sm font-medium ml-2">{props.label}</span>
            {props.options.filter((value) => {
              return value.value === props?.dropdownValue?.value;
            })[0]?.value === props.data.value && (
              <span className="material-icons-outlined -mr-9">checked</span>
            )}
          </div>
        </label>
      </components.Option>
    </div>
  );
};

const Input = (props) => {
  const inputFieldCursor = props["aria-expanded"]
    ? "cursor-text"
    : "cursor-pointer";
  return <components.Input {...props} className={`${inputFieldCursor}`} />;
};

const Control = ({ children, ...props }) => (
  <components.Control {...props}>
    <span className="material-icons-outlined ml-2">search</span> {children}
  </components.Control>
);

const DropdownIndicator = (props) => {
  return <></>;
};

const IndicatorSeparator = ({ innerProps }) => {
  return <></>;
};
