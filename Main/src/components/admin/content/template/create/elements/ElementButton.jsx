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

const ElementButton = (props) => {

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
    const [btnText, setBtnText] = useState('');
    const [btnTextTransform, setBtnTextTransform] = useState('');
    const [btnStyle, setBtnStyle] = useState('');
    const [btnSize, setBtnSize] = useState('');
    const [btnLink, setBtnLink] = useState('');
    const [btnLinkWindow, setBtnLinkWindow] = useState(false);
    const [btnLinkFollow, setBtnLinkFollow] = useState('');
    const [btnDisplay, setBtnDisplay] = useState('Yes');

    const selectedObj = props.componentHtml.filter(obj => obj.uid == props.currentComponent);
    let attributes = {};

    const propertyName = props.variable;


    /* Function to set component with updated attributes values */

    useEffect(() => {
        if (selectedObj.length > 0) {
            if (selectedObj[0].selected_Values != undefined && Object.keys(selectedObj[0].selected_Values).length > 0) {
                let tmp;
                let tmpTextTransform;
                let tmpStyle;
                let tmpSize;
                let tmpLink;
                let tmpLinkWindow;
                let tmpLinkFollow;
                let tmpDisplay;
                Object.entries(selectedObj[0].selected_Values).map(([key, value]) => {
                    if (key == bgPropertyName) {
                        tmp = value;
                    }
                    if (key == bgPropertyName + "_text_transform") {
                        tmpTextTransform = value;
                    }
                    if (key == bgPropertyName + "_style") {
                        tmpStyle = value;
                    }
                    if (key == bgPropertyName + "_size") {
                        tmpSize = value;
                    }
                    if (key == bgPropertyName + "_link") {
                        tmpLink = value;
                    }
                    if (key == bgPropertyName + "_window") {
                        tmpLinkWindow = value;
                    }
                    if (key == bgPropertyName + "_follow") {
                        tmpLinkFollow = value;
                    }
                    if (key == bgPropertyName + "_display") {
                        tmpDisplay = value;
                    }
                });
                if (tmp != undefined) {
                    let attributes = tmp;
                    setBtnText(attributes.value);

                }
                else {
                    setBtnText('');
                }

                if (tmpTextTransform != undefined) {
                    let attributes = tmpTextTransform;
                    setBtnTextTransform(attributes.value);

                }
                else {
                    setBtnTextTransform('');
                }

                if (tmpSize != undefined) {
                    let attributes = tmpSize;
                    setBtnSize(attributes.value);

                }
                else {
                    setBtnSize('');
                }

                if (tmpLinkWindow != undefined) {
                    let attributes = tmpLinkWindow;
                    setBtnLinkWindow(attributes.value);

                }
                else {
                    setBtnLinkWindow('');
                }


                if (tmpLink != undefined) {
                    let attributes = tmpLink;
                    setBtnLink(attributes.value);

                }
                else {
                    setBtnLink('');
                }

                if (tmpLinkFollow != undefined) {
                    let attributes = tmpLinkFollow;
                    setBtnLinkFollow(attributes.value);

                }
                else {
                    setBtnLinkFollow('');
                }

                if (tmpDisplay != undefined) {
                    let attributes = tmpDisplay;
                    setBtnDisplay(attributes.value);

                }
                else {
                    setBtnDisplay('Yes');
                }

            }
            else {
                setBtnText('');
                setBtnTextTransform('');
                setBtnSize('');
                setBtnLink('');
                setBtnLinkWindow('');
                setBtnLinkFollow('');
                setBtnDisplay('Yes');
                //updateProperty({[bgPropertyName]: imageURL});
            }
        }


    }, [props.currentComponent]);


    const buttonTextChange = (event) => {
        let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
        x.querySelectorAll('#' + props.variable)[0].innerHTML = event.target.value;
        setBtnText(event.target.value);
        props.updateProperty({ type: "text", value: event.target.value }, bgPropertyName);
    }

    const changeTextTransform = (event) => {
        let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);

        x.querySelectorAll('#' + props.variable)[0].classList.remove("normal-case");
        x.querySelectorAll('#' + props.variable)[0].classList.remove("uppercase");
        x.querySelectorAll('#' + props.variable)[0].classList.remove("lowercase");
        x.querySelectorAll('#' + props.variable)[0].classList.remove("capitalize");

        x.querySelectorAll('#' + props.variable)[0].classList.add(event.target.value);
        setBtnTextTransform(event.target.value);
        props.updateProperty({ type: "btn_transform", value: event.target.value }, bgPropertyName + "_text_transform");
    }

    const changeBtnSize = (event) => {
        let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);

        x.querySelectorAll('#' + props.variable)[0].classList.remove("btn-xs");
        x.querySelectorAll('#' + props.variable)[0].classList.remove("btn-md");
        x.querySelectorAll('#' + props.variable)[0].classList.remove("btn-lg");

        x.querySelectorAll('#' + props.variable)[0].classList.add(event.target.value);

        setBtnSize(event.target.value);
        props.updateProperty({ type: "btn_size", value: event.target.value }, bgPropertyName + "_size");
    }

    const changeLinkTarget = (event) => {
        let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
        if (event.target.checked) {
            x.querySelectorAll('#' + props.variable)[0].target = "_blank";
            setBtnLinkWindow("_blank");
            props.updateProperty({ type: "btn_link_target", value: "_blank" }, bgPropertyName + "_window");
        }
        else {
            x.querySelectorAll('#' + props.variable)[0].target = '_self';
            setBtnLinkWindow("_self");
            props.updateProperty({ type: "btn_link_target", value: "_self" }, bgPropertyName + "_window");
        }
    }

    const changeBtnLink = (event) => {
        let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
        x.querySelectorAll('#' + props.variable)[0].href = event.target.value;
        setBtnLink(event.target.value);
        props.updateProperty({ type: "btn_link", value: event.target.value }, bgPropertyName + "_link");
    }

    const changeLinkFollow = (event) => {
        let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
        if (event.target.checked) {
            x.querySelectorAll('#' + props.variable)[0].rel = "nofollow";
            props.updateProperty({ type: "btn_link_rel", value: event.target.value }, bgPropertyName + "_follow");

        }
        else {
            x.querySelectorAll('#' + props.variable)[0].rel = "";
            props.updateProperty({ type: "btn_link_rel", value: '' }, bgPropertyName + "_follow");

        }

        setBtnLinkFollow(event.target.value);
    }

    const changeBtnStyle = (event) => {
        let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);

        x.querySelectorAll('#' + props.variable)[0].classList.remove("btn-primary");
        x.querySelectorAll('#' + props.variable)[0].classList.remove("btn-secondary");

        x.querySelectorAll('#' + props.variable)[0].classList.add(event.target.value);

        setBtnStyle(event.target.value);
        props.updateProperty({ type: "btn_style", value: event.target.value }, bgPropertyName + "_style");

    }

    const changeBtnDisplay = (event) => {
        let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);



        if (event.target.value == "Yes") {
            x.querySelectorAll('#' + props.variable)[0].classList.remove("hidden");

            const allWithClass = Array.from(
                document.querySelectorAll('div.btn-extra-info')
            );
            allWithClass.forEach(element => {
                element.classList.remove("hidden");
            });

        }
        else {
            x.querySelectorAll('#' + props.variable)[0].classList.add("hidden");
            const allWithClass = Array.from(
                document.querySelectorAll('div.btn-extra-info')
            );
            allWithClass.forEach(element => {
                element.classList.add("hidden");
            });


        }
        setBtnDisplay(event.target.value);
        props.updateProperty({ type: "btn_display", value: event.target.value }, bgPropertyName + "_display");
    }

    return (
        <>
            <div className="relative border-b border-neutral-00">
                <button onClick={() => { showHideProperties() }}
                    className="flex w-full flex-wrap justify-between items-center text-sm px-3 py-4 bg-white border-0 font-bold">
                    <span >{props.compprop.title ?? "Button"}</span>
                    <span className="material-icons-outlined">expand_more</span>
                </button>

                <div className={`property-content bg-white border-y border-b-0 border-neutral-200 ${showHide ? "" : "hidden"}`}>
                    <div class="w-full py-2 px-3">


                        <div className="mb-4 last:mb-0">
                            <label htmlFor="" className="mb-1 block text-sm">Button Display</label>
                            <div className="flex flex-wrap">
                                <select value={btnDisplay} onChange={changeBtnDisplay} className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                        </div>

                        <div className={`btn-extra-info ${btnDisplay == "Yes" ? "" : "hidden"}`}>

                            <div className="mb-4 last:mb-0">
                                <label htmlFor="" className="mb-1 block text-sm">Button Text</label>
                                <div className="flex flex-wrap">
                                    <input
                                        onChange={buttonTextChange}
                                        value={btnText}
                                        type="text"
                                        className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md"
                                    />



                                </div>
                            </div>

                            <div className="mb-4 last:mb-0">
                                <label htmlFor="" className="mb-1 block text-sm">Text Transform</label>
                                <div className="flex flex-wrap">
                                    <select value={btnTextTransform} onChange={changeTextTransform} className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                        <option value="normal-case">None</option>
                                        <option value="capitalize">Capitalize</option>
                                        <option value="uppercase">Uppercase</option>
                                        <option value="lowercase">Lowercase</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4 last:mb-0">
                                <label htmlFor="" className="mb-1 block text-sm">Button Style</label>
                                <div className="flex flex-wrap">
                                    <select value={btnStyle} onChange={changeBtnStyle} className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                        <option value="btn-secondary">Secondary</option>
                                        <option value="btn-primary">Primary</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4 last:mb-0">
                                <label htmlFor="" className="mb-1 block text-sm">Button Size</label>
                                <div className="flex flex-wrap">
                                    <select value={btnSize} onChange={changeBtnSize} className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                        <option value="btn-md">Regular</option>
                                        <option value="btn-xs">Small</option>
                                        <option value="btn-lg">Large</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4 last:mb-0">
                                <label htmlFor="" className="mb-1 block text-sm">Button Link</label>
                                <div className="flex flex-wrap">
                                    <select className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                        <option value="1">External</option>
                                        <option value="2">Content</option>
                                        <option value="3">File</option>
                                        <option value="4">Email address</option>
                                        <option value="5">Blog</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4 last:mb-0">
                                <label htmlFor="" class="mb-1 block text-sm">URL</label>
                                <div className="flex flex-wrap">
                                    <input
                                        onChange={changeBtnLink}
                                        type="text"
                                        value={btnLink}
                                        className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md"
                                    />
                                </div>
                            </div>

                            <div className="mb-4 last:mb-0">
                                <div className="flex flex-wrap justify-between items-center">
                                    <label htmlFor="" className="mb-1 block text-sm">Open link in new window</label>
                                    <div className="flex items-center">
                                        <div className="w-16 relative">
                                            <input onChange={changeLinkTarget} type="checkbox" id="new-window-link" x-model="checked" checked={btnLinkWindow == "_blank" ? "checked" : ""} />
                                            {/* <label className="text-gray-500 lef text-center h-7 cursor-pointer flex items-center justify-center rounded leading-5 bg-green-600 bg-slate-600 hidden" htmlFor="new-window-link"> 
                                                <span className="bg-white shadow-sm w-6 h-6 transition-all absolute rounded left-0.5" aria-hidden="true"></span> 
                                                <span className="text-white text-xs inline-block absolute right-2 opacity-0 opacity-100" x-text="checked ? 'ON' : 'OFF'">OFF</span> 
                                                <span className="text-white text-xs inline-block absolute left-2 opacity-1 opacity-0" x-text="checked ? 'ON' : 'OFF'">OFF</span> 
                                            </label>  */}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4 last:mb-0">
                                <label htmlFor="" className="mb-1 block text-sm">Link Type</label>
                                <label className="flex items-center" htmlFor="no-follow-link">
                                    <input onChange={changeLinkFollow} type="checkbox" id="no-follow-link" className="form-checkbox" checked={btnLinkFollow == "nofollow" ? "checked" : ""} />
                                    <span className="text-sm font-medium ml-2">No Follow</span>
                                </label>
                            </div>
                        </div>



                    </div>

                </div>

            </div>
        </>
    );
};

export default ElementButton;
