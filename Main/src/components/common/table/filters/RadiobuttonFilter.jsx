/*Component Name: radiobuttonFilter
Component Functional Details: User can create or update radiobuttonFilter master details from here.
Created By: Happy
Created Date: 06/01/22
Modified By: Pradip Kher
Modified Date: 6/12/2022 */

import React, { useState, useRef, useEffect } from "react";
import Transition from "../../../../utils/Transition";

const RadiobuttonFilter = ({ name, columnName, options, setColumnFilter, filteringOptions }) => {
  const [statusValue, setStatusValue] = useState("");
  const statusHandleChange = (e) => {
    setStatusValue(e.target.value);
  };
  const handleChangeStatus = (e) => {
    e.preventDefault();
    setColumnFilter({
      field: columnName,
      operator: 0,
      value: statusValue,
    });
  };
  useEffect(() => {
    setStatusValue(() => {
      var temp = filteringOptions.filter((value) => {
        return value.field === columnName
      });
      if (temp.length > 0) {
        return temp[0].value;
      } else {
        return "";
      }
    });
  }, [filteringOptions])
  const clearStatus = (e) => {
    e.preventDefault();
    setStatusValue("");
    setColumnFilter({
      field: columnName,
      operator: 0,
      value: "",
    });
  };
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const trigger = useRef(null);
  const dropdown = useRef(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div className="relative inline-flex" x-data="{ open: false }">
      <button
        ref={trigger}
        className="flex flex-wrap items-center text-sm px-3 py-2 bg-white border border-neutral-200 text-gray-500 hover:text-gray-700 rounded-md shadow-sm mr-2"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <span className="material-icons-outlined">done</span>
        <span className="ml-1">{name}</span>
        <wbr />
      </button>
      <Transition
        show={dropdownOpen}
        tag="div"
        className="origin-top-left z-10 absolute top-full right-0 min-w-72 bg-white border border-neutral-200 pt-1.5 rounded shadow-lg overflow-y-auto max-h-96 mt-1"
        enter="transition ease-out duration-100 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          className="font-medium text-sm text-gray-600"
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <form onSubmit={handleChangeStatus}>
            <ul className="mb-4">
              {options.map((option) => {
                return (
                  <li key={option.value} className="py-1 px-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="filter_status"
                        className="form-radio"
                        value={option.value}
                        checked={statusValue === option.value}
                        onChange={statusHandleChange}
                      />
                      <span className="text-sm font-medium ml-2">
                        {option.label}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
            <div className="py-2 px-3 border-t border-neutral-200 bg-slate-50 sticky bottom-0">
              <ul className="flex items-center justify-between">
                <li>
                  <button
                    type="button"
                    className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
                    onClick={(e) => {
                      clearStatus(e);
                    }}
                  >
                    Clear
                  </button>
                </li>
                <li>
                  <button
                    type="submit"
                    className={`btn bg-indigo-500 hover:bg-indigo-600 text-white ${statusValue === "" ? "cursor-not-allowed" : ""
                      }`}
                    disabled={statusValue === "" ? true : false}
                    onClick={() => setDropdownOpen(false)}
                    onBlur={() => setDropdownOpen(false)}
                  >
                    Apply
                  </button>
                </li>
              </ul>
            </div>
          </form>
        </div>
      </Transition>
    </div>
  );
};
export default React.memo(RadiobuttonFilter);
