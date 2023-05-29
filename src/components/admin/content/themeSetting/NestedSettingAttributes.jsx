
import React, { useState } from 'react'
import { useEffect } from 'react';
import SingleSettingAttribute from './SingleSettingAttribute';
const NestedSettingAttributes = ({AttributeData, onNestedAttributeClickHandler, ...rest}) => {
    const [showNestedHeader, setShowNestedHeader] = useState(false); 
    const [Attributes, setAttributes] = useState([]);

    useEffect(()=>{
        if(AttributeData.length > 1){
            setAttributes(AttributeData);
            setShowNestedHeader(false);
        }else{
            setAttributes(AttributeData[0].sub_attributes);
            setShowNestedHeader(true);
        }
    },[AttributeData]);

    return (
        <>  
            {showNestedHeader && 
                <div className="relative border-b last:border-b-0 border-neutral-00"> 
                    <button className="flex w-full flex-wrap justify-between items-center text-md font-bold px-3 py-4 bg-white border-0" type="button"> 
                        <span className="ml-1">{AttributeData[0].label}</span> 
                    </button> 
                </div>

            }
            {Attributes &&
                Attributes.map((attribute, index)=>{
                    if(attribute.sub_attributes){
                        return (
                            <div className={`relative border-b border-neutral-00`} key={index}>
                                <button 
                                    onClick={() => onNestedAttributeClickHandler(attribute)}
                                    className="flex w-full flex-wrap justify-between items-center text-sm px-3 py-4 bg-white border-0 font-medium"
                                    type="button"> 
                                    <span className="ml-1">{attribute.label}</span> 
                                    <span className="material-icons-outlined">expand_more</span> 
                                </button>
                            </div>
                        )
                    }else{
                        return (
                            <SingleSettingAttribute attribute={attribute} {...rest} key={index}/>
                        )    
                    }
                })
            }
        </>
    )
}

export default NestedSettingAttributes