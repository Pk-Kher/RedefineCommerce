/*Component Name: BannerBox2
Component Functional Details:  BannerBox2 .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React from 'react';

const BannerBox2 = () => {
    return (
        <>
            <section id="bannerBox2">
                <div className="mx-auto">
                    <div className="group">
                        <div className="w-full border-2 relative border-solid border-transparent">
                            <div className="section">
                                <div className="container mx-auto">
                                    <div className="flex flex-wrap items-center p-6 lg:p-16 bg-gray-100">

                                        <div className="w-full lg:w-1/2 text-gray-900 px-3 lg:pl-10 lg:pr-0">
                                            <h2 className="text-4xl">Men's Custom Clothing</h2>
                                            <div className="text-xl mt-2">Name Brand Logo Apparel &amp; Company Clothing</div>
                                            <p className="mt-1 text-lg text-gray-900">Custom clothing and logo apparel adds timeless style to men's promotional apparel. Customize company clothing from name brands like Nike, Peter Millar, FootJoy, Adidas, Helly Hansen, The North Face, Johnnie-O, Southern Tide and more.</p>
                                        </div>
                                        <div className="w-full lg:w-1/2 flex gap-2 h-full justify-around pr-0 lg:pr-10">
                                            <div className="h-full w-full lg:w-1/2">
                                                <img className="object-cover" src="http://ystore.us/HTML/RedefineCommerce/Admin/images/your-favorite-brands.png" alt="" />
                                            </div>
                                            <div className="px-4 text-5xl leading-none text-gray-900 flex items-center">&amp;</div>
                                            <div className="w-full lg:w-1/2 bg-white shadow-sm flex items-center justify-center">
                                                <div className="uppercase border-2 border-black inline-block p-2" role="heading" aria-level="6">Your Logo</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default BannerBox2;
