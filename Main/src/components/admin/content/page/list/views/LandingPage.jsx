import React, { useState, useCallback, useEffect, useMemo } from 'react'
import ReactTable from 'components/common/table/ReactTableServerSide';

import { paginationDetails } from 'global/Enum';
import TopicsDetailsServices from 'services/admin/topics/TopicsDetailsServices';
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { useDispatch } from "react-redux";

const LandingPage = ({ setTopic, setOpenDeleteModal, columns, domainId }) => {
  const [Data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({ ...paginationDetails });
  const [filteringOptions, setColumnFilteringOptions] = useState([]);
  const dispatch = useDispatch();

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

  useEffect(() => {
    getWebsiteData();
  }, [domainId]);

  const getWebsiteData = useCallback(() => {
    dispatch(setAddLoading(true))

    TopicsDetailsServices.getTopics(domainId, "Landing")
      .then((res) => {
        setData(res.data.data);
        dispatch(setAddLoading(false))

      }).catch((err) => {
        dispatch(setAddLoading(false))

      })
  }, [domainId])

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
        COLUMNS={columns}
        DATA={Data}
        {...paginationData}
        setPageIndex={(value) => setPaginationDataFunc("pageIndex", value)}
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