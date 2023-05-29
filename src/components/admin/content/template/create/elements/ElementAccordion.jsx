/*Component Name: ElementBackground
Component Functional Details: Element for Component ElementBackground  
Created By: Vikas Patel
Created Date: 07/07/2022
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import ColorPicker from 'components/admin/content/common/ColorPicker';
import ImageFile from 'components/admin/content/common/ImageFile';
import { object } from 'yup';
import ReactDOMServer from 'react-dom/server';
import { CKEditor } from "ckeditor4-react";

const ElementAccordion = (props) => {
    const [showHide, setShowHide] = useState(false);
    const [iconStyle, setIconStyle] = useState('caret');
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

    const [backAttributes, setBackAttributes] = useState({});
    const selectedObj = props.componentHtml.filter(obj => obj.uid == props.currentComponent);
    const [acTitle, setAcTitle] = useState('');
    const [acDesc, setAcDesc] = useState('');
    const [acValArr, setAcValArr] = useState([]);
    const [pos, setPos] = useState(null);
    const [editBtn, setEditBtn] = useState(false);
    const [addBtn, setAddBtn] = useState(true);
    const [openStatus, setOpenStatus] = useState("No");
    const [editEnabled, setEditEnabled] = useState(false);

    const [editor, setEditor] = useState(null);
    let ckeditor = useRef(null);



    let attributes = {};

    const bgPropertyName = props.variable;//selectedObj.length > 0 ? Object.keys(selectedObj[0].properties).find(key => selectedObj[0].properties[key] === "background") : [];

    /* When click on any component background component will reload and
    we have called function to set default properties */

    useEffect(() => {
        // if(textChanged)
        // {
        if (acDesc != 'Begin') {

            let editor1 = (
                <CKEditor
                    id={"description"}
                    name={"description"}
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

    useEffect(() => {
        displayAccordion();
        props.updateProperty({ type: "accordion", value: acValArr }, bgPropertyName);
    }, [acValArr]);

    useEffect(() => {
        let tmpVal = acValArr.map((acValue, index) => {
            return { "index": acValue.index, "title": acValue.title, "desc": acValue.desc, "openstatus": acValue.openstatus, "icon": iconStyle };

        });


        setAcValArr(tmpVal);
    }, [iconStyle]);



    useEffect(() => {
        if (selectedObj.length > 0) {
            let tmpVal;
            let tmpImageDisplay;
            let tmpTextDisplay;
            Object.entries(selectedObj[0].selected_Values).map(([key, value]) => {
                if (key == bgPropertyName) {
                    tmpVal = value;
                }
            });
            //console.log(tmpImageDisplay);
            if (tmpVal != undefined) {
                let attributes = tmpVal;
                setAcValArr(attributes.value);
                attributes.value.map((acValue, index) => {
                    if (index == 0) {
                        setIconStyle(acValue.icon);
                    }

                });
            }
            else {
                setAcValArr([]);

            }
        }
        else {
            setAcValArr([]);
        }


    }, [props.currentComponent]);


    const changeIconStyle = (val) => {
        setIconStyle(val);

        //props.updateProperty({type: "icon", value: val}, bgPropertyName+"_icon");
    }

    const changeAcTitle = (event) => {
        setAcTitle(event.target.value);
    }

    const changeAcDesc = (event) => {
        setAcDesc(event.target.value);
    }
    const saveAccordion = () => {
        if (acTitle == "") {
            alert("Please add Title");
        }
        else if (acDesc == "") {
            alert("Please add Description");
        }
        else {
            setEditEnabled(false);
            saveAcValues();
        }
    }

    const saveAcValues = () => {

        setAcValArr((previous) => [...previous, { "index": acValArr.length + 1, "title": acTitle, "desc": acDesc, "openstatus": openStatus, "icon": iconStyle }]);
        setEditor(null);
        setAcDesc("");
        setAcTitle("");
        setOpenStatus("No");
        setIconStyle("caret");

    }

    const updateAccordion = () => {
        setEditEnabled(false);

        let tmpVal = acValArr.map((acValue, index) => {
            if (acValue.index == pos) {
                return { "index": acValue.index, "title": acTitle, "desc": acDesc, "openstatus": openStatus, "icon": iconStyle };
            }
            else {
                return acValue;
            }
        });

        setAcValArr(tmpVal);
        setEditBtn(false);
        setAddBtn(true);
        setEditor(null);
        setAcDesc("");
        setAcTitle("");
        setOpenStatus("No");
        setIconStyle("caret");
    }

    const changeThis = () => {

    }

    const deleteAcc = (element) => {
        let tmpVal = [];
        acValArr.map((acValue, index) => {
            if (acValue.title != element.title) {
                tmpVal.push(acValue);
            }
        });
        setAcValArr(tmpVal);
    };


    const displayAccordion = () => {

        let strAcHTML = "";
        acValArr.forEach(function (acValue) {
            strAcHTML += "<li class='mb-4 last:mb-0 hasarr clonnable border-b border-black'>";
            strAcHTML += "<button class='w-full flex justify-between items-center text-left font-bold font-heading px-2 py-4 border-0 hover:border-0'>";
            strAcHTML += "<div class='text-defaule-text'>" + acValue.title + "</div>";
            if (acValue.icon == "caret") {
                if (acValue.openstatus == "Yes")
                    strAcHTML += '<span class="material-icons-outlined ml-3">keyboard_arrow_down</span>';
                else
                    strAcHTML += '<span class="material-icons-outlined ml-3">keyboard_arrow_up</span>';
            }
            else {
                if (acValue.openstatus == "Yes")
                    strAcHTML += '<span class="material-icons-outlined ml-3">remove_circle_outline</span>';
                else
                    strAcHTML += '<span class="material-icons-outlined ml-3">add_circle_outline</span>';
            }

            strAcHTML += '</button>';
            if (acValue.openstatus == "Yes")
                strAcHTML += '<div class="text-defaule-text px-2 mt-2 pb-4">';
            else
                strAcHTML += '<div class="text-defaule-text px-2 mt-2 pb-4 hidden">';
            strAcHTML += '<div class="text-defaule-text mt-2">';
            strAcHTML += acValue.desc;
            strAcHTML += '</div>';
            strAcHTML += '</div>';
            strAcHTML += '</li>';
        })
        //const temp = ReactDOMServer.renderToString(<Accordion acValArr={acValArr} />);
        // console.log(ReactDOMServer.renderToString(<Accordion acValArr={acValArr} />));
        let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
        x.querySelectorAll("#accordion")[0].innerHTML = strAcHTML;

        //        x.querySelectorAll("#accordion")[0].innerHTML = temp;

    }

    const changeOpenStatus = (event) => {
        if (event.target.checked) {
            setOpenStatus("Yes");
        }
        else {
            setOpenStatus("No");
        }

    }


    return (
        <>
            <div className="relative border-b border-neutral-00">
                <button onClick={() => { showHideProperties() }}
                    className="flex w-full flex-wrap justify-between items-center text-sm px-3 py-4 bg-white border-0 font-bold">
                    <span >{props.compprop.title ?? "Accordion"}</span>
                    <span className="material-icons-outlined">expand_more</span>
                </button>

                <div className={`property-content bg-white border-y border-b-0 border-neutral-200 ${showHide ? "" : "hidden"}`}>
                    <div class="mx-2 text-sm">
                        <div class="py-2">

                            <div className="mb-4 last:mb-0">
                                <label htmlFor="" className="mb-1 block text-sm">Icon *</label>
                                <div className="flex flex-wrap">
                                    <select value={iconStyle} onChange={(event) => { changeIconStyle(event.target.value) }} className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                        <option value="caret">Caret</option>
                                        <option value="plus">Plus</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between"> <sapn className="font-semibold">Accordions</sapn></div>
                            <ul class="my-2" id="accordions_list">
                                {acValArr.map((acValue, index) => {
                                    return (
                                        <>
                                            <li className="p-2 border border-neutral-200 border-b-0 last:border-b flex items-center justify-between">
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex items-center">
                                                        <span className="material-icons-outlined">drag_indicator</span>
                                                        <div className="">
                                                            {acValue.title}
                                                        </div>
                                                    </div>
                                                    {!editEnabled && <>
                                                        <div>
                                                            <a href="javascript:void(0)" onClick={() => { setEditEnabled(true); setAcTitle(acValue.title); setEditor(null); setAcDesc(acValue.desc); setPos(acValue.index); setAddBtn(false); setEditBtn(true); setOpenStatus(acValue.openstatus); }}><span class="material-icons-outlined ml-3">mode_edit</span></a>
                                                            <a href="javascript:void(0)" onClick={() => { deleteAcc(acValue);}}><span class="material-icons-outlined ml-3">delete_outline</span></a>
                                                        </div>
                                                        </>
                                                    }
                                                </div>
                                            </li>
                                        </>
                                    )
                                })}
                            </ul>
                            <div className="my-2 px-2 py-2">
                                <div className="mb-4 last:mb-0">
                                    <label htmlFor="" className="mb-1">Accordion Title</label>
                                    <div >
                                        <input type="text" className="w-full h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md" value={acTitle} onChange={changeAcTitle} />
                                    </div>
                                </div>
                                <div className="mb-4 last:mb-0">
                                    <label htmlFor="" className="mb-1">Content</label>
                                    <div >
                                        {editor}
                                    </div>
                                </div>

                                <div className="mr-5 px-2">
                                    <label className="text-gray-500 flex items-center">
                                        <input onChange={changeOpenStatus} type="checkbox" x-model="checked" checked={openStatus == "Yes" ? "checked" : ""} />
                                        <span className="ml-2">Open By Default</span>
                                    </label>
                                </div>
                                <div className="mb-4 last:mb-0">
                                    {addBtn && <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white mt-2" onClick={saveAccordion}>+ Add</button>}
                                    {editBtn && <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white mt-2" onClick={updateAccordion}>+ Edit</button>}

                                </div>
                            </div>





                        </div>
                    </div>

                </div>



            </div>
        </>
    );
};

export default ElementAccordion;
