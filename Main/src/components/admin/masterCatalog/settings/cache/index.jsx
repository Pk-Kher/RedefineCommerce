/*Component Name: Index
Component Functional Details:  Index .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import Select from 'components/common/formComponent/Select';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setAddLoading } from 'redux/globalLoader/GlobalLoaderAction';
import StoreService from 'services/admin/store/StoreService';
import DropdownService from 'services/common/dropdown/DropdownService';
import Brand from './Brand';
import Category from './Category';
import Home from './Home';
import Messages from "components/common/alerts/messages/Index";

const Index = () => {
    const dispatch = useDispatch();
    const [storeOptions, setStoreOptions] = useState([]);
    const [storeId, setStoreId] = useState("");
    const { user, CompanyConfiguration } = useSelector(store => store);
    useEffect(() => {
        dispatch(setAddLoading(true));
        StoreService.getStoreByUserId({
            "userid": user?.id,
            "companyConfigurationId": CompanyConfiguration?.id,
            "isSuperUser": user?.isSuperUser
        }).then((response) => {
            if (response?.data?.success && response?.data?.data) {
                setStoreOptions(response?.data?.data);
            }
            dispatch(setAddLoading(false));
        }).catch(() => {
            dispatch(setAddLoading(false));
        })
    }, []);
    return (
        <>
            <title>Clear Cache</title>
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="sm:flex sm:justify-between sm:items-center mb-8">
                    <div className="col-span-full w-full flex justify-between items-center">
                        <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">Clear Cache</h1>
                    </div>
                </div>
                <Messages />
                <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                    <div className="w-full">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Select Store</div>
                        <div className="relative mb-6 last:mb-0">
                            <Select name="storeId" defaultValue={storeId} options={storeOptions}
                                onChange={(e) => {
                                    setStoreId(e ? e.value : '');
                                }}
                            />
                        </div>
                    </div>
                </div>
                <Home storeId={storeId} />
                <div className="w-full flex flex-wrap justify-start items-start">
                    <div className="sm:w-1/2 w-full flex h-full sm:pr-3">
                        <Brand storeId={storeId} />
                    </div>
                    <div className="sm:w-1/2 h-full flex w-full sm:pl-3">
                        <Category storeId={storeId} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Index;
