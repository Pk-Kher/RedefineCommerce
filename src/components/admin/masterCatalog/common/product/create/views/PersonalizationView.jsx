/*Component Name: PersonalizationView.jsx
Component Functional Details: Basic Information tab field display
Created By: Vikas Patel
Created Date: 11-May-2022
Modified By: Shrey Patel
Modified Date: June/24/2022 */
import React, { useState, useCallback } from "react";
import ReactTable from "components/common/table/ReactTableServerSide";
import Image from "components/common/formComponent/Image";
import {
  paginationDetails,
  defaultImage,
} from "global/Enum";
import LogoLocationService from "services/admin/logolocation/LogoLocationService";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { useDispatch } from "react-redux";
import { useMemo } from "react";
import { scrollTop } from "services/common/helper/Helper";

const PersonalizationView = ({
  displayFieldElement,
  fetchFieldProperty,
  fields,
  values,
  requiredFields,
  tab,
  setActiveTab,
  index,
}) => {
  const dispatch = useDispatch();

  const COLUMNS = [
    {
      id: "LogoLocation",
      Header: "Logo Location",
      accessor: "LogoLocation",
      Footer: "Logo Location",
      column_name: "LogoLocation",
      Cell: () => {
        return values ? (
          <>
            <div >{values.LogoLocation} </div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "location Image",
      Header: "Location Image",
      accessor: "locationimage",
      Footer: "Location Image",
      column_name: "locationimage",
      Cell: () => {
        return values ? (
          <>
            <div className="flex items-center">
              <Image
                src={values.imageUrl ? values.imageUrl : defaultImage}
                className="h-20 w-20"
                alt={"logoLocationImage"}
              />
            </div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "3dimage",
      Header: "3D Image",
      accessor: "image",
      Footer: "3DImage",
      column_name: "3dimage",
      Cell: ({ }) => {
        return values ? (
          <>
            <div className="flex items-center">

              <Image
                src={
                  values.threeDImageURL
                    ? values.threeDImageURL
                    : defaultImage
                }
                className="h-20 w-20"
                alt={"threeDImage"}
              />
            </div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "logolocationclass",
      Header: "Logo-location Class",
      accessor: "logolocationclass",
      Footer: "Logo-location Class",
      column_name: "logolocationclass",
      Cell: ({ }) => {
        return values ? (
          <>
            <div >{values.threeDLogoLocationClass}</div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "ourcost",
      Header: "Our Cost($)",
      accessor: "ourcost",
      Footer: "Our Cost($)",
      column_name: "ourcost",
      Cell: ({ }) => {
        return values ? (
          <>
            <div >{values.ourcost}</div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "ourprice",
      Header: "Our Price ($)",
      accessor: "ourprice",
      Footer: "Our Price ($)",
      column_name: "ourprice",
      Cell: ({ }) => {
        return values ? (
          <>
            <div >{values.ourprice}</div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "brandguidelines",
      Header: "Brand Guidelines",
      accessor: "brandguidelines",
      Footer: "Brand Guidelines",
      column_name: "brandguidelines",
      Cell: ({ }) => {
        return values ? (
          <>
            <div >{values.brandguidelines}</div>
          </>
        ) : (
          "-"
        );
      },
    },
  ];

  const [Data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({
    paginationDetails,
  });

  const [sortingOptions, setSortingOptions] = useState([
    {
      field: "firstname",
      direction: 0,
      priority: 0,
    },
  ]);

  const [selectedRows, setSelectedRows] = useState([]);
  const [filteringOptions, setColumnFilteringOptions] = useState([]);

  const getpersonalizationData = useCallback(
    (pageIndex = 1) => {
      if (values.personalizedCategoryId) {
        dispatch(setAddLoading(true))

        LogoLocationService.getLogoLocationDetailsByID((values.personalizedCategoryId)).then((res) => {
          var response = res?.data;
          if (response?.success) {
            setData([{ ...response.data }]);
          }
          dispatch(setAddLoading(false))
        })
          .catch((err) => {
            dispatch(setAddLoading(false))
          });
      }

    },
    [filteringOptions, paginationData.pageSize, sortingOptions]
  );
  const setSortingOptionHandler = (column, direction) => {
    setSortingOptions([
      {
        field: column,
        direction: direction,
        priority: 0,
      },
    ]);
  };

  const setPaginationDataFunc = (key, value) => {
    setPaginationData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleSort = (sortValue) => { };

  return (
    <>
      <div className="px-6 py-12 border-b-4 border-neutral-200 last:border-b-0">
        <div className="flex items-center justify-between py-1">
          <div
            className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2">
            {tab.label}
          </div>
          <div >
            <span
              className="text-indigo-500 cursor-pointer"
              onClick={() => {
                setActiveTab(index);
                scrollTop();
              }}
            >
              Edit
            </span>
          </div>
        </div>

        <div className="w-full">
          <div className="overflow-x-auto max-h-screen border-neutral-200">
            <ReactTable
              COLUMNS={COLUMNS}
              DATA={Data}
              {...paginationData}
              setPageIndex={(value) =>
                setPaginationDataFunc("pageIndex", value)
              }
              setTablePageSize={(value) =>
                setPaginationDataFunc("pageSize", value)
              }
              fetchData={getpersonalizationData}
              sortingOptions={sortingOptions}
              setSortingOptions={setSortingOptionHandler}
              hiddenColumns={["rowSelection"]}
              handleSort={handleSort}
              filteringOptions={filteringOptions}
              setColumnFilteringOptions={setColumnFilteringOptions}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              displaySearch={false}

            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonalizationView;
