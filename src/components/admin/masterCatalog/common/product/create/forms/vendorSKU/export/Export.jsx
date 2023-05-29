/*Component Name: Export
Component Functional Details:  Export .
Created By: PK Kher
Created Date: 7-28-2022
Modified By: PK Kher
Modified Date: 7-28-2022> */

import React from 'react';
import ExportComponent from 'components/common/others/admin/export/Export'
import { NavLink, useParams } from 'react-router-dom';

const tableColumns = {
    name: 'Vendor Name',
    our_sku: "OUR SKU",
    vendor_sku: "Vendor SKU",
    default_vendor: "Default Vendor"
};
const Export = () => {
    const { id } = useParams();
    return (
        <>
            <title>Export Vendor SKU</title>
            <div className='px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto'>
                <div className="flex mb-8 justify-between">
                    <div className="flex items-center">
                        <NavLink to={`/admin/MasterCatalog/MasterCatalog/edit/${id}`} className="btn border-neutral-200 hover:border-neutral-400 text-gray-500 hover:text-gray-700 flex items-center mr-2">
                            <span className="material-icons-outlined">west</span>
                        </NavLink>
                        <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">Export Vendor SKU</h1>
                    </div>
                </div>
                <ExportComponent tableColumns={tableColumns} />
            </div>

        </>
    );
};

export default Export;
