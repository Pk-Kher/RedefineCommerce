import React, { useState, useEffect, useCallback } from 'react'

const Images = (props) => {

    const [showHide, setShowHide] = useState(false);
    const showHideProperties = () => {
        if(showHide == true)
            setShowHide(false);
        else
        {
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
        alert(props.loadComplete);
        if (props.loadComplete) 
        {
            let x = document.getElementById("right1");
            alert(x.html);
            let images = x.querySelectorAll("img");
            //console.log(images);
        }
    }, [props.originalText]);


    return (
        <>
           <div className="relative bg-white mb-4">
                <button onClick={ () => { showHideProperties()  } } className="flex w-full flex-wrap justify-between items-center text-sm px-3 py-4 bg-white border-0 font-medium">
                <span className="ml-1 font-bold">Images</span> 
                    <span className="flex">
                        <span className="text-xs inline-flex font-bold border border-yellow-300 bg-yellow-100 text-black-600 rounded-full text-center px-4 py-1 ml-3">
                            1/1
                        </span>
                        <span className="material-icons-outlined ml-3 pointer-class">{showHide ? "keyboard_arrow_down" : "keyboard_arrow_up"}</span>
                    </span>
                </button>

                <div className={`bg-white border-y border-b-0 border-neutral-200 overflow-hidden ${showHide ? "" : "hidden"}`}>
                    <div className='bg-white px-4 py-4'>
                        <ul className='class="bg-white mx-1 text-sm mt-4 mb-4"'>
                        </ul>
                    </div>
                </div>
            </div>
            
        </>
    )
}

export default Images