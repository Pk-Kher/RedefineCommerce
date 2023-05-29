import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { hideAlertMessage } from "redux/alertMessage/AlertMessageActions"

const Warning = (/* { message, showMessage, setShowMessage } */) => {
    const showMessage = useSelector(state => state.alertMessage);
    const dispatch = useDispatch();
    const [errors, setErrors] = useState([]);
    useEffect(() => {
        setErrors(() => {
            let temp = [];
            if (showMessage.message !== '') {
                temp = showMessage.message.split('<br/> ');
            }
            return temp;
        });
    }, [showMessage]);
    return (
        <>
            <div className={`py-5 ${!showMessage?.message && 'hidden'} gap-2 sticky top-0 pb-2 pt-2 sticky-header z-30`}>
                <div className="flex justify-between items-start px-4 py-2 rounded text-sm bg-yellow-100 border border-yellow-200 text-yellow-600">
                    <div className="w-full">
                        {
                            errors?.map((value, index) => {
                                return (
                                    <div className="flex mb-1" key={index}>
                                        <svg className="w-4 h-4 shrink-0 fill-current opacity-80 mt-[3px] mr-3" viewBox="0 0 16 16">
                                            <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z">
                                            </path>
                                        </svg>
                                        <div>{value}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <button type="button" className="opacity-70 hover:opacity-80 ml-3 mt-[3px]" onClick={() => dispatch(hideAlertMessage())}>
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

export default Warning