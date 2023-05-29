import React, { useState, useCallback, useEffect } from "react";
import ReactTable from "../../../../../common/table/ReactTableServerSide";
import { defaultImage, paginationDetails } from "global/Enum";
import Status from "components/common/displayStatus/Status";
import MasterService from "services/admin/masterCatalog/masterCatalog/products/ProductService";
import { useParams } from "react-router-dom";
import ImageComponent from "../../../../../common/formComponent/Image";
import { useDispatch } from "react-redux";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { useMemo } from "react";
import CategoryService from "services/admin/category/CategoryService";

const CategoryProducts = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [categoryIds, setCategoryIds] = useState([]);
  const COLUMNS = [
    {
      id: "image",
      Header: "Image",
      accessor: "productImage",
      column_name: "image",
      disableSortBy: true,
      Cell: ({ value, row }) => {
        return value ? (
          <>
            <div
              className="flex  items-center"
              style={{ width: "100px" }}
            >
              {value && value.length > 0 ? (
                <ImageComponent
                  className="w-20" containerheight={"h-16"}
                  src={`${value[0]}`}
                  alt="No Image"
                />
              ) : (
                <ImageComponent
                  className="w-20" containerheight={"h-16"}
                  src={`${value}`}
                  alt="No Image"
                />
              )}
            </div>
          </>
        ) : (
          <div className="flex -space-x-9 items-center">
            <ImageComponent
              src={defaultImage}
              className="w-16" containerheight={"h-16"}
            />
          </div>
        );
      },
    },
    {
      id: "name",
      Header: "Name",
      accessor: "name",
      column_name: "name",
      Cell: ({ value }) => {
        return (
          <div >{value}</div>
        );
      },
    },
    {
      id: "ourSKU",
      Header: "sku",
      accessor: "ourSKU",
      column_name: "ourSKU",
      Cell: ({ value }) => {
        return (
          <div >{value}</div>
        );
      },
    },
    {
      id: "recStatus",
      Header: "Status",
      accessor: "recStatus",
      column_name: "recStatus",
      Cell: ({ value }) => {
        if (value !== undefined) {
          return <Status type={value} />;
        } else {
          return "-";
        }
      },
    },
  ];

  useEffect(() => {
    dispatch(setAddLoading(true));
    CategoryService.GetAllCategoryXIdByCategoryId(id).then((response) => {
      if (response?.data?.success) {
        setCategoryIds(response?.data?.data);
      }
      dispatch(setAddLoading(false));
    }).catch(() => {
      dispatch(setAddLoading(false));
    })
  }, [])
  const [Data, setData] = useState([]);

  const [sortingOptions, setSortingOptions] = useState([
    {
      field: "name",
      direction: 0,
      priority: 0,
    },
  ]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filteringOptions, setColumnFilteringOptions] = useState([]);
  const [paginationData, setPaginationData] = useState(paginationDetails);

  const setSortingOptionHandler = (column, direction) => {
    setSortingOptions([
      {
        field: column,
        direction: direction,
        priority: 0,
      },
    ]);
  };
  const handleSort = (sortValue) => { };

  const setPaginationDataFunc = (key, value) => {
    setPaginationData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const getCategoryData = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true))

      if (categoryIds.length > 0) {
        MasterService.getMasterProductsWithoutSubrows({
          args: {
            pageSize: paginationData.pageSize,
            pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
            sortingOptions,
            filteringOptions: [...filteringOptions, {
              "field": "categoryId",
              "operator": 1,
              "value": categoryIds.join(',')
            }],
          }
        }).then((response) => {
          setData(response.data.data.items);
          // setData(CategoryData)
          setPaginationData((prevState) => ({
            ...prevState,
            pageIndex: response.data.data.pageIndex,
            pageSize: response.data.data.pageSize,
            totalCount: response.data.data.totalCount,
            totalPages: response.data.data.totalPages,
            hasPreviousPage: response.data.data.hasPreviousPage,
            hasNextPage: response.data.data.hasNextPage,
          }));


          dispatch(setAddLoading(false))
        }).catch(() => {
          dispatch(setAddLoading(false))
        })
      }
    }, [filteringOptions,
    paginationData.pageSize,
    sortingOptions,
    paginationData.pageIndex, categoryIds]);
  // useEffect(() => {
  //   if (categoryIds.length > 0) {
  //     getCategoryData();
  //   }
  // }, [categoryIds]);
  return (
    <>
      <div className="w-full pt-6 px-6">
        <div className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2">
          Products
        </div>
      </div>

      {categoryIds.length > 0 && <ReactTable
        className="overflow-x-auto max-h-screen border-t border-neutral-200"
        COLUMNS={COLUMNS}
        DATA={Data}
        {...paginationData}
        setPageIndex={(value) => setPaginationDataFunc("pageIndex", value)}
        setTablePageSize={(value) =>
          setPaginationDataFunc("pageSize", value)
        }
        sortingOptions={sortingOptions}
        setSortingOptions={setSortingOptionHandler}
        handleSort={handleSort}
        // column filters
        filteringOptions={filteringOptions}
        setColumnFilteringOptions={setColumnFilteringOptions}
        displayColumnFilter={[]}
        editColumnFilter={false}
        morefilter={false}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        fetchData={getCategoryData}
        hiddenColumns={["rowSelection"]}

      />}
    </>
  );
};

export default CategoryProducts;
