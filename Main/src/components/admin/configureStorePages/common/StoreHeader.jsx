/*Component Name: Header
Component Functional Details: User can create or update Header master details from here.
Created By: chandan
Created Date: <Creation Date>
Modified By: chandan
Modified Date: <Modified Date> */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Select from "components/common/formComponent/Select";
import { StorePagesObject } from 'dummy/Dummy';

const Header = ({ page, setPage, store }) => {

    return (
        <>
            <div id='StoreHeader' className="flex py-3 p-4 justify-between items-center bg-slate-800 sticky inset-0 bottom-auto z-60">
                <div className="flex items-center flex-wrap gap-x-2">
                    <div className="relative inline-flex">
                        <Link to={`/admin/MasterCatalog/Store/`} className={`className="flex flex-wrap btn-sm px-4 py-[5px] bg-white hover:bg-indigo-500 text-indigo-500 hover:text-white"`}>
                            <span >Exit</span>
                            <wbr />
                        </Link>
                        <div
                            className="fixed inset-0 bg-slate-900 bg-opacity-30 z-50 transition-opacity"
                            style={{ display: "none" }}
                        ></div>
                    </div>
                    <button
                        type='submit'
                        className="px-4 py-[5px] btn-sm bg-indigo-500 hover:bg-indigo-600 text-white hidden"
                    >
                        Save
                    </button>
                </div>
                <div className="relative inline-flex justify-center items-center text-white ">
                    <span className="mr-5 ">{store.name}</span>

                    {/* dropDown  */}
                    <div className="text-white">
                        <Select
                            onChange={(e) => {
                                if (e) { setPage(e.value) }
                                else { setPage("") }
                            }}
                            defaultValue={page}
                            name="filterVendorId"
                            options={StorePagesObject}
                            className={'w-80 text-white bg-slate-100 outline-none border-black shadow-none rounded-lg'}
                            optionClass={`text-black`}
                            isClearable={false}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-x-2">
                    {/* <Link to="" className="px-4 py-[5px] btn-sm border-indigo-300 hover:border-indigo-400 text-white"><span className="text-sm">Customize Theme</span></Link>
                    <Link to={`/admin/store/configureStore/preview/${page}`} className="px-4 py-[5px] btn-sm border-indigo-300 hover:border-indigo-400 text-white"><span className="text-sm">Preview</span></Link>
                    <Link to="" className="px-4 py-[5px] btn-sm bg-indigo-500 hover:bg-indigo-600 text-white">Publish</Link> */}
                </div>
            </div>
        </>

    );
};

export default Header;
