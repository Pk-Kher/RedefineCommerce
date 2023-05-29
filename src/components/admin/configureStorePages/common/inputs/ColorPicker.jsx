/*Component Name: ColorPicker
Component Functional Details: User can create or update ColorPicker master details from here.
Created By: chandan
Created Date: <Creation Date>
Modified By: chandan
Modified Date: <Modified Date> */

import React from 'react'
import { useFormikContext } from "formik";
import ColorPickerComponent from 'components/common/formComponent/ColorPicker';

const ColorPicker = ({ name, title = "Color", conditionalRender = false, ...rest }) => {
    const { values } = useFormikContext();
    return (
        <>
            <div className='pt-4'>
                <label className=" text-sm mb-1 flex flex-wrap font-bold">
                    <span> {title} </span>
                </label>
                <ColorPickerComponent
                    name={name ? name : 'color'}
                    value={values[name] ? values[name] : ""}
                    defaultValue={values[`${name}`]}
                />
            </div>
        </>
    )
}

export default ColorPicker