/*Component Name: Import
Component Functional Details:  Import .
Created By: PK Kher
Created Date: 7-19-2022
Modified By: PK Kher
Modified Date: 7-19-2022 */

import React from 'react';
import ImportComponent from 'components/common/others/admin/import/Import';
import { NavLink } from 'react-router-dom';
import { productType } from 'dummy/Dummy';
const Import = () => {
    return (
        <>
            <title>Import</title>
            <div className='px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto'>
                <div className="flex mb-8 justify-between">
                    <div className="flex items-center">
                        <NavLink to="/admin/MasterCatalog/MasterCatalog/" className="btn border-neutral-200 hover:border-neutral-400 text-gray-500 hover:text-gray-700 flex items-center mr-2">
                            <span className="material-icons-outlined">west</span>
                        </NavLink>
                        <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">Import</h1>
                    </div>
                </div>
                <ImportComponent type={productType.MC} />
            </div>
        </>
    );
};

export default Import;
