import React from 'react';
import StoreNestedSettingAttributes from './StoreNestedSettingAttributes';
import { useFormikContext, } from "formik";
import { useSelector } from "react-redux";

const Settings = ({ AttributeData, page, initialValues = {} }) => {
    const permission = useSelector(store => store.permission);
    const { values, setFieldValue } = useFormikContext();
    const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

    return (
        <>
            <StoreNestedSettingAttributes AttributeData={AttributeData} setFieldValue={setFieldValue} initialValues={initialValues} />
            {(AttributeData.length > 0 && (permission?.isEdit || permission?.isDelete)) && <div className="p-3 h-[125px]">
                <button className={`btn border-indigo-300 hover:border-indigo-400 text-indigo-500 w-full ${(GlobalLoading)
                    ? "bg-indigo-200 hover:bg-indigo-200"
                    : "cursor-pointer"
                    }`} type='submit'

                    disabled={Object.keys(values).length <= 0 || GlobalLoading}
                >
                    {GlobalLoading && (
                        <span className="spinner-border spinner-border-sm mr-2"></span>
                    )}
                    Apply Theme
                </button>
            </div>}
        </>
    )
}

export default Settings