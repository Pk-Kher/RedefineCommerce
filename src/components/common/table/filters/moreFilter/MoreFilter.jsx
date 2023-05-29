import React, { useState, useEffect, useCallback } from "react";
import Transition from "../../../../../utils/Transition";
import Dropdown from "./Dropdown";
import { Formik } from "formik";

const MoreFilter = ({
  filteringOptions,
  setColumnFilteringOptions,
  moreFilterOption,
}) => {
  const [show, setShow] = useState(false);
  const [filter, setFilterOptions] = useState([]);
  const [mainFilter, setMainFilter] = useState([]);

  useEffect(() => {
    setMainFilter(() => {
      return (filteringOptions ? filteringOptions : []).filter(value => {
        return value.type === 'moreFilter';
      });
    });
  }, [filteringOptions, show]);
  useEffect(() => {
    setFilterOptions(moreFilterOption);
  }, [moreFilterOption]);

  const setmainColumnFilter = useCallback((filter) => {
    setMainFilter((prev) => {
      const existingItem = prev.find((value) => filter.field === value.field);
      if (!existingItem && filter.value !== "") {
        return [...prev, { ...filter, type: 'moreFilter' }];
      } else {
        return prev
          .map((value) => {
            if (value.field === filter.field && filter.value === "") {
              return { ...value, value: filter.value, field: "" };
            }
            else if (value.field === filter.field)
              return { ...value, value: filter.value };
            return value;
          })
          .filter((value) => value.field !== "");
      }
    });

  }, []);
  // const columnFilter = useCallback(() => {
  //   setColumnFilteringOptions((prev) => {
  //     return prev.filter((val) => {
  //       return val.field === "global"
  //     })
  //   })
  // }, [mainFilter]);

  const search = (e) => {
    setFilterOptions(() => {
      return moreFilterOption.filter((option, index) => {
        return e?.target?.value === "" || option?.name?.toLowerCase()?.includes(e?.target?.value?.toLowerCase());
      });
    });
  };

  const clearMainFilter = () => {
    setMainFilter([]);
    // setFilterOptions(moreFilterOption);
    setColumnFilteringOptions((prev) => {
      return prev.filter((val) => {
        return val.type !== "moreFilter"
      })
    })
    setShow(false);
  };
  const applyMoreFilter = (event/* , filter = null */) => {

    setColumnFilteringOptions((prev) => {
      return (/* filter ? filter :  */[...prev.filter(value => value.type !== 'moreFilter'), ...mainFilter]);
    });
    setShow(false);
  };
  const clearSubFilter = (filter) => {
    setColumnFilteringOptions((prev) => {
      return prev.filter((val) => {
        return val.field !== filter
      })
    })
    setShow(false);
  };
  let filterLength = filteringOptions ? filteringOptions.filter(value => {
    return value.type === 'moreFilter';
  }) : [];
  return (
    <>
      <Formik initialValues={{}}>
        <div className="relative inline-flex">
          <button
            className="flex flex-wrap items-center text-sm px-3 py-2 bg-white border border-neutral-200 text-gray-500 hover:text-gray-700 rounded-md shadow-sm"
            aria-haspopup="true"
            onClick={() => setShow(true)}
          >
            <span className="material-icons-outlined">tune</span>
            <span className="ml-1">More Filters</span><span>({filterLength?.length})</span>
          </button>

          <Transition
            show={show}
            className={`fixed h-screen right-80 left-0 top-0 bg-black opacity-60 z-50 ${!show && "hidden"
              }`}
            enter="transition ease-out duration-200 transform"
            enterStart="opacity-0 -translate-y-2"
            enterEnd="opacity-100 translate-y-0"
            leave="transition ease-out duration-200"
            leaveStart="opacity-100"
            leaveEnd="opacity-0"
            onClick={() => setShow(false)}
          />
          <Transition
            show={show}
            className="origin-top-right z-50 fixed top-0 h-screen right-0 w-full max-w-xs bg-white border-l border-neutral-200 overflow-hidden overflow-y-auto"
            enter="transition ease-out duration-200 transform"
            enterStart="opacity-0 -translate-y-2"
            enterEnd="opacity-100 translate-y-0"
            leave="transition ease-out duration-200"
            leaveStart="opacity-100"
            leaveEnd="opacity-0"
          >
            <div className="flex flex-wrap justify-between items-center p-3 border-b">
              <div className="font-medium">More Filters ({(filterLength.length > 0 && filterLength[0]?.field) ? filterLength?.length : 0})</div>
              <button className="h-6 w-6" onClick={() => setShow(false)}>
                <span className="material-icons-outlined">close</span>
              </button>
            </div>
            <div >
              <div className="py-2 px-3 border-b border-neutral-200">
                <div className="relative w-full">
                  <div className="absolute h-10 mt-0 left-0 top-0 flex items-center">
                    <svg
                      className="h-4 pl-4 fill-current text-gray-600"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                    </svg>
                  </div>
                  <input
                    onKeyUp={search}
                    type="input"
                    placeholder="Search"
                    className="block w-full bg-[#f7f7fa] border-neutral-200 hover:border-neutral-300 focus:border-neutral-100 focus:ring-neutral-300 focus:shadow-lg pl-10 pr-2 py-2 rounded-md"
                  />
                </div>
              </div>

              {filter &&
                filter.length > 0 &&
                filter.map((value, index) => {
                  return (
                    <Dropdown
                      {...value}
                      key={index}
                      setShow={setShow}
                      mainFilter={mainFilter}
                      setMainFilter={setMainFilter}
                      setmainColumnFilter={setmainColumnFilter}
                      setColumnFilteringOptions={setColumnFilteringOptions}
                      applyMoreFilter={clearSubFilter}
                    />
                  );
                })}
            </div>
            <div className=" py-2 px-3 border-l border-t border-neutral-200 bg-slate-50 sticky inset-0 top-auto">
              <ul className="flex items-center justify-between">
                <li>
                  <button
                    className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
                    onClick={clearMainFilter}
                  >
                    Clear
                  </button>
                </li>
                <li>
                  <button
                    className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                    onClick={applyMoreFilter}
                  >
                    Apply
                  </button>
                </li>
              </ul>
            </div>
          </Transition>
        </div>
      </Formik>
    </>
  );
};

export default React.memo(MoreFilter);
