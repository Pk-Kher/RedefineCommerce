import React from 'react';
import Select from 'components/common/formComponent/Select';
import { useFormikContext } from "formik";
import { themeMaxContainerWidthOption } from 'dummy/Dummy'
import Dropdown from 'components/common/formComponent/Dropdown';

const MaxContainerWidth = ({ name, value, ...rest }) => {
    const { setFieldValue, values } = useFormikContext();
    return (
        <>
            <div>
                <label className="text-sm mb-1 flex flex-wrap">
                    <span> Max Container Width </span>
                </label>
                <div >
                    <Dropdown
                        label=""
                        name={name && name}
                        options={themeMaxContainerWidthOption}
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

export default MaxContainerWidth