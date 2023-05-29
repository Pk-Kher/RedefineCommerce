/*Component Name: Create
Component Functional Details:  Create .
Created By: PK Kher
Created Date: 6-21-2022
Modified By: PK Kher
Modified Date: 6-21-2022 */

import React from 'react';

import Input from 'components/common/formComponent/Input';
import { FieldArray, useFormikContext } from 'formik';
import Dropdown from 'components/common/formComponent/Dropdown';
import { FilteringOptions } from 'global/Enum';
import { brandColumnsOptions } from 'dummy/Dummy';

const Create = () => {
    const { values } = useFormikContext();
    return (
        <>
            <div className="pb-4">
                {values.customFilters.length > 0 && <div className="py-1 px-3">
                    <div className=" items-center pb-2 mb-2 ">
                        <Input name="name" type="text" className="relative grow mr-1 border-0 border-b border-neutral-200" placeholder="Custom Name" />
                    </div>
                </div>}
                <FieldArray
                    name="customFilters"
                    render={(fieldArrayProps) => {
                        const { form } = fieldArrayProps;
                        return (
                            <>
                                {form.values.customFilters.map((value, i) => {
                                    return (
                                        <Search
                                            fieldArrayProps={fieldArrayProps}
                                            key={i}
                                            index={i}
                                        />
                                    );
                                })}
                                <div className="flex justify-between py-1 px-3">
                                    <span onClick={() => {
                                        fieldArrayProps.push({
                                            field: "1",
                                            operator: "0",
                                            value: ''
                                        });
                                    }} className="btn bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer">Add Filter</span>
                                    {form.values.customFilters.length > 0 &&
                                        <button type={'reset'} onClick={() => {
                                            fieldArrayProps.push({
                                                field: "1",
                                                operator: "0",
                                                value: ''
                                            });
                                        }} className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700 cursor-pointer">Clear</button>}
                                </div>
                            </>
                        );
                    }}
                />
            </div>
        </>
    );
};

export default React.memo(Create);
const Search = React.memo(({ index, fieldArrayProps }) => {
    const { values } = useFormikContext();
    const operatorTypes = ['12', '13', '14', '15'];
    return (
        <>
            <div className='border-4 border-t shadow-sm shadow-blue-200 mb-2 pb-2'>
                <div className="flex items-center justify-end pr-2 pt-1">
                    <span onClick={fieldArrayProps.remove.bind(null, index)} className="inline-block w-6 h-6 text-rose-500 material-icons-outlined cursor-pointer">delete</span>
                </div>
                <div className="py-1 px-3">
                    <Dropdown
                        defaultValue={values.customFilters[index].field ? values.customFilters[index].field : 0}
                        name={`customFilters[${index}].field`}
                        options={brandColumnsOptions}
                        placeholder={`Select Field`}
                        isClearable={false}
                    />
                </div>
                <div className="py-1 px-3">
                    <Dropdown
                        // defaultValue={values.customFilters[index].operator}
                        defaultValue={values.customFilters[index].operator ? values.customFilters[index].operator : 0}
                        name={`customFilters[${index}].operator`}
                        options={FilteringOptions}
                        placeholder={`Select Operator`}
                        isClearable={false}
                    // onChange={(value) => { setFieldValue(`customFilters[${index}].operator`, value.value); }}

                    />
                </div>
                {(() => {
                    switch (true) {
                        case !operatorTypes.includes(values.customFilters[index].operator):
                            return (
                                <div className="py-1 px-3">
                                    <Input name={`customFilters[${index}].value`} id={`customFilters[${index}].value`} placeholder={`Value`} />
                                </div>
                            );
                        /* case ['3', '4', '5', '6', '7', '8'].includes(values.customFilters[index].operator):
                            return (
                                <div className="py-1 px-3">
                                    <Input
                                        name={`customFilters[${index}].value`}
                                        id={`customFilters[${index}].value`}
                                        placeholder={`Value`}
                                        onKeyPress={(event) => {
                                            if (!/^\d*\.?\d*$/.test(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}
                                        value={values.customFilters[index].value.replace(/^\D+/g, '')}
                                        onChange={(e) => setFieldValue(`customFilters[${index}].value`, e.target.value)}
                                    />
                                </div>
                            ); */
                        default:
                            break;
                    }
                })()}
            </div>
        </>
    );
})
