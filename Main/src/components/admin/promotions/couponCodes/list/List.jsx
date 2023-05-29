// /*Component Name: List
// Component Functional Details: User can create or update List master details from here.
// Created By: Shrey Patel
// Created Date: 07/14/22
// Modified By: <Modified By Name>
// Modified Date: <Modified Date> */

import React, { useState, useCallback, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { PromotionStatusTabs, } from "dummy/Dummy";
import DropdownService from "services/common/dropdown/DropdownService";
import All from "../views/All";
import Tabs from "components/common/Tabs";
import Select from "components/common/formComponent/Select";
import Messages from "components/common/alerts/messages/Index";
import { useSelector } from "react-redux";

const List = () => {
  const permission = useSelector(store => store.permission);
  const [activeTab, setActiveTab] = useState(0);
  const [stores, setStores] = useState([]);
  const [storeFilter, setStoreFilter] = useState("");
  const displayTabs = PromotionStatusTabs
  const onTabClick = (e, index) => {
    setActiveTab(index);
  };

  const getDropdownData = useCallback(() => {
    DropdownService.getDropdownValues("store", false).then((res) => {
      if (res.data.success) {
        setStores(() => {
          return res.data.data;
        });
      }
    });
  }, []);


  useEffect(() => {
    getDropdownData();
  }, [getDropdownData]);
  return (
    <>
      <title>Promotions List</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className='sm:flex sm:justify-between sm:items-center mb-8'>
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">Promotions</h1>
          </div>
          <div className="flex flex-wrap sm:auto-cols-min gap-2">
            <Select
              name=""
              options={stores}
              defaultValue={storeFilter}
              onChange={(data) => {
                setStoreFilter(data ? data.value : "");
              }}
              classNames={'w-56'}

            />
            {(permission?.isEdit || permission?.isDelete) &&
              <NavLink
                to={"create"}
                className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                <span className="material-icons-outlined">add</span>
                <span className="ml-1">Create Discounts</span>
              </NavLink>
            }
          </div>
        </div>
        {/* Product Filter */}
        <Messages />

        <>
          <div className="bg-white shadow-xxl rounded-md mb-8">
            <div className="col-span-full w-full bg-white shadow-xxl rounded-md mb-8 relative">
              <Tabs
                options={displayTabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onTabClick={onTabClick}
                isCount={false}
              />
              <div className='w-full'>
                <div className={`rounded-md mb-8 tab-content text-sm overflow-x-auto`}>
                  <div className="overflow-x-auto grow">
                    {
                      PromotionStatusTabs.map((value, index) => {
                        if (index === activeTab) {
                          return (
                            <All key={value.componentname} activeTab={activeTab} filterData={value.filter} storeFilter={storeFilter} setStoreFilter={setStoreFilter} tab={value} />
                          )
                        } else {
                          return "";
                        }
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </div>
    </>
  )
}

export default List;
