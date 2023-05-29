/*Component Name: DropdownFilter
Component Functional Details:  DropdownFilter .
Created By: PK Kher
Created Date: 6-20-2022
Modified By: PK Kher
Modified Date: 6-20-2022 */

import Select from 'components/common/formComponent/Select';
import React, { useState, useEffect } from 'react';

const DropdownFilter = ({ name, columnName, options, setColumnFilter, filteringOptions, defaultValue }) => {
    const [dropdownValue, setDropdownValue] = useState("");
    useEffect(() => {
        setDropdownValue(defaultValue ? defaultValue : '');
    }, []);
    const dropdownHandleChange = (e) => {
        setDropdownValue(() => {
            return e ? e.value : ''
        });
        if (e && e.value !== "-1" && e.value !== "0") {
            setColumnFilter({
                field: columnName,
                operator: 0,
                value: e.value,
            });
        } else {
            setColumnFilter({
                field: columnName,
                operator: 0,
                value: "",
            });
        }
    };
    return (
        <>
            <div>
                <Select
                    name={name}
                    options={options}
                    onChange={dropdownHandleChange}
                    defaultValue={dropdownValue}
                />
            </div>
        </>
    );
};

export default DropdownFilter;
