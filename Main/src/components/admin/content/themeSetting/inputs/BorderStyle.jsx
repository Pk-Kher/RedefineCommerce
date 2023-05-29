import React, { useState, useEffect } from 'react'
import { useFormikContext } from "formik";
import { themeBorderStyleOptions } from 'dummy/Dummy'
import Dropdown from 'components/common/formComponent/Dropdown';

const BorderStyle = ({ name, value, ...rest }) => {

    const { setFieldValue, values } = useFormikContext();
    return (
        <>
            <div>
                <label className="text-sm mb-1 flex flex-wrap">
                    <span> Style </span>
                </label>
                <div >
                    <Dropdown
                        label={''}
                        name={name && name}
                        options={themeBorderStyleOptions}
                        defaultValue={values[name]}
                        isSearchable={false}

                        onChange={(e) => {
                            if (e) {
                                setFieldValue(
                                    name,
                                    e.value
                                );
                            } else {
                                setFieldValue(name, "");
                            }
                        }}
                    />
                </div>
            </div>
        </>
    )
}

export default BorderStyle