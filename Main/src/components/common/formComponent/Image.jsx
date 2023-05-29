import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { defaultImage } from "global/Enum";

const ImageComponent = ({
    className,
    src,
    containerheight,
    defaultImageVisibility,
    ...rest
}) => {
    const imgRef = useRef();
    const imageContainer = useRef();
    const imageContainerBorder = useRef();
    const [imageError, setImageError] = useState(false);
    useEffect(() => {
        setImageError(false);
    }, [src]);

    // imgRef?.current?.addEventListener('error', function handleError() {
    //     if (imgRef.current) {
    //         imgRef.current.style.visibility = !defaultImageVisibility ? "hidden" : "";
    //         imageContainerBorder.current.className = "a";
    //         // imgRef.current.style.height = defaultImageHeight;
    //     }
    //     if (imageContainer?.current) {

    //         imageContainer.current.innerHTML = "No Image"
    //         // imageContainer.current.style.height = defaultImageHeight;
    //         imageContainer.current.className = `col-span-full lg:col-span-6 border-2 border-neutral-200 rounded-md shadow flex items-center bg-sky-400/10 justify-center font-normal ${className} ${containerheight}`;
    //     }
    // });

    return (
        <>
            <div ref={imageContainerBorder} className={`h-24 w-40 p-2 border border-neutral-200 flex justify-center items-center ${imageError && 'bg-sky-400/10'}`}>
                <div ref={imageContainer} className={`flex justify-center items-center ${containerheight} ${imageError && `col-span-full lg:col-span-6 rounded-md  flex items-center justify-center font-normal ${className}`}`}>
                    <img ref={imgRef} className={`max-${containerheight}`} src={`${process.env.REACT_APP_API_BLOB}${src}`} {...rest} alt={'No Image'} onErrorCapture={() => {
                        setImageError(true);
                        imgRef.current.src = '/noImage.png';
                    }} />
                </div>
            </div>
        </>
    );
};

export default React.memo(ImageComponent);
