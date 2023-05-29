/*Component Name: RightSidebar
Component Functional Details:  RightSidebar .
Created By: PK Kher
Created Date: 8-8-2022
Modified By: PK Kher
Modified Date: 8-8-2022 */

import Input from 'components/common/formComponent/Input';
import ToggleButton from 'components/common/formComponent/ToggleButton';
import { useFormikContext } from 'formik';
import React from 'react';

const RightSidebar = () => {
    const { values } = useFormikContext();
    return (
        <>
            <div className="w-full justify-between bg-white py-3 mb-4 rounded-md shadow-lg">
                <div className="w-full mb-4 last:mb-0">
                    <div className="px-5 flex flex-wrap justify-between">
                        <div className="text-lg font-bold text-gray-500 text-left leading-10">Akshay Vyas</div>
                        <div x-data="{ modalOpen: false }">
                            <span title="Edit" className="inline-block cursor-pointer">
                                <span className="material-icons-outlined leading-10">edit</span>
                            </span>
                        </div>
                    </div>
                    <div className="px-5">
                        <div className="mb-2">
                            <span className="inline-block text-indigo-500">akshayvyas@example.com</span>
                        </div>
                        <div >No account</div>
                    </div>
                </div>
            </div>
            <div className="w-full justify-between bg-white py-3 mb-4 rounded-md shadow-lg">
                <div className="w-full px-3">
                    <div className="w-full flex mb-2 items-center justify-between">
                        <div className="text-lg font-bold text-gray-500 text-left px-2 leading-10">Tax Settings</div>
                    </div>
                    <div className="px-2 mb-2">
                        <div className="flex items-center" x-data="{ checked: true }">
                            <div className="w-16 relative">
                                <ToggleButton name={'isTaxEnable'} defaultValue={values.tax} id="isTaxEnable" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full justify-between bg-white px-5 py-3 mb-4 rounded-md shadow-lg">
                <div className="w-full flex justify-between mb-2 last:mb-0">
                    <div className="w-1/2 text-left">
                        <div className="text-lg font-bold text-gray-500 text-left leading-10">Marketing Status</div>
                    </div>
                    <span title="Edit" className="inline-block">
                        <span className="material-icons-outlined leading-10 cursor-pointer">edit</span>
                    </span>
                </div>
                <div className="w-full">
                    <div className="py-1">
                        <span className="text-xs inline-flex font-medium border border-neutral-200 bg-slate-100 text-gray-500 rounded-md text-center px-2.5 py-1">Email not subscribed</span>
                    </div>
                    <div className="py-1">
                        <span title="" className="text-xs inline-flex font-medium border border-neutral-200 bg-slate-100 text-gray-500 rounded-md text-center px-2.5 py-1">SMS not subscribed</span>
                    </div>
                    <div className="py-1 text-xs">Last updated 3:55 am.</div>
                </div>
            </div>
            <div className="w-full justify-between bg-white px-5 py-3 mb-4 rounded-md shadow-lg">
                <div className="w-full flex mb-2 justify-between items-center">
                    <div className="text-lg font-bold text-gray-500 text-left leading-10">Tags</div>
                    <span title="" className="text-indigo-500 text-sm cursor-pointer">Manage</span>
                </div>
                <div className="w-full flex mb-2">
                    <Input name={'tags'} className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md" type="text" placeholder="Tags" />
                </div>
            </div>
        </>
    );
};

export default RightSidebar;
