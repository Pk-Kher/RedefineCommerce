/*Component Name: Tab2
Component Functional Details:  Tab2 .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React from 'react';

const Tab2 = ({ activeTab = false, setActiveTab, options = [] }) => {
    return (
        <>
            <ul className="w-full flex border-b border-b-neutral-200">
                {
                    options.map((tab, index) => {
                        return (
                            <li className="pl-6 cursor-pointer" key={index} onClick={() => { setActiveTab(tab.id); }}>
                                <span className={`material-icons-outlined mr-2 ${activeTab === tab.id ? 'text-red-500' : ''}`}>{tab.icon}</span>
                                <span className={`tab py-4 block focus:outline-none border-b-2 font-bold ${activeTab !== tab.id ? "bg-transparent text-[#BDBDC2] hover:text-red-500 rounded-sm border-transparent hover:border-red-500" : "hover:text-black text-black border-red-500"}`}>
                                    {tab.label}
                                </span>
                            </li>
                        );
                    })
                }
            </ul >
        </>
    );
};

export default Tab2;
