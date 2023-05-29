import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import Messages from "components/common/alerts/messages/Index";
import ReactTable from 'components/common/table/ReactTableServerSide';
import { DateTimeFormat } from "services/common/helper/Helper";
import TopicsDetailsServices from 'services/admin/topics/TopicsDetailsServices';
import Status from 'components/common/displayStatus/Status';
import Actions from "./Actions";

import { paginationDetails, contentTabs, contentPageType } from 'global/Enum';

import Tabs from "components/common/Tabs";
import ListSideBar from './ListSideBar';
import CreatePopup from '../create/CreatePopup';
import ConfirmDelete from 'components/common/modals/ConfirmDelete';
const SingleList = () => {

  const COLUMNS = [
    {
      id: "title",
      Header: "Name and URL",
      accessor: "title",
      column_name: "title",
      Cell: ({ value, row }) => {
        return value !== null && value !== "" && value !== undefined ? (
          <>
            <div>{value}</div>
            {/* <div className='text-[#707070] text-xs font-normal'>
              <NavLink
                to={row?.original?.access_url}
              >{row?.original?.access_url}</NavLink>
            </div> */}
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
        return <Status type={value} />;
      },
    },
    {
      id: "test_status",
      Header: "Test Status",
      accessor: "test_status",
      column_name: "test_status",
    },
    {
      id: "created_at",
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
      id: "created_by",
      Header: "Created By",
      accessor: "created_by",
      column_name: "created_by",
    },
    {
      id: "updated_at",
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
      id: "updated_by",
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

  const [Data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({ ...paginationDetails });
  const [filteringOptions, setColumnFilteringOptions] = useState([]);

  const setPaginationDataFunc = (key, value) => {
    setPaginationData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const [sortingOptions, setSortingOptions] = useState([
    {
      field: "name",
      direction: 0,
      priority: 0,
    },
  ]);

  const setSortingOptionHandler = (column, direction) => {
    setSortingOptions([
      {
        field: column,
        direction: direction,
        priority: 0,
      },
    ]);
  };

  const [moreFilterOptionValues, setMoreFilterOptionValues] = useState({
    createdBy: [],
    modifiedBy: [],
    pageName: [],
    pageTitle: []
  });

  useEffect(() => {
    setMoreFilterOptionValues((prev) => {
      var temp = {
        createdBy: [],
        modifiedBy: [],
        pageName: [],
        pageTitle: [],
      };
      Data.map((values) => {
        var createdByAvail = temp.createdBy.find(
          (createdBy) => createdBy.value === values.created_by
        );
        var modifiedByAvail = temp.modifiedBy.find(
          (modifiedBy) => modifiedBy.value === values.updated_by
        );
        var pageNameAvail = temp.pageName.find(
          (pageName) => pageName.value === values.name
        );
        var pageTitleAvail = temp.pageTitle.find(
          (pageTitle) => pageTitle.value === values.page_title
        );
        if (!createdByAvail && values.created_by) {
          temp = {
            ...temp,
            createdBy: [
              ...temp.createdBy,
              { label: values.created_by, value: values.created_by },
            ],
          };
        }
        if (!modifiedByAvail && values.updated_by) {
          temp = {
            ...temp,
            modifiedBy: [
              ...temp.modifiedBy,
              { label: values.updated_by, value: values.updated_by },
            ],
          };
        }
        if (!pageNameAvail && values.name) {
          temp = {
            ...temp,
            pageName: [
              ...temp.pageName,
              { label: values.name, value: values.name },
            ],
          };
        }
        if (!pageTitleAvail && values.page_title) {
          temp = {
            ...temp,
            pageTitle: [
              ...temp.pageTitle,
              { label: values.page_title, value: values.page_title },
            ],
          };
        }
        return "";
      });
      return temp;
    });
  }, [Data]);
  const moreFilterOptions = useMemo(() => [
    {
      name: "Name",
      options: moreFilterOptionValues.pageName,
      column_name: "name",
      type: "checkbox",
      conditionalSearch: true,
    },
    {
      name: "Created By",
      options: moreFilterOptionValues.createdBy,
      column_name: "created_by",
      type: "checkbox",
      conditionalSearch: true,
    },
    {
      name: "Created Date",
      columnName: "created_at",
      options: [],
      type: "date",
    },
    {
      name: "Updated By",
      options: moreFilterOptionValues.modifiedBy,
      columnName: "updated_by",
      type: "checkbox",
    },
    {
      name: "Updated Date",
      options: [],
      columnName: "updated_at",
      type: "date",
    },
    {
      name: "Page Title",
      options: moreFilterOptionValues.pageTitle,
      column_name: "page_title",
      type: "checkbox",
      conditionalSearch: true,
    },
  ]);

  const getWebsiteData = useCallback(() => {
    TopicsDetailsServices.getTopics(0, { "page_type": contentPageType[activeTab] })
      .then((res) => {
        setData(res.data.data);
      })
  }, [activeTab])

  const displayTabs = contentTabs;
  const onTabClick = (e, index) => {
    setActiveTab(index);
  };

  // const componentsList = {
  //   website_page: WebSitePage,
  //   landing_page: LandingPage,
  //   blog: Blog,
  // }

  const handleDelete = (topic) => {
    //console.log("Topic Delted Function");
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
            <div className="relative inline-flex">
              <CreatePopup />
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
                return (
                  <div className={`${activeTab !== index && "hidden"} rounded-md mb-8 tab-content text-sm overflow-x-auto w-full`} key={index}>
                    <div className="overflow-x-auto grow">
                      <ReactTable
                        COLUMNS={COLUMNS}
                        DATA={Data}
                        {...paginationData}
                        setPageIndex={(value) => setPageIndex(value)}
                        setTablePageSize={(value) =>
                          setPaginationDataFunc("pageSize", value)
                        }
                        fetchData={getWebsiteData}
                        sortingOptions={sortingOptions}
                        setSortingOptions={setSortingOptionHandler}
                        editColumnFilter={true}
                        filteringOptions={filteringOptions}
                        setColumnFilteringOptions={setColumnFilteringOptions}
                        moreFilterOption={moreFilterOptions}
                        hiddenColumns={useMemo(() => ['rowSelection'], [])}

                      />
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

export default SingleList