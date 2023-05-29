import React from 'react'
import { useFormikContext } from "formik";
import Input from "components/common/formComponent/Input";

import { themeFontSizeOption } from 'dummy/Dummy';
import Dropdown from 'components/common/formComponent/Dropdown';

const FontSize = ({ name, value, ...rest }) => {
    const { setFieldValue, values } = useFormikContext();
    return (
        <>
            <div>
                <label className="text-sm mb-1 flex flex-wrap">
                    <span> Size </span>
                </label>
                <div className=''>
                    <Dropdown
                        label={''}
                        name={name && name}
                        options={themeFontSizeOption}
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

export default FontSize