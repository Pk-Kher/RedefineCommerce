/*Component Name: Personalization
Component Functional Details: User can create or update Personalization master details from here.
Created By: Happy Patel
Created Date: June/23/2022
Modified By: Shrey Patel
Modified Date: 01/23/2023 */

import React, { useRef, useEffect, useState } from "react";
import Transition from "utils/Transition";
import { Link } from "react-router-dom";
import { ProductStatusValueName, RecStatusValuebyName, RecStatusValueName } from "global/Enum";
import { useSelector } from "react-redux";

const Actions = ({ row, moduleName, setModalInfo, setOpenBasicModal, setOpenDeleteModal, setDeleteData, editUrl, setViewHistoryModal, setRecordId, hideAction = [], type, setMoreAttributes, setViewRemainingAttributesModal }) => {
  const permission = useSelector(store => store?.permission)
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
  return (
    <div x-data="{ open: false }">
      <div className="text-right">
        <button
          type="button"
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
          {editUrl && (
            <li className="pt-4 px-5">
              <Link
                type="button"
                to={editUrl}
                className="text-indigo-500 hover:text-indigo-600 cursor-pointer"
              >
                Edit
              </Link>
            </li>
          )}
          {
            (permission?.isEdit || permission?.isDelete) &&
            <>
              {
                [RecStatusValuebyName?.Inactive, RecStatusValuebyName?.Draft, ProductStatusValueName?.Pending, RecStatusValueName.Pending].includes(row?.original?.recStatus) ?
                  (
                    <li
                      className="pt-4 px-5"
                      onClick={() => {
                        setModalInfo((prev) => {
                          return {
                            ...prev,
                            // message: 'Do you want to change Status to Active?',
                            module: moduleName,
                            status: RecStatusValueName.Active,
                            title: `Active this ${moduleName}`,
                            ButtonName: RecStatusValueName.Active,
                            data: {
                              ...row.original,
                              changeStatus: RecStatusValuebyName.Active,
                            },
                          };
                        });
                        setOpenBasicModal((prev) => !prev);
                      }}
                    >
                      <span className="text-indigo-500 hover:text-indigo-600  cursor-pointer">
                        {RecStatusValueName.Active}
                      </span>
                    </li>
                  )
                  : [RecStatusValueName?.Disapproved, RecStatusValueName.Pending].includes(row?.original?.status) ?
                    (
                      <li
                        className="pt-4 px-5"
                        onClick={() => {
                          setModalInfo((prev) => {
                            return {
                              ...prev,
                              // message: 'Do you want to change Status to Active?',
                              module: moduleName,
                              status: RecStatusValueName.Approved,
                              title: `Active this ${moduleName}`,
                              ButtonName: RecStatusValueName.Approved,
                              data: {
                                ...row.original,
                                changeStatus: RecStatusValuebyName.Active,
                              },
                            };
                          });
                          setOpenBasicModal((prev) => !prev);
                        }}
                      >
                        <span className="text-indigo-500 hover:text-indigo-600  cursor-pointer">
                          {RecStatusValueName.Approved}
                        </span>
                      </li>
                    ) : ("")
              }
              {
                [RecStatusValuebyName?.Active, RecStatusValuebyName?.Draft].includes(row?.original?.recStatus) ?
                  (
                    <li
                      className="pt-4 px-5"
                      onClick={() => {
                        setModalInfo((prev) => {
                          return {
                            ...prev,
                            status: RecStatusValueName.Inactive,
                            module: moduleName,
                            title: `Inactive this ${moduleName}`,
                            ButtonName: RecStatusValueName.Inactive,
                            data: {
                              ...row.original,
                              changeStatus: RecStatusValuebyName.Inactive,
                            },
                          };
                        });
                        setOpenBasicModal((prev) => !prev);
                      }}
                    >
                      <span className="text-indigo-500 hover:text-indigo-600  cursor-pointer">
                        {RecStatusValueName.Inactive}
                      </span>
                    </li>
                  ) : [RecStatusValueName?.Approved, RecStatusValueName?.Pending].includes(row?.original?.status) ? (
                    <li
                      className="pt-4 px-5"
                      onClick={() => {
                        setModalInfo((prev) => {
                          return {
                            ...prev,
                            status: RecStatusValueName.Disapproved,
                            module: moduleName,
                            title: `Inactive this ${moduleName}`,
                            ButtonName: RecStatusValueName.Disapproved,
                            data: {
                              ...row.original,
                              changeStatus: RecStatusValuebyName.Disapproved,
                            },
                          };
                        });
                        setOpenBasicModal((prev) => !prev);
                      }}
                    >
                      <span className="text-indigo-500 hover:text-indigo-600  cursor-pointer">
                        {RecStatusValueName.Disapproved}
                      </span>
                    </li>
                  ) : ("")
              }
            </>
          }


          {(!hideAction.includes("delete") && row.original?.recStatus !== RecStatusValuebyName.Archived && permission?.isDelete) && (
            <li className="pt-4 px-5">
              <span
                onClick={() => {
                  setDeleteData({
                    ...row.original,
                    changeStatus: RecStatusValuebyName.Archived,
                  });
                  setOpenDeleteModal(true);
                }}
                className="text-indigo-500 hover:text-indigo-600 cursor-pointer"
              >
                Delete
              </span>
            </li>
          )}
          {setRecordId &&
            <li className="pt-4 px-5">
              <span
                type="button"
                className="text-indigo-500 hover:text-indigo-600 cursor-pointer"
                onClick={() => { setRecordId(row.original.id); setViewHistoryModal(prev => !prev); }}
              >
                View history
              </span>
            </li>
          }
          {setMoreAttributes &&
            <li className="pt-4 px-5">
              <span
                type="button"
                className="text-indigo-500 hover:text-indigo-600 cursor-pointer"
                onClick={() => { setMoreAttributes(row.original.id); setViewRemainingAttributesModal(prev => !prev); }}
              >
                Add More Colors
              </span>
            </li>
          }
        </ul>
      </Transition>
    </div>
  );
};

export default Actions;
