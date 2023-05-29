/*Component Name: ColumnSelect
Component Functional Details: User can create or update ColumnSelect master details from here.
Created By: chandan
Created Date: <Creation Date>
Modified By: chandan
Modified Date: <Modified Date> */


import React from 'react';
import { useFormikContext } from 'formik';
import { useSelector } from 'react-redux';

const ColumnSelect = ({ name }) => {
    const permission = useSelector(store => store.permission);
    const { setFieldValue, values } = useFormikContext();

    return (
        <>
            <div className="last:mb-0 flex flex-wrap justify-between items-center pt-4" >
                <label className="mb-3 block text-sm font-bold">Column Select</label>
                <div className="grid grid-cols-3 gap-2 mb-5">
                    <button type='button' disabled={!permission?.isEdit && !permission?.isDelete} className={`border-2 rounded-md overflow-hidden focus:ring-indigo-500 focus:border-indigo-500   ${values[name] === 2 ? 'border-blue-500 activeTab' : 'border-gray-300 cursor-pointer'} `} onClick={() => setFieldValue(name, 2)}  >
                        <img alt="" src="http://ystore.us/HTML/RedefineCommerce/Admin/images/coloum-2.png" />
                    </button>
                    <button type='button' disabled={!permission?.isEdit && !permission?.isDelete} className={`border-2 rounded-md overflow-hidden focus:ring-indigo-500 focus:border-indigo-500   ${values[name] === 3 ? 'border-blue-500 activeTab' : 'border-gray-300 cursor-pointer'} `} onClick={() => setFieldValue(name, 3)} >
                        <img alt="" src="http://ystore.us/HTML/RedefineCommerce/Admin/images/coloum-3.png" />
                    </button>
                    <button type='button' disabled={!permission?.isEdit && !permission?.isDelete} className={`border-2 rounded-md overflow-hidden focus:ring-indigo-500 focus:border-indigo-500   ${values[name] === 4 ? 'border-blue-500 activeTab' : 'border-gray-300 cursor-pointer'} `} onClick={() => setFieldValue(name, 4)} >
                        <img alt="" src="http://ystore.us/HTML/RedefineCommerce/Admin/images/coloum-4.png" />
                    </button>
                </div>
            </div >
        </>
    );
};

export default ColumnSelect;
