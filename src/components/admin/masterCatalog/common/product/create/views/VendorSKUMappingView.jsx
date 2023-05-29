/*Component Name: VendorSKUMappingView
Component Functional Details:  VendorSKUMappingView .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React from 'react';
import { scrollTop } from 'services/common/helper/Helper';
import VendorSKUMapping from '../forms/vendorSKU/VendorSKUMapping';

const VendorSKUMappingView = ({ tab, index, setActiveTab, ...rest }) => {
  return (
    <>
      <div className='px-6 py-12 border-b-4 border-neutral-200 last:border-b-0'>
        <div className="flex justify-between">
          <div
            className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2"
          >
            {tab.label}
          </div>
          <div >
            <span
              className="text-indigo-500 cursor-pointer"
              onClick={() => {
                setActiveTab(index);
                scrollTop();
              }}
            >
              Edit
            </span>
          </div>
        </div>
        <VendorSKUMapping {...rest} displayView={true} />
      </div>
    </>
  );
};

export default VendorSKUMappingView;
