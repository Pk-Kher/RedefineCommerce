/*Component Name: List
Component Functional Details: User can create or update List master details from here.
Created By: chandan
Created Date: 01-07-2022
Modified By: Shrey Patel
Modified Date: 09-13-2022 */

import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { StoreProductStatusTabs } from "dummy/Dummy";
import All from "../views/All";
import Tabs from "components/common/Tabs";
import Messages from "components/common/alerts/messages/Index";
import StoreService from "services/admin/store/StoreService";
import { useDispatch, useSelector } from "react-redux";
import { addActiveTab } from "redux/searchQueryForMGS/SearchQueryAction"

const List = () => {
  const permission = useSelector(store => store.permission);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { toFill, currentTab } = useSelector((store) => store?.SearchQueryReducers);

  const [activeTab, setActiveTab] = useState(toFill ? currentTab : 0);
  const [store, setStore] = useState({});
  const displayTabs = StoreProductStatusTabs;
  const onTabClick = (e, index) => {
    setActiveTab(index);
    dispatch(addActiveTab(index));
  };
  const { storeName, storeType, storeId } = useParams();
  useEffect(() => {
    if (!toFill) {
      setActiveTab(0);
    }
    StoreService.getStoreById(storeId).then((response) => {
      var storeData = response.data.data;
      if (response.data.data) {
        if (storeData.name.replaceAll(' ', '').toLowerCase() === storeName.toLowerCase() && storeType.toLowerCase() === storeData.storeType.name.replaceAll(' ', '').toLowerCase()) {
          setStore(storeData);
        } else {
          navigate('404');
        }
      } else {
        navigate('404');
      }
    }).catch((error) => {
      navigate('404');
    });
  }, [storeId]);

  return (
    <>
      <title>{store.name}</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          {/* Page Title */}
          <div className="col-span-full w-full flex flex-wrap justify-between items-center">
            {/* Title */}
            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
              {store.name}
            </h1>
            <div className="flex flex-wrap space-x-2 items-center">
              <NavLink to={'export'}
                className="btn shadow-none text-indigo-500 hover:text-indigo-600 font-semibold mb-2"
              >
                <span className="">Export</span>
              </NavLink>

              {(permission?.isDelete || permission?.isEdit) &&
                <>
                  <NavLink to='import'
                    type="button"
                    className="btn shadow-none text-indigo-500 hover:text-indigo-600 font-semibold mb-2"
                  >
                    <span className="">Import</span>
                  </NavLink>
                </>}
              {(permission?.isEdit || permission?.isDelete) && <NavLink
                type="button"
                to={`/admin/MasterCatalog/${storeType}/${storeName}/${storeId}/products/bundle/create`}
                className="items-center btn bg-indigo-500 hover:bg-indigo-600 text-white rounded mb-2"
              >
                <span className="material-icons-outlined text-[12px]">add</span><span className="ml-1">Create Bundle</span>
                <wbr />
              </NavLink>}
              <button className="items-center btn bg-indigo-500 hover:bg-indigo-600 text-white rounded mb-2">
                <span >Report</span>
                <wbr />
              </button>
            </div>
          </div>
        </div>
        {/* Product Filter */}
        <Messages />
        <>
          <div className="shadow-xxl mb-8">
            <div className="col-span-full w-full bg-[white] shadow-xxl rounded-md mb-8">
              <Tabs
                options={displayTabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onTabClick={onTabClick}
              />
              <div className='w-full'>
                <div className={`rounded-md mb-8 tab-content text-sm overflow-x-auto`}>
                  <div className="overflow-x-auto grow">
                    {/* <All activeTab={activeTab} type={[productType.EcommerceStore, productType.CorporateStore].includes(type)} /> */}
                    {
                      StoreProductStatusTabs.map((value, index) => {
                        if (index === activeTab) {
                          return (
                            <All key={value.componentname} activeTab={activeTab} filterData={value.filter} tab={value} />
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
  );
};

export default List;
