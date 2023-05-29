import React, { useState, useCallback, useEffect } from "react";
import { categoryProductsData } from "dummy/Dummy";
import ReactTable from "../../../../../common/table/ReactTableServerSide";
import { defaultImage, paginationDetails } from "global/Enum";
import Status from "components/common/displayStatus/Status";
import MasterService from "services/admin/masterCatalog/masterCatalog/products/ProductService";
import { useParams } from "react-router-dom";
import ImageComponent from "../../../../../common/formComponent/Image";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { useDispatch } from "react-redux";
import { useMemo } from "react";

const CategoryProducts = () => {
  const dispatch = useDispatch();

  const COLUMNS = [
    {
      id: "productImage",
      Header: "Image",
      accessor: "productImage",
      column_name: "productImage",
      Cell: ({ value, row }) => {
        return row ? (
          <>
            <div
              className="flex -space-x-9 items-center"
              style={{ width: "100px" }}
            >
              {value && value.length > 0 ? (
                <img
                  className="w-16 max-h-16 shrink-0 p-1 border border-neutral-200"
                  src={`${process.env.REACT_APP_API_BLOB}${value[0]}`}
                  alt=""
                />
              ) : (
                <img
                  className="w-16 max-h-16 shrink-0 p-1 border border-neutral-200"
                  src={`${process.env.REACT_APP_API_BLOB}${value}`}
                  alt="No Iamge"
                />
              )}
            </div>
          </>
        ) : (
          <div className="flex -space-x-9 items-center">
            <ImageComponent
              src={defaultImage}
              className="w-14 h-14  inline-flex text-center items-center justify-center"
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
          <div className="relative">
            <div >{value}</div>
          </div>
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
          <div className="relative">
            <div >{value}</div>
          </div>
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

  const [Data, setData] = useState(categoryProductsData);
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
  const { id } = useParams();

  const setPaginationDataFunc = (key, value) => {
    setPaginationData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

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

  const getCategoryData = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true))

      if (id) {

        MasterService.getMasterProductsWithoutSubrows({
          args: {
            pageSize: paginationData.pageSize,
            pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
            sortingOptions,
            filteringOptions,
          }
        }).then((response) => {
          setData(response.data.data.items);
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
    paginationData.pageIndex]);

  useEffect(() => {
    if (id) {
      setColumnFilteringOptions([{
        field: "categoryId",
        operator: 0,
        value: id
      }])
    }
  }, [id])

  return (
    <>
      <div className="w-full p-6">
        <div className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2">
          Products
        </div>
      </div>

      <ReactTable
        className="overflow-x-auto max-h-screen border-t border-neutral-200"
        COLUMNS={COLUMNS}
        DATA={Data}
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
        actionRelativeCl={false}
      />
    </>
  );
};

export default CategoryProducts;
