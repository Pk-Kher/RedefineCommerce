import React, { useEffect, useState, useCallback } from 'react';
import { Link, NavLink } from 'react-router-dom'

import Dropdown from "components/common/formComponent/Dropdown";
import { Formik, Form as FormikForm, useFormikContext } from "formik";

import DropdownService from "services/common/dropdown/DropdownService";
import {
    contentTabs
} from 'global/Enum';

const ListSideBar = ({ activeTab, setDomainId }) => {

    const [dropDownOption, setdropDownOption] = useState([]);
    const [showMoreTool, setShowMoreTool] = useState(false);
    const [storeData, setStoreData] = useState([]);

    const initialValues = {
        domain: "0",
    };

    useEffect(() => {
        DropdownService.getDropdownValues("store").then((res) => {
            if (res.data.success) {
                setStoreData(() => {
                    return res.data.data;
                });
            }
        });

    }, []);

    const onSubmit = (fields, { resetForm }) => { };

    useEffect(() => {
        let optionDefaultValue = contentTabs[activeTab]?.extra?.storeDefaultOption;
        let optionValue = [{ value: "0", label: optionDefaultValue }];
        storeData?.map((value, key) => {
            optionValue = [...optionValue, { value: value.value, label: value.label }]
        });
        setdropDownOption(optionValue);
    }, [activeTab, storeData]);

    const showMoreToolHandler = useCallback(() => {
        setShowMoreTool((prev) => !prev);
    }, [showMoreTool]);

    return (
        <div className="flex flex-nowrap md:block px-3 py-6 border-b md:border-b-0 md:border-r border-neutral-200 min-w-80 md:space-y-3" x-data="{ show: false}">


            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
            >
                {
                    ({ setFieldValue, errors, values }) => {
                        return (
                            <>
                                <div>
                                    <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Domain</div>
                                    <Dropdown
                                        label="Domain"
                                        isMulti={false}
                                        isClearable={false}
                                        defaultValue={values.domain}
                                        name="domain"
                                        className={`w-full`}
                                        options={dropDownOption}
                                        onChange={(val) => {
                                            setDomainId(val.value)
                                            setFieldValue("domain", val.value)
                                        }}
                                    />
                                </div>
                                <div>
                                    <ul className="flex flex-nowrap md:block mr-3 md:mr-0">
                                        <li className="mr-0.5 md:mr-0 md:mb-0.5">
                                            <a className="flex items-center px-2.5 py-2 rounded whitespace-nowrap bg-indigo-50">
                                                <span className="text-sm font-medium text-indigo-500">{dropDownOption.length > 0 ? dropDownOption[0].label : ''}</span>
                                            </a>
                                            <ul className="px-2 pl-5 py-2 mt-1">
                                                <li className="mb-3 last:mb-0">
                                                    <a className="block text-gray-500 hover:text-gray-600 transition duration-150 truncate">
                                                        <span className="bg-yellow-500 text-white rounded-full text-center w-2 h-2 items-center inline-flex mr-1">&nbsp;</span>
                                                        <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Draft</span>
                                                    </a>
                                                </li>
                                                <li className="mb-3 last:mb-0">
                                                    <a className="block text-gray-500 hover:text-gray-600 transition duration-150 truncate">
                                                        <span className="bg-green-500 text-white rounded-full text-center w-2 h-2 items-center inline-flex mr-1">&nbsp;</span>
                                                        <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Published</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                                {
                                    values.domain &&
                                        values.domain != 0 ? (
                                        <div className="w-full mt-5 border-t border-neutral-200 pt-4" x-show="show">
                                            <ul className="flex flex-nowrap md:block mr-3 md:mr-0">
                                                <li className="mr-0.5 md:mr-0 md:mb-0.5">
                                                    <Link
                                                        to={"/admin/Content/Template"}
                                                        className="flex items-center px-2.5 py-2 rounded whitespace-nowrap"
                                                    >
                                                        <span className="text-sm font-medium text-gray-500">Template</span>
                                                    </Link>
                                                </li>
                                                <li className="mr-0.5 md:mr-0 md:mb-0.5">
                                                    <Link
                                                        to={"/admin/MasterCatalog/Theme"}
                                                        className="flex items-center px-2.5 py-2 rounded whitespace-nowrap"
                                                    >
                                                        <span className="text-sm font-medium text-gray-500">Edit theme configuration</span>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    ) : ('')
                                }
                            </>
                        );
                    }
                }
            </Formik>

            {/* <div className="w-full mt-5 border-t border-neutral-200 pt-4">
                <ul className="flex flex-nowrap md:block mr-3 md:mr-0">
                    <li className="mr-0.5 md:mr-0 md:mb-0.5 relative">
                        <span className='flex items-center px-2.5 py-2 rounded whitespace-nowrap cursor-pointer' onClick={showMoreToolHandler}>
                            <span className="text-sm font-medium text-gray-500 flex items-center">
                                More tools
                                {
                                    showMoreTool ?
                                        <span className="material-icons-outlined">expand_more</span> : <span className="material-icons-outlined">expand_less</span>
                                }
                            </span>
                        </span>
                        {
                            showMoreTool &&
                            <div className="bg-white shadow border border-neutral-200 absolute top-full left-0 min-w-72 z-10" x-show="open">
                                <ul className="p-2">
                                    <li className="p-2"><a className="text-indigo-500">Export all pages & blog posts (HTML)</a></li>
                                </ul>
                            </div>
                        }

                    </li>
                </ul>
            </div> */}
        </div>
    )
}

export default ListSideBar