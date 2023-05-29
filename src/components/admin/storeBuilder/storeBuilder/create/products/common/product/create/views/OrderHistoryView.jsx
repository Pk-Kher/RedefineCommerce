/*Component Name: PricingView
Component Functional Details: User can create or update PricingView master details from here.
Created By: <Your Name>
Created Date: <Creation Date>
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

/*Component Name: OrderHistoryView.jsx
Component Functional Details: Basic Information tab field display
Created By: Vikas Patel
Created Date: 11-May-2022
Modified By: Viks Patel
Modified Date: June/02/2022 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import OrderHistory from '../forms/OrderHistory';


const OrderHistoryView = ({ displayFieldElement, fetchFieldProperty, fields, values, requiredFields, tab, setActiveTab, index }) => {


  return (
    <>
      <div className="px-6 py-12 border-b-4 border-neutral-200 last:border-b-0">
        <div className='flex items-center justify-between'>
          <div className='block uppercase tracking-wide text-gray-500 text-base font-bold mb-2'>
            {tab.label}
          </div>
          <div className="">
            <span className="text-indigo-500 cursor-pointer" onClick={() => { setActiveTab(index) }}>Edit</span>
          </div>
        </div>
        <OrderHistory />
      </div>
    </>
  );
};

export default OrderHistoryView;

