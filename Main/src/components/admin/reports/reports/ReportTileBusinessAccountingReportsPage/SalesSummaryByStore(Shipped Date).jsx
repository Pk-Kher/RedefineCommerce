import React, { useState, useEffect, useCallback } from "react";
import Select from "components/common/formComponent/Select";
import DropdownService from "services/common/dropdown/DropdownService";
import { NavLink } from "react-router-dom";

const SalesSummaryByStoreShippedDate = () => {
  const [storeData, setStoreData] = useState([]);

  const [store, setStore] = useState({
    label: "",
    value: "",
  });

  const getStoreDropdownData = useCallback(() => {
    DropdownService.getDropdownValues("store").then((res) => {
      if (res?.data?.success && res?.data?.data) {
        setStoreData(() => {
          return res.data.data;
          // return Object.keys(res.data.data).map((value, key) => {
          //   return { label: res.data.data[value], value: value }
          // })
        });
        if (res?.data?.data?.length > 0) {
          setStore(res?.data?.data[0]);
        }
      }
    });
  }, []);

  useEffect(() => {
    getStoreDropdownData();
  }, [getStoreDropdownData]);

  return (
    <>
      <title>Sales Summary By Store (Shipped Date)</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
        <div className="flex justify-between mb-8">
          <div className="flex items-center">
            <NavLink
              className="btn border-neutral-200 hover:border-neutral-400 text-gray-500 hover:text-gray-700 flex items-center mr-2"
              to={"/admin/reports"}
            >
              <span className="material-icons-outlined">west </span>
            </NavLink>
            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
              Sales Summary By Store (Shipped Date)
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a className="text-indigo-500">Export</a>
            <Select
              onChange={(e) => {
                if (e) {
                  setStore((prevState) => ({
                    ...prevState,
                    label: e.label,
                    value: e.value,
                  }));
                } else {
                  setStore({});
                }
              }}
              defaultValue={store?.value}
              classNames={"w-[200px]"}
              options={storeData}
              isMulti={false}
            />
          </div>
        </div>
        <div className="bg-white shadow-xxl rounded-md p-6 mb-8">
          Coming soon
        </div>
      </div>
    </>
  );
};

export default SalesSummaryByStoreShippedDate;
