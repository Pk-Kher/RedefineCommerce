/*Component Name: ProductAndStoreMappingView.jsx
Component Functional Details: Basic Information tab field display
Created By: chandan
Created Date: 19-jan-2023
Modified By: chandan
Modified Date: 19-jan-2023 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { scrollTop } from 'services/common/helper/Helper';
import ProductAndStoreMapping from '../forms/ProductAndStoreMapping';

const ProductAndStoreMappingView = ({ displayFieldElement, fetchFieldProperty, fields, values, requiredFields, tab, setActiveTab, index }) => {

  return (
    <>
      <div className="px-6 py-12 border-b-4 border-neutral-200 last:border-b-0">
        <div className='flex items-center justify-between'>
          <div className='block uppercase tracking-wide text-gray-500 text-base font-bold mb-2'>
            {tab.label}
          </div>
          <div >
            <span className="text-indigo-500 cursor-pointer" onClick={() => { setActiveTab(index); scrollTop(); }}>Edit</span>
          </div>
        </div>
        <ProductAndStoreMapping />
      </div>
    </>
  );
};

export default ProductAndStoreMappingView;

