/*Component Name: ElementImage
Component Functional Details: Element for Component Background  
Created By: Vikas Patel
Created Date: 07/07/2022
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useCallback } from 'react';
import ElementIconBrowser from './ElementIconBrowser';


const ElementIcon = (props) => {

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
    const [iconSymbol, setIconSymbol] = useState('');
    const [showModal, setShowModal] = useState(false);
    const selectedObj = props.componentHtml.filter(obj => obj.uid == props.currentComponent);
    let attributes = {};

    const propertyName = props.variable;


    /* Function to set component with updated attributes values */

    useEffect(() => {
        if (selectedObj.length > 0) {
            if (selectedObj[0].selected_Values != undefined && Object.keys(selectedObj[0].selected_Values).length > 0) {
                let tmp;
                Object.entries(selectedObj[0].selected_Values).map(([key, value]) => {
                    if (key == bgPropertyName) {
                        tmp = value;
                    }

                });

                if (tmp != undefined) {
                    let attributes = tmp;
                    setIconSymbol(attributes.value);
                    //onIcon(attributes.value);

                }
                else {
                    setIconSymbol('');
                }


            }
            else {
                setIconSymbol('');
                //updateProperty({[bgPropertyName]: imageURL});
            }
        }


    }, [props.currentComponent]);

    const updateFont = (type, value) => {
        let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
        if (x.querySelectorAll("#" + bgPropertyName).length > 0) {
            if (type == "fontawesome") {

            }
            else if (type == "googlematerial") {
                //x.innerHTML = '<span class="icon-asset material-icons-outlined">' + value + '</span>';
            
                x.querySelectorAll("#" + bgPropertyName)[0].innerHTML = '<span class="icon-asset material-icons-outlined">' + value + '</span>';
            }
        }

       // let x = document.getElementById('icon_style');
        
        //setImageURL(url);
        // setTimeout(function () {displayImageVideo(url); }, 500);
        // if(imageOrVideo == "Image")
        // {
        //     let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
        //     x.querySelectorAll('#'+props.variable)[0].src = url;
        //     // props.refArray.current[props.currentComponent].style='background: url("'+url+'");';
        //     props.updateProperty({type: "image", value: url}, bgPropertyName);

        // }
    }




    return (
        <>
            <div className="relative border-b border-neutral-00">
                <button onClick={() => { showHideProperties() }}
                    className="flex w-full flex-wrap justify-between items-center text-sm px-3 py-4 bg-white border-0 font-bold">
                    <span >{props.compprop.title ?? "Icon"}</span>
                    <span className="material-icons-outlined">expand_more</span>
                </button>

                <div className={`property-content bg-white border-y border-b-0 border-neutral-200 ${showHide ? "" : "hidden"}`}>
                    <div class="mx-2 text-sm">
                        <div class="py-2">
                            <div className="mb-4 last:mb-0 flex justify-between">
                                <label htmlFor="" className="mb-1 block text-sm">Icon Style</label>
                                <div className="flex flex-wrap">
                                    <span id="icon_style"></span>
                                    <a href="javascript:void(0)" onClick={() => setShowModal(true)}>Change</a>
                                </div>
                                <ElementIconBrowser showModal={showModal} setShowModal={setShowModal} defaultIcon="" updateFont={updateFont} />
                            </div>



                        </div>
                    </div>

                </div>

            </div>
        </>
    );
};

export default ElementIcon;
