import React, { useState, useEffect } from 'react'
import { useFormikContext } from "formik";
import { themeFontStyleOptions } from 'dummy/Dummy'
import Dropdown from 'components/common/formComponent/Dropdown';

const FontStyle = ({ name, value, ...rest }) => {
    const { setFieldValue, values } = useFormikContext();
    return (
        <>
            <div>
                <label className="text-sm mb-1 flex flex-wrap">
                    <span> Font </span>
                </label>
                <div >
                    <Dropdown
                        label={''}
                        name={name && name}
                        options={themeFontStyleOptions}
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

export default FontStyle