import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { hideAlertMessage } from "redux/alertMessage/AlertMessageActions"

const Error = ({ showMessage, setMessage }) => {
    return (
        <>
            <div className={`py-5 ${!showMessage?.message?.length > 0 && 'hidden'} gap-2 sticky top-0 pb-2 pt-2 sticky-header z-30 `}>
                <div className="flex px-4 py-2 rounded text-sm bg-rose-100 border border-rose-200 text-rose-600 justify-between items-start">
                    <div className="w-full ">
                        {showMessage?.message?.length > 0 &&
                            showMessage?.message?.map((value, index) => {
                                return (
                                    <div className="flex mb-1" key={index}>
                                        <svg className="w-4 h-4 shrink-0 fill-current opacity-80 mt-[3px] mr-3" viewBox="0 0 16 16">
                                            <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm3.5 10.1l-1.4 1.4L8 9.4l-2.1 2.1-1.4-1.4L6.6 8 4.5 5.9l1.4-1.4L8 6.6l2.1-2.1 1.4 1.4L9.4 8l2.1 2.1z">
                                            </path>
                                        </svg>
                                        <div>
                                            <span className='font-bold'> {value?.row}</span>
                                            <ul>
                                                {value?.error?.map((msg, index1) => {
                                                    return <li key={index1}> {msg}</li>
                                                })}
                                            </ul>
                                        </div>

                                    </div>
                                );
                            })
                        }


                    </div>
                    <button type="button" className="opacity-70 hover:opacity-80 ml-3 mt-[3px]" onClick={() => setMessage({ message: [] })}>
                        <div className="sr-only">Close</div>
                        <svg className="w-4 h-4 fill-current">
                            <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z">
                            </path>
                        </svg>
                    </button>
                </div>
            </div>
        </>
    )
}

export default Error