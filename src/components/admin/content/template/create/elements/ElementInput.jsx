/*Component Name: ElementImage
Component Functional Details: Element for Component Background  
Created By: Vikas Patel
Created Date: 07/07/2022
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import { fontSizeClassOption } from 'global/Enum';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const ElementInput = (props) => {

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
    const [headline, setHeadline] = useState("");
    const [textTransform, setTextTransform] = useState("");
    const [fontSize, setFontSize] = useState("");

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
                let tmpTextTransform;
                let tmpFontSize;

                //console.log("SA", selectedObj[0].selected_Values);
                Object.entries(selectedObj[0].selected_Values).map(([key, value]) => {
                    if (key == bgPropertyName) {
                        tmp = value;
                    }
                    if (key == bgPropertyName + "_text_transform") {
                        tmpTextTransform = value;
                    }
                    if (key == bgPropertyName + "_font_size") {
                        tmpFontSize = value;
                    }
                });

                console.log(bgPropertyName, tmpFontSize);
                if (tmp != undefined) {
                    let attributes = tmp;
                    setHeadline(attributes.value);
                }
                else {
                    setHeadline('');
                }
                if (tmpTextTransform != undefined) {
                    let attributes = tmpTextTransform;
                    setTextTransform(attributes.value);
                }
                else {
                    setTextTransform('');
                }
                if (tmpFontSize != undefined) {
                    let attributes = tmpFontSize;
                    setFontSize(attributes.value);
                    changeFontSize(attributes.value);
                }
                else {
                    setFontSize('');
                }
            }
            else {
                setHeadline('');
                //updateProperty({[bgPropertyName]: imageURL});
            }
        }


    }, [props.currentComponent]);






    const updateHeadline = (event) => {
        if(bgPropertyName != "additionalclass")
        {
            let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
            console.log(props.variable);
            x.querySelectorAll('#' + props.variable)[0].innerHTML = event.target.value;
            if(event.target.value != "")
                x.querySelectorAll('#' + props.variable)[0].classList.remove("hidden");
            else
                x.querySelectorAll('#' + props.variable)[0].classList.add("hidden");

        }
        props.updateProperty({ type: "text", value: event.target.value }, bgPropertyName);
        setHeadline(event.target.value);
    }

    const changeFontSize = (value) => {

        console.log(props.variable, bgPropertyName);
        let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
        fontSizeClassOption.map((element, index) => {
            x.querySelectorAll('#' + props.variable)[0].classList.remove(element.class);
        })
        x.querySelectorAll('#' + props.variable)[0].classList.add(value);

        props.updateProperty({ type: "fontsize", value: value }, bgPropertyName + "_font_size");
        setFontSize(value);
    }

    const changeTextTransform = (event) => {
        let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);

        x.querySelectorAll('#' + props.variable)[0].classList.remove("normal-case");
        x.querySelectorAll('#' + props.variable)[0].classList.remove("uppercase");
        x.querySelectorAll('#' + props.variable)[0].classList.remove("lowercase");
        x.querySelectorAll('#' + props.variable)[0].classList.remove("capitalize");

        x.querySelectorAll('#' + props.variable)[0].classList.add(event.target.value);
        setTextTransform(event.target.value);
        props.updateProperty({ type: "transform", value: event.target.value }, bgPropertyName + "_text_transform");
    }




    return (
        <>
            <div className="relative border-b border-neutral-00">
                <button onClick={() => { showHideProperties() }}
                    className="flex w-full flex-wrap justify-between items-center text-sm px-3 py-4 bg-white border-0 font-bold">
                    <span >{props.compprop.title ?? "Headline"}</span>
                    <span className="material-icons-outlined">expand_more</span>
                </button>

                <div className={`property-content bg-white border-y border-b-0 border-neutral-200 ${showHide ? "" : "hidden"}`}>
                    <div class="mx-2 text-sm">
                        <div class="py-2">
                            <div className="mb-3">
                                <div className="flex justify-between items-center mb-1">
                                    <div>{bgPropertyName == "additionalclass" ? "Additional Class" : "Headline Text"}</div>
                                </div>
                                <div class="text-center relative overflow-hidden">
                                    <input type="text" className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-3 py-2 leading-tight focus:outline-none focus:bg-white" defaultValue={headline} onChange={updateHeadline} />

                                </div>
                            </div>
                            {bgPropertyName != "additionalclass" && 
                                <div className="mb-4 last:mb-0">
                                    <label htmlFor="" className="mb-1 block text-sm">Text Transform</label>
                                    <div className="flex flex-wrap">
                                        <select onChange={changeTextTransform} className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                            <option value="normal-case">None</option>
                                            <option value="capitalize">Capitalize</option>
                                            <option value="uppercase">Uppercase</option>
                                            <option value="lowercase">Lowercase</option>
                                        </select>
                                    </div>
                                </div>
                            }

                            {props.compprop.fontsize && <>
                                <div className="mb-4 last:mb-0">
                                    <label htmlFor="" className="mb-1 block text-sm">Headline Font Size</label>
                                    <div className="flex flex-wrap">
                                        
                                        <select value={fontSize} onChange={(event) => { changeFontSize(event.target.value) }} className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                            { fontSizeClassOption.map((element, index) => {
                                                return (<option value={element.class}>{element.value}</option>);
                                            })}
                                        </select>
                                    </div>
                                </div>

                            </>
                            }
                        </div>
                    </div>

                </div>

            </div>
        </>
    );
};

export default ElementInput;
