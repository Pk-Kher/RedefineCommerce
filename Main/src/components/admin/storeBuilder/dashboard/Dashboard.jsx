import React, { useState } from 'react'
import { storeBuilderDashboard, formBuilderDashboard } from 'dummy/Dummy'
import { useEffect } from 'react';

const Dashboard = () => {
    const [storeBuilder, setStoreBuilder] = useState({});
    const [formBuilder, setFormBuilder] = useState({});

    useEffect(() => {
        // Need to set data From StoreBuilder API
        setStoreBuilder(storeBuilderDashboard);
        setFormBuilder(formBuilderDashboard);
    }, []);

    return (
        <>
            <title>Dashboard</title>
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="grid grid-cols-12 gap-6 max-w-3xl mx-auto mb-6">
                    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-6 bg-white shadow-lg rounded-md">
                        <div className="text-center item-center block">
                            <div className="flex flex-wrap items-center">
                                <div className="relative w-full max-w-full text-center">
                                    <div className="p-3 font-semibold text-xl text-gray-700 border-b-2 border-neutral-200">Store Builder</div>
                                    <div className="p-3 text-gray-700 uppercase font-bold text-xs flex justify-between border-b border-neutral-200 last:border-b-0">
                                        <div >Stores</div>
                                        <div >{storeBuilder.total}</div>
                                    </div>
                                    <div className="p-3 text-gray-700 uppercase font-bold text-xs flex justify-between border-b border-neutral-200 last:border-b-0">
                                        <div >Active</div>
                                        <div >{storeBuilder.active}</div>
                                    </div>
                                    <div className="p-3 text-gray-700 uppercase font-bold text-xs flex justify-between border-b border-neutral-200 last:border-b-0">
                                        <div >Inactive</div>
                                        <div >{storeBuilder.inactive}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-6 bg-white shadow-lg rounded-md">
                        <div className="text-center item-center block">
                            <div className="flex flex-wrap items-center">
                                <div className="relative w-full max-w-full text-center">
                                    <div className="p-3 font-semibold text-xl text-gray-700 border-b-2 border-neutral-200">Form Builder</div>
                                    <div className="p-3 text-gray-700 uppercase font-bold text-xs flex justify-between border-b border-neutral-200 last:border-b-0">
                                        <div >Forms</div>
                                        <div >{formBuilder.total}</div>
                                    </div>
                                    <div className="p-3 text-gray-700 uppercase font-bold text-xs flex justify-between border-b border-neutral-200 last:border-b-0">
                                        <div >Active</div>
                                        <div >{formBuilder.active}</div>
                                    </div>
                                    <div className="p-3 text-gray-700 uppercase font-bold text-xs flex justify-between border-b border-neutral-200 last:border-b-0">
                                        <div >Inactive</div>
                                        <div >{formBuilder.inactive}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard