
import React, { useState } from 'react'
import { useEffect } from 'react';
import StoreSingleSettingAttribute from './StoreSingleSettingAttribute';
const NestedSettingAttributes = ({ AttributeData, ...rest }) => {
    const [Attributes, setAttributes] = useState([]);
    const [show, setShow] = useState({
        isVisible: false,
        whichRow: 0
    });
    useEffect(() => {
        // if (AttributeData.length > 1) {
        //     setAttributes(AttributeData);
        // } else {
        //     setAttributes(AttributeData[0].sub_attributes);
        // }
        setAttributes(AttributeData);
    }, [AttributeData]);
    return (
        <>
            {Attributes &&
                Attributes.map((attribute, index) => <StoreSingleSettingAttribute attribute={attribute} show={show} setShow={setShow} {...rest} index={index} key={index} />
                )
            }
        </>
    )
}

export default NestedSettingAttributes;