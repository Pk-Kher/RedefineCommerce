/*Component Name: Category
Component Functional Details:  Category .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import CheckBox from 'components/common/table/CheckBox';
import ReactTableServerSide from 'components/common/table/ReactTableServerSide';
import { paginationDetails } from 'global/Enum';
import { ValidationMsgs } from 'global/ValidationMessages';
import { data } from 'jquery';
import { toArray } from 'lodash';
import React from 'react';
import { useEffect } from 'react';
import { useMemo } from 'react';
import { useState } from 'react';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import { setAddLoading } from 'redux/globalLoader/GlobalLoaderAction';
import CacheService from 'services/admin/cache/CacheService';
import CategoryMasterService from 'services/admin/masterCatalog/store/categoryMaster/CategoryMasterService';
import { serverError } from 'services/common/helper/Helper';
const Category = ({ storeId }) => {
    const permission = useSelector(store => store?.permission);
    const dispatch = useDispatch();
    const [Data, setData] = useState([]);
    const getCategoryData = useCallback(
        () => {
            if (storeId) {
                dispatch(setAddLoading(true))
                CategoryMasterService.getCategoriesWithTreeview({
                    args: {
                        pageSize: 9999999,
                        pageIndex: 0,
                        sortingOptions: [{
                            field: 'name',
                            direction: 0,
                            priority: 0
                        }],
                        filteringOptions: [],
                    },
                    storeId: storeId,
                }).then((response) => {
                    setData(response.data.data.items);

                    dispatch(setAddLoading(false))
                }).catch(() => {
                    dispatch(setAddLoading(false))
                })
            } else {
                setData([]);
            }
        },
        [
            storeId
        ]
    );
    useEffect(() => {
        getCategoryData();
    }, [storeId]);
    const [categoryIds, setCategoryIds] = useState([]);
    const clearCache = (e) => {
        var categories = []
        if (e.target.id !== 'clearAllCache') {
            categories = categoryIds;
        } else {
            const findSubCategory = (Data) => {
                Data.map((value) => {
                    categories = [...categories, value.id];
                    if (value?.subRows.length > 0) {
                        findSubCategory(value?.subRows);
                    }
                });
            }
            Data.map((value) => {
                categories = [...categories, value.id];
                if (value?.subRows.length > 0) {
                    findSubCategory(value?.subRows);
                }
            });
        }
        if (categories.length <= 0) {
            dispatch(setAlertMessage({
                type: 'danger',
                message: ValidationMsgs.cache.selectCategory
            }));
            return;
        }
        dispatch(setAddLoading(true));
        CacheService.clearCategoryCache({
            catchecategoryidList: {  //wrong spelling for cache here from API side
                catcheIDlist: categories,//here as well
                storeId: storeId
            }
        }).then((response) => {
            if (response?.data?.data && response?.data?.success) {
                dispatch(setAlertMessage({
                    type: 'success',
                    message: ValidationMsgs.cache.clearCategoryCache
                }));
                setCategoryIds([]);
                // setParentCheckBox(false);
            } else {
                dispatch(setAlertMessage({
                    type: 'danger',
                    message: serverError(response)
                }));
            }
            dispatch(setAddLoading(false));
        }).catch(() => {
            dispatch(setAlertMessage({
                type: 'danger',
                message: ValidationMsgs.cache.CategoryCacheNotClear
            }));
            dispatch(setAddLoading(false));
        });
    }
    return (
        <>
            <div className="w-full">
                <div className="w-full pt-6 flex flex-wrap justify-between items-center mb-2">
                    <div className="block uppercase tracking-wide text-gray-500 text-lg font-bold">Clear Category Cache</div>
                </div>
                <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                    <div className="w-full">
                        <div className="w-full max-h-96 mb-4 overflow-auto">
                            <table className='table-auto w-full text-sm text-[#191919] font-semibold'>
                                <tbody className='divide-y divide-slate-200 border-b border-neutral-200'>
                                    {Data?.length > 0 ? Data.map((value, index) => {
                                        return (
                                            <TR data={value} key={index} deep={0} parentCheckBox={false} categoryIds={categoryIds} setCategoryIds={setCategoryIds} show={true} />
                                        )
                                    }) : <tr><td className='text-center normal-case'><p className="flex justify-center items-center p-5 rounded-t border-b sticky top-0 left-0 text-red-600 bg-white">No data found as of now.</p></td></tr>}
                                </tbody>
                            </table>
                        </div>
                        {(permission?.isEdit || permission?.isDelete) && <>
                            <button type='button' onClick={clearCache} id='selected' className="btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white mr-2"> Clear Category Cache</button>
                            <button type='button' onClick={clearCache} id='clearAllCache' className="btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white"> Clear All Category Cache</button>
                        </>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Category;

const TR = ({ data, deep, parentCheckBox, categoryIds, setCategoryIds, show }) => {
    const [showSubRows, setShowSubRows] = useState(false);
    const [currentCheckBox, setCurrentCheckBox] = useState(false);
    useEffect(() => {
        setCurrentCheckBox(parentCheckBox);
        addValueInCategory(parentCheckBox);
    }, [parentCheckBox]);
    useEffect(() => {
        if (!show) {
            setShowSubRows(show);
        }
    }, [show])
    useEffect(() => {
        // setCategoryIds((prev) => {
        //     if (currentCheckBox) {
        //         return [...prev, data?.id];
        //     } else {
        //         return prev.filter(value => value !== data?.id);
        //     }
        // })
        setCurrentCheckBox(categoryIds.includes(data?.id));
    }, [categoryIds]);
    const addValueInCategory = (value) => {
        setCategoryIds((prev) => {
            if (value) {
                return [...prev, data?.id];
            } else {
                return prev.filter(value => value !== data?.id);
            }
        });
    }
    return (
        <>
            <tr className={`main-parent bg-slate-${50 * deep} ${show ? '' : 'hidden'}`}>
                <td className="px-2 first:pl-5 py-3 whitespace-nowrap w-px">
                    <div className="flex items-center">
                        <label className="inline-flex leading-none w-4 h-4">
                            <span className="sr-only">Select</span>
                            <CheckBox onChange={(e) => {
                                // setCurrentCheckBox(e.target.checked)
                                addValueInCategory(e.target.checked);
                            }}
                                value={data?.id} checked={currentCheckBox} /* indeterminate={true} */ />
                        </label>
                        {data?.subRows?.length > 0 && <div className="leading-none ml-2 w-6 h-6 cursor-pointer transition-all variant-arrow" onClick={() => setShowSubRows(prev => !prev)}>
                            <span className="material-icons-outlined">{showSubRows ? 'remove' : 'add'}</span>
                        </div>}
                    </div>
                </td>
                <td className="px-2 first:pl-5 py-3 group">
                    <div className="relative">
                        <div className="">
                            <span className="">{data?.name}</span>
                        </div>
                    </div>
                </td>
            </tr>
            {
                data?.subRows?.map((value, index) => {
                    return (
                        <TR data={value} key={index} deep={deep + 1} parentCheckBox={currentCheckBox} categoryIds={categoryIds} setCategoryIds={setCategoryIds} show={showSubRows} />
                    )
                })
            }
        </>
    )
}
