import React from 'react';
import { useFormikContext } from "formik";
import { themeVerticalSpacingOption } from 'dummy/Dummy'
import Dropdown from 'components/common/formComponent/Dropdown';

const VerticalSpacing = ({ name, value, ...rest }) => {

    const { setFieldValue, values } = useFormikContext();
    return (
        <>
            <div>
                <label className="text-sm mb-1 flex flex-wrap">
                    <span> Vertical Spacing </span>
                </label>
                <div >
                    <Dropdown
                        label=""
                        name={name && name}
                        options={themeVerticalSpacingOption}
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

export default VerticalSpacing