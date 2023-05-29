/*Component Name: List
Component Functional Details: User can create or update List master details from here.
Created By: chandan
Created Date: 01-07-2022
Modified By: chandan
Modified Date: 04-07-2022 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OrderStatusTabs } from "dummy/Dummy";
import All from "../views/All";
import Tabs from "components/common/Tabs";
import Select from "components/common/formComponent/Select";
import DropdownService from "services/common/dropdown/DropdownService";
import { useCallback } from "react";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { useDispatch } from "react-redux";
import { ValidationMsgs } from "global/ValidationMessages";
import Messages from "components/common/alerts/messages/Index";
import OrderService from "services/admin/order/OrderService";
import { serverError } from "services/common/helper/Helper";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { useSelector } from "react-redux";
import StatusService from "services/admin/status/StatusService";
import { previousDay } from "date-fns/esm";
import StoreService from "services/admin/store/StoreService";

const List = ({ statusList }) => {
  const permission = useSelector(store => store?.permission);
  const user = useSelector(store => store?.user);
  const companyInfo = useSelector(store => store?.CompanyConfiguration);
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useDispatch();
  const [showListMessage, setShowListMessage] = useState(true);
  const [storeOptions, setStoreOption] = useState([]);
  const [store, setStore] = useState(0);
  const [displayTabs, setDisplayTabs] = useState(OrderStatusTabs);
  const onTabClick = (e, index) => {
    setActiveTab(index);
  };
  const getAllData = React.useRef(null);
  const [navSyncRows, setNavSyncRows] = useState([]);
  useEffect(() => {
    if (user?.id && companyInfo?.id) {
      StoreService.getStoreByUserId({
        userid: user?.id,
        companyConfigurationId: companyInfo?.id,
        isSuperUser: user?.isSuperUser
      }).then((response) => {
        if (response?.data?.data) {
          setStoreOption(response?.data?.data);
        }
      }).catch((error) => { })
    }
  }, [user, companyInfo]);
  const navSync = useCallback(() => {
    dispatch(setAddLoading(true));
    if (navSyncRows.length > 0) {
      OrderService.orderSyncWithNav({
        orderNo: navSyncRows
      }).then((response) => {
        if (response?.data?.success) {
          dispatch(setAlertMessage({
            message: ValidationMsgs.order.navSync,
            type: 'danger'
          }));
          getAllData();
        } else {
          dispatch(setAlertMessage({
            message: serverError(response),
            type: 'danger'
          }))
        }
        dispatch(setAddLoading(false));
      }).catch(() => {
        dispatch(setAlertMessage({
          message: ValidationMsgs.order.navNotSync,
          type: 'danger'
        }));
        dispatch(setAddLoading(false));
      })
    } else {
      dispatch(setAlertMessage({
        message: ValidationMsgs.order.selectOrderForNav,
        type: 'danger'
      }));
    }
  }, [navSyncRows]);

  return (
    <>
      <title>Order List</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className='sm:flex sm:justify-between sm:items-center mb-8'>
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">Orders</h1>
          </div>
          <div className='flex items-center gap-2'>
            <div >
              <Select
                name={'name'}
                options={storeOptions}
                classNames={'w-44'}
                defaultValue={store}
                onChange={(value) => {
                  if (value) {
                    setStore(value.value);
                    // getAllData.current(1, [value.value]);
                  } else {
                    setStore("none");
                    // getAllData.current(1, [0]);
                  }
                }}
              />
            </div>
            {(permission?.isEdit || permission?.isDelete) && <button type="button" onClick={navSync} className="btn bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer">
              <span className="material-icons-outlined">add</span>
              <span className="ml-1">Sync with NAV</span>
            </button>}
          </div>
        </div>
        {/* Product Filter */}
        {showListMessage && <Messages />}
        <>
          <div className="bg-white shadow-xxl rounded-md mb-8">
            <div className="col-span-full w-full bg-white shadow-xxl rounded-md mb-8 relative">
              <Tabs
                options={displayTabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onTabClick={onTabClick}
                isCount={true}
              />
              <div className='w-full'>
                <div className={`rounded-md mb-8 tab-content text-sm overflow-x-auto`}>
                  <div className="overflow-x-auto grow">
                    {
                      OrderStatusTabs.map((value, index) => {
                        return (
                          // <All key={value.componentname} activeTab={activeTab} selectedData={selectedData} setSelectedData={setSelectedData} setGetDataFunction={setGetDataFunction} moreFilterOptions={moreFilterOptions} openAttributeCloneModal={openAttributeCloneModal} setOpenAttributeCloneModal={setOpenAttributeCloneModal} />
                          <div className={`${index === activeTab ? '' : 'hidden'}`} key={index}>
                            <All statusList={statusList} storeId={store} setShowListMessage={setShowListMessage} activeTab={activeTab} filterData={[...value.filter]} key={index} childFunc={getAllData} setDisplayTabs={setDisplayTabs} tab={value} setNavSyncRows={setNavSyncRows} />
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </div>
      {/* {AdvancedSearch && <AdvancedSearchModal setAdvancedSearch={setAdvancedSearch} />} */}
    </>
  )
}

export default List
