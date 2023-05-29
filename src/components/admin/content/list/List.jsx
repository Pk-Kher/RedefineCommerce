import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import Messages from "components/common/alerts/messages/Index";
import ReactTable from 'components/common/table/ReactTableServerSide';
import { DateTimeFormat } from "services/common/helper/Helper";

import {
  paginationDetails,
  RecStatusValue,
  RecStatusValuebyName,
  contentTabs
} from 'global/Enum';

import WebSitePage from './views/WebSitePage';
import LandingPage from './views/LandingPage';
import Blog from './views/Blog';

import { useCallback } from 'react';
import { ContentWebsiteData } from 'dummy/Dummy'
import { useEffect } from 'react';
import Status from 'components/common/displayStatus/Status';
import Tabs from "components/common/Tabs";
import ListSideBar from './ListSideBar';


const List = () => {

  const [activeTab, setActiveTab] = useState(0);

  const displayTabs = contentTabs;
  const onTabClick = (e, index) => {
    setActiveTab(index);
  };

  const componentsList = {
    website_page: WebSitePage,
    landing_page: LandingPage,
    blog: Blog,
  }


  return (
    <>
      <title>Content Master</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          <div className="col-span-full w-full flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
              Content
            </h1>
            <div className="flex flex-wrap sm:auto-cols-max gap-2">
              {/* <NavLink
                        to={"create"}
                        className="btn bg-indigo-500 hover:bg-indigo-600 text-white" >*/}
              <div className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
                <span className="material-icons-outlined">add</span>
                <span className="ml-1">Create Page</span>
              </div>
              {/* </NavLink> */}
            </div>
          </div>
        </div>
        <Messages />
        <div className="col-span-full w-full bg-white shadow-xxl rounded-md mb-8 pt-8">
          <Tabs
            options={displayTabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onTabClick={onTabClick}
          />
          <div className='flex flex-col md:flex-row'>
            <ListSideBar activeTab={activeTab} />
            {
              displayTabs.map((tab, index) => {
                const Component = componentsList[tab.componentname];

                return (
                  <div className={`${activeTab !== index && "hidden"} rounded-md mb-8 tab-content text-sm overflow-x-auto w-full`} key={index}>
                    <div className="overflow-x-auto grow">
                      {/* <Component /> */}
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default List