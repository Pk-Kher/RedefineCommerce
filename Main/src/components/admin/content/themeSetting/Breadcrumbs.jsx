import React from 'react'
import { useEffect } from 'react';

const Breadcrumbs = ({ setThemeSettingData, ThemeData, breadcrumbs, setBreadcrumbs }) => {
    const onBreadcrumbClick = (element, index) => {
        breadcrumbs.splice(index + 1);

        setThemeSettingData([element]);
        setBreadcrumbs(breadcrumbs);
    }

    return (
        <>
            <div className="bg-white pt-2">
                <div className="pl-2 pb-1 flex">
                    <span className='text-sm py-1 pr-1 text-gray-500 hover:text-indigo-600 flex items-center cursor-pointer'
                        onClick={
                            () => {
                                setThemeSettingData(ThemeData);
                                setBreadcrumbs([]);
                            }}>
                        <span className="material-icons-outlined text-sm">home</span>
                        <span className="ml-1">Theme Setting</span>
                    </span>

                    {
                        breadcrumbs &&
                        breadcrumbs.map((element, index, row) => {
                            return (
                                <span key={index} >
                                    <span className="text-sm py-1 px-1 text-gray-500" >/</span>
                                    <span
                                        className="text-sm py-1 px-1 text-gray-500 cursor-pointer last:cursor-default hover:text-indigo-600 last:hover:text-gray-500"
                                        onClick={() => (row.length != index + 1) ? onBreadcrumbClick(element, index) : ''}
                                    >
                                        {element.label}
                                    </span>
                                </span>
                            )
                        })
                    }
                </div>
            </div>
        </>
    );
}

export default Breadcrumbs