/*Component Name: ElementCKEditor
Component Functional Details: Element for Component ElementCKEditor  
Created By: Vikas Patel
Created Date: 07/07/2022
Modified By: <Modified By Name>
Modified Date: <Modified Date> */
import React, { useState, useEffect, useRef } from 'react';
import ImageFile from 'components/admin/content/common/ImageFile';
import ReactDOM from 'react-dom';
import { CKEditor } from "ckeditor4-react";

const ElementCKEditor = (props) => {

    const [editor, setEditor] = useState(null);
    const [showHide, setShowHide] = useState(false);
    let ckeditor = useRef(null);
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
    const [editorText, setEditorText] = useState('');
    let bgPropertyName = props.variable;

    const selectedObj = props.componentHtml.filter(obj => obj.uid == props.currentComponent);
    let attributes = {};

    const propertyName = props.variable;
    const [textChanged, setTextChanged] = useState(false);

    const [ckData, setckdata] = useState(null);
    //   useEffect(() => {
    //     // if (ckData && defaultValue === '') {
    //         console.log('h');
    //      ckData.setData(editorText);
    //     // }
    //     // if (ckData && defaultValue != '') {
    //     //   ckData.setData(defaultValue);
    //     // }
    //   }, [ckData]);


    useEffect(() => {
        // if(textChanged)
        // {
        if (editorText != 'Begin') {

            onChangeHandler(editorText);
            let editor1 = (
                <CKEditor
                    id={"description"}
                    name={"description"}
                    // onInstanceReady={(editor) => { setckdata(editor.editor); }}
                    initData={editorText}
                    // value={editorText}
                    config={{
                        toolbar: [
                            ['Source'],
                            ['Styles'],
                            ['Bold', 'Italic', 'Underline'],
                            ['NumberedList','BulletedList'],
                            ['List', 'Indent', 'Blocks', 'Align']
                        ],
                        extraPlugins: [/* 'wordcount'  */],
                        removePlugins: ['image'],
                        extraAllowedContent: 'div(*)',
                        allowedContent: true
                    }}

                    onChange={({ event, editor }) => {
                        setTextChanged(true);

                        setEditorText(editor.getData());
                    }}
                />
            );
            setEditor(editor1);

        }

        // }
    }
        , [editorText])
    const onChangeHandler = (text) => {

        let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);

        if (x != undefined) {

            if (x.querySelectorAll('#' + props.variable)[0] != undefined) {
                x.querySelectorAll('#' + props.variable)[0].innerHTML = text;

                //  let x1 = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
                //   x.querySelectorAll('#desciption')[0].innerHTML = text;

                updateProperty({ type: "text", value: text }, propertyName);
            }
        }
        //  changeText(editor.getData());
    }

    useEffect(()=>{
        let editor1 = (
                <CKEditor
                    id={"description"}
                    name={"description"}
                    // onInstanceReady={(editor) => { setckdata(editor.editor); }}
                    initData={editorText}
                    // value={editorText}
                    config={{
                        toolbar: [
                            ['Source'],
                            ['Styles'],
                            ['Bold', 'Italic', 'Underline'],
                            ['NumberedList','BulletedList'],
                            ['List', 'Indent', 'Blocks', 'Align']
                        ],
                        extraPlugins: [/* 'wordcount'  */],
                        removePlugins: ['image'],
                        extraAllowedContent: 'div(*)',
                        allowedContent: true
                    }}

                    onChange={({ event, editor }) => {
                        setTextChanged(true);

                        setEditorText(editor.getData());
                    }}
                />
            );
            setEditor(editor1);
    })


    /* Function to set component with updated attributes values */

    useEffect(() => {
        if (selectedObj[0].selected_Values != undefined && Object.keys(selectedObj[0].selected_Values).length > 0) {

            let tmp;
            Object.entries(selectedObj[0].selected_Values).map(([key, value]) => {
                if (key == bgPropertyName) {
                    tmp = value;
                }
            });

            if (tmp != undefined) {
                let attributes = tmp;
                setEditorText(attributes.value);
                // ckData.setData(attributes.value);
                setEditor(null);

            }
            else {
                let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
                setEditor(null);
                setEditorText(x.querySelectorAll('#' + props.variable)[0].innerHTML);

                //  ckData.setData('');
            }
        }
        else {
            let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
            setEditorText(x.querySelectorAll('#' + props.variable)[0].innerHTML);
            // ckData.setData('');
            //updateProperty({[bgPropertyName]: imageURL});
        }



        //const editor = CKEDITOR.instances.myeditor;



    }, [props.currentComponent]);

    const changeText = (text) => {


    }

    /* Update background properties related to element */
    const updateProperty = (bgObj, propertyChange) => {
        const curObj = props.componentHtml.filter(obj => obj.uid == props.currentComponent);
        let attributes;
        if (propertyChange != "") {
            if (curObj[0].selected_Values != undefined) {
                let isProperty = false;
                Object.entries(curObj[0].selected_Values).map(([key, value]) => {
                    if (key == propertyChange) {
                        isProperty = true;
                        attributes = { ...attributes, [key]: bgObj };
                    }
                    else {
                        attributes = { ...attributes, [key]: value };

                    }
                });
                if (!isProperty) {
                    attributes = { ...attributes, [propertyChange]: bgObj };
                }

            }
            else {
                attributes = { [propertyChange]: bgObj };
            }
            const updatedObj = props.componentHtml.map((obj) => {
                if (obj.uid == props.currentComponent) {
                    return { ...obj, selected_Values: attributes };
                }
                else {
                    return { ...obj };
                }

            });

            props.setComponentHtml(updatedObj);
            //    // setBackAttributes(updatedObj);

        }
    }

    return (
        <>
            <div className="relative border-b border-neutral-00">
                <button onClick={() => { showHideProperties() }}
                    className="flex w-full flex-wrap justify-between items-center text-sm px-3 py-4 bg-white border-0 font-bold">
                    <span >{props.compprop.title ?? "Text"}</span>
                    <span className="material-icons-outlined">expand_more</span>
                </button>

                <div className={`property-content bg-white border-y border-b-0 border-neutral-200 ${showHide ? "" : "hidden"}`}>
                    <div class="mx-2 text-sm">
                        <div class="py-2">

                            {editor}





                        </div>
                    </div>

                </div>

            </div>
        </>
    );
};

export default ElementCKEditor;
