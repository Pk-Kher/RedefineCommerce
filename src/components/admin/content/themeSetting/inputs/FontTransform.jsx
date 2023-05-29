import React, { useState, useEffect } from 'react'
import { useFormikContext } from "formik";
import { themeFontTransformationOption } from 'dummy/Dummy'
import Dropdown from 'components/common/formComponent/Dropdown';

const FontTransform = ({ name, value, ...rest }) => {
    const { setFieldValue, values } = useFormikContext();
    return (
        <>
            <div>
                <label className="text-sm mb-1 flex flex-wrap">
                    <span> Transform </span>
                </label>
                <div >
                    <Dropdown
                        label={''}
                        name={name && name}
                        options={themeFontTransformationOption}
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

export default FontTransform