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

const ElementElementConfiguration = (props) => {

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
    const [imageDisplay, setImageDisplay] = useState("Yes");
    const [textDisplay, setTextDisplay] = useState("Yes");
    const [imagePosition, setImagePosition] = useState('Left');

    const selectedObj = props.componentHtml.filter(obj => obj.uid == props.currentComponent);
    let attributes = {};

    const propertyName = props.variable;


    /* Function to set component with updated attributes values */

    useEffect(() => {
        if (selectedObj.length > 0) {
            if (selectedObj[0].selected_Values != undefined && Object.keys(selectedObj[0].selected_Values).length > 0) {

                let tmpPosition;
                let tmpImageDisplay;
                let tmpTextDisplay;
                Object.entries(selectedObj[0].selected_Values).map(([key, value]) => {
                    if (key == bgPropertyName + "_Image_position") {
                        tmpPosition = value;
                    }
                    if (key == bgPropertyName + "_Image_display") {
                        tmpImageDisplay = value;
                    }
                    if (key == bgPropertyName + "_Text_display") {
                        tmpTextDisplay = value;
                    }
                });
                //console.log(tmpImageDisplay);
                if (tmpPosition != undefined) {
                    let attributes = tmpPosition;
                    setImagePosition(attributes.value);
                    changeImagePosition(attributes.value);
                }
                else {
                    setImagePosition('Left');
                    //                    changeImagePosition('Left');
                }

                if (tmpImageDisplay != undefined) {
                    let attributes = tmpImageDisplay;
                    setImageDisplay(attributes.value);
                }
                else {
                    setImageDisplay('Yes');
                    //                    changeImagePosition('Left');

                }

                if (tmpTextDisplay != undefined) {
                    let attributes = tmpTextDisplay;
                    setTextDisplay(attributes.value);
                }
                else {
                    setTextDisplay('Left');
                    //                    changeImagePosition('Left');
                }
            }

        }


    }, [props.currentComponent]);

    useEffect(() => {

        if (imageDisplay == "Yes") {
            document.querySelectorAll('#textDisplay')[0].classList.remove("hidden");
            document.querySelectorAll('#imagePosition')[0].classList.remove("hidden");
        }
        else {
            document.querySelectorAll('#textDisplay')[0].classList.add("hidden");
            document.querySelectorAll('#imagePosition')[0].classList.add("hidden");
        }
    }, [imageDisplay]);





    const changeImageDisplay = (val) => {
        let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
        if (val == "Yes") {
            document.querySelectorAll('#textDisplay')[0].classList.remove("hidden");
            document.querySelectorAll('#imagePosition')[0].classList.remove("hidden");

            x.querySelectorAll('#left-section')[0].classList.remove("hidden");

            setAllWidthClass();
            removeOrderClass();

            if (imagePosition == "Left" || imagePosition == "Top") {
                x.querySelectorAll('#left-section')[0].classList.add("lg:order-1");
                x.querySelectorAll('#right-section')[0].classList.add("lg:order-2");
            }
            else if (imagePosition == "Right" || imagePosition == "Bottom") {
                x.querySelectorAll('#left-section')[0].classList.add("lg:order-2");
                x.querySelectorAll('#right-section')[0].classList.add("lg:order-1");
            }

            if (imagePosition == "Top" || imagePosition == "Bottom") {
                removeAllWidthClass();
            }


        }
        else {
            document.querySelectorAll('#textDisplay')[0].classList.add("hidden");
            document.querySelectorAll('#imagePosition')[0].classList.add("hidden");

            x.querySelectorAll('#left-section')[0].classList.add("hidden");
            x.querySelectorAll('#right-section')[0].classList.remove("lg:w-1/2");
            x.querySelectorAll('#right-section')[0].classList.remove("lg:w-3/5");
            x.querySelectorAll('#right-section')[0].classList.remove("lg:w-2/3");
            x.querySelectorAll('#right-section')[0].classList.remove("lg:w-3/4");
            x.querySelectorAll('#right-section')[0].classList.remove("lg:w-4/5");
            x.querySelectorAll('#right-section')[0].classList.remove("lg:w-5/6");


        }
        setImageDisplay(val);
        props.updateProperty({ type: "display", value: val }, bgPropertyName + "_Image_display");
    }

    const findLayout = () => {
        let layout = "50-50";
        Object.entries(selectedObj[0].selected_Values).map(([key, value]) => {
            if (key == "Layout") {
                layout = value.value;
            }
        });
        return layout;
    };

    const removeAllWidthClass = () => {
        let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
        x.querySelectorAll('#right-section')[0].classList.remove("lg:w-1/2");
        x.querySelectorAll('#right-section')[0].classList.remove("lg:w-2/3");
        x.querySelectorAll('#right-section')[0].classList.remove("lg:w-3/4");

        x.querySelectorAll('#left-section')[0].classList.remove("lg:w-1/2");
        x.querySelectorAll('#left-section')[0].classList.remove("lg:w-1/3");
        x.querySelectorAll('#left-section')[0].classList.remove("lg:w-1/4");
    };

    const removeOrderClass = () => {
        let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
        x.querySelectorAll('#left-section')[0].classList.remove("lg:order-1");
        x.querySelectorAll('#right-section')[0].classList.remove("lg:order-2");

        x.querySelectorAll('#left-section')[0].classList.remove("lg:order-2");
        x.querySelectorAll('#right-section')[0].classList.remove("lg:order-1");
    };

    const setAllWidthClass = () => {
        let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
        let layout = findLayout();
        removeAllWidthClass();

        if (layout == "50-50") {
            x.querySelectorAll('#left-section')[0].classList.add("lg:w-1/2");
            x.querySelectorAll('#right-section')[0].classList.add("lg:w-1/2");
        }
        else if (layout == "33-66") {
            x.querySelectorAll('#left-section')[0].classList.add("lg:w-1/3");
            x.querySelectorAll('#right-section')[0].classList.add("lg:w-2/3");
        }
        else if (layout == "33-66") {
            x.querySelectorAll('#left-section')[0].classList.add("lg:w-1/4");
            x.querySelectorAll('#right-section')[0].classList.add("lg:w-3/4");
        }

    };
    const changeTextDisplay = (val) => {
        let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
        if (val == "Yes") {
            x.querySelectorAll('#right-section')[0].classList.remove("hidden");

            document.querySelectorAll('#imageDisplay')[0].classList.remove("hidden");
            document.querySelectorAll('#imagePosition')[0].classList.remove("hidden");

            //x.querySelectorAll('#textDisplay')[0].classList.remove("hidden");


            removeAllWidthClass();
            setAllWidthClass();


            removeOrderClass();

            if (imagePosition == "Left" || imagePosition == "Top") {
                x.querySelectorAll('#left-section')[0].classList.add("lg:order-1");
                x.querySelectorAll('#right-section')[0].classList.add("lg:order-2");
            }
            else if (imagePosition == "Right" || imagePosition == "Bottom") {
                x.querySelectorAll('#left-section')[0].classList.add("lg:order-2");
                x.querySelectorAll('#right-section')[0].classList.add("lg:order-1");
            }

            if (imagePosition == "Top" || imagePosition == "Bottom") {
                removeAllWidthClass();
            }

        }
        else {
            document.querySelectorAll('#imageDisplay')[0].classList.add("hidden");
            document.querySelectorAll('#imagePosition')[0].classList.add("hidden");

            x.querySelectorAll('#right-section')[0].classList.add("hidden");
            x.querySelectorAll('#left-section')[0].classList.remove("lg:w-1/2");
            x.querySelectorAll('#left-section')[0].classList.remove("lg:w-2/3");
            x.querySelectorAll('#left-section')[0].classList.remove("lg:w-1/4");
        }
        setTextDisplay(val);
        props.updateProperty({ type: "display", value: val }, bgPropertyName + "_Text_display");
    }




    const changeImagePosition = (val) => {
        let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);

        removeOrderClass();

        if (val == "Left") {
            x.querySelectorAll('#left-section')[0].classList.add("lg:order-1");
            x.querySelectorAll('#right-section')[0].classList.add("lg:order-2");
            setAllWidthClass();
        }
        else if (val == "Top") {
            removeAllWidthClass();

            x.querySelectorAll('#left-section')[0].classList.add("lg:order-1");
            x.querySelectorAll('#right-section')[0].classList.add("lg:order-2");

        }
        else if (val == "Bottom") {
            removeAllWidthClass();

            x.querySelectorAll('#left-section')[0].classList.add("lg:order-2");
            x.querySelectorAll('#right-section')[0].classList.add("lg:order-1");

        }
        else {
            x.querySelectorAll('#right-section')[0].classList.add("lg:order-1");
            x.querySelectorAll('#left-section')[0].classList.add("lg:order-2");
            setAllWidthClass();
        }

        setImagePosition(val);
        props.updateProperty({ type: "position", value: val }, bgPropertyName + "_Image_position");
    }


    return (
        <>
            <div className="relative border-b border-neutral-00">
                <button onClick={() => { showHideProperties() }}
                    className="flex w-full flex-wrap justify-between items-center text-sm px-3 py-4 bg-white border-0 font-bold">
                    <span >{props.compprop.title ?? "Element Configuration"}</span>
                    <span className="material-icons-outlined">expand_more</span>
                </button>

                <div className={`property-content bg-white border-y border-b-0 border-neutral-200 ${showHide ? "" : "hidden"}`}>
                    <div class="mx-2 text-sm">
                        <div class="py-2">
                            <div className="mb-4 last:mb-0" id="imageDisplay">
                                <label htmlFor="" className="mb-1 block text-sm">Image Display</label>
                                <div className="flex flex-wrap">
                                    <select value={imageDisplay} onChange={(event) => { changeImageDisplay(event.target.value) }} className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-4 last:mb-0" id="textDisplay">
                                <label htmlFor="" className="mb-1 block text-sm">Text Display</label>
                                <div className="flex flex-wrap">
                                    <select value={textDisplay} onChange={(event) => { changeTextDisplay(event.target.value) }} className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-4 last:mb-0" id="imagePosition">
                                <label htmlFor="" className="mb-1 block text-sm">Image Position</label>
                                <div className="flex flex-wrap">
                                    <select value={imagePosition} onChange={(event) => { changeImagePosition(event.target.value) }} className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                        <option value="Left">Left</option>
                                        <option value="Right">Right</option>
                                        <option value="Top">Top</option>
                                        <option value="Bottom">Bottom</option>
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

export default ElementElementConfiguration;
