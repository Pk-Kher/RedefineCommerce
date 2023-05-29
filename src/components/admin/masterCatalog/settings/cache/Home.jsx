/*Component Name: Home
Component Functional Details:  Home .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import { ValidationMsgs } from 'global/ValidationMessages';
import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import { setAddLoading } from 'redux/globalLoader/GlobalLoaderAction';
import CacheService from 'services/admin/cache/CacheService';
import { serverError } from 'services/common/helper/Helper';

const Home = ({ storeId }) => {
    const permission = useSelector(store => store?.permission);
    const dispatch = useDispatch();
    const clearHomeCache = () => {
        if (!storeId) {
            dispatch(setAlertMessage({
                type: 'danger',
                message: ValidationMsgs.cache.selectStore
            }));
            return;
        }
        dispatch(setAddLoading(true));
        CacheService.clearHomeCache(storeId).then((response) => {
            if (response?.data?.data && response?.data?.success) {
                dispatch(setAlertMessage({
                    type: 'success',
                    message: ValidationMsgs.cache.clearHomeCache
                }));
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
                message: ValidationMsgs.cache.HomeCacheNotClear
            }));
            dispatch(setAddLoading(false));
        });
    }
    return (
        <>
            <div className="w-full pt-6 flex flex-wrap justify-between items-center mb-2">
                <div className="block uppercase tracking-wide text-gray-500 text-lg font-bold">Clear Home Cache</div>
            </div>
            <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                <div className="w-full">
                    {(permission?.isEdit || permission?.isDelete) && <button type='button' onClick={clearHomeCache} className="btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white"> Clear Home Cache</button>}
                </div>
            </div>
        </>
    );
};

export default Home;
