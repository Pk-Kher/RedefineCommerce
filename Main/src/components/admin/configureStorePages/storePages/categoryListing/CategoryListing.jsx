/*Component Name: CategoryListing
Component Functional Details:  CategoryListing .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React from 'react';
import PromotionText1 from '../common/PromotionText1';
import AnnouncementBox from '../common/AnnouncementBox';
import Breadcrumb from '../common/Breadcrumb';
import Footer from '../common/Footer';
import Header from '../common/Header';
import PromotionText2 from '../common/PromotionText2';
import { useFormikContext } from 'formik';
import CategoryTileList from '../common/CategoryTileList';
import Listing from './Listing';
import BannerBox from '../common/bannerbox/';

const CategoryListing = ({ storeDetails }) => {
    const { values } = useFormikContext();
    return (
        <>
            {/* <iframe className="w-full min-h-screen mx-auto" src="http://ystore.us/HTML/RedefineCommerce/Admin/store-category.html" title='i' frameBorder="0"></iframe> */}
            <AnnouncementBox />
            <Header storeDetails={storeDetails} />
            <Breadcrumb />
            <PromotionText1 values={values?.promotionalText1} />
            <BannerBox bannerType={values?.bannertype} />
            <PromotionText2 values={values?.promotionalText2} />
            <Listing values={{
                columnSelect: values?.categoryListOpt_columnSelect,
                titleAlign: values?.categoryListOpt_texthorizontalAlign,
                titleColor: values?.categoryListOpt_TextColor,
                titleSize: values?.categoryListOpt_titleFontSize
            }} />
            <Footer />
        </>
    );
};

export default CategoryListing;
