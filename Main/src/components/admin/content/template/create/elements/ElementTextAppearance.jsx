/*Component Name: ElementImage
Component Functional Details: Element for Component Background  
Created By: Vikas Patel
Created Date: 07/07/2022
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useEffect } from 'react';
import ElementHeadlineColorOpacity from './ElementHeadlineColorOpacity';

const ElementTextAppearance = (props) => {

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

    const [textBgColor, setTextBgColor] = useState("");
    const [bgOpacity, setBgOpacity] = useState('1');
    const [fontSize, setFontSize] = useState('');
    const [textPos, setTextPos] = useState("");
    const [hexColor, setHexColor] = useState("");

    let bgPropertyName = props.variable;

    const selectedObj = props.componentHtml.filter(obj => obj.uid == props.currentComponent);
    let attributes = {};

    const propertyName = props.variable;


    useEffect(() => {
        let tmp = {};
        Object.assign(tmp, { 'text_bg_color': textBgColor });
        Object.assign(tmp, { 'hex_color': hexColor });
        Object.assign(tmp, { 'bg_opacity': bgOpacity });
        Object.assign(tmp, { 'font_size': fontSize });
        Object.assign(tmp, { 'text_pos': textPos });

        //if(textBgColor !== "" &&  textPos !== "" && hexColor !== "")
       // {
            props.updateProperty({ type: "appearance", value: tmp }, bgPropertyName);
        //}

        let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);

        if (props.compprop.fields != undefined) {
            let fields = props.compprop.fields.split(",");
            //console.log(fieled);
            fields.forEach(element => {
                if(x.querySelectorAll('#'+element+"_pos").length > 0) {
                   // x.querySelectorAll('#' + element + "_pos")[0].className = "flex items-center absolute " + fontSize + " inset-0 p-1 lg:p-4 text-white justify-" + textPos;
                    x.querySelectorAll('#' + element + "_bg")[0].style = "background: rgb(" + textBgColor + ", " + bgOpacity + "); padding: 20px";
                    //x.querySelectorAll('#' + element)[0].className = "pb-2";
                }
            });
        }

    }, [textBgColor, bgOpacity, textPos, hexColor, fontSize])
    /* Function to set component with updated attributes values */

    useEffect(() => {
        if (selectedObj.length > 0) {
            
            if (selectedObj[0].selected_Values != undefined && Object.keys(selectedObj[0].selected_Values).length > 0) {
                let tmpApperance;

                Object.entries(selectedObj[0].selected_Values).map(([key, value]) => {
                    if (key == bgPropertyName) {
                        tmpApperance = value;
                    }
                });
                if (tmpApperance != undefined) {
                    let attributes = tmpApperance;
                    //console.log("APPE",attributes)
                    setTextBgColor(attributes.value.text_bg_color ?? '');
                    setHexColor(attributes.value.hex_color ?? '');
                    setBgOpacity(attributes.value.bg_opacity ?? '1');
                    setFontSize(attributes.value.font_size ?? '');
                    setTextPos(attributes.value.text_pos ?? 'center');
                }


            }

        }


    }, [props.currentComponent]);

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
                            {console.log(props)}
                            <ElementHeadlineColorOpacity
                                props={props}
                                textBgColor={textBgColor}
                                setTextBgColor={setTextBgColor}
                                fontSize={fontSize}
                                setFontSize={setFontSize}
                                bgOpacity={bgOpacity}
                                setBgOpacity={setBgOpacity}
                                textPos={textPos}
                                setTextPos={setTextPos}
                                hexColor={hexColor}
                                setHexColor={setHexColor}
                                fntDisplay={props.compprop?.fontsize ?? false}
                            />
                        </div>
                    </div>

                </div>

            </div>
        </>
    );
};

export default ElementTextAppearance;
