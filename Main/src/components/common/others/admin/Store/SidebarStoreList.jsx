/*Component Name: SidebarStoreList
Component Functional Details:  SidebarStoreList .
Created By: PK Kher
Created Date: 6-16-2022
Modified By: PK Kher
Modified Date: 6-16-2022*/

import React, {
  Fragment,
  useEffect,
  useState,
} from "react";
import Tabs from "components/common/Tabs";
import Checkbox from "components/common/formComponent/Checkbox";
// import { storeTypes } from "dummy/Dummy";

const SidebarStoreList = ({ storeType, children }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [openModel, setOpenModal] = useState(false);
  const [storeTypeList, setStoreTypeList] = useState([]);
  const [storeIds, setStoreIds] = useState([]);

  const onChangeHandler = (e) => {
    if (e.target.checked) {
      setStoreIds((prev) => {
        return [...prev, e.target.value];
      });
    } else {
      var array = [...storeIds];
      const index = array.indexOf(e.target.value);
      if (index > -1) {
        array.splice(index, 1); // 2nd parameter means remove one item only
      }
      setStoreIds(array);
    }
  };

  useEffect(() => {
    setStoreTypeList(storeType);
  }, [storeType]);

  const searchStore = (e) => {
    var search = e.target.value.trim();
    if (search !== "") {
      setStoreTypeList(() => {
        return storeType
          .map((value) => {
            return {
              ...value,
              storeList: value?.storeList.filter((store) => {
                return store.storeName.toLowerCase().includes(search.toLowerCase());
              }),
            };
          })
          .filter(
            (value) => value.storeList.length > 0 && value.storeList !== undefined
          );
      });
      // , storeTypes)
    } else {
      setStoreTypeList(storeType);
    }
  };
  const onTabClick = (e, index) => {
    e.preventDefault();
    setActiveTab(index);
  };
  return (
    <>
      <div className="store-list">
        {
          children
        }
        {/* <div className="w-full flex justify-between border-b-2 border-solid border-neutral-200 pb-4">
          <div className="text-md py-1 text-gray-500">
            Sales Channels and Stores
          </div>
        </div> */}
        <div className="py-2 border-b border-neutral-200">
          <input
            type="text"
            onChange={searchStore}
            className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md"
            placeholder="Search Store"
          />
        </div>
        {storeTypeList && storeTypeList.map((value, index) => {
          if (value.storeList.length > 0) {
            return (
              <Fragment key={index}>
                <div className="mb-2 mt-6">{value.storeType}</div>
                <ul className="text-sm">
                  {value.storeList.map((store, index) => {
                    return (
                      <li className="py-1" key={index}>
                        <div className="flex flex-wrap items-center justify-between">
                          <div className="flex flex-wrap items-center">
                            {" "}
                            <span className="bg-green-500 text-white rounded-full text-center w-2 h-2 items-center inline-flex mr-1">
                              &nbsp;
                            </span>
                            <div className="w-14 overflow-hidden flex items-center justify-center h-10 p-1 mr-2 border border-neutral-200 rounded-md">
                              <img src={process.env.REACT_APP_API_BLOB + store.storeImagePath} />
                            </div>
                            <div >{store.storeName}</div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </Fragment>
            )
          }
        })}
        {
          storeTypeList.filter((items) => items.storeList.length > 0).length === 0 ?
            <p className="flex justify-center items-center p-5 rounded-t border-b sticky top-0 left-0 text-red-600 bg-white">No data found.</p>
            : ("")
        }
      </div>
      {/* <div
        id="managestoreModal"
        className={`overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-4 z-50 justify-center items-center h-modal md:h-full md:inset-0 ${!openModel && "hidden"
          }`}
      >
        <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative px-4 w-full max-w-2xl h-full md:h-auto">
            <div className="relative bg-white rounded-lg shadow max-h-screen overflow-y-auto">
              <div className="flex justify-between items-start p-5 rounded-t border-b sticky top-0 left-0 bg-white">
                <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl">
                  Sales Channels and Stores
                </h3>
                <button
                  onClick={() => setOpenModal((prev) => !prev)}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  data-modal-toggle="managestoreModal"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div>
                <div
                  x-data="{activeTab:01, activeClass: 'tab py-4 block hover:text-black focus:outline-none text-black border-b-2 font-bold border-red-500', inactiveClass : 'tab bg-transparent text-[#BDBDC2] py-4 block hover:text-red-500 focus:outline-none border-b-2 rounded-sm font-bold border-transparent hover:border-red-500' }"
                  className="w-full"
                >
                  <Tabs
                    options={useMemo(() =>
                      storeTypeList.map((value) => {
                        return {
                          id: value.id,
                          label: value.typeName,
                          value: value.typeName,
                        };
                      })
                    )}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onTabClick={onTabClick}
                  />
                  <div className="w-full">
                    {storeTypeList.map((data, index) => {
                      return (
                        <StoreList
                          data={data}
                          activeTab={activeTab}
                          index={index}
                          key={index}
                          onChangeHandler={onChangeHandler}
                          storeIds={storeIds}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200">
                <button
                  onClick={() => setOpenModal((prev) => !prev)}
                  data-modal-toggle="managestoreModal"
                  type="button"
                  className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  data-modal-toggle="managestoreModal"
                  type="button"
                  className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default SidebarStoreList;
const StoreList = ({ data, activeTab, index, onChangeHandler, storeIds }) => {
  const [stores, setStores] = useState(data.stores);
  useEffect(() => {
    setStores(data.stores);
  }, [data.stores]);
  const search = (e) => {
    if (e.target.value !== "") {
      setStores(() => {
        return data.stores.filter((store) => {
          return store.name
            .toLowerCase()
            .includes(e.target.value.toLowerCase());
        });
      });
    } else {
      setStores(data.stores);
    }
  };

  return (
    <div
      className={`panel-01 tab-content ${activeTab !== index && "hidden"}`}
      key={index}
    >
      <div className="p-4 border-b border-neutral-200">
        <input
          type="text"
          onChange={search}
          className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md"
          placeholder="Search Store"
        />
      </div>
      <div className="store-list p-4 max-h-screen overflow-y-auto">
        <ul className="text-sm">
          {stores.map((option, index) => {
            return (
              <li className="py-1" key={index}>
                <div className="flex flex-wrap items-center justify-between">
                  <div className="flex flex-wrap items-center">
                    <Checkbox
                      id={data.typeName.replaceAll(" ", "_") + "_" + option.id}
                      name={data.typeName.replaceAll(" ", "_") + "_" + option.id}
                      value={option.id}
                      type="checkbox"
                      className="form-checkbox mr-2"
                      checked={storeIds.includes(
                        option.id ? option.id.toString() : option.id
                      )}
                      onChange={onChangeHandler}
                    />
                    <div className="w-14 overflow-hidden flex items-center justify-center h-10 p-1 mr-2 border border-neutral-200 rounded-md">
                      <img src={option.img} />
                    </div>
                    <div>{option.name}</div>
                  </div>
                </div>
              </li>
            );
          })}
          {stores.length === 0 && "No Data Found."}
        </ul>
      </div>
    </div>
  );
};
