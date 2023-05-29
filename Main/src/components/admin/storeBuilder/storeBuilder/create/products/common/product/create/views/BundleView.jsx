/*Component Name: BundleView.jsx
Component Functional Details: Basic Information tab field display
Created By: Vikas Patel
Created Date: 11-May-2022
Modified By: Shrey Patel
Modified Date: Sept/28/2022 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { productType } from 'dummy/Dummy';
import { defaultImage, paginationDetails } from 'global/Enum';
import ReactTable from 'components/common/table/ReactTableServerSide';
import Image from 'components/common/formComponent/Image';
import BundleService from 'services/admin/masterCatalog/masterCatalog/products/BundleService';
import BundleStoreService from 'services/admin/masterCatalog/store/product/BundleService'

const BundleView = ({ displayFieldElement, fetchFieldProperty, fields, values, requiredFields, type, tab, setActiveTab, index, productId }) => {

  const COLUMNS = [
    {
      id: "",
      Header: "",
      accessor: "productImage",
      column_name: "",
      Cell: ({ value, row }) => {
        return row ? (
          <>
            {row.original.subRows === undefined && (
              <>
                {value !== null ? (
                  <>
                    <div className="" >
                      <img src={`${process.env.REACT_APP_API_BLOB}${value}`} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="" >
                      <Image src={defaultImage} />
                    </div>
                  </>
                )}
              </>
            )}
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "name",
      Header: "Name",
      accessor: "name",
      column_name: "name",
      Cell: ({ value, row }) => {
        return row ? (
          <>
            <div
              className="w-full flex justify-start items-center group"
              style={{ width: "200px" }}
            >
              <div className="">
                {value}
              </div>
            </div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "store",
      Header: "Store",
      accessor: "storeImage",
      column_name: "store",
      Cell: ({ value, row }) => {
        return row ? (
          <>
            {row.original.subRows !== undefined && (
              <>
                {value !== null ? (
                  <>
                    <div className="" >
                      <img className={'w-12 h-12 border border-neutral-200 rounded-full box-content items-center'} src={`${process.env.REACT_APP_API_BLOB}${value}`} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="" >
                      <Image src={defaultImage} />
                    </div>
                  </>
                )}
              </>
            )}
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "SKU",
      Header: "SKU",
      accessor: "ourSKU",
      column_name: "SKU",
      Cell: ({ value, row }) => {
        return row ? (
          <>
            <div className="w-full flex justify-start items-center group mr-8">
              <div className="">
                {value}
              </div>
            </div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "sale_price",
      Header: "Sale Price",
      accessor: "salePrice",
      column_name: "salePrice",
      Cell: ({ value, row }) => {
        return row ? (
          <>
            <div className="w-full flex justify-start items-center group mr-8">
              <div className="">
                {value}
              </div>
            </div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "MSRP",
      Header: "MSRP",
      accessor: "msrp",
      column_name: "MSRP",
      Cell: ({ value, row }) => {
        return row ? (
          <>
            <div className="w-full flex justify-start items-center group mr-8">
              <div className="">
                {value}
              </div>
            </div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "quantity",
      Header: "Quantity",
      accessor: "quantity",
      column_name: "quantity",
      Cell: ({ value, row }) => {
        return row ? (
          <>
            <div className="w-full flex justify-start items-center group mr-8">
              <div className="">
                {value}
              </div>
            </div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "color",
      Header: "color",
      accessor: "color",
      column_name: "color",
      Cell: ({ value, row }) => {
        return row ? (
          <>
            <div className="w-full flex justify-start items-center group">
              <div className="">
                {value}
              </div>
            </div>
          </>
        ) : (
          "-"
        );
      },
    },
  ]
  const API = (type == productType.MC ? BundleService : BundleStoreService)
  const [loading, setLoading] = useState(false);
  const [Data, setData] = useState([]);
  const [sortingOptions, setSortingOptions] = useState([
    {
      field: "name",
      direction: 0,
      priority: 0,
    },
  ]);
  const [paginationData, setPaginationData] = useState({
    ...paginationDetails,
  });
  const [filteringOptions, setColumnFilteringOptions] = useState([]);
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
  const getBundleData = useCallback(
    (pageIndex) => {
      setLoading(true);
      if (type == productType.MC) {
        BundleService.getBundleProducts({
          args: {
            pageSize: paginationData.pageSize,
            pageIndex: paginationData.pageIndex,
            pagingStrategy: 0,
            sortingOptions,
            filteringOptions,
          },
          masterProductID: 1
        }).then((response) => {
          const BundleProduct = response?.data;
          setData(BundleProduct?.data?.items);
          setPaginationData((prevState) => ({
            ...prevState,
            pageIndex: BundleProduct?.data?.pageIndex,
            pageSize: BundleProduct?.data?.pageSize,
            totalCount: BundleProduct?.data?.totalCount,
            totalPages: BundleProduct?.data?.totalPages,
            hasPreviousPage: BundleProduct?.data?.hasPreviousPage,
            hasNextPage: BundleProduct?.data?.hasNextPage,
          }));
          setLoading(false);
        });
      } else {
        BundleStoreService.getBundleProducts(productId)
          .then((response) => {
            const StoreBundleProduct = response?.data;
            setData(StoreBundleProduct?.data);
            setLoading(false);
          });
      }

    },
    [filteringOptions, paginationData.pageSize, sortingOptions, paginationData.pageIndex]
  );

  return (
    <>
      <div className="px-6 py-12 border-b-4 border-neutral-200 last:border-b-0">
        <div className='flex items-center justify-between'>
          <div className='block uppercase tracking-wide text-gray-500 text-base font-bold mb-2'>
            {tab.label}
          </div>
          <div className="">
            <span className="text-indigo-500 cursor-pointer" onClick={() => { setActiveTab(index) }}>Edit</span>
          </div>
        </div>
        <div className="col-span-full w-full rounded-md">
          <ReactTable
            COLUMNS={COLUMNS}
            DATA={Data}
            // {...paginationData}
            setTablePageSize={(value) =>
              setPaginationDataFunc("pageSize", value)
            }
            fetchData={getBundleData}
            sortingOptions={sortingOptions}
            setSortingOptions={setSortingOptionHandler}
            loading={loading}
            hiddenColumns={['rowSelection', type == productType.StoreBuilder && 'store']}
            tablePadding={'px-4 pb-4'}
            displaySearch={false}
            expandedRows={useMemo(() => true, [])}

          />
        </div>
      </div>
    </>
  );
};

export default BundleView;

