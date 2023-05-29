/*Component Name: ElementBackground
Component Functional Details: Element for Component ElementBackground  
Created By: Vikas Patel
Created Date: 07/07/2022
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import ColorPicker from 'components/admin/content/common/ColorPicker';
import ImageFile from 'components/admin/content/common/ImageFile';
import { useEffect } from 'react';
import { object } from 'yup';
import ReactDOMServer from 'react-dom/server';

const ElementHeader = (props) => {
    const [showHide, setShowHide] = useState(false);
    const showHideProperties = () => {
        if (showHide == true)
            setShowHide(false);
        else {
            const allWithClass = Array.from(
                document.querySelectorAll('div.property-content')
            );
            allWithClass.forEach(element => {
                element.classList.add("hidden");
            });



            setShowHide(true);

        }
    }






    return (
        <>
            <div className="relative border-b border-neutral-00">
                <button onClick={() => { showHideProperties() }}
                    className="flex w-full flex-wrap justify-between items-center text-sm px-3 py-4 bg-white border-0 font-bold">
                    <span >Header</span>
                    <span className="material-icons-outlined">expand_more</span>
                </button>

                <div className={`property-content bg-white border-y border-b-0 border-neutral-200 ${showHide ? "" : "hidden"}`}>
                    <div class="mx-2 text-sm">
                        sss
                    </div>

                </div>



            </div>
        </>
    );
};

export default ElementHeader;
