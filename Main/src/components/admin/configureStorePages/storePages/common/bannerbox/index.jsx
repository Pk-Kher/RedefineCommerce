/*Component Name: BannerBox
Component Functional Details:  BannerBox .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React from 'react';
import BannerBox1 from './BannerBox1';
import BannerBox2 from './BannerBox2';
import BannerBox3 from './BannerBox3';
import BannerBox4 from './BannerBox4';

const BannerBox = ({ bannerType, ...rest }) => {
    if (bannerType === 'type1') {
        return <BannerBox1 {...rest} />
    } else if (bannerType === 'type2') {
        return <BannerBox2 {...rest} />
    } else if (bannerType === 'type3') {
        return <BannerBox3 {...rest} />
    } else if (bannerType === 'type4') {
        return <BannerBox4 {...rest} />
    } else {
        return <BannerBox1 {...rest} />
    }
};

export default BannerBox;
