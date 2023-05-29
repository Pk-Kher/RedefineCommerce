/*Component Name: Breadcrum
Component Functional Details:  Breadcrum .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React from 'react';

const Breadcrumb = () => {
    return (
        <>
            <section id="breadcrumbsbox" className="my-3">
                <div className="mx-auto">
                    <div className="group">
                        <div className="w-full border-2 relative border-solid border-transparent">
                            <div className="container mx-auto">
                                <nav className="flex" aria-label="Breadcrumb">
                                    <ol className="inline-flex items-center space-x-1 md:space-x-3 px-2">
                                        <li className="inline-flex items-center">
                                            <span className="cursor-pointer inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
                                                <span className="material-icons top-header-phone-icon text-xl mr-1">home</span>
                                                Home
                                            </span>
                                        </li>

                                        <li aria-current="page">
                                            <div className="flex items-center">
                                                <span className="material-icons top-header-phone-icon text-xl mr-1">woman</span>
                                                Women
                                            </div>
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Breadcrumb;
