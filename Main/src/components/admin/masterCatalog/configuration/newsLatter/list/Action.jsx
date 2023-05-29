import React, { useRef, useEffect, useState } from "react";
import Transition from "utils/Transition";
import { useSelector } from "react-redux";

const Actions = ({
  id,
  row,
  setBasicModalInfo,
  setOpenBasicModal,
}) => {
  const permission = useSelector((store) => store.permission);
  const [show, setShow] = useState(false);

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
  return (
    <div x-data="{ open: false }">
      <div className="text-right">
        <button
          ref={trigger}
          onClick={() => setShow(!show)}
          className="w-6 h-6"
          aria-haspopup="true"
          aria-expanded="true"
        >
          <span className="material-icons-outlined">more_vert</span>
        </button>
      </div>
      <Transition
        className="z-10 absolute min-w-60 bg-white border border-neutral-200 pt-1.5 rounded shadow-lg mt-1 overflow-y-auto enter-done right-14"
        show={show}
        tag="div"
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <ul className="pb-4" ref={dropdown}>
          {(permission.isEdit || permission.isDelete) && (
            <>
              {(() => {
                if (row.original?.isSubscribe === true) {
                  return (
                    <li
                      className="pt-2 px-5"
                      onClick={() => {
                        setBasicModalInfo((prev) => {
                          return {
                            ...prev,
                            status: "Unsubscribe",
                            module: "Newsletter",
                            title: "Unsubscribe this user",
                            ButtonName: "Unsubscribe",
                            data: {
                              ...row.original,
                              changeStatus: row.original.id,
                            },
                          };
                        });
                        setOpenBasicModal((prev) => !prev);
                      }}
                    >
                      <span className="text-indigo-500 hover:text-indigo-600  cursor-pointer">
                        Unsubscribe
                      </span>
                    </li>
                  );
                }
              })()}
            </>
          )}
        </ul>
      </Transition>
    </div>
  );
};

export default Actions;
