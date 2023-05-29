import React, { useState, useCallback, useEffect, useMemo } from 'react'
import ReactTable from 'components/common/table/ReactTableServerSide';

import { paginationDetails } from 'global/Enum';
import { ContentLandingPageData } from 'dummy/Dummy'

const LandingPage = () => {
  const COLUMNS = [
    // {
    //   id: "name",
    //   Header: "Name and URL",
    //   accessor: "name",
    //   column_name: "name",
    //   Cell: ({ value, row }) => {
    //     return value !== null && value !== "" && value !== undefined ? (
    //       <>
    //         <div>{value}</div>
    //         <div className='text-[#707070] text-xs font-normal'>
    //           <NavLink
    //             to={row.original.access_url}
    //           >{row.original.access_url}</NavLink>
    //         </div>
    //       </>
    //     ) : (
    //       <>
    //         <div>{value}</div>
    //         <div className='text-[#707070] text-xs font-normal'>
    //           <NavLink
    //             to="/demoLink"
    //           >demoLink</NavLink>
    //         </div>
    //       </>
    //     );
    //   }
    // },
    // {
    //   id: "publish_status",
    //   Header: "Publish Status",
    //   accessor: "publish_status",
    //   column_name: "publish_status",
    //   Cell: ({ value }) => {
    //     return <Status type={value} />;
    //   },
    // },
    // {
    //   id: "test_status",
    //   Header: "Test Status",
    //   accessor: "test_status",
    //   column_name: "test_status",
    // },
    // {
    //   id: "created_at",
    //   Header: "Created Date",
    //   accessor: "created_at",
    //   column_name: "created_at",
    //   Cell: ({ value }) => {
    //     return value ? (
    //       <>
    //         <div >{DateTimeFormat(value).date} </div>
    //         <div className="text-[#707070] text-xs font-normal">
    //           {DateTimeFormat(value).time}
    //         </div>
    //       </>
    //     ) : (
    //       "-"
    //     );
    //   },
    // },
    // {
    //   id: "created_by",
    //   Header: "Created By",
    //   accessor: "created_by",
    //   column_name: "created_by",
    // },
    // {
    //   id: "updated_at",
    //   Header: "Updated Date",
    //   accessor: "updated_at",
    //   column_name: "updated_at",
    //   Cell: ({ value }) => {
    //     return value ? (
    //       <>
    //         <div >{DateTimeFormat(value).date} </div>
    //         <div className="text-[#707070] text-xs font-normal">
    //           {DateTimeFormat(value).time}
    //         </div>
    //       </>
    //     ) : (
    //       "-"
    //     );
    //   },
    // },
    // {
    //   id: "updated_by",
    //   Header: "Updated By",
    //   accessor: "updated_by",
    //   column_name: "updated_by",
    // },
    // {
    //   id: "domain",
    //   Header: "Domain",
    //   accessor: "domain",
    //   column_name: "domain",
    // },
    // {
    //   id: "publish_at",
    //   Header: "Publish Date",
    //   accessor: "publish_at",
    //   column_name: "publish_at",
    //   Cell: ({ value }) => {
    //     return value ? (
    //       <>
    //         <div >{DateTimeFormat(value).date} </div>
    //         <div className="text-[#707070] text-xs font-normal">
    //           {DateTimeFormat(value).time}
    //         </div>
    //       </>
    //     ) : (
    //       "-"
    //     );
    //   },
    // },
    // {
    //   id: "page_title",
    //   Header: "Page Title",
    //   accessor: "page_title",
    //   column_name: "page_title",
    // },
  ];

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

  const getWebsiteData = useCallback(() => {
    setData(ContentLandingPageData);
  }, [])

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

  return (
    <>
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
    </>
  )
}

export default LandingPage