import React, { useState, useEffect } from 'react'
import { useFormikContext } from "formik";
import { themeFontWeightOption } from 'dummy/Dummy'
import Dropdown from 'components/common/formComponent/Dropdown';

const FontWeight = ({ name, value, ...rest }) => {
    const { setFieldValue, values } = useFormikContext();
    return (
        <>
            <div>
                <label className="text-sm mb-1 flex flex-wrap">
                    <span> Font Weight </span>
                </label>
                <div >
                    <Dropdown
                        label=""
                        name={name}
                        options={themeFontWeightOption}
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

export default FontWeight