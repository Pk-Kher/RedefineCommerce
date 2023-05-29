/*Component Name: LeftAsideBar
Component Functional Details: User can create or update LeftAsideBar master details from here.
Created By: chandan
Created Date: <Creation Date>
Modified By: chandan
Modified Date: <Modified Date> */

import React from 'react';
import { useEffect, useState } from 'react';

const LeftAsideBar = ({ children, showSidebar, setShowSideBar }) => {
    return (
        <>
            <div className="transition-all h-screen bg-slate-100 overflow-x-hidden shadow-lg fixed inset-0 bottom-auto mt-[6px] z-60 top-[56px]" style={{ width: showSidebar ? '380px' : '30px' }} >
                <div className="p-1 bg-slate-100 border-b border-b-solid border-b-slate-300 text-right w-full">
                    <button type='button' className="pr-1" onClick={() => setShowSideBar((prev) => !prev)}>
                        <span className="material-icons-outlined text-sm">{showSidebar ? 'arrow_back_ios' : 'arrow_forward_ios'}</span>
                    </button>
                </div>
                <div className={`${showSidebar ? '' : 'hidden'} pt-4`}>
                    {children}
                </div>
            </div>
        </>
    );
};

export default LeftAsideBar;
