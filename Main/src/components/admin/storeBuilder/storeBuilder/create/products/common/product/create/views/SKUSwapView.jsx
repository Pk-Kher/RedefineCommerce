/*Component Name: SKUSwapView.jsx
Component Functional Details: Basic Information tab field display
Created By: Vikas Patel
Created Date: 11-May-2022
Modified By: Shrey Patel
Modified Date: June/23/2022 */
import React, { useState } from "react";

const SKUSwapView = ({
  displayFieldElement,
  fetchFieldProperty,
  fields,
  values,
  requiredFields,
  tab,
  setActiveTab,
  index,
}) => {
  return (
    <>
      <div className="px-6 py-12 border-b-4 border-neutral-200 last:border-b-0">
        <div className="flex items-center justify-between">
          <div className="block uppercase tracking-wide text-gray-500 text-base font-bold ">
            <div
              className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2">
              {tab.label}
            </div>
          </div>
          <div className="">
            <span
              className="text-indigo-500 cursor-pointer"
              onClick={() => {
                setActiveTab(index);
              }}
            >
              Edit
            </span>
          </div>
        </div>

        <div className="overflow-x-auto max-h-screen mt-4 border-t border-neutral-200">
          <table className="table-auto w-full text-sm text-[#191919] font-semibold">
            <thead className="text-sm font-bold uppercase text-[#b3b3b3] border-b border-neutral-200">
              <tr>
                <th className="pt-4 py-3">
                  <div className="font-semibold text-left w-screen max-w-sm flex items-center">
                    <span className="first:pl-5">Old SKU</span>
                    <div className="flex flex-col pl-2">
                      <span className="material-icons-outlined text-sm h-2 leading-[10px]">
                        keyboard_arrow_up
                      </span>
                      <span className="material-icons-outlined  text-sm  h-2 leading-[10px]">
                        keyboard_arrow_down
                      </span>
                    </div>
                  </div>
                </th>
                <th className="pt-4 py-3">
                  <div className="font-semibold text-left w-screen max-w-sm flex items-center">
                    <span className="first:pl-5">New SKU</span>
                    <div className="flex flex-col pl-2">
                      <span className="material-icons-outlined text-sm h-2 leading-[10px]">
                        keyboard_arrow_up
                      </span>
                      <span className="material-icons-outlined  text-sm  h-2 leading-[10px]">
                        keyboard_arrow_down
                      </span>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="col-span-outlined text-right">
              <tr>
                {displayFieldElement(fields, "ourSKU") && (
                  <>
                    <td className="px-2 py-3">
                      <div className="flex items-center">
                        <span className="grow ml-3 text-left">
                          {values?.ourSKU}
                        </span>
                      </div>
                    </td>
                  </>
                )}
                {displayFieldElement(fields, "newsku") && (
                  <>
                    <td className="px-2 py-3">
                      <div className="flex items-center">
                        <span className="grow ml-3 text-left">
                          {values?.newSKU}
                        </span>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default SKUSwapView;
