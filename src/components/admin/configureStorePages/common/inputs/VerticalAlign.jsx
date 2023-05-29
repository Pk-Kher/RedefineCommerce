/*Component Name: VerticalAlign
Component Functional Details:  VerticalAlign .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import { useFormikContext } from 'formik';
import React from 'react';
import { useSelector } from 'react-redux';

const VerticalAlign = ({ name, title = 'Vertical Align' }) => {
    const permission = useSelector(store => store.permission);
    const { setFieldValue, values } = useFormikContext();
    return (
        <>
            <div className="flex justify-between items-center mb-4 last:mb-0 pt-4">
                <div className="block font-bold">{title}</div>
            </div>
            <div className="flex justify-between items-center mb-4 last:mb-0">
                <ul className="flex gap-1">
                    <li>
                        <button type='button' disabled={!permission?.isEdit && !permission?.isDelete} className={`border-2 rounded-md overflow-hidden focus:ring-indigo-500 focus:border-indigo-500 ${values[name] === 'top' ? 'border-blue-500 activeTab' : 'border-gray-300 cursor-pointer'} `} onClick={() => setFieldValue(name, 'top')}>
                            <span className={`w-full py-2 px-3 bg-white text-gray-500 hover:text-gray-700 flex items-center `} >
                                <span className="material-icons-outlined">align_vertical_top</span><span className="ml-1">Top</span>
                            </span>
                        </button>
                    </li>

                    <li>
                        <button type='button' disabled={!permission?.isEdit && !permission?.isDelete} className={`border-2 rounded-md overflow-hidden focus:ring-indigo-500 focus:border-indigo-500 ${values[name] === 'center' ? 'border-blue-500 activeTab' : 'border-gray-300 cursor-pointer'} `} onClick={() => setFieldValue(name, 'center')}>
                            <span className={`"w-full py-2 px-3 bg-white text-gray-500 hover:text-gray-700 flex items-center`} >
                                <span className="material-icons-outlined">align_vertical_center</span><span className="ml-1">Center</span>
                            </span>
                        </button>
                    </li>

                    <li>
                        <button type='button' disabled={!permission?.isEdit && !permission?.isDelete} className={`border-2 rounded-md overflow-hidden focus:ring-indigo-500 focus:border-indigo-500 ${values[name] === 'bottom' ? 'border-blue-500 activeTab' : 'border-gray-300 cursor-pointer'} `} onClick={() => setFieldValue(name, 'bottom')}>
                            <span className={`"w-full py-2 px-3 bg-white text-gray-500 hover:text-gray-700 flex items-center`}>
                                <span className="material-icons-outlined">align_vertical_bottom</span>
                                <span className="ml-1">Bottom</span>
                            </span>
                        </button>
                    </li>

                </ul>
            </div>
        </>
    );
};

export default VerticalAlign;
