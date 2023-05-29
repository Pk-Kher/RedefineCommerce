/*Component Name: Export
Component Functional Details:  Export .
Created By: PK Kher
Created Date: 7-20-2022
Modified By: PK Kher
Modified Date: <Modified Date> */
import React from 'react';
import ExportComponent from 'components/common/others/admin/export/Export'
import { NavLink } from 'react-router-dom';
import { productType } from 'dummy/Dummy';

const Export = () => {
    return (
        <>
            <title>Export Quantity Discount</title>
            <div className='px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto'>
                <div className="flex mb-8 justify-between">
                    <div className="flex items-center">
                        <NavLink to="/admin/MasterCatalog/Configuration/quantityDiscount/" className="btn border-neutral-200 hover:border-neutral-400 text-gray-500 hover:text-gray-700 flex items-center mr-2">
                            <span className="material-icons-outlined">west</span>
                        </NavLink>
                        <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">Export Quantity Discount</h1>
                    </div>
                </div>
                <ExportComponent type={productType.General} />
            </div>
        </>
    );
};

export default Export;
