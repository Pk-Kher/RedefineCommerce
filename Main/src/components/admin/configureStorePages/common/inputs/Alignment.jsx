/*Component Name: Alignment
Component Functional Details: User can create or update Alignment master details from here.
Created By: chandan
Created Date: <Creation Date>
Modified By: chandan
Modified Date: <Modified Date> */


import React from 'react';
import { useFormikContext } from 'formik';
import { useSelector } from 'react-redux';

const ProductGallerySlideStyle = ({ name = "alignment", title = "Alignment" }) => {
    const { setFieldValue, values } = useFormikContext();
    const permission = useSelector(store => store.permission);
    return (
        <>
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
                        <button type='button' disabled={!permission?.isEdit && !permission?.isDelete} className={`border-2 rounded-md overflow-hidden focus:ring-indigo-500 focus:border-indigo-500 ${values[name] === 'center' ? 'border-blue-500 activeTab' : 'border-gray-300 cursor-pointer'} `} onClick={() => setFieldValue(name, 'center')}>
                            <span className={`"w-full py-2 px-3 bg-white text-gray-500 hover:text-gray-700 flex items-center`} >
                                <span className="material-icons-outlined">format_align_center</span><span className="ml-1">Center</span>
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
        </>
    );
};

export default ProductGallerySlideStyle;
