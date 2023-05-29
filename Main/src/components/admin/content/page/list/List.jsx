import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import Messages from "components/common/alerts/messages/Index";
import ReactTable from 'components/common/table/ReactTableServerSide';
import { DateTimeFormat } from "services/common/helper/Helper";
import WebSitePage from './views/WebSitePage';
import LandingPage from './views/LandingPage';
import Blog from './views/Blog';
import {
  paginationDetails,
  RecStatusValue,
  RecStatusValuebyName,
  contentTabs
} from 'global/Enum';
import Status from 'components/common/displayStatus/Status';
import Tabs from "components/common/Tabs";
import ListSideBar from './ListSideBar';
import CreatePopup from '../create/CreatePopup';
import ConfirmDelete from 'components/common/modals/ConfirmDelete';
import Actions from "./Actions";
import { ContentPageStatus } from "global/Enum";

const List = () => {
  const COLUMNS = [
    {
      id: "title",
      Header: "Name and URL",
      accessor: "title",
      column_name: "title",
      Cell: ({ value, row }) => {
        return value !== null && value !== "" && value !== undefined ? (
          <>
            <div>
              <NavLink
                to={`/admin/Content/Page/edit/setting/${row?.original?.id}`}
              >
                {value}
              </NavLink>

            </div>
            <div className='text-[#707070] text-xs font-normal'>
              <NavLink
                to={`/resource/${row?.original?.slug}`}
              >{row?.original?.slug}</NavLink>
            </div>
          </>
        ) : (
          <>
            <div>{value}</div>
            <div className='text-[#707070] text-xs font-normal'>
              <NavLink
                to="/demoLink"
              >demoLink</NavLink>
            </div>
          </>
        );
      }
    },
    {
      id: "status",
      Header: "Publish Status",
      accessor: "status",
      column_name: "status",
      Cell: ({ value }) => {
        return (
          value == 'P'
            ?
            <div className="text-xs inline-block font-medium border border-green-300 bg-green-100 text-green-600 rounded-md text-center px-2.5 py-1 w-28">
              {ContentPageStatus.Publish}
            </div>
            :
            <div className="text-xs inline-block font-medium border border-yellow-300 bg-yellow-100 text-yellow-600 rounded-md text-center px-2.5 py-1 w-28">
              {ContentPageStatus.Draft}
            </div>
        )
      },
    },
    {
      id: "test_status",
      Header: "Test Status",
      accessor: "test_status",
      column_name: "test_status",
    },
    {
      id: "Created Date",
      Header: "Created Date",
      accessor: "created_at",
      column_name: "created_at",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div >{DateTimeFormat(value).date} </div>
            <div className="text-[#707070] text-xs font-normal">
              {DateTimeFormat(value).time}
            </div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "Created By",
      Header: "Created By",
      accessor: "created_by",
      column_name: "created_by",
    },
    {
      id: "Updated Date",
      Header: "Updated Date",
      accessor: "updated_at",
      column_name: "updated_at",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div >{DateTimeFormat(value).date} </div>
            <div className="text-[#707070] text-xs font-normal">
              {DateTimeFormat(value).time}
            </div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "Updated By",
      Header: "Updated By",
      accessor: "updated_by",
      column_name: "updated_by",
    },
    {
      id: "store_id",
      Header: "Domain",
      accessor: "store_id",
      column_name: "store_id",
    },
    {
      id: "publish_at",
      Header: "Publish Date",
      accessor: "publish_at",
      column_name: "publish_at",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div >{DateTimeFormat(value).date} </div>
            <div className="text-[#707070] text-xs font-normal">
              {DateTimeFormat(value).time}
            </div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "topic_title",
      Header: "Page Title",
      accessor: "topic_title",
      column_name: "topic_title",
    },
    {
      id: "action",
      Header: "",
      accessor: "id",
      column_name: "action",
      Cell: ({ value, row }) => {
        return (
          <Actions
            id={value}
            row={row}
            setTopic={setTopic}
            setOpenDeleteModal={setOpenDeleteModal}
          />
        );
      },
      disableSortBy: true,
      disableShowHide: true,
    },
  ];

  const [activeTab, setActiveTab] = useState(0);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [topic, setTopic] = useState(null);
  const [RecordId, setRecordId] = useState(null);
  const [domainId, setDomainId] = useState(0);

  const displayTabs = contentTabs;
  const onTabClick = (e, index) => {
    setActiveTab(index);
  };

  const componentsList = {
    website_page: WebSitePage,
    landing_page: LandingPage,
    blog: Blog,
  }

  const handleDelete = (topic) => {
   // console.log("Topic Deleted Function");
  };

  return (
    <>
      <title>Content Master</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          <div className="col-span-full w-full flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
              Content
            </h1>
            {domainId != 0 &&
              <div className="relative inline-flex">
                <CreatePopup domainId={domainId} />
              </div>
            }
          </div>
        </div>
        {/* <Messages /> */}
        <div className="col-span-full w-full bg-white shadow-xxl rounded-md mb-8 pt-8">
          <Tabs
            options={displayTabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onTabClick={onTabClick}
          />
          <div className='flex flex-col md:flex-row'>
            <ListSideBar activeTab={activeTab} domainId={domainId} setDomainId={setDomainId} />
            {
              displayTabs.map((tab, index) => {
                const Component = componentsList[tab.componentname];

                return (
                  <div className={`${activeTab !== index && "hidden"} rounded-md mb-8 tab-content text-sm overflow-x-auto w-full`} key={index}>
                    <div className="overflow-x-auto grow">
                      <Component setTopic={setTopic} setOpenDeleteModal={setOpenDeleteModal} columns={COLUMNS} domainId={domainId} />
                    </div>
                  </div>
                )
              })
            }
          </div>
          <ConfirmDelete
            handleDelete={handleDelete}
            data={topic}
            message="Deleting this Page will permanently remove this record from your account. This can't be undone"
            title={"Delete"}
            openDeleteModal={openDeleteModal}
            setOpenDeleteModal={setOpenDeleteModal}
          />
        </div>
      </div>
    </>
  )
}

export default List