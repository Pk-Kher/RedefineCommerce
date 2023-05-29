/*Component Name: ProductFilter
Component Functional Details:  ProductFilter .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import Transition from 'utils/Transition';
import FilterOptions from './FilterOptions';

const ProductFilter = ({ values }) => {
    const [showFilter, setShowFilter] = useState(true);
    const dropdown = useRef(null);
    const trigger = useRef(null);
    // useEffect(() => {
    //     const clickHandler = ({ target }) => {
    //         if (!dropdown.current) return;
    //         if (
    //             !showFilter ||
    //             dropdown.current.contains(target) ||
    //             trigger.current.contains(target)
    //         )
    //             return;
    //         setShowFilter(false);
    //     };
    //     document.addEventListener("click", clickHandler);
    //     return () => document.removeEventListener("click", clickHandler);
    // });
    return (
        <>
            <div className="mx-auto mb-6" id="filterbox">
                <div className="group">
                    <div className="w-full border-2 relative border-solid border-transparent" >
                        <div className="border-t border-b border-gray-200">
                            <div className="container mx-auto">
                                <section aria-labelledby="filter-heading" className="relative z-10 grid items-center">
                                    <h2 id="filter-heading" className="sr-only">Filters</h2>
                                    <div className="relative col-start-1 row-start-1 py-4">
                                        <div className="flex space-x-6 divide-x divide-gray-200 text-sm pl-4 lg:pl-6 justify-end">
                                            {values.filter !== 'none' ?
                                                <>
                                                    <div>
                                                        <button ref={trigger} onClick={() => setShowFilter(true)} type="button" className="group text-gray-700 font-medium flex items-center hover:text-blue-500" aria-controls="disclosure-1"  >
                                                            <svg className="flex-none w-5 h-5 mr-2 text-gray-400 group-hover:text-blue-500" xmlns="http://www.w3.org/2000/svg" width="38.298" height="40.814" viewBox="0 0 48 48">
                                                                <path id="filter" d="M20.6,34.813H0v-2H20.6a5.994,5.994,0,0,1,11.822,0H37.3v2H32.425a5.994,5.994,0,0,1-11.822,0Zm1.91-1a4,4,0,1,0,4-4A4.007,4.007,0,0,0,22.513,33.813ZM4.873,20.905H0v-2H4.873a5.994,5.994,0,0,1,11.822,0H37.3v2h-20.6a5.994,5.994,0,0,1-11.822,0Zm1.911-1a4,4,0,1,0,4-4A4.005,4.005,0,0,0,6.783,19.905ZM20.6,7H0V5H20.6A5.994,5.994,0,0,1,32.425,5H37.3V7H32.425A5.994,5.994,0,0,1,20.6,7Zm1.91-1a4,4,0,1,0,4-4A4.006,4.006,0,0,0,22.513,6Z" transform="translate(0.5 0.5)" stroke="rgba(0,0,0,0)" strokeMiterlimit="10" strokeWidth="1"></path>
                                                            </svg>
                                                            Filters
                                                        </button>
                                                    </div>
                                                    <div className="lg:flex-1 flex flex-wrap justify-center items-center px-2"> <span>250 results</span> </div>
                                                </> :
                                                <>

                                                </>
                                            }
                                            <div className="col-start-1 row-start-1 ">
                                                <div className="flex justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-40">
                                                    <div className="flex items-center">
                                                        <div className="relative inline-block text-left">
                                                            <div>
                                                                <button type="button" className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900" id="menu-button"> Sort
                                                                    <svg className="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500" x-description="Heroicon name: solid/chevron-down" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                                                    </svg>
                                                                </button>
                                                            </div>

                                                        </div>
                                                        <button type="button" className="p-2 -m-2 ml-5 sm:ml-7 text-gray-400 hover:text-blue-500 cursor-pointer" > <span className="sr-only">Grid
                                                            View</span>
                                                            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 48 48">
                                                                <path d="M6,22.5V6h16.5v16.5H6z M6,42V25.5h16.5V42H6z M25.5,22.5V6H42v16.5H25.5z M25.5,42V25.5H42V42H25.5z M8,20.5h12.5V8H8V20.5 z M27.5,20.5H40V8H27.5V20.5z M27.5,40H40V27.5H27.5V40z M8,40h12.5V27.5H8V40z"></path>
                                                            </svg>
                                                        </button>
                                                        <button type="button" className="p-2 -m-2 ml-0 sm:ml-0 text-gray-400 hover:text-blue-500 cursor-pointer"  > <span className="sr-only">List
                                                            View</span>
                                                            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 48 48">
                                                                <path d="M6,22.5V6h36v16.5H6z M8,20.5h32V8H8V20.5z M6,42V25.5h36V42H6z M8,40h32V27.5H8V40z"></path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Transition
                                        className={`fixed top-0 z-50 ${values?.floyout_alignment === 'right' ? 'right-0' : 'left-auto'} mt-16 mb-44`}
                                        show={showFilter && values?.filter === 'floyout'}
                                        tag="div"
                                        enter="transition ease-out duration-200 transform"
                                        enterStart="opacity-0 -translate-y-2"
                                        enterEnd="opacity-100 translate-y-0"
                                        leave="transition ease-out duration-200"
                                        leaveStart="opacity-100"
                                        leaveEnd="opacity-0"
                                    >
                                        <div className="bg-gray-100 w-80 h-screen overflow-auto" ref={dropdown}>
                                            <div className="px-4 flex items-center justify-between">
                                                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                                                <button onClick={() => setShowFilter(false)} type="button" className="-mr-2 w-10 h-10 p-2 flex items-center justify-center text-gray-400 hover:text-gray-500" >
                                                    <span className="sr-only">Close menu</span>
                                                    <svg className="h-6 w-6" x-description="Heroicon name: outline/x" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                            {/* Filters */}
                                            <FilterOptions />
                                        </div>
                                    </Transition>
                                </section>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductFilter;
