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

const ElementLayout = (props) => {

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

    let bgPropertyName = props.variable;
    const [layoutOption, setLayoutOption] = useState("50-50");

    const selectedObj = props.componentHtml.filter(obj => obj.uid == props.currentComponent);
    let attributes = {};

    const propertyName = props.variable;


    /* Function to set component with updated attributes values */

    useEffect(() => {
        if (selectedObj.length > 0) {
            if (selectedObj[0].selected_Values != undefined && Object.keys(selectedObj[0].selected_Values).length > 0) {

                let tmp;
                let tmpAlt;
                let tmpLink;
                Object.entries(selectedObj[0].selected_Values).map(([key, value]) => {
                    if (key == bgPropertyName) {
                        tmp = value;
                    }
                });
                if (tmp != undefined) {
                    let attributes = tmp;
                    setLayoutOption(attributes.value);

                }
                else {
                    setLayoutOption('50-50');
                }


            }
            else {
                setLayoutOption('50-50');
                //updateProperty({[bgPropertyName]: imageURL});
            }
        }


    }, [props.currentComponent]);


    const changeLayoutOption = (event) => {
        let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);


        x.querySelectorAll('#right-section')[0].classList.remove("lg:w-1/2");
        x.querySelectorAll('#right-section')[0].classList.remove("lg:w-2/3");
        x.querySelectorAll('#right-section')[0].classList.remove("lg:w-1/3");
        x.querySelectorAll('#right-section')[0].classList.remove("lg:w-3/2");
        x.querySelectorAll('#right-section')[0].classList.remove("lg:w-3/4");
        x.querySelectorAll('#right-section')[0].classList.remove("lg:w-1/4");


        x.querySelectorAll('#left-section')[0].classList.remove("lg:w-1/2");
        x.querySelectorAll('#left-section')[0].classList.remove("lg:w-2/3");
        x.querySelectorAll('#left-section')[0].classList.remove("lg:w-1/3");
        x.querySelectorAll('#left-section')[0].classList.remove("lg:w-3/2");
        x.querySelectorAll('#left-section')[0].classList.remove("lg:w-3/4");
        x.querySelectorAll('#left-section')[0].classList.remove("lg:w-1/4");

        if (event.target.value == "50-50") {
            x.querySelectorAll('#left-section')[0].classList.add("lg:w-1/2");
            x.querySelectorAll('#right-section')[0].classList.add("lg:w-1/2");
        }
        else if (event.target.value == "66-33") {
            x.querySelectorAll('#left-section')[0].classList.add("lg:w-2/3");
            x.querySelectorAll('#right-section')[0].classList.add("lg:w-1/3");
        }
        else if (event.target.value == "75-25") {
            x.querySelectorAll('#left-section')[0].classList.add("lg:w-3/4");
            x.querySelectorAll('#right-section')[0].classList.add("lg:w-1/4");
        }
        else if (event.target.value == "33-66") {
            x.querySelectorAll('#left-section')[0].classList.add("lg:w-1/3");
            x.querySelectorAll('#right-section')[0].classList.add("lg:w-2/3");
        }
        else if (event.target.value == "25-75") {
            x.querySelectorAll('#left-section')[0].classList.add("lg:w-1/4");
            x.querySelectorAll('#right-section')[0].classList.add("lg:w-3/4");
        }
        props.updateProperty({ type: "layout", value: event.target.value }, bgPropertyName);

    }


    return (
        <>
            <div className="relative border-b border-neutral-00">
                <button onClick={() => { showHideProperties() }}
                    className="flex w-full flex-wrap justify-between items-center text-sm px-3 py-4 bg-white border-0 font-bold">
                    <span >{props.compprop.title ?? "Layout Opitons"}</span>
                    <span className="material-icons-outlined">expand_more</span>
                </button>

                <div className={`property-content bg-white border-y border-b-0 border-neutral-200 ${showHide ? "" : "hidden"}`}>
                    <div class="mx-2 text-sm">
                        <div class="py-2">
                            <div className="mb-4 last:mb-0">
                                <label htmlFor="" className="mb-1 block text-sm">Component Layout</label>
                                <div className="flex flex-wrap">
                                    <select onChange={changeLayoutOption} className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                        <option value="50-50">50:50</option>
                                        <option value="33-66">33:66</option>
                                        <option value="25-75">66:33</option>
                                        <option value="75-25">75:25</option>
                                        <option value="25-75">25:75</option>
                                    </select>
                                </div>
                            </div>


                        </div>
                    </div>

                </div>

            </div>
        </>
    );
};

export default ElementLayout;
