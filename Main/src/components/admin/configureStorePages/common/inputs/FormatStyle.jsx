import React from 'react'
import { useFormikContext } from "formik";

import Dropdown from 'components/common/formComponent/Dropdown';

const FormatStyle = ({ name, title, options, ...rest }) => {
    const { setFieldValue, values } = useFormikContext();
    return (
        <>
            <div className='pt-4'>
                <label className="text-sm mb-1 flex flex-wrap font-bold">
                    <span>{title}</span>
                </label>
                <div>
                    {/* <Dropdown
                        label={''}
                        name={name && name}
                        options={options}
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
                        {...rest}
                    /> */}
                    <Dropdown
                        defaultValue={values[name] ? values[name] : (rest?.isMulti ? [] : '')}
                        name={name && name}
                        options={
                            options
                        }
                        {...rest}
                    />
                </div>
            </div>
        </>
    )
}

export default FormatStyle