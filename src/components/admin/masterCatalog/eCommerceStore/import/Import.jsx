/*Component Name: Import
Component Functional Details:  Import .
Created By: PK Kher
Created Date: 7-19-2022
Modified By: PK Kher
Modified Date: 7-19-2022 */

import React, { useState, useEffect } from 'react';
import ImportComponent from 'components/common/others/admin/import/Import';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { productType } from 'dummy/Dummy';
import StoreService from 'services/admin/store/StoreService';
const Import = () => {
    const { storeName, storeId, storeType } = useParams();
    const [store, setStore] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        StoreService.getStoreById(storeId).then((response) => {
            if (response.data.data) {
                let storeData = response.data.data;
                if (storeData.name.replace(' ', '').toLowerCase() === storeName.toLowerCase() && storeType.toLowerCase() === storeData.storeType.name.replace(' ', '').toLowerCase()) {
                    setStore(storeData);
                } else {
                    navigate('404');
                }
            }
        }).catch((error) => {
            navigate('404');
        });
    }, [storeId]);
    return (
        <>
            <title>Import</title>
            <div className='px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto'>
                <div className="flex mb-8 justify-between">
                    <div className="flex items-center">
                        <NavLink to={`/admin/MasterCatalog/${storeType}/${storeName}/${storeId}/products`} className="btn border-neutral-200 hover:border-neutral-400 text-gray-500 hover:text-gray-700 flex items-center mr-2">
                            <span className="material-icons-outlined">west</span>
                        </NavLink>
                        <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">Import</h1>
                    </div>
                </div>
                <ImportComponent type={store?.storeTypeId} />
            </div>
        </>
    );
};

export default Import;
