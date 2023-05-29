/*Component Name: Listing
Component Functional Details:  Listing .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React from 'react';
import ProductTileForList from '../common/ProductTileForList';

const Listing = ({ values }) => {
    return (
        <>
            <div className="w-full relative" >
                <div className="bg-white">
                    <div className="container mx-auto">
                        <section aria-labelledby="products-heading" >
                            <h2 id="products-heading" className="sr-only">Products</h2>
                            <div id='gridview' className={`grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-${values?.productListOpt_columnSelect ? values.productListOpt_columnSelect : 4} xl:gap-x-8 mb-10`}>
                                {
                                    [...Array(12).keys()].map((value, index) => {
                                        return <ProductTileForList key={index} values={values} />
                                    })
                                }
                            </div>
                        </section>
                    </div>
                </div>
            </div>
            <div className="py-24 border-t border-t-gray-300">
                {values?.productListOpt_productCount && <p className="text-center">You've seen 09 Products out of 250</p>}
                <button type="button" className="mt-8 w-auto mx-auto bg-white border border-gray-800 py-3 px-24 flex items-center text-center justify-center text-base font-medium text-gray-800 hover:bg-blue-500 hover:border-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">{values?.productListOpt_viewMoreButton ? values?.productListOpt_viewMoreButton : 'View More'}</button>
            </div>
        </>
    );
};

export default Listing;
