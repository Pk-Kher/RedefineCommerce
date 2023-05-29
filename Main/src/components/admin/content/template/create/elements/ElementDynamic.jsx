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
import Input from 'components/admin/content/common/Input';

import { useEffect } from 'react';
import { object } from 'yup';
import ReactDOMServer from 'react-dom/server';
import * as helper from 'components/admin/content/helper/Helper';
import * as dynamicFunctions from 'components/admin/content/helper/DynamicFunctions';
import { CKEditor } from "ckeditor4-react";
import { randomNumber } from 'components/admin/content/helper/Helper';

const ElementDynamic = (props) => {
    const [editor, setEditor] = useState(null);
    const [acDesc, setAcDesc] = useState('');

    const [showHide, setShowHide] = useState(false);
    const [iconStyle, setIconStyle] = useState('caret');
    const [indArr, setIndArr] = useState([]);
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
    };

    useEffect(() => {
        // if(textChanged)
        // {
        if (acDesc != 'Begin') {

            let editor1 = (
                <CKEditor
                    id={"description1"}
                    name={"description1"}
                    // onInstanceReady={(editor) => { setckdata(editor.editor); }}
                    initData={acDesc}
                    // value={editorText}
                    config={{
                        toolbar: [
                            ['Source'],
                            ['Styles'],
                            ['Bold', 'Italic', 'Underline'],

                            ['About']
                        ],
                        extraPlugins: [/* 'wordcount'  */],
                        removePlugins: ['image'],
                        extraAllowedContent: 'div(*)',
                        allowedContent: true
                    }}

                    onChange={({ event, editor }) => {
                        setAcDesc(editor.getData());
                    }}
                />
            );
            setEditor(editor1);

        }

        // }
    }
        , [acDesc]);

    const [perRow, setPerRow] = useState(2);
    const [dynamicType, setDynamicType] = useState('');
    const [cloneType, setCloneType] = useState('');
    const selectedObj = props.componentHtml.filter(obj => obj.uid == props.currentComponent);
    const [groupFields, setGroupFields] = useState({});

    const [dataArr, setDataArr] = useState([]);

    const [imageURL, setImageURL] = useState('');
    const [imageAlt, setImageAlt] = useState('');
    const [imageLink, setImageLink] = useState('');

    const [btnText, setBtnText] = useState('');
    const [btnTextTransform, setBtnTextTransform] = useState('');
    const [btnStyle, setBtnStyle] = useState('');
    const [btnSize, setBtnSize] = useState('');
    const [btnLink, setBtnLink] = useState('');
    const [btnLinkWindow, setBtnLinkWindow] = useState(false);
    const [btnLinkFollow, setBtnLinkFollow] = useState('');
    const [btnDisplay, setBtnDisplay] = useState('Yes');

    const [staticFields, setStaticFields] = useState({});
    const [headline, setHeadline] = useState("");

    const [editBtn, setEditBtn] = useState(false);
    const [addBtn, setAddBtn] = useState(true);
    const [pos, setPos] = useState(0);
    const [imageOrNumber, setImageOrNumber] = useState("Number");
    const [bgColor, setBgColor] = useState('');




    let attributes = {};

    const bgPropertyName = props.variable;//selectedObj.length > 0 ? Object.keys(selectedObj[0].properties).find(key => selectedObj[0].properties[key] === "background") : [];

    /* When click on any component background component will reload and
    we have called function to set default properties */

    useEffect(() => {
        let flds;
        setDynamicType(props.compprop.html);
        Object.entries(props.compprop.fields).map(([key, val]) => {
            if (key == "single") {
                setStaticFields(val);
            }
            if (key == "group") {
                setGroupFields(val);
            }
        }
        );


    });

    const changePerRow = (event) => {
        setPerRow(event.target.value);

    }

    const updateHeadline = (event) => {
        //props.updateProperty({type: "text", value: event.target.value}, bgPropertyName);
        setHeadline(event.target.value);
    }

    useEffect(() => {

        let tdataArr = dataArr;
        setDataArr([])
        tdataArr.forEach(function (item) {
            let tmpArr = {};
            Object.keys(item).map((key, index) => {
                if (key == "colcount") {
                    Object.assign(tmpArr, { "colcount": perRow });
                }
                else {
                    Object.assign(tmpArr, { [key]: item[key] });

                }
                // console.log(key);
            });
            setDataArr((previous) => [...previous, tmpArr]);
        });
        // console.log(tmpArr);
        //        setDataArr(tmpArr);
    }, [perRow]);

    useEffect(() => {

        /* Here when change component,values are not retiNING */
        if (selectedObj.length > 0) {
            let tmpVal;
            Object.entries(selectedObj[0].selected_Values).map(([key, value]) => {
                if (key == bgPropertyName) {
                    tmpVal = value;
                }
            });
            if (tmpVal != undefined) {
                // let attributes = tmpVal;
                setDataArr(tmpVal.value);
            }
        }
    }, [props.currentComponent]);

    const onElementImageChange = (url) => {
        setImageURL(url);
        //props.updateProperty({type: "image", value: url}, bgPropertyName);
    }

    const changeImageNumberDisplay = (event) => {
        setImageOrNumber(event.target.value);
        //props.updateProperty({type: "image", value: url}, bgPropertyName);
    }

    const updateAltTag = (val) => {
        //props.updateProperty({type: "alt", value: val}, bgPropertyName+"_alt");
        setImageAlt(val);
    }

    const updateLink = (val) => {
        // props.updateProperty({type: "alt", value: val}, bgPropertyName+"_link");
        setImageLink(val);
        //x.querySelectorAll('#'+props.variable)[0].title = event.target.value;

    }

    const buttonTextChange = (event) => {
        setBtnText(event.target.value);
        //props.updateProperty({type: "text", value: event.target.value}, bgPropertyName);
    }

    const changeTextTransform = (event) => {
        setBtnTextTransform(event.target.value);
        //props.updateProperty({type: "transform", value: event.target.value}, bgPropertyName+"_text_transform");
    }

    const changeBtnSize = (event) => {
        setBtnSize(event.target.value);
        //props.updateProperty({type: "size", value: event.target.value}, bgPropertyName+"_size");
    }

    const changeLinkTarget = (event) => {
        if (event.target.checked) {
            setBtnLinkWindow("_blank");
            //props.updateProperty({type: "link_target", value: "_blank"}, bgPropertyName+"_window");
        }
        else {
            setBtnLinkWindow("_self");
            //props.updateProperty({type: "link_target", value: "_self"}, bgPropertyName+"_window");
        }
    }

    const changeBtnLink = (event) => {
        setBtnLink(event.target.value);
        //props.updateProperty({type: "link", value: event.target.value}, bgPropertyName+"_link");
    }

    const changeLinkFollow = (event) => {
        if (event.target.checked) {
            //props.updateProperty({type: "link_rel", value: event.target.value}, bgPropertyName+"_follow");

        }
        else {
            //props.updateProperty({type: "link_rel", value: ''}, bgPropertyName+"_follow");
        }

        setBtnLinkFollow(event.target.value);
    }

    const changeBtnStyle = (event) => {
        setBtnStyle(event.target.value);
        //props.updateProperty({type: "style", value: event.target.value}, bgPropertyName+"_style");
    }

    const changeBtnDisplay = (event) => {
        if (event.target.value == "Yes") {
            const allWithClass = Array.from(
                document.querySelectorAll('div.btn-extra-info')
            );
            allWithClass.forEach(element => {
                element.classList.remove("hidden");
            });

        }
        else {
            const allWithClass = Array.from(
                document.querySelectorAll('div.btn-extra-info')
            );
            allWithClass.forEach(element => {
                element.classList.add("hidden");
            });


        }
        setBtnDisplay(event.target.value);
        //props.updateProperty({type: "display", value: event.target.value}, bgPropertyName+"_display");
    }

    const saveData = () => {
        let tmpArr = updateDataArray();
        let rndNumber = randomNumber(indArr);
        setIndArr((previous) => [...previous, rndNumber]);
        Object.assign(tmpArr, { "index": rndNumber });
        setDataArr((previous) => [...previous, tmpArr]);
    };

    useEffect(() => {
        if (dynamicType != "") {
            let strHTML = dynamicFunctions[dynamicType](dataArr, (selectedObj.length > 0 ? selectedObj[0] : {}));
            let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
            x.querySelectorAll("#" + dynamicType)[0].innerHTML = strHTML;
            props.updateProperty({ type: "dynamic", value: dataArr }, bgPropertyName);
        }

        // if(dynamicType == "numberingdiv")
        // {
        //     console.log(dataArr);
        //     let strHTML = helper[dynamicType](dataArr);//helper.[dynamicType](dataArr);
        //     let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
        //     x.querySelectorAll("#"+dynamicType)[0].innerHTML = strHTML;
        //     props.updateProperty({type: "dynamic", value: dataArr}, bgPropertyName);
        // }

        // if(dynamicType == "multipleImages")
        // {
        //     let strHTML = [`helper.${dynamicType}`](dataArr);
        //     let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
        //     x.querySelectorAll("#"+dynamicType)[0].innerHTML = strHTML;
        //     props.updateProperty({type: "dynamic", value: dataArr}, bgPropertyName);
        // }
    }, [dataArr]);

    const editData = (element) => {
        setPos(element.index);
        setEditBtn(true);
        setAddBtn(false);
        Object.keys(groupFields).map((key, value) => {
            let newKey;
            if (groupFields[key] == "image") {
                setImageURL(element[key]);
                setImageAlt(element[key + "_alt"]);
                setImageLink(element[key + "_link"]);
            }

            if (groupFields[key] == "imagenumber") {
                setImageOrNumber(element[key]);
                setImageURL(element[key + "_image"]);
            }

            if (groupFields[key] == "bgcolor") {
                setBgColor(element[key]);
            }

            if (groupFields[key] == "button") {
                setBtnDisplay(element[key + "_display"]);
                setBtnText(element[key + "_text"]);
                setBtnTextTransform(element[key + "_transform"]);
                setBtnStyle(element[key + "_style"]);
                setBtnSize(element[key + "_size"]);
                setBtnLink(element[key + "_link"]);
                setBtnLinkFollow(element[key + "_link_follow"]);
                setBtnLinkWindow(element[key + "_link_window"]);

            }

            if (groupFields[key] == "text") {
                setHeadline(element[key]);
            }

            if (groupFields[key] == "description") {
                setEditor(null);
                setAcDesc(element[key]);
            }
        });
    };

    const deleteData = (element) => {

        let tmpVal = [];
        dataArr.map((acValue, index) => {
            if (acValue.index != element.index) {
                tmpVal.push(acValue);
            }
        });
        setDataArr(tmpVal);
    
    };

    const updateDataArray = () => {
        let tmpArr = {};
        let rndNumber = randomNumber(indArr);
        
        setIndArr((previous) => [...previous, rndNumber]);
        
        Object.assign(tmpArr, {"index": rndNumber});
        Object.assign(tmpArr, { "colcount": perRow })
        Object.keys(groupFields).map((key, value) => {
            if (groupFields[key] == "image") {
                Object.assign(tmpArr, { [key]: imageURL });

                let newKey = key + "_link";
                Object.assign(tmpArr, { [newKey]: imageLink });

                newKey = key + "_alt";
                Object.assign(tmpArr, { [newKey]: imageAlt });
            }

            if (groupFields[key] == "imagenumber") {
                Object.assign(tmpArr, { [key]: imageOrNumber });

                if(imageOrNumber === "Image")
                {
                    let newKey = key + "_image";
                    Object.assign(tmpArr, { [newKey]: imageURL });
                }

            }

            if (groupFields[key] == "bgcolor") {
                Object.assign(tmpArr, { [key]: bgColor });
            }

            if (groupFields[key] == "button") {
                let newKey = key + "_display";
                Object.assign(tmpArr, { [newKey]: btnDisplay });

                newKey = key + "_text";
                Object.assign(tmpArr, { [newKey]: btnText });

                newKey = key + "_transform";
                Object.assign(tmpArr, { [newKey]: btnTextTransform });

                newKey = key + "_style";
                Object.assign(tmpArr, { [newKey]: btnStyle });

                newKey = key + "_size";
                Object.assign(tmpArr, { [newKey]: btnSize });

                newKey = key + "_link";
                Object.assign(tmpArr, { [newKey]: btnLink });

                newKey = key + "_link_window";
                Object.assign(tmpArr, { [newKey]: btnLinkWindow });

                newKey = key + "_link_follow";
                Object.assign(tmpArr, { [newKey]: btnLinkFollow });
            }

            if (groupFields[key] == "text") {
                let newKey = key;
                Object.assign(tmpArr, { [newKey]: headline });
            }

            if (groupFields[key] == "description") {
                let newKey = key;
                Object.assign(tmpArr, { [newKey]: acDesc });
            }

        });

        setImageURL('');
        setImageAlt('');
        setImageLink('');
        setBtnText('');
        setBtnTextTransform('');
        setBtnStyle('');
        setBtnSize('');
        setBtnLink('');
        setBtnLinkWindow(false);
        setBtnLinkFollow('');
        setBtnDisplay('Yes');
        setHeadline("");
        setEditor(null);
        setAcDesc('');
        setBgColor('');
        setImageOrNumber('Number');
       

        return tmpArr;
    };

    const changeBackgroundColor = (color) => {
        setBgColor(color.hex);
    }

    const updateData = () => {
        let tmpVal = dataArr.map((acValue, index) => {

            if (acValue.index == pos) {
                let tmpArr = updateDataArray();
                Object.assign(tmpArr, { "index": pos });
                return tmpArr;
            }
            else {
                return acValue;
            }
        });
        setDataArr(tmpVal);
        setEditBtn(false);
        setAddBtn(true);

    };
    return (
        <>

            <div className="relative border-b border-neutral-00">
                <button onClick={() => { showHideProperties() }}
                    className="flex w-full flex-wrap justify-between items-center text-sm px-3 py-4 bg-white border-0 font-bold">
                    <span >{props.compprop.title ?? "Dynamic Properties"}</span>
                    <span className="material-icons-outlined">expand_more</span>
                </button>

                <div className={`property-content bg-white border-y border-b-0 border-neutral-200 ${showHide ? "" : "hidden"}`}>

                    <div class="mx-2 text-sm">
                        <div class="py-2">
                            {Object.keys(staticFields).length > 0 && <>
                                {Object.keys(staticFields).map((key, val) => {
                                    return (
                                        <>
                                            {key == "perRow" &&
                                                <>
                                                    <div className="mb-4 last:mb-0">
                                                        <label htmlFor="" className="mb-1 block text-sm">{key}</label>
                                                        <div className="flex flex-wrap">
                                                            <select value={perRow} onChange={changePerRow} className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                                                <option value="2">2</option>
                                                                <option value="3">3</option>
                                                                <option value="4">4</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                        </>
                                    );
                                })}
                            </>
                            }

                            <div className="mb-4 last:mb-0">
                                <p className="font-bold">Added Data</p>
                                <ul class="my-2" id="htmlData">
                                    {dataArr.length > 0 && dataArr.map((acValue, index) => {
                                        return (
                                            <>
                                                <li className="p-2 border border-neutral-200 border-b-0 last:border-b flex items-center justify-between">
                                                    <div className="flex items-center justify-between w-full">
                                                        <div className="flex items-center">
                                                            <div className="grow ml-2">
                                                                {index+1}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <a href="javascript:void(0)" onClick={() => { editData(acValue); }}><span class="material-icons-outlined ml-3">mode_edit</span></a>
                                                            <a href="javascript:void(0)" onClick={() => { deleteData(acValue); }}><span class="material-icons-outlined ml-3">delete_outline</span></a>
                                                        </div>
                                                    </div>
                                                </li>
                                            </>
                                        )
                                    })}
                                </ul>
                            </div>
                            {Object.keys(groupFields).length > 0 && <>
                                {Object.keys(groupFields).map((key, val) => {

                                    return (
                                        <>
                                            {groupFields[key] == "image" &&
                                                <>
                                                    <div class="mb-3" x-data="{ modalOpen: false }">
                                                        <label htmlFor="" className="mb-1 block text-sm">Image</label>
                                                        <ImageFile
                                                            type="file"
                                                            className="sr-only"
                                                            name={key}
                                                            id={key}
                                                            buttonName="Add"
                                                            folderpath={props.imagePath}
                                                            onChange={onElementImageChange}
                                                            edibtn={true}
                                                            url={imageURL}
                                                        />
                                                    </div>

                                                    <div className="mb-3">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <div >Alt Title</div>
                                                        </div>
                                                        <div class="text-center relative overflow-hidden">
                                                            <Input onChange={(event) => { updateAltTag(event.target.value) }} type="text" className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-3 py-2 leading-tight focus:outline-none focus:bg-white" defaultValue={imageAlt} />
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <div >Link (optional)</div>
                                                        </div>
                                                        <div class="text-center relative overflow-hidden">
                                                            <Input onChange={(event) => { updateLink(event.target.value) }} type="text" className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-3 py-2 leading-tight focus:outline-none focus:bg-white" defaultValue={imageLink} />
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                            {groupFields[key] == "text" &&
                                                <>
                                                    <div className="mb-3">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <div >Headline Text</div>
                                                        </div>
                                                        <div class="text-center relative overflow-hidden">
                                                            <input type="text" className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-3 py-2 leading-tight focus:outline-none focus:bg-white" value={headline} onChange={updateHeadline} />

                                                        </div>
                                                    </div>
                                                </>
                                            }
                                            {groupFields[key] == "description" &&
                                                <>
                                                    <div className="mb-3">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <div >Description</div>
                                                        </div>
                                                        <div class="text-center relative overflow-hidden">
                                                            {editor}
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                            {groupFields[key] == "imagenumber" &&
                                                <>
                                                    <div className="mb-3">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <div >Image or Number</div>
                                                        </div>
                                                        <div className="flex flex-wrap">
                                                            <select value={imageOrNumber} onChange={changeImageNumberDisplay} className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                                                <option value="Image">Image</option>
                                                                <option value="Number">Number</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    {imageOrNumber === "Image" && <div className="mb-3">
                                                        <label htmlFor="" className="mb-1 block text-sm">Image</label>
                                                        <ImageFile
                                                            type="file"
                                                            className="sr-only"
                                                            name={key}
                                                            id={key}
                                                            buttonName="Add"
                                                            folderpath={props.imagePath}
                                                            onChange={onElementImageChange}
                                                            edibtn={true}
                                                            url={imageURL}
                                                        />
                                                    </div>
                                                    }
                                                </>
                                            }
                                            {groupFields[key] == "bgcolor" && <>
                                                    <div className='form-check form-check-inline pb-2'><label className='form-check-label inline-block text-gray-800'>BG Color</label>
                                                    </div>

                                                   
                                                    <div className={`pt-2`}>
                                                        <ColorPicker changeBackgroundColor={changeBackgroundColor} value={bgColor} />
                                                    </div>
                                            </>}
                                            {groupFields[key] == "button" &&
                                                <>
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
                                                </>
                                            }
                                        </>
                                    );
                                })}
                                <div className="mb-4 last:mb-0">
                                    {addBtn && <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white mt-2" onClick={saveData}>+ Add</button>}
                                    {editBtn && <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white mt-2" onClick={updateData}>+ Update</button>}


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

export default ElementDynamic;
