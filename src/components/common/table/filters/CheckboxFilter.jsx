/*Component Name: checkboxFilter
Component Functional Details: User can create or update checkboxFilter master details from here.
Created By: Happy
Created Date: 06/01/22
Modified By: Pradip kher
Modified Date: 6/9/2022 */

import Checkbox from "components/common/formComponent/Checkbox";
import React, { useState, useRef, useEffect } from "react";
import Transition from "../../../../utils/Transition";
import { FilteringOperator } from "global/Enum";

const CheckboxFilter = ({
  name,
  columnName,
  options,
  setColumnFilter,
  filteringOptions,
  icon,
  search,
  iconPosition = 'left',
}) => {
  const [filterValue, setFilterValue] = useState([]);
  const [filterOptions, setFilterOptions] = useState([]);
  useEffect(() => {
    setFilterOptions(options);
  }, [options]);
  useEffect(() => {
    setFilterValue(() => {
      var temp = filteringOptions.filter((value) => {
        return value.field === columnName;
      });
      if (temp.length > 0) {
        return temp[0].value.split(",");
      } else {
        return [];
      }
    });
  }, [filteringOptions]);
  const statusHandleChange = (e) => {
    if (e.target.checked) {
      setFilterValue([...filterValue, e.target.value]);
    } else {
      setFilterValue((prev) => {
        let value = [...prev];
        var index = value.indexOf(e.target.value);
        if (index > -1) {
          value.splice(index, 1); // 2nd parameter means remove one item only
        }
        return value;
      });
    }
  };
  const handleChangeStatus = (e) => {
    e.preventDefault();
    setColumnFilter({
      field: columnName,
      operator: FilteringOperator.Contains,
      value: filterValue.length === 0 ? "" : filterValue.join(","),
    });
  };

  const clearStatus = (e) => {
    e.preventDefault();
    setFilterValue([]);
    setColumnFilter({
      field: columnName,
      operator: 1,
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

  const searchHandler = (e) => {
    if (e.target.value !== "") {
      setFilterOptions(() => {
        let temp = [];
        Object.values(options).map((option, index) => {
          if (
            option.label
              .toString()
              .toLowerCase()
              .includes(e.target.value.toLowerCase())
          ) {
            temp = [...temp, option];
          }
        });
        return temp;
      });
    } else {
      setFilterOptions(options);
    }
  };
  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="flex flex-wrap items-center text-sm px-3 py-2 bg-white border border-neutral-200 text-gray-500 hover:text-gray-700 rounded-md shadow-sm mr-2"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <span className={`material-icons-outlined`} style={iconPosition === "right" ? { visibility: 'hidden', width: '1px' } : {}}>{icon}</span>
        {name}
        <span className={`material-icons-outlined`} style={iconPosition === "left" ? { visibility: 'hidden', width: '1px' } : {}}>{icon}</span>
      </button>
      <Transition
        show={dropdownOpen}
        tag="div"
        className="origin-top-left z-10 absolute top-full left-0 min-w-72 bg-white border border-neutral-200 rounded shadow-lg overflow-y-auto max-h-96 mt-1"
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
            <ul >
              {search && (
                <li className="py-1 px-3 sticky top-0 bg-white border-b border-neutral-200">
                  <div className="relative w-full">
                    <div className="absolute h-10 mt-0 left-0 top-0 flex items-center">
                      <svg
                        className="h-4 pl-4 fill-current text-gray-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z">
                          {" "}
                        </path>
                      </svg>
                    </div>
                    <input
                      onChange={searchHandler}
                      type="search"
                      placeholder="Search"
                      className="block w-full bg-[#f7f7fa] border-neutral-200 hover:border-neutral-300 focus:border-neutral-100 focus:ring-neutral-300 focus:shadow-lg pl-10 pr-2 py-2 rounded-md"
                    />
                  </div>
                </li>
              )}
              {filterOptions.map((option) => {
                return (
                  <li key={option.value} className="py-1 px-3">
                    <label className="flex items-center">
                      <Checkbox
                        label={option.label}
                        name={`checkbox_filter_status${option.label}`}
                        value={option.value}
                        onChange={(e) => {
                          statusHandleChange(e);
                        }}
                        checked={filterValue.includes(option.value.toString())}
                      />
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
                      setDropdownOpen(false);
                    }}
                  >
                    Clear
                  </button>
                </li>
                <li>
                  <button
                    type="submit"
                    className={`btn bg-indigo-500 hover:bg-indigo-600 text-white ${filterValue === "" ? "cursor-not-allowed" : ""
                      }`}
                    disabled={filterValue === "" ? true : false}
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
export default CheckboxFilter;
