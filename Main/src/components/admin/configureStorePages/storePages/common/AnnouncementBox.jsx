/*Component Name: AnnouncementBox
Component Functional Details:  AnnounceMentBox .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React from 'react';

const AnnouncementBox = () => {
    return (
        <>
            <section id="announcementbox">
                <div className="mx-auto">
                    <div className="group">
                        <div className="w-full border-2 relative border-solid border-transparent">
                            <div className="bg-blue-500 text-white px-2 sm:px-0 text-base">
                                <div className="container mx-auto">
                                    <div className="flex items-center justify-between text-center">
                                        <div className="flex items-center"><span className="material-icons top-header-icon text-xl mr-1">verified</span> <span>Free Logo &amp; Free Shipping, All Inclusive Pricing! </span> </div>
                                        <div className="flex items-center"><span className="material-icons top-header-phone-icon text-xl mr-1">phone</span> <span >888-293-5648</span></div>
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

export default AnnouncementBox;
