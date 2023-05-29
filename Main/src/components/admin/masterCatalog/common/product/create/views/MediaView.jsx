/*Component Name: MediaView.jsx
Component Functional Details: Basic Information tab field display
Created By: Vikas Patel
Created Date: 11-May-2022
Modified By: chnadan
Modified Date: 06/08/2022 */

import { productType } from "dummy/Dummy";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { scrollTop } from "services/common/helper/Helper";

const MediaView = ({
  displayFieldElement,
  fetchFieldProperty,
  fields,
  values,
  requiredFields,
  tab,
  setActiveTab,
  type,
  index,
}) => {
  const initialValues = {
    mainImage:
      "	http://ystore.us/HTML/RedefineCommerce/Admin/images/stonewash.jpg",
    backImage:
      "http://ystore.us/HTML/RedefineCommerce/Admin/images/stonewash2.jpg",
    frontImage:
      "http://ystore.us/HTML/RedefineCommerce/Admin/images/stonewash1.jpg",
    rightImage:
      "http://ystore.us/HTML/RedefineCommerce/Admin/images/stonewash3.jpg",
  };

  return (
    <>
      <div className="px-6 py-12 border-b-4 border-neutral-200 last:border-b-0">
        <div className="flex items-center justify-between">
          <div
            className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2"
          >
            {tab.label}
          </div>
          <div >
            <span
              className="text-indigo-500 cursor-pointer"
              onClick={() => {
                setActiveTab(index);
                scrollTop();
              }}
            >
              Edit
            </span>
          </div>
        </div>

        {![productType.EcommerceStore, productType.CorporateStore].includes(type) &&
          <div className="px-6 py-6 border-b-4 border-neutral-200 last:border-b-0">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-full lg:col-span-6 border-2 border-neutral-200 rounded-md shadow">
                <img
                  src={initialValues.mainImage}
                  className="rounded-lg h-auto align-middle border-none"
                />
              </div>
              <div className="col-span-full lg:col-span-6">
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-full lg:col-span-6 border-2 border-neutral-200 rounded-md shadow">
                    <img
                      src={initialValues.backImage}
                      className="rounded-lg h-auto align-middle border-none"
                    />
                  </div>
                  <div className="col-span-full lg:col-span-6 border-2 border-neutral-200 rounded-md shadow">
                    <img
                      src={initialValues.frontImage}
                      className="rounded-lg h-auto align-middle border-none"
                    />
                  </div>
                  <div className="col-span-full lg:col-span-6 border-2 border-neutral-200 rounded-md shadow">
                    <img
                      src={initialValues.rightImage}
                      className="rounded-lg h-auto align-middle border-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        }

      </div>
    </>
  );
};

export default MediaView;
