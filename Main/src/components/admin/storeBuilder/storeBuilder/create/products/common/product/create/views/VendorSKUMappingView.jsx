/*Component Name: VendorSKUMappingView
Component Functional Details:  VendorSKUMappingView .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React from 'react';
import VendorSKUMapping from '../forms/vendorSKU/VendorSKUMapping';

const VendorSKUMappingView = ({ tab, index, setActiveTab, ...rest }) => {
  return (
    <>
      <div className="flex items-center justify-between px-5 w-full mt-6">
        <div
          className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2"
        >
          {tab.label}
        </div>
        <div className="">
          <span
            className="text-indigo-500 cursor-pointer"
            onClick={() => {
              setActiveTab(index);
            }}
          >
            Edit
          </span>
        </div>
      </div>
      <VendorSKUMapping {...rest} displayView={true} />
    </>
  );
};

export default VendorSKUMappingView;
