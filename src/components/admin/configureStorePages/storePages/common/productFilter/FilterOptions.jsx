/*Component Name: FilterOptions
Component Functional Details:  FilterOptions .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React from 'react';

const FilterOptions = () => {
    return (
        <>
            <div className='p-4 bg-gray-100'>
                <div className="text-lg font-medium text-gray-900 hidden lg:block mb-4 uppercase">Category</div>
                <div className="py-4 border-t border-neutral-300 filter-type">
                    <div className="text-md" x-show="open">
                        <ul className="w-full">
                            <ul className="ml-0 w-full text-base">
                                <li className="w-full py-1">
                                    <a className="font-semibold flex items-center text-black" href=""> <span className="material-icons-outlined">expand_more</span> Polos(266)</a>
                                    <ul className="ml-3">
                                        <li className="py-1">
                                            <a href="" className="flex items-center text-black"> <span className="material-icons-outlined"> chevron_right</span> Short Sleeve(240)</a>
                                        </li>
                                        <li className="py-1">
                                            <a href="" className="flex items-center text-black"> <span className="material-icons-outlined"> chevron_right</span> Long Sleeve(14)</a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </ul>
                    </div>
                </div>

                <div className="py-4 border-t border-neutral-300">
                    <button type='button' className="flex items-center justify-between w-full group mb-1" aria-expanded="true">
                        <div className="text-lg font-medium text-gray-900 hidden lg:block uppercase">Brand</div>
                        <svg className="w-8 h-8 shrink-0 fill-current text-gray-400 group-hover:text-gray-500 ml-3 rotate-180" viewBox="0 0 32 32">
                            <path d="M16 20l-5.4-5.4 1.4-1.4 4 4 4-4 1.4 1.4z" />
                        </svg>
                    </button>
                    <div className="text-sm" x-show="open">
                        <ul className="pb-6 pt-2 space-y-3">
                            <li className="flex items-center">
                                <input id="filbrand-0" name="filbrand[]" defaultValue="Men (10)" type="checkbox" className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500" />
                                <label htmlFor="filbrand-0" className="ml-3 text-black text-base">Adidas</label>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="py-4 border-t border-neutral-300">
                    <button type='button' className="flex items-center justify-between w-full group mb-1" aria-expanded="true">
                        <div className="text-lg font-medium text-gray-900 hidden lg:block uppercase">Product Type</div>
                        <svg className="w-8 h-8 shrink-0 fill-current text-gray-400 group-hover:text-gray-500 ml-3 rotate-180" viewBox="0 0 32 32">
                            <path d="M16 20l-5.4-5.4 1.4-1.4 4 4 4-4 1.4 1.4z" />
                        </svg>
                    </button>
                    <div className="text-sm" x-show="open">
                        <ul className="pb-6 pt-2 space-y-3">
                            <li className="flex items-center">
                                <input id="filprodtype-0" name="filprodtype[]" defaultValue="Bottom" type="checkbox" className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500" />
                                <label htmlFor="filprodtype-0" className="ml-3 text-black text-base"> Bottom </label>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="py-4 border-t border-neutral-300">
                    <button type='button' className="flex items-center justify-between w-full group mb-1" >
                        <div className="text-lg font-medium text-gray-900 hidden lg:block uppercase">Select Color</div>
                        <svg className="w-8 h-8 shrink-0 fill-current text-gray-400 group-hover:text-gray-500 ml-3 rotate-180" viewBox="0 0 32 32">
                            <path d="M16 20l-5.4-5.4 1.4-1.4 4 4 4-4 1.4 1.4z" />
                        </svg>
                    </button>
                    <div className="text-base" x-show="open">
                        <ul role="list" className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
                            <li className="w-8 h-8 border-2 border-secondary hover:border-secondary p-0.5">
                                <img src="https://www.corporategear.com/Resources/parsonskellogg/Product/color/black-sc.jpg" alt="" />
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="py-4 border-t border-neutral-300">
                    <button type='button' className="flex items-center justify-between w-full group mb-1" aria-expanded="true">
                        <div className="text-lg font-medium text-gray-900 hidden lg:block uppercase">
                            Select Size
                        </div>
                        <svg className="w-8 h-8 shrink-0 fill-current text-gray-400 group-hover:text-gray-500 ml-3 rotate-180" viewBox="0 0 32 32">
                            <path d="M16 20l-5.4-5.4 1.4-1.4 4 4 4-4 1.4 1.4z" />
                        </svg>
                    </button>
                    <div className="text-sm" x-show="open">
                        <ul className="pb-6 pt-2 space-y-3">
                            <li className="flex items-center">
                                <input id="size-0" name="size[]" defaultValue="new-arrivals" type="checkbox" className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500" />
                                <label htmlFor="size-0" className="ml-3 text-black text-base"> XS (3) </label>
                            </li>
                        </ul>
                    </div>
                </div >

                <div className="py-4 border-t border-neutral-300">
                    <button type='button' className="flex items-center justify-between w-full group mb-1" aria-expanded="true">
                        <div className="text-lg font-medium text-gray-900 hidden lg:block uppercase">Price Range</div>
                        <svg className="w-8 h-8 shrink-0 fill-current text-gray-400 group-hover:text-gray-500 ml-3 rotate-180" viewBox="0 0 32 32">
                            <path d="M16 20l-5.4-5.4 1.4-1.4 4 4 4-4 1.4 1.4z" />
                        </svg>
                    </button >
                    <div className="text-sm mb-14" x-show="open">
                        <ul className="pb-6 pt-2 space-y-3">
                            <li className="flex items-center">
                                <input id="price-0" name="price[]" defaultValue="new-arrivals" type="checkbox" className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500" />
                                <label htmlFor="price-0" className="ml-3 text-black text-base"> $150 - $199 </label>
                            </li>
                        </ul>
                    </div>
                </div >
            </div >
        </>
    );
};

export default FilterOptions;
