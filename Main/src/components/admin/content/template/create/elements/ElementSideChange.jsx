/*Component Name: ElementImage
Component Functional Details: Element for Component Background  
Created By: Vikas Patel
Created Date: 07/07/2022
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import ImageFile from 'components/admin/content/common/ImageFile';
import Input from 'components/admin/content/common/Input';
import { useEffect } from 'react';

const ElementSideChange = (props) => {

    const [showHide, setShowHide] = useState(false);
    const [sideClassArr, setSideClassArr] = useState({});
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

    let bgPropertyName = props.variable;

    const selectedObj = props.componentHtml.filter(obj => obj.uid == props.currentComponent);
    let attributes = {};

    const propertyName = props.variable;


    /* Function to set component with updated attributes values */

    useEffect(() => {
        if (selectedObj.length > 0) {
            if (selectedObj[0].selected_Values != undefined && Object.keys(selectedObj[0].selected_Values).length > 0) {
                let tmpSide;
                Object.entries(selectedObj[0].selected_Values).map(([key, value]) => {
                    if (key == bgPropertyName) {
                        tmpSide = value;
                    }
                });

                if (tmpSide != undefined) {
                    let attributes = tmpSide;
                    setSideClassArr(attributes.value);
                }
                else {
                    setSideClassArr({ "left": "lg:order-1", "right": "lg:order-2" });
                }

            }

        }


    }, [props.currentComponent]);

    useEffect(() => {
        let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
        if (Object.keys(sideClassArr).length > 0) {
            x.querySelectorAll('#left-section')[0].classList.add(sideClassArr.left);
            x.querySelectorAll('#right-section')[0].classList.add(sideClassArr.right);
        }
    }, [sideClassArr]);


    const sideChange = () => {
        let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
        let sideArr = {};
        if (x.querySelectorAll('#left-section')[0].classList.contains("lg:order-1")) {
            x.querySelectorAll('#right-section')[0].classList.remove("lg:order-1");
            x.querySelectorAll('#left-section')[0].classList.remove("lg:order-1");
            x.querySelectorAll('#right-section')[0].classList.remove("lg:order-2");
            x.querySelectorAll('#left-section')[0].classList.remove("lg:order-2");

            sideArr = { "left": "lg:order-2", "right": "lg:order-1" };
        }
        else if (x.querySelectorAll('#left-section')[0].classList.contains("lg:order-2")) {
            x.querySelectorAll('#right-section')[0].classList.remove("lg:order-1");
            x.querySelectorAll('#left-section')[0].classList.remove("lg:order-1");
            x.querySelectorAll('#right-section')[0].classList.remove("lg:order-2");
            x.querySelectorAll('#left-section')[0].classList.remove("lg:order-2");

            sideArr = { "left": "lg:order-1", "right": "lg:order-2" };
        }
        else {
            x.querySelectorAll('#right-section')[0].classList.remove("lg:order-1");
            x.querySelectorAll('#left-section')[0].classList.remove("lg:order-1");
            x.querySelectorAll('#right-section')[0].classList.remove("lg:order-2");
            x.querySelectorAll('#left-section')[0].classList.remove("lg:order-2");

            sideArr = { "left": "lg:order-1", "right": "lg:order-2" };

        }
        setSideClassArr(sideArr);
        props.updateProperty({ type: "side_change", value: sideArr }, bgPropertyName);

    }


    return (
        <>
            <div className="relative border-b border-neutral-00">
                <button onClick={() => { showHideProperties() }}
                    className="flex w-full flex-wrap justify-between items-center text-sm px-3 py-4 bg-white border-0 font-bold">
                    <span >{props.compprop.title ?? "Change Side"}</span>
                    <span className="material-icons-outlined">expand_more</span>
                </button>

                <div className={`property-content bg-white border-y border-b-0 border-neutral-200 ${showHide ? "" : "hidden"}`}>
                    <div class="mx-2 text-sm">
                        <div class="py-2">
                            <div className="mb-4 last:mb-0">

                                <div className="flex flex-wrap">
                                    <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none" onClick={sideChange}>Side Change</button>
                                </div>
                            </div>


                        </div>
                    </div>

                </div>

            </div>
        </>
    );
};

export default ElementSideChange;
