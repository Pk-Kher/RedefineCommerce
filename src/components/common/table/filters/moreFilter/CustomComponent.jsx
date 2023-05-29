/*Component Name: CustomComponent
Component Functional Details:  CustomComponent .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React, { useState, useEffect, useCallback, Fragment } from "react";
import Transition from "utils/Transition";

const CustomComponent = ({ Component = "", openDropdown, ...rest }) => {


    return (
        <Transition
            className={`bg-white border-y border-b-0 border-neutral-200 max-h-96 overflow-y-auto`}
            show={openDropdown}
            enter="transition ease-out duration-200 transform"
            enterStart="opacity-0 -translate-y-2"
            enterEnd="opacity-100 translate-y-0"
            leave="transition ease-out duration-200"
            leaveStart="opacity-100"
            leaveEnd="opacity-0"
        >
            {Component instanceof Function ? <Component {...rest} /> : Component}
            <div className="py-1 px-3 sticky bottom-0 bg-white mt-px">
                <button className="text-gray-500 hover:text-gray-700" type="button" onClick={() => rest?.applyMoreFilter(rest?.columnName)}>Clear</button>
            </div>
        </Transition>
    );
};

export default CustomComponent;
