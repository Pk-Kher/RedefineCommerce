/*Component Name: ElementCarousel
Component Functional Details: Element for Headline Text Background / Opacity Component  
Created By: Vikas Patel
Created Date: 12th October 2022
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import ColorPicker from 'components/admin/content/common/ColorPicker';

import { useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';


const ElementHeadlineColorOpacity = (props) => {

    let attributes = {};
    const bgPropertyName = props.variable;//selectedObj.length > 0 ? Object.keys(selectedObj[0].properties).find(key => selectedObj[0].properties[key] === "background") : [];
    const [isTransparent, setIsTransparent] = useState(props.hexColor == "" ? true : false);
    const changeTextBackgroundColor = (color) => {
        let obj = color.rgb;
        props.setHexColor(color.hex);
        props.setTextBgColor(obj.r + ", " + obj.g + ", " + obj.b);
    }

    const setTranspgarentBG = (event) => {
        if (event.target.checked) {
            setIsTransparent(true);
            props.setHexColor("");
            props.setTextBgColor("");
        }
        else {
            setIsTransparent(false);
        }

    }

    useEffect(() => {
        if (props.hexColor == "")
            setIsTransparent(true);
        else
            setIsTransparent(false);
    }, [props.hexColor]);

    return (
        <>
            {props.fntDisplay && 
                <div className="mb-4 last:mb-0">
                    <label htmlFor="" className="mb-1 block text-sm">Headline Font Size</label>
                    <div className="flex flex-wrap">
                        <select value={props.fontSize} onChange={(event) => { props.setFontSize(event.target.value) }} className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                            <option value="text-xs">Extral Small</option>
                            <option value="text-sm">Small</option>
                            <option value="text-base">Normal</option>
                            <option value="text-lg">Large</option>
                            <option value="text-xl">Extra Large</option>
                            <option value="text-2xl">2 XL</option>
                            <option value="text-3xl">3 XL</option>
                        </select>
                    </div>
                </div>
            }

            <div className="mb-4 last:mb-0">
                <label htmlFor="" className="mb-1 block text-sm">Headline Text Position</label>
                <div className="flex flex-wrap">
                    <select value={props.textPos} onChange={(event) => { props.setTextPos(event.target.value) }} className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                        <option value="center">Center</option>
                        <option value="start">Left</option>
                        <option value="end">Right</option>
                        <option value="bottom">Bottom</option>
                        <option value="top">Top</option>
                    </select>
                </div>
            </div>


            <div className="mb-4 last:mb-0">
                <label htmlFor="" className="mb-1 block text-sm">Background Color</label>
                <div className="flex flex-wrap">
                    <div className="relative">
                        <input id="new-window-link2" x-model="checked" onChange={setTranspgarentBG} type="checkbox" checked={isTransparent ? "checked" : ""} /> <span className="pl-2">Transparent Background</span>
                    </div>
                </div>
                {!isTransparent &&
                    <div className="flex flex-wrap">
                        <ColorPicker changeBackgroundColor={changeTextBackgroundColor} value={props.hexColor} />
                    </div>
                }
            </div>

            <div className="mb-4 last:mb-0">
                <label htmlFor="" className="mb-1 block text-sm">Background Opacity</label>
                <div className="flex flex-wrap">
                    <select value={props.bgOpacity} onChange={(event) => { props.setBgOpacity(event.target.value) }} className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                        <option value="1">1</option>
                        <option value="0.9">0.9</option>
                        <option value="0.8">0.8</option>
                        <option value="0.7">0.7</option>
                        <option value="0.6">0.6</option>
                        <option value="0.5">0.5</option>
                        <option value="0.4">0.4</option>
                        <option value="0.3">0.3</option>
                        <option value="0.2">0.2</option>
                        <option value="0.1">0.1</option>
                        <option value="0">0</option>
                    </select>
                </div>
            </div>




        </>
    );
};

export default ElementHeadlineColorOpacity;