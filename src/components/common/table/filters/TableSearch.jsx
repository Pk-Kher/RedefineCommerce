/*Component Name: TableSearch
Component Functional Details: User can create or update TableSearch master details from here.
Created By: 
Created Date: <Creation Date>
Modified By: chandan
Modified Date: 16/11/2022 */


import React, { useState, useEffect } from 'react';
import { useAsyncDebounce } from 'react-table';
import { setSearchQuery, fillSerchQuery } from "redux/searchQueryForMGS/SearchQueryAction"
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const TableSearch = ({ filter, setFilter, placeholderText, setColumnFilter, filteringOptions }) => {
  const [value, setValue] = useState(filter);
  const dispatch = useDispatch();
  const searchQuery = useSelector((store) => store?.SearchQueryReducers);
  const { storeName, storeType, storeId } = useParams();

  const onChange = useAsyncDebounce(value => {
    setFilter(value || undefined);
    dispatch(fillSerchQuery(false));

    // these two will set search query inside our redux and so that we can use it later , for providing search query populated inside master/ grand master / store pages , 
    dispatch(setSearchQuery(value));

    if (value && value !== "") {
      setColumnFilter({
        field: 'global',
        operator: 0,
        value: value.trim(),
      });
    } else {
      setColumnFilter({
        field: 'global',
        operator: 0,
        value: '',
      });
    }
  }, 1000)

  useEffect(() => {
    if (searchQuery.toFill) {
      setValue(searchQuery.searchQuery)
      onChange(searchQuery.searchQuery)
    }
  }, [value]);

  useEffect(() => {
    if (storeName && storeType && storeId) {
      // setValue(searchQuery.searchQuery)
      onChange(searchQuery.searchQuery)
    }
  }, [storeName, storeType, storeId]);

  return (
    <>
      <div className="grow flex">
        <div className="relative w-full">
          <div className="absolute h-10 mt-0 left-0 top-0 flex items-center">
            <svg className="h-4 pl-4 fill-current text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z">
              </path>
            </svg>
          </div>
          <input type="search" placeholder={placeholderText} value={value || ''} onChange={(e) => { setValue(e.target.value); onChange(e.target.value) }} className="block w-full bg-[#f7f7fa] border-neutral-200 hover:border-neutral-300 focus:border-neutral-100 focus:ring-neutral-300 focus:shadow-lg pl-10 pr-2 py-2 rounded-md" />
        </div>
      </div>
    </>
  )
}

export default TableSearch;