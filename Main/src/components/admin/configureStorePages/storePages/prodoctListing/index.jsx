/*Component Name: ProductListing
Component Functional Details:  ProductListing .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import { useFormikContext } from 'formik';
import React from 'react';
import AnnouncementBox from '../common/AnnouncementBox';
import BannerBox from '../common/bannerbox';
import Breadcrumb from '../common/Breadcrumb';
import Footer from '../common/Footer';
import Header from '../common/Header';
import ProductFilter from '../common/productFilter/FilterHeader';
import FilterOptions from '../common/productFilter/FilterOptions';
import ProductTileForList from '../common/ProductTileForList';
import PromotionText1 from '../common/PromotionText1';
import PromotionText2 from '../common/PromotionText2';
import Listing from './Listing';

const ProductListing = ({ storeDetails }) => {
    const { values } = useFormikContext();
    return (
        <>
            <AnnouncementBox />
            <Header storeDetails={storeDetails} />
            <Breadcrumb />
            <PromotionText1 values={values?.promotionalText1} />
            <BannerBox bannerType={values?.bannertype} />
            <PromotionText2 values={values?.promotionalText2} />
            <ProductFilter values={values} />
            <section id="categoryList">
                <div className="w-full border-2 relative border-solid border-transparent">
                    <div className="container mx-auto">
                        <div className="flex flex-wrap -mx-4">
                            {values?.filter === 'leftSide' && <div className='w-full lg:w-3/12 px-4'>
                                <FilterOptions />
                            </div>}
                            <div className={`w-full ${values?.filter === 'leftSide' ? 'lg:w-9/12' : 'lg:w-auto'} px-4`}>
                                <Listing values={values} />
                            </div>

                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default ProductListing;
