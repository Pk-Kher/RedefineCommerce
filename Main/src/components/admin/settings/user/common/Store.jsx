/*Component Name: Store
Component Functional Details: User can create or update Store master details from here.
Created By: Pradip
Modified By: Chandan
Created Date: 5/17/2022
Modified Date:  5/17/2022*/

import React, { useState, useEffect } from "react";
import StoreService from "services/admin/store/StoreService";
import Checkbox from "components/common/formComponent/Checkbox";
import FormErrorMessage from "components/common/alerts/FormErrorMessage";
import { ErrorMessage, useFormikContext } from "formik";
import axios from "axios";

const Store = () => {
  const [stores, setStores] = useState([]);
  const [mainStores, setMainStores] = useState([]);
  const { setFieldValue, values } = useFormikContext();
  useEffect(() => {
    let unmounted = false;
    let source = axios.CancelToken.source();
    StoreService.getStoresListByType({
      storesearch: "",
      categoryid: 0
    })
      .then((stores) => {
        if (stores.data.success && !unmounted) {
          setStores(stores.data.data);
          setMainStores(stores.data.data);
        }
      })
      .catch((error) => { });
    return () => {
      unmounted = true;
      source.cancel("Cancelling in cleanup");
    };
  }, []);
  const searchStore = (e) => {
    var search = e.target.value.trim();
    if (search !== "") {
      // console.log(
      setStores(() => {
        return stores
          .map((value) => {
            var subStore = [];
            value?.store.map((storeId) => {
              if (
                storeId.name
                  .toLowerCase()
                  .includes(search.toLowerCase())
              ) {
                subStore = [...subStore, { ...storeId }];
              }
              return "";
            });
            if (subStore && subStore.length > 0) {
              return { ...value, store: subStore };
            }
            return { ...value, store: undefined };
          })
          .filter((value) => value.store !== undefined);
      });

      // , mainStores)
    } else {
      setStores(mainStores);
    }
  };
  const setStoresValue = (stores, e) => {
    if (e.target.checked) {
      return [...stores, parseInt(e.target.value)];
    } else {
      var index = stores.indexOf(parseInt(e.target.value));
      if (index > -1) {
        stores.splice(index, 1); // 2nd parameter means remove one item only
      }
      return stores;
    }
  };
  return (
    <>
      <div className="w-full mb-6">
        <label
          className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
          htmlFor="grid-first-name"
        >
          Store
        </label>
        <div className="relative w-full">
          <div className="absolute h-10 mt-0 left-0 top-0 flex items-center">
            <svg
              className="h-4 pl-4 fill-current text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
            </svg>
          </div>
          <input
            type="search"
            onChange={searchStore}
            placeholder="Search"
            className="block w-full bg-[#f7f7fa] border-neutral-200 hover:border-neutral-300  focus:border-neutral-100 focus:ring-neutral-300 focus:shadow-lg pl-10 pr-2 py-2 rounded-md"
          />
          <ErrorMessage name={"storeId"} component={FormErrorMessage} />
        </div>
        <div className="w-full relative">
          <div >
            {stores.map((store, index) => {
              return (
                <ul className="w-full mt-2" key={index}>
                  <li className="py-1">
                    <div className="flex items-center border-b border-slate-200 py-2 over">
                      <span className="text-xs font-bold ml-2">
                        {store.storeTypeName}
                      </span>
                    </div>
                    <div className="w-full relative pt-2 pb-4">
                      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-2">
                        {store?.store.map((subStore, index) => {
                          return (
                            <li className="py-1 px-3" key={index}>
                              <label className="flex items-center">
                                <Checkbox
                                  name="storeId"
                                  onChange={(e) => {
                                    setFieldValue(
                                      `storeId`,
                                      setStoresValue(values.storeId, e)
                                    );
                                  }}
                                  value={subStore.id}
                                  type="checkbox"
                                  className="form-checkbox"
                                  checked={values.storeId ? values.storeId.includes(subStore.id) : false}
                                />
                                <span className="text-sm font-medium ml-2">
                                  {subStore.name}
                                </span>
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </li>
                </ul>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Store;
