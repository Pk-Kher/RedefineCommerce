import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Transition from "utils/Transition";


const Actions = ({
    id,
    row,
    cancelOrderItem,
    editQtyModal,
    setEditQtyModal
}) => {
    const permission = useSelector(store => store?.permission);
    const [show, setShow] = useState(false);
    // const getEditData = useRef(null);
    const dropdown = useRef(null);
    const trigger = useRef(null);
    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!dropdown.current) return;
            if (
                !show ||
                dropdown.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            setShow(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });
    // close if the esc key is pressed

    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (!show || keyCode !== 27) return;
            setShow(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });
    return (
        <div className="relative">
            <div className="text-right">
                <button
                    ref={trigger}
                    type="button"
                    onClick={() => setShow(!show)}
                    className="w-6 h-6"
                    aria-haspopup="true"
                    aria-expanded="true"
                >
                    <span className="material-icons-outlined text-indigo-500">settings</span>
                </button>
            </div>
            <Transition
                className="origin-top-right z-10 absolute -top-3 right-6 min-w-36 bg-white border border-neutral-200 pt-1.5 rounded shadow-lg overflow-hidden mt-1"
                show={show}
                tag="div"
                enter="transition ease-out duration-200 transform"
                enterStart="opacity-0 -translate-y-2"
                enterEnd="opacity-100 translate-y-0"
                leave="transition ease-out duration-200"
                leaveStart="opacity-100"
                leaveEnd="opacity-0"
            >
                <ul className="pb-1" ref={dropdown}>
                    {(permission?.isEdit || permission?.isDelete) && <li className="py-1 px-3 text-left cursor-pointer" onClick={() => {
                        setEditQtyModal({
                            show: true,
                            orderItem: row?.original
                        });
                    }} >
                        <span className="text-gray-500">Edit</span>
                    </li>}
                    {permission?.isDelete && <li className="py-1 px-3 text-left cursor-pointer" onClick={() => cancelOrderItem(id)}>
                        <span className="text-gray-500">Cancel</span>
                    </li>}
                </ul>
            </Transition>
        </div>
    );
};

export default Actions;
