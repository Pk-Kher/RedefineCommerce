/*Component Name: OptionsView.jsx
Component Functional Details: Basic Information tab field display
Created By: Vikas Patel
Created Date: 11-May-2022
Modified By: Viks Patel
Modified Date: <Modified Date> */
import React, { useState, useEffect, useCallback, useRef } from 'react';



const OptionsView = ({ displayFieldElement, fetchFieldProperty, fields, values, requiredFields, tab, setActiveTab, index }) => {


  return (
    <>

      <div className="px-6 py-12 border-b-4 border-neutral-200">
        <div className='flex items-center justify-between'>
          <div className='block uppercase tracking-wide text-gray-500 text-base font-bold mb-2'>
            {tab.label}
          </div>
          <div className="">
            <span className="text-indigo-500 cursor-pointer" onClick={() => { setActiveTab(index) }}>Edit</span>
          </div>
        </div>
      </div>

    </>
  );
};

export default OptionsView;
