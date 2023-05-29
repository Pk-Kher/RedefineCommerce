

import { ErrorMessage } from 'formik';
import React, { useState, useEffect, useRef } from 'react';
import FormErrorMessage from '../alerts/FormErrorMessage';

const CustomSearchDropDown = ({ name, onChange, options, toSet, uniqueId, defaultValue, displayError, isDisabled, ...rest }) => {

    const [searchResults, setSearchResults] = useState([]); // searchResults is the object we a are getting from api for our dropdown {object as options}
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownValue, setDropdownValue] = useState("");
    const trigger = useRef(null);
    const dropdown = useRef(null);
    useEffect(() => {
        setDropdownValue(defaultValue);
    }, [defaultValue]);
    let dropDownElem = useRef(null);

    useEffect(() => {
        !toSet && setSearchResults(options);
    }, [options]);

    useEffect(() => {
        if (dropdownValue) {
            if (toSet) {
                if (dropdownValue.length > 1) {
                    setSearchResults(() => {
                        return options.filter((value) => value.label.toLowerCase().includes(dropdownValue.toLowerCase()));
                    })
                } else {

                    setSearchResults(() => {
                        return [];
                    })
                }
            }
            else {
                setSearchResults(() => {
                    return options.filter((value) => value.label.toLowerCase().includes(dropdownValue.toLowerCase()));
                })
            }

        }
        else {
            !toSet ? setSearchResults(options) : setSearchResults([]);
        }
    }, [dropdownValue, options])

    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!dropdown.current) return;
            if (
                !dropdownOpen ||
                dropdown.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            setDropdownOpen(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });

    const onChangeHandler = (value) => {
        setDropdownValue(value);
        if (onChange instanceof Function) {
            onChange(value);
        }
    }
    return (
        <div className={`relative ${uniqueId}`}>
            <input
                className={`w-full bg-white rounded-md border border-neutral-200 ${isDisabled ? "bg-slate-100" : ""} ${uniqueId}`}
                type="text"
                id={name}
                placeholder="Search"
                value={dropdownValue}
                onChange={(e) => { onChangeHandler(e.target.value) }}
                name={name}
                onFocus={() => { setDropdownOpen(true); }}
                disabled={isDisabled}
                {...rest}
                ref={trigger}
            />
            {(displayError && name) && <ErrorMessage name={name} component={FormErrorMessage} />}
            <div ref={dropdown} id={uniqueId} className={`${uniqueId}`}>
                {
                    (dropdownValue?.length > 1 && dropdownOpen) && <div className={`origin-top-left z-10 absolute top-full max-h-96  overflow-y-auto right-0 left-0 min-w-72 bg-white border border-neutral-200 rounded shadow-lg overflow-hidden mt-1 ${uniqueId}`}>
                        <ul className={`py-1 ${uniqueId}"`} >
                            {searchResults.map((item, index) => {
                                return (
                                    <li className={`py-3 px-3 cursor-pointer mb-0.5 hover:bg-[#deebff] ${uniqueId}`} key={index} onClick={() => { onChangeHandler(item.value); setDropdownOpen(false); }}>
                                        <label className={`flex items-center cursor-pointer ${uniqueId}`}>
                                            <span className={`text-sm font-medium ml-2 ${uniqueId}`}>{item.label}</span>
                                        </label>
                                    </li>
                                )
                            })}
                            {searchResults?.length <= 0 &&
                                <li className={`py-3 px-3 cursor-pointer mb-0.5 hover:bg-[#deebff] ${uniqueId}`} >
                                    <label className={`flex items-center cursor-pointer ${uniqueId}`}>
                                        <span className={`text-sm font-medium ml-2 ${uniqueId}`}>No Match Found.</span>
                                    </label>
                                </li>}
                        </ul>
                    </div>
                }
            </div>
        </div>
    );
};

export default CustomSearchDropDown;

