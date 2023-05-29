/*Component Name: ProductTileForList
Component Functional Details:  ProductTileForList .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

const ProductTileForList = ({ values }) => {
    const [titleAlign, setTitleAlign] = useState("");
    useEffect(() => {
        setTitleAlign(`flex ${values?.productListOpt_alignment === 'center' ? 'justify-center' : (values?.productListOpt_alignment === 'right' ? 'justify-end' : 'justify-start')}`)
    })
    return (
        <>
            <div className="text-center">
                <div >
                    <div className="flex text-center lg:w-auto">
                        <div className="relative border border-gray-200 pb-4">
                            <div className="w-full bg-gray-200 rounded-md overflow-hidden aspect-w-1 aspect-h-1">
                                <img src="http://ystore.us/HTML/RedefineCommerce/Admin/images/look-11.png" alt="Front of men's Basic Tee in white." className="w-auto h-auto max-h-max" width="50" />
                                <div className="absolute top-5 right-5 text-gray-800 p-1 z-5">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" className="w-4 h-4">
                                        <path id="favorite_FILL0_wght400_GRAD0_opsz48" d="M24,41.95,21.95,40.1A177.4,177.4,0,0,1,8.9,27.1Q4,21.55,4,15.85A10.334,10.334,0,0,1,14.5,5.3a11.375,11.375,0,0,1,5.05,1.225A11.871,11.871,0,0,1,24,10.55a14.5,14.5,0,0,1,4.55-4.025A10.564,10.564,0,0,1,33.5,5.3,10.334,10.334,0,0,1,44,15.85q0,5.7-4.9,11.25a177.4,177.4,0,0,1-13.05,13Zm0-18.8ZM24,38q7.6-7,12.3-12.15t4.7-10A7.271,7.271,0,0,0,33.5,8.3a8.013,8.013,0,0,0-4.7,1.55,11.3,11.3,0,0,0-3.6,4.45H22.75a10.835,10.835,0,0,0-3.575-4.45A8.052,8.052,0,0,0,14.5,8.3a7.264,7.264,0,0,0-5.4,2.125A7.394,7.394,0,0,0,7,15.85q0,4.85,4.7,10T24,38Z" transform="translate(-2 -1.3)"></path>
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-6 relative px-3">
                                {values?.productListOpt_availability &&
                                    <div className={`text-sm -top-4 left-0 right-0 ${titleAlign}`}>
                                        <span className="w-2.5 h-2.5 bg-lime-500 inline-block rounded-full mr-1 mt-1"></span>
                                        <span >Available Online</span>
                                    </div>
                                }
                                {values?.productListOpt_brand &&
                                    <div className={`mt-1 ${titleAlign}`}>
                                        <img className="inline-block max-h-12" src="http://ystore.us/HTML/RedefineCommerce/Ecom-front/corporategear/images/peter-millar.png" alt="" />
                                    </div>}
                                {values?.productListOpt_personalize &&
                                    <div className={`mt-1 ${titleAlign}`}>
                                        <button type='button' className={`inline-flex items-center gap-1`}>
                                            <span>
                                                <img src="http://ystore.us/HTML/RedefineCommerce/Admin/images/personalize-icon.png" className="max-h-6" alt="" />
                                            </span>
                                            <span>Personalize</span>
                                        </button>
                                    </div>}
                                {values?.productListOpt_productName &&
                                    < div className={`mt-1 text-anchor hover:text-anchor-hover h-14 text-ellipsis overflow-hidden line-clamp-2  ${titleAlign}`}>
                                        <button type='button' className="relative">
                                            <span className={`${values?.productListOpt_productNameFontSize} ${values?.productListOpt_productNameTextStyle?.join(" ")}`} style={{ color: values?.productListOpt_productNameColor }}>Product Name</span>
                                        </button>
                                    </div>}
                                {values?.productListOpt_price && <div className={`mt-2 text-black text-base tracking-wider  ${titleAlign}`}>
                                    <span className="font-semibold">MSRP $159.00</span>
                                </div>}
                                {values?.productListOpt_compare &&
                                    <div className={`form-group mt-2  ${titleAlign}`}>
                                        <label className="checkbox-inline">
                                            <input type="checkbox" disabled={true} /> Compare (1)
                                        </label>
                                    </div>
                                }
                                {values?.productListOpt_color &&
                                    <div className={`mt-2 ${titleAlign}`}>
                                        <ul role="list" className={`flex flex-wrap items-center justify-center gap-1`}>
                                            <li className="w-7 h-7 border-2 border-light-gray hover:border-secondary relative">
                                                {/* <img src="http://ystore.us/HTML/RedefineCommerce/Admin/images/look-11.png" alt="" title="" className="max-h-full inline-block" /> */}
                                                <span className="absolute inset-0 bg-primary text-xs font-semibold flex items-center justify-center text-white">IMG</span>
                                            </li><li className="w-7 h-7 border-2 border-light-gray hover:border-secondary relative">
                                                {/* <img src="http://ystore.us/HTML/RedefineCommerce/Admin/images/look-11.png" alt="" title="" className="max-h-full inline-block" /> */}
                                                <span className="absolute inset-0 bg-primary text-xs font-semibold flex items-center justify-center text-white">IMG</span>
                                            </li><li className="w-7 h-7 border-2 border-light-gray hover:border-secondary relative">
                                                {/* <img src="http://ystore.us/HTML/RedefineCommerce/Admin/images/look-11.png" alt="" title="" className="max-h-full inline-block" /> */}
                                                <span className="absolute inset-0 bg-primary text-xs font-semibold flex items-center justify-center text-white">IMG</span>
                                            </li><li className="w-7 h-7 border-2 border-light-gray hover:border-secondary relative">
                                                {/* <img src="http://ystore.us/HTML/RedefineCommerce/Admin/images/look-11.png" alt="" title="" className="max-h-full inline-block" /> */}
                                                <span className="absolute inset-0 bg-primary text-xs font-semibold flex items-center justify-center text-white">IMG</span>
                                            </li><li className="w-7 h-7 border-2 border-light-gray hover:border-secondary relative">
                                                {/* <img src="http://ystore.us/HTML/RedefineCommerce/Admin/images/look-11.png" alt="" title="" className="max-h-full inline-block" /> */}
                                                <span className="absolute inset-0 bg-primary text-xs font-semibold flex items-center justify-center text-white">IMG</span>
                                            </li>
                                            <li className="w-7 h-7 border-2 border-light-gray hover:border-secondary relative">
                                                {/* <img src="http://ystore.us/HTML/RedefineCommerce/Admin/images/look-11.png" alt="" title="" className="max-h-full inline-block" /> */}
                                                <span className="absolute inset-0 bg-primary text-xs font-semibold flex items-center justify-center text-white">+2</span>
                                            </li>
                                        </ul>

                                    </div>
                                }
                                {values?.productListOpt_addToCartButton &&
                                    <div className={`mt-3 ${titleAlign}`}>
                                        <button type='button' className="btn btn-primary">Add to cart</button>
                                    </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductTileForList;
