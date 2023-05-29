/*Component Name: Brand
Component Functional Details:  Brand .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAddLoading } from 'redux/globalLoader/GlobalLoaderAction';
import DropdownService from 'services/common/dropdown/DropdownService';
import { Formik, Form as FormikForm, Field } from "formik";
import CacheService from 'services/admin/cache/CacheService';
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import { ValidationMsgs } from 'global/ValidationMessages';
import { serverError } from 'services/common/helper/Helper';
import { useSelector } from 'react-redux';

const Brand = ({ storeId }) => {
    const permission = useSelector(store => store?.permission);
    const dispatch = useDispatch();
    const [brandIds, setBrandIds] = useState([]);
    const [brandOptions, setBrandOptions] = useState([]);
    useEffect(() => {
        if (storeId) {
            dispatch(setAddLoading(true));
            DropdownService.getDropdownValues('storebrand', false, storeId).then((response) => {
                if (response?.data?.success && response?.data?.data) {
                    setBrandOptions(response?.data?.data);
                }
                dispatch(setAddLoading(false));
            }).catch(() => {
                dispatch(setAddLoading(false));
            });
        } else {
            setBrandOptions([]);
        }
    }, [storeId]);

    const clearCache = (e) => {
        var brands = e.target.id === 'clearAllCache' ? brandOptions.map((value) => value.value) : brandIds;
        if (brands.length <= 0) {
            dispatch(setAlertMessage({
                type: 'danger',
                message: ValidationMsgs.cache.selectBrand
            }));
            return;
        }
        dispatch(setAddLoading(true));
        var brands = e.target.id === 'clearAllCache' ? brandOptions.map((value) => value.value) : brandIds;
        CacheService.clearBrandCache({
            catcheBrandidList: {  //wrong spelling for cache here from API side
                catcheIDlist: brands,//here as well
                storeId: storeId
            }
        }).then((response) => {
            if (response?.data?.data && response?.data?.success) {
                dispatch(setAlertMessage({
                    type: 'success',
                    message: ValidationMsgs.cache.clearBrandCache
                }));
                setBrandIds([]);
            } else {
                dispatch(setAlertMessage({
                    type: 'danger',
                    message: serverError(response)
                }));
            }
            dispatch(setAddLoading(false));
        }).catch(() => {
            dispatch(setAlertMessage({
                type: 'danger',
                message: ValidationMsgs.cache.brandCacheNotClear
            }));
            dispatch(setAddLoading(false));
        });
    }
    return (
        <>
            <div className="w-full">
                <div className="w-full pt-6 flex flex-wrap justify-between items-center mb-2">
                    <div className="block uppercase tracking-wide text-gray-500 text-lg font-bold">Clear Brand Cache</div>
                </div>
                <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                    <div className="w-full">
                        <select className="block w-full mb-4 form-multiselect h-52" value={brandIds} multiple={true} onChange={(e) => {
                            setBrandIds(Array.from(e.target.selectedOptions).map(({ value }) => value));
                        }}>
                            {brandOptions.map((value, index) => <option value={value.value} key={index}>{value?.label}</option>)}
                        </select>

                        {(permission?.isEdit || permission?.isDelete) && <>
                            <button type='button' id='selected' onClick={clearCache} className="btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white mr-2"> Clear Brand Cache</button>
                            <button type='button' id='clearAllCache' onClick={clearCache} className="btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white"> Clear All Brand Cache</button>
                        </>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Brand;
