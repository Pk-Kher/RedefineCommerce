import React, { useEffect, forwardRef, useRef } from 'react';

const CheckBox = forwardRef(({ indeterminate, ...rest }, ref) => {
    const defualtRef = useRef();
    const resolvedRef = ref || defualtRef;
    useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);
    return (
        <>
            <input
                id="parent-checkbox"
                className="form-checkbox cursor-pointer"
                type="checkbox"
                ref={resolvedRef} {...rest}
            />

        </>
    );

});

export default CheckBox;