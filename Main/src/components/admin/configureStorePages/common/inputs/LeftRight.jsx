/*Component Name: LeftRight
Component Functional Details:  LeftRight .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import { useFormikContext } from 'formik';
import React from 'react';
import { useSelector } from 'react-redux';

const LeftRight = ({ name, title, conditionalRender, conditionalValue }) => {
    const { setFieldValue, values } = useFormikContext();
    const permission = useSelector(store => store.permission);
    return (
        (!conditionalRender || values[conditionalRender] === conditionalValue) ? <>
            <div className="flex justify-between items-center mb-4 last:mb-0">
                <div className="block font-bold">{title}</div>
            </div>
            <div className="flex justify-between items-center mb-4 last:mb-0">
                <ul className="flex gap-1">
                    <li>
                        <button type='button' disabled={!permission?.isEdit && !permission?.isDelete} className={`border-2 rounded-md overflow-hidden focus:ring-indigo-500 focus:border-indigo-500 ${values[name] === 'left' ? 'border-blue-500 activeTab' : 'border-gray-300 cursor-pointer'} `} onClick={() => setFieldValue(name, 'left')}>
                            <span className={`w-full py-2 px-3 bg-white text-gray-500 hover:text-gray-700 flex items-center `} >
                                <span className="material-icons-outlined">format_align_left</span><span className="ml-1">Left</span>
                            </span>
                        </button>
                    </li>
                    <li>
                        <button type='button' disabled={!permission?.isEdit && !permission?.isDelete} className={`border-2 rounded-md overflow-hidden focus:ring-indigo-500 focus:border-indigo-500 ${values[name] === 'right' ? 'border-blue-500 activeTab' : 'border-gray-300 cursor-pointer'} `} onClick={() => setFieldValue(name, 'right')}>
                            <span className={`"w-full py-2 px-3 bg-white text-gray-500 hover:text-gray-700 flex items-center`}>
                                <span className="material-icons-outlined">format_align_right</span>
                                <span className="ml-1">Right</span>
                            </span>
                        </button>
                    </li>
                </ul>
            </div>
        </> : ''
    );
};

export default LeftRight;
