/*Component Name: Header
Component Functional Details:  Header .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React from 'react';

const Header = ({ storeDetails }) => {
    return (
        <>
            <section id="headbox">
                <div className="mx-auto">
                    <div className="group">
                        <div className="w-full border-2 relative border-solid border-transparent">
                            <div className="bg-white">
                                <header className='relative'>
                                    <nav aria-label='top'>
                                        <div className='bg-white border-b border-gray-200'>
                                            <div className='container mx-auto'>
                                                <div>
                                                    <div className='py-3 lg:py-4 flex items-center justify-between'>
                                                        <div className="lg:flex lg:items-center">
                                                            <span className='cursor-pointer'>
                                                                <span className="sr-only">Workflow</span>
                                                                <img className="h-12 w-auto" src={process.env.REACT_APP_API_BLOB + storeDetails?.logoUrl} alt={storeDetails?.name || ''} />
                                                            </span>
                                                        </div>
                                                        <div className="h-full lg:flex items-center justify-center flex-1">
                                                            {/* <!-- Mega menus --> */}
                                                            <div className="ml-6">
                                                                <div className="h-full flex justify-center space-x-4">
                                                                    <div className="flex">
                                                                        <div className="relative flex">
                                                                            <span className="cursor-pointer relative z-10 flex items-center transition-colors ease-out duration-200 text-xs font-medium border-b-2 -mb-px pt-px border-transparent text-gray-700 hover:text-gray-800">
                                                                                <span className="uppercase text-primary">Brands</span>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <div className="relative flex">
                                                                            <span className="cursor-pointer relative z-10 flex items-center transition-colors ease-out duration-200 text-xs font-medium border-b-2 -mb-px pt-px border-transparent text-gray-700 hover:text-gray-800">
                                                                                <span className="uppercase text-primary">Men</span>

                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <div className="relative flex">
                                                                            <span className="cursor-pointer relative z-10 flex items-center transition-colors ease-out duration-200 text-xs font-medium border-b-2 -mb-px pt-px border-transparent text-gray-700 hover:text-gray-800">
                                                                                <span className="uppercase text-primary">Women</span>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <div className="relative flex">
                                                                            <span className="cursor-pointer relative z-10 flex items-center transition-colors ease-out duration-200 text-xs font-medium border-b-2 -mb-px pt-px border-transparent text-gray-700 hover:text-gray-800">
                                                                                <span className="uppercase text-primary">Golf</span>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <div className="relative flex">
                                                                            <span className="cursor-pointer relative z-10 flex items-center transition-colors ease-out duration-200 text-xs font-medium border-b-2 -mb-px pt-px border-transparent text-gray-700 hover:text-gray-800">
                                                                                <span className="uppercase text-primary">Accessories</span>
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex">
                                                                        <div className="relative flex">
                                                                            <span className="cursor-pointer relative z-10 flex items-center transition-colors ease-out duration-200 text-xs font-medium border-b-2 -mb-px pt-px border-transparent text-gray-700 hover:text-gray-800">
                                                                                <span className="uppercase text-primary">Consultation</span>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <div className="relative flex">
                                                                            <span className="cursor-pointer relative z-10 flex items-center transition-colors ease-out duration-200 text-xs font-medium border-b-2 -mb-px pt-px border-transparent text-gray-700 hover:text-gray-800">
                                                                                <span className="uppercase text-primary">General Info</span>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <div className="relative flex">
                                                                            <span className="cursor-pointer relative z-10 flex items-center transition-colors ease-out duration-200 text-xs font-medium border-b-2 -mb-px pt-px border-transparent text-gray-700 hover:text-gray-800">
                                                                                <span className="uppercase text-primary">Sale</span>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-end">
                                                            <div className="flex items-center lg:ml-6">
                                                                <div className="flex items-center space-x-4">
                                                                    <div className="hidden lg:flex">
                                                                        <span href="#" className="cursor-pointer -m-2 border border-gray-400 p-2 pr-10 text-gray-400 hover:text-gray-500 relative">
                                                                            <input type="text" className="outline-none border-0 p-0 focus:ring-0" />
                                                                            <div className="w-6 h-6 absolute right-2 top-2">
                                                                                <svg className="w-6 h-6" x-description="Heroicon name: outline/search" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                                                                </svg>
                                                                            </div>
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <span className="cursor-pointer text-gray-400 hover:text-gray-500 relative">
                                                                            <span className="sr-only">Wishlist</span>
                                                                            <svg className="w-6 h-6 fill-[#003a70] hover:fill-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                                                <path d="M12 21 10.55 19.7Q6.625 16.2 4.312 13.612Q2 11.025 2 8.15Q2 5.8 3.575 4.225Q5.15 2.65 7.5 2.65Q8.825 2.65 10 3.212Q11.175 3.775 12 4.75Q12.825 3.775 14 3.212Q15.175 2.65 16.5 2.65Q18.85 2.65 20.425 4.225Q22 5.8 22 8.15Q22 11.025 19.688 13.612Q17.375 16.2 13.45 19.7ZM12 11.475Q12 11.475 12 11.475Q12 11.475 12 11.475Q12 11.475 12 11.475Q12 11.475 12 11.475Q12 11.475 12 11.475Q12 11.475 12 11.475Q12 11.475 12 11.475Q12 11.475 12 11.475Q12 11.475 12 11.475Q12 11.475 12 11.475Q12 11.475 12 11.475Q12 11.475 12 11.475ZM12 18.3Q15.575 15.05 17.788 12.7Q20 10.35 20 8.15Q20 6.65 19 5.65Q18 4.65 16.5 4.65Q15.325 4.65 14.325 5.312Q13.325 5.975 12.95 7H11.05Q10.675 5.975 9.675 5.312Q8.675 4.65 7.5 4.65Q6 4.65 5 5.65Q4 6.65 4 8.15Q4 10.35 6.213 12.7Q8.425 15.05 12 18.3Z"></path>
                                                                            </svg>
                                                                            <span className="absolute -right-2 -top-2 w-4 h-4 rounded-full flex items-center justify-center bg-gray-200 text-xs font-medium text-gray-500">0</span>
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <span className="cursor-pointer text-primary hover:text-gray-500 flex items-center gap-1" data-modal-toggle="LoginModal">
                                                                            <span className="hidden lg:inline-block text-xs uppercase">login</span>
                                                                            <svg className="w-6 h-6" x-description="Heroicon name: outline/user" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                                            </svg>
                                                                        </span>
                                                                    </div>
                                                                    <div className="flow-root">
                                                                        <span className="cursor-pointer text-primary hover:text-gray-500 group flex items-center gap-1 relative pr-2">
                                                                            <span className="hidden lg:inline-block text-xs uppercase">my cart</span>
                                                                            <svg className="flex-shrink-0 h-6 w-6 text-primary group-hover:text-gray-500" x-description="Heroicon name: outline/shopping-cart" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                                                            </svg>
                                                                            <span className="absolute right-0 -top-2 w-4 h-4 rounded-full flex items-center justify-center bg-gray-200 text-xs font-medium text-gray-500">0</span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </nav>
                                </header>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Header;
