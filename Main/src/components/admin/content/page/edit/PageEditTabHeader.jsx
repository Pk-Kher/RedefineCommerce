import React from 'react'
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { login } from 'redux/auth/AuthAction';

const PageEditTabHeader = ({activeTab, children}) => {
   // console.log(children);
    const { id } = useParams();
    const activeClass = "tab py-4 px-6 block hover:text-blue-500 focus:outline-none text-blue-500 border-b-2 font-medium border-blue-500 cursor-pointer";
    const inactiveClass = "tab text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none border-b-2 font-medium border-white hover:border-indigo-400 cursor-pointer"
    return (
        <div className="flex justify-between border-solid border-b-gray-100 w-full">
            <div className="w-full">
                <div className="bg-white grid grid-cols-6 border-b px-2 sticky inset-0 bottom-auto z-50 top-[56px]">
                    <div className="col-span-1 flex items-center"></div>
                    <div className="col-span-4">
                        <ul className="w-full flex justify-center bg-white">
                            <li className="mr-0.5 md:mr-0"> 
                                <Link
                                    to={`/admin/Content/Page/edit/${id}`}
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    <span className={activeTab==1 ? activeClass : inactiveClass}>Content</span> 
                                </Link>
                            </li>
                            <li className="mr-0.5 md:mr-0">
                                <Link
                                    to={`/admin/Content/Page/edit/setting/${id}`}
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    <span className={activeTab==2 ? activeClass : inactiveClass}>Settings</span> 
                                </Link>
                            </li>
                            <li className="mr-0.5 md:mr-0"> <Link
                                    to={`/admin/Content/Page/edit/optimize/${id}`}
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    <span className={activeTab==3 ? activeClass : inactiveClass}>Optimize</span>
                                </Link>
                            
                            </li>
                            <li className="mr-0.5 md:mr-0"> 
                                <Link
                                    to={`/admin/Content/Page/edit/publish/${id}`}
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    <span className={activeTab==4 ? activeClass : inactiveClass}>Publishing Options</span> 
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="col-span-1 flex items-center"></div>
                </div>
                <div className="bg-gray-100 tab-content p-4">
                    <div className="md:w-3/6 mx-auto">
                        {children}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default PageEditTabHeader