import React, { useEffect } from "react";
import Transition from "utils/Transition";

const IdleTimeModal = ({
    data,
    title,
    handleConfirmation,
    openModal,
    setOpenModal,
    ButtonName,
    displayCancelButton,
    cancelButtonName,
    cancelButtonAction,
    children
}) => {
    // esc hide modal
    //  useEffect(() => {    

    const confirmation = () => {
        if (handleConfirmation instanceof Function) {
            handleConfirmation(data);
        } else {
            setOpenModal(false);
        }
    };
    const cancelFunction = () => {
        if (cancelButtonAction instanceof Function) {
            cancelButtonAction();
        }
        setOpenModal(false);
    };
    return (
        <>
            <Transition
                className="fixed inset-0 bg-slate-900 bg-opacity-95 z-50 transition-opacity"
                show={openModal}
                tag="div"
                enter="transition ease-out duration-200 transform"
                enterStart="opacity-0 -translate-y-2"
                enterEnd="opacity-100 translate-y-0"
                leave="transition ease-out duration-200"
                leaveStart="opacity-100"
                leaveEnd="opacity-0"
                onClick={() => setOpenModal(false)}
            ></Transition>
            <Transition
                className="fixed inset-0 z-50 overflow-hidden flex items-center my-4 justify-center transform px-4 sm:px-6"
                show={openModal}
                tag="div"
                id="basic-modal"
                enter="transition ease-out duration-200 transform"
                enterStart="opacity-0 -translate-y-2"
                enterEnd="opacity-100 translate-y-0"
                leave="transition ease-out duration-200"
                leaveStart="opacity-100"
                leaveEnd="opacity-0"
            >
                <div className="bg-white rounded shadow-lg overflow-auto max-w-lg max-h-full w-full top-4 absolute">
                    <div className="px-5 py-3 border-b border-neutral-200 ">
                        <div className="flex justify-between items-center">
                            <div className="font-bold text-black">
                                {title ? title : "Confirmation"}
                            </div>
                            {/* <button type="button"
                                className="text-black hover:text-gray-400"
                                onClick={() => setOpenModal(false)}
                            >
                                <div className="sr-only">Close</div>
                                <svg className="w-4 h-4 fill-current">
                                    <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z"></path>
                                </svg>
                            </button> */}
                        </div>
                    </div>
                    <div className="px-5 pt-4 pb-1">
                        <div className="text-sm">
                            <div className="space-y-2">
                                {children}
                            </div>
                        </div>
                    </div>
                    <div className="px-5 py-4">
                        <div className="flex flex-wrap justify-start space-x-2">
                            <button
                                type="button"
                                onClick={confirmation}
                                className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                            >
                                {ButtonName ? ButtonName : "OK"}
                            </button>
                            {(displayCancelButton === true ||
                                displayCancelButton === undefined) && (
                                    <button type="button"
                                        className="btn border-gray-300 hover:border-neutral-400 text-gray-500"
                                        onClick={() => cancelFunction()}
                                    >
                                        {cancelButtonName ? cancelButtonName : "Cancel"}
                                    </button>
                                )}
                        </div>
                    </div>
                </div>
            </Transition>
        </>
    );
};

export default IdleTimeModal;
