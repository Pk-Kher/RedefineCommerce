/*Component Name: Select
Component Functional Details: simple Select Box
Created By: PK Kher
Created Date: 6/6/2022 
Modified By: chandan
Modified Date:6/6/2022 */

import React, { useState, useEffect, useRef } from "react";
import ReactSelect, { components } from "react-select";

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
    optionClass,
    ...rest
}) => {
    const [dropdownValue, setDropdownValue] = useState([]);

    const [optionsData, setOptionsData] = useState([]);

    useEffect(() => {
        setOptionsData(() => {
            return options ? options : []
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
                ...optionStyle,
            };
        },
    };

    const onChangeHandler = (value, event) => {
        if (onChange instanceof Function) onChange(value, event);
    };

    return (
        <>
            {
                /* options && options.length !== 0 ? */
                <ReactSelect
                    isMulti={isMulti}
                    isClearable={isClearable == false ? false : true}
                    name={name}
                    options={optionsData}
                    className={` ${rest?.isDisabled ? "bg-slate-100" : ""} ${classNames}`}
                    closeMenuOnSelect={!isMulti}
                    components={{
                        Option: (props) => (
                            <Option
                                {...props}
                                isMulti={isMulti}
                                dropdownValue={dropdownValue}
                                hidecheckbox={hidecheckbox}
                                optionClass={optionClass}
                            />
                        ),
                        Input,
                    }}
                    hideSelectedOptions={false}
                    styles={colourStyles}
                    isSearchable={true}
                    onChange={(value, event) => onChangeHandler(value, event)}
                    value={dropdownValue}
                    {...rest}
                />
            }
        </>
    );
};

export default React.memo(Dropdown);

const Option = (props) => {
    return (
        <div>
            <components.Option {...props}>
                <label className={`flex items-center p-0 ${props.optionClass}`}>
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

                    <span className="text-sm font-medium ml-2">{props.label}</span>
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
