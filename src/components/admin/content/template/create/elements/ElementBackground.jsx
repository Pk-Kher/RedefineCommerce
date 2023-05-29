/*Component Name: ElementBackground
Component Functional Details: Element for Component ElementBackground  
Created By: Vikas Patel
Created Date: 07/07/2022
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useState } from 'react';
import ColorPicker from 'components/admin/content/common/ColorPicker';
import ImageFile from 'components/admin/content/common/ImageFile';
import { useEffect } from 'react';
import { object } from 'yup';

const ElementBackground = (props) => {
    const [showHide, setShowHide] = useState(false);
    const [imageURL, setImageURL] = useState('');
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
    const [backProp, selectBackProp] = useState({ type: 'none', value: '' });
    const [colorOption, changeColorOption] = useState('');

    let attributes = {};

    const bgPropertyName = props.variable;//selectedObj.length > 0 ? Object.keys(selectedObj[0].properties).find(key => selectedObj[0].properties[key] === "background") : [];

    /* When click on any component background component will reload and
    we have called function to set default properties */

    useEffect(() => {
        //  console.log(props.variable);
    })
    useEffect(() => {
        if (backProp.type == "image")
            setImageURL(backProp.value);
        else
            setImageURL('');
    }, [backProp, imageURL]);


    useEffect(() => {
        if (selectedObj.length > 0) {
           // console.log(selectedObj[0].selected_Values, bgPropertyName);
            if (selectedObj[0].selected_Values != undefined && Object.keys(selectedObj[0].selected_Values).length > 0) {
                Object.entries(selectedObj[0].selected_Values).map(([key, value]) => {
                    if (key == bgPropertyName)
                    attributes =  value;
                });
               // console.log("attributes", bgPropertyName, attributes);

                if (attributes != undefined && Object.keys(attributes).length > 0) {

                    selectBackProp(attributes);
                    setBackgroundValue(attributes.type);
                    //loadBackgroundDefault(attributes);
                }
            }
            else {
                setBackgroundType('none');
                selectBackProp({ type: "none", value: "" });
            }
        }


    }, [props.currentComponent]);

    // const loadBackgroundDefault = (obj) => {
    //     if(obj.type == "color")
    //     {
    //         props.refArray.current[props.currentComponent].style='background: '+obj.value+';';
    //     }
    //     else if(obj.type == "image")
    //     {
    //         props.refArray.current[props.currentComponent].style='background: url("'+obj.value+'");';
    //     }
    //     else if(obj.type == "none")
    //     {
    //         props.refArray.current[props.currentComponent].style='background: none;';
    //     }
    // }

    /* Function to set component with updated attributes values */
    useEffect(() => {
        if (Object.keys(backAttributes).length > 0) {
            props.setComponentHtml(backAttributes);
        }
    },
        [backAttributes]);



    const changeBackgroundColor = (color) => {
        // props.refArray.current[props.currentComponent]
        props.refArray.current[props.currentComponent].style = 'background: ' + color.hex + ';';
        props.updateProperty({ type: 'color', value: color.hex }, bgPropertyName);
        //setCurrentApp({ ...currentApp, [e.target.id]: e.target.value, ["hospitalID"]: id.hospitalID })  
        //console.log(color);
    }


    const [backgroundValue, setBackgroundValue] = useState('none');

    /* Background image change function */
    const onBackgroundImageChange = (url) => {
        props.refArray.current[props.currentComponent].style = 'background: url("' + url + '");';
        props.updateProperty({ type: "image", value: url }, bgPropertyName);
    }

    /* Function to set background type */
    const setBackgroundType = (val) => {
        const curObj = props.componentHtml.filter(obj => obj.uid == props.currentComponent);
        if (val == "none") {
            props.refArray.current[props.currentComponent].style = 'background: none';


        }
        selectBackProp({ type: val, value: '' });
        props.updateProperty({ type: val, value: '' }, bgPropertyName);
        setBackgroundValue(val);
        if (backProp.type == "image")
            setImageURL(backProp.value);
        else
            setImageURL('');
    }


    /* Update background properties related to element */
    // const updateProperty = (bgObj) => {
    //     const curObj = props.componentHtml.filter(obj => obj.uid == props.currentComponent);

    //     if(bgPropertyName != "")
    //     {
    //         if(curObj[0].selected_Values)
    //         {
    //             attributes = Object.entries(curObj[0].selected_Values).map(([key, value]) => {
    //                 if(key == bgPropertyName)
    //                     return ({[key]: bgObj});
    //                 else
    //                     return ({key: value});
    //             })[0];
    //         }
    //         else
    //         {
    //              attributes = {[bgPropertyName]:  bgObj};
    //         }

    //         const updatedObj = props.componentHtml.map((obj) => { 
    //             if(obj.uid == props.currentComponent)
    //             {
    //                 return {...obj, selected_Values: attributes};
    //             }
    //             else{
    //                 return {...obj};
    //             }

    //         });

    //         setBackAttributes(updatedObj);

    //     }
    // }

    return (
        <>
            <div className="relative border-b border-neutral-00">
                <button onClick={() => { showHideProperties() }}
                    className="flex w-full flex-wrap justify-between items-center text-sm px-3 py-4 bg-white border-0 font-bold">
                    <span >{props.compprop.title ?? "Background"}</span>
                    <span className="material-icons-outlined">expand_more</span>
                </button>

                <div className={`property-content bg-white border-y border-b-0 border-neutral-200 ${showHide ? "" : "hidden"}`}>
                    <ul className='mx-2 text-sm'>
                        <li className="py-2 px-3">
                            <div className='form-check form-check-inline pb-2'>
                                <input onChange={() => setBackgroundType('none')} type="radio" name="backgroundtype" checked={backgroundValue === "none"} value="none" className='form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-indigo-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer' />
                                <label className='form-check-label inline-block text-gray-800'>None</label>
                            </div>
                            <div className='form-check form-check-inline pb-2'>
                                <input onChange={() => setBackgroundType('image')} type="radio" name="backgroundtype" checked={backgroundValue === "image"} value="image" className='form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-indigo-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer' />
                                <label className='form-check-label inline-block text-gray-800'>Image</label>
                            </div>
                            <div className='form-check form-check-inline pb-2'>
                                <input onChange={() => setBackgroundType('color')} type="radio" name="backgroundtype" checked={backgroundValue === "color"} value="color" className='form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-indigo-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer' />
                                <label className='form-check-label inline-block text-gray-800'>Color</label>
                            </div>

                            <div className={`pt-2 ${(backgroundValue == "image") ? "" : "hidden"}`}>
                                <ImageFile
                                    type="file"
                                    className="sr-only"
                                    name="backgroundImage"
                                    id="backgroundImage"
                                    buttonName="Add"
                                    folderpath={props.imagePath}
                                    onChange={onBackgroundImageChange}
                                    edibtn={true}
                                    url={imageURL}
                                    backProp={backProp}
                                />
                            </div>
                            <div className={`pt-2 ${(backgroundValue == "color") ? "" : "hidden"}`}>
                                <ColorPicker changeBackgroundColor={changeBackgroundColor} value={backProp.type == "color" ? backProp.value : ""} />
                            </div>



                        </li>
                    </ul>
                </div>

            </div>
        </>
    );
};

export default ElementBackground;
