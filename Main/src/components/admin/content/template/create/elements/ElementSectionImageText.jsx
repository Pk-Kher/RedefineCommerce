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
import { useSelector } from "react-redux";
import { CKEditor } from "ckeditor4-react";
import { EXITED } from 'react-transition-group/transition';

const ElementSectionImageText = (props) => {
    const [loaderDisplay, setLoaderDisplay] = useState(false);
    const [editor, setEditor] = useState(null);
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

    const [sectionType, setSectionType] = useState('');
    const [selectionClass, setSelectionClass] = useState('hidden');
    const [leftSection, setLeftSection] = useState({});
    const [rightSection, setRightSection] = useState({});
    const [centerSection, setCenterSection] = useState({});
    const [imageURL, setImageURL] = useState('');
    const [imageAlt, setImageAlt] = useState('');
    const [imageLink, setImageLink] = useState('');
    const [headline, setHeadline] = useState('');
    const [Description, setDescription] = useState('');
    const [content, setContent] = useState('Image');
    const [sectionDisplay, setSectionDisplay] = useState('Yes');
    const [contentType, setContentType] = useState('Text');
    const [finalArr, setFinalArr] = useState({});



    const CompanyName = useSelector((store) => store?.CompanyConfiguration.data)
    const FolderPath = `/temp/${CompanyName}/content/1`

    const selectedObj = props.componentHtml.filter(obj => obj.uid == props.currentComponent);
    let attributes = {};

    const propertyName = props.variable;
    const [editorText, setEditorText] = useState('');

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
                    setFinalArr(attributes.value);
                }
            }
            else {
            }
        }


    }, [props.currentComponent]);

    const generateCKEditor = (value) => {
        // let elProps = 
        let displayData = finalArr?.[value]?.description;
        setEditor(null);
        if (displayData === undefined) {
            displayData = "";
            // setEditorText("<p></p>");
        }

        const editor1 = (
            <CKEditor
                id={`description${value}`}
                // onInstanceReady={(editor) => { setckdata(editor.editor); }}
                initData={displayData}
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
                    setEditorText(editor.getData());
                }}
            />
        );
        setLoaderDisplay(true);
        setTimeout(function () {
            setLoaderDisplay(false);
            setEditor(editor1);
        }, 2000);

    };



    const displaySection = (obj, side) => {

        let strHTML = "";
        if (obj.contentType == "Image") {
            strHTML += '<div class="flex">';
            strHTML += '<a title="' + obj.image_alt + '" href="' + obj.image_link + '" class="hrefurl no-underline">';
            strHTML += '<img class="w-full" src="' + obj.image + '" alt="' + obj.image_alt + '" title="' + obj.image_alt + '">';
            strHTML += '<div class="text-center w-full bg-gray-50">';
            strHTML += '<div class="text-base font-semibold p-4">' + obj.headline + '</div>';
            strHTML += '</div>';

            //strHTML += '</div>';
            strHTML += '</a>';
            strHTML += '</div>';
        }
        else {
            strHTML += '<div class="p-4 lg:p-8 flex w-full items-center">';
            strHTML += '<div class="w-full">';
            strHTML += '<div class="text-sub-title">' + obj.headline + '</div>';
            strHTML += '<div class="text-default-text mt-2">' + obj.description + '</div>';
            strHTML += '</div>';
            strHTML += '</div>';
        }
        let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
        x.querySelectorAll('#section' + side)[0].innerHTML = strHTML;

    }

    const findClass = () => {
        let column = 0;
        if (!Object.keys(finalArr).includes("Right")) {
            column = column + 1;
        }
        else if (finalArr.Right.display == "Yes") {
            column = column + 1;
        }

        if (!Object.keys(finalArr).includes("Center")) {
            column = column + 1;
        }
        else if (finalArr.Center.display == "Yes") {
            column = column + 1;
        }

        if (!Object.keys(finalArr).includes("Left")) {
            column = column + 1;
        }
        else if (finalArr.Left.display == "Yes") {
            column = column + 1;
        }
        if (column == 3) {
            return ["lg:w-1/3", "px-3", "md:w-1/2"];
        }
        else if (column == 2) {
            return ["lg:w-1/2", "px-3", "md:w-1/2"];
        }
        else if (column == 1) {
            return [];
        }
        return [];
    }


    //section 1 - image/text
    const onElementImageChange = (url) => {
        setImageURL(url);
        // let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
        // x.querySelectorAll('#'+props.variable)[0].src = url;
        // // props.refArray.current[props.currentComponent].style='background: url("'+url+'");';
        // props.updateProperty({type: "image", value: url}, bgPropertyName);
    }

    const updateAltTag = (val) => {
        setImageAlt(val);
    }

    const updateLink = (val) => {
        setImageLink(val);
    }



    const changeSections = (value) => {
        if (value == "") {
            setSelectionClass("hidden");
        }
        else {
            setSelectionClass("");
            //generateCKEditor();
            // setEditor(null);
            // setEditor(null);
            if (Object.keys(finalArr).includes(value)) {

                let elProps = finalArr[value];

                setSectionDisplay(elProps.display);
                setContentType(elProps.contentType);
                setHeadline(elProps.headline);

                setEditorText(elProps.description);
                setImageURL(elProps.image);
                setImageAlt(elProps.image_alt);
                setImageLink(elProps.image_link);
            }
            else {
                setImageURL('');
                setImageLink('');
                setImageAlt('');
                setHeadline('');
                setEditorText('');
                //changeSections('');

            }

            generateCKEditor(value);
        }
        setSectionType(value);

    };

    const changeSectionDisplay = (event) => {
        setSectionDisplay(event.target.value);
        setEditor(null);
        if (event.target.value === "Yes") {
            const allWithClass = Array.from(
                document.querySelectorAll('div#imagetextdiv')
            );
            allWithClass.forEach(element => {
                element.classList.remove("hidden");
            });

            // generateCKEditor();
        }
        else {
            const allWithClass = Array.from(
                document.querySelectorAll('div#imagetextdiv')
            );
            allWithClass.forEach(element => {
                element.classList.add("hidden");
            });
        }
        generateCKEditor();
    };

    const changeContentType = (event) => {
        setContentType(event.target.value);
    }

    const updateHeadline = (event) => {
        setHeadline(event.target.value);
    };

    const saveData = () => {
        if (sectionType != "") {
            let saveObj = { "display": sectionDisplay, "contentType": contentType, "headline": headline, "description": editorText, "image": imageURL, "image_alt": imageAlt, "image_link": imageLink };
            let tmpArr = {};
            if (Object.keys(finalArr).includes(sectionType)) {

                Object.keys(finalArr).map((dkey, index) => {

                    if (dkey == sectionType) {
                        Object.assign(tmpArr, { [sectionType]: saveObj });
                    }
                    else
                        Object.assign(tmpArr, { [dkey]: finalArr[dkey] });
                });
                setFinalArr(tmpArr);
                props.updateProperty({ type: "dynamic", value: tmpArr }, bgPropertyName);
            }
            else {
                Object.assign(finalArr, { [sectionType]: saveObj });
            }

            setImageURL('');
            setImageLink('');
            setImageAlt('');
            setHeadline('');
            setEditorText('');
            changeSections('');
            setContentType('Text')
            //setEditor(null);
            alert('Data Saved successfully');

            //            setTimeout(displayHTML(), 1000);



        }
        setEditor(null);
        generateCKEditor();
    };

    const displayClass = (divid, classArr) => {
        let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
        x.querySelectorAll('#' + divid)[0].classList.remove("lg:w-1/3");
        x.querySelectorAll('#' + divid)[0].classList.remove("px-3");
        x.querySelectorAll('#' + divid)[0].classList.remove("md:w-1/2");
        x.querySelectorAll('#' + divid)[0].classList.remove("lg:w-1/2");
        classArr.forEach((value) => {
            x.querySelectorAll('#' + divid)[0].classList.add(value);
        });

    }

    const displayHTML = () => {
        let className = findClass();
        let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);

        if (Object.keys(finalArr).includes("Left")) {

            if (finalArr.Left.display === "Yes") {
                displayClass('sectionLeft', className);
                displaySection(finalArr.Left, "Left");
                x.querySelectorAll('#sectionLeft')[0].classList.remove("hidden");
            }
            else {
                x.querySelectorAll('#sectionLeft')[0].classList.add("hidden");
            }
        }
        else {
            x.querySelectorAll('#sectionLeft')[0].innerHTML = '<div class="p-4 lg:p-8 flex w-full items-center"></div>';
        }

        if (Object.keys(finalArr).includes("Center")) {
            if (finalArr.Center.display == "Yes") {
                displayClass('sectionCenter', className);
                displaySection(finalArr.Center, "Center");
                x.querySelectorAll('#sectionCenter')[0].classList.remove("hidden");
            }
            else {
                x.querySelectorAll('#sectionCenter')[0].classList.add("hidden");
            }
        }
        else {
            x.querySelectorAll('#sectionCenter')[0].innerHTML = '<div class="p-4 lg:p-8 flex w-full items-center"></div>';

        }
        if (Object.keys(finalArr).includes("Right")) {
            if (finalArr.Right.display == "Yes") {
                displayClass('sectionRight', className);
                displaySection(finalArr.Right, "Right");
                x.querySelectorAll('#sectionRight')[0].classList.remove("hidden");
            }
            else {
                x.querySelectorAll('#sectionRight')[0].classList.add("hidden");
            }
        }
        else {
            x.querySelectorAll('#sectionRight')[0].innerHTML = '<div class="p-4 lg:p-8 flex w-full items-center"></div>';
        }
    };


    useEffect(() => {
        setTimeout(function () {
            displayHTML();

            props.updateProperty({ type: "dynamic", value: finalArr }, bgPropertyName);
        }, 2000);
    }, [finalArr]);


    return (
        <>
            <div className="relative border-b border-neutral-00">
                <button onClick={() => { showHideProperties() }}
                    className="flex w-full flex-wrap justify-between items-center text-sm px-3 py-4 bg-white border-0 font-bold">
                    <span >{props.compprop.title ?? "Image"}</span>
                    <span className="material-icons-outlined">expand_more</span>
                </button>

                <div className={`property-content bg-white border-y border-b-0 border-neutral-200 ${showHide ? "" : "hidden"}`}>
                    <div class="mx-2 text-sm">
                        <div className="mb-4 last:mb-0">
                            <label htmlFor="" className="mb-1 block text-sm">Select Section</label>
                            <div className="flex flex-wrap pb-2">
                                <select value={sectionType} onChange={(event) => { changeSections(event.target.value) }} className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                    <option value="">None</option>
                                    <option value="Left">Left</option>
                                    <option value="Center">Center</option>
                                    <option value="Right">Right</option>
                                </select>
                            </div>
                        </div>
                        <div class={`py-2 ${selectionClass}`} id="selections">
                            <div className="mb-4 last:mb-0">
                                <label htmlFor="" className="mb-1 block text-sm">Section Display</label>
                                <div className="flex flex-wrap">
                                    <select value={sectionDisplay} onChange={changeSectionDisplay} className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                            </div>
                            <div id="imagetextdiv" className={sectionDisplay == "No" ? "hidden" : ""}>
                                <div className="mb-4 last:mb-0">
                                    <label htmlFor="" className="mb-1 block text-sm">Content Type</label>
                                    <div className="flex flex-wrap">
                                        <select value={contentType} onChange={changeContentType} className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                            <option value="Text">Text</option>
                                            <option value="Image">Image</option>
                                        </select>
                                    </div>
                                </div>
                                <div id="textdiv" className={contentType == "Text" ? "" : "hidden"}>


                                    <div class="mx-2 text-sm">
                                        <label htmlFor="" className="mb-1 block text-sm">Description</label>
                                        {loaderDisplay && <div class="py-2">
                                            Loading...
                                        </div>}
                                        <div class="py-2">
                                            {editor}
                                        </div>
                                    </div>
                                </div>
                                <div id="imagediv" className={contentType == "Image" ? "" : "hidden"}>
                                    <div class="mb-3">
                                        <ImageFile
                                            type="file"
                                            className="sr-only"
                                            name="image1"
                                            id="image1"
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
                                </div>
                                <div className="mb-3">
                                    <div className="flex justify-between items-center mb-1">
                                        <div >Headline Text</div>
                                    </div>
                                    <div class="text-center relative overflow-hidden">
                                        <input type="text" className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-3 py-2 leading-tight focus:outline-none focus:bg-white" value={headline} onChange={updateHeadline} />

                                    </div>
                                </div>

                            </div>
                            <div className="mb-4 last:mb-0">
                                <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white mt-2" onClick={saveData}>+ Add</button>
                            </div>

                        </div>
                    </div>

                </div>

            </div>
        </>
    );
};

export default ElementSectionImageText;
