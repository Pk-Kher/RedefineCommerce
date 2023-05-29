/*Component Name: FacetView.jsx
Component Functional Details: Basic Information tab field display
Created By: Vikas Patel
Created Date: 11-May-2022
Modified By: Shrey Patel
Modified Date: June/22/2022 */
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import FacetService from "services/admin/masterCatalog/store/product/FacetService";

const FacetView = ({
  displayFieldElement,
  fetchFieldProperty,
  fields,
  values,
  requiredFields,
  tab,
  setActiveTab,
  index,
}) => {
  const { id: productId } = useParams();
  const [data, setData] = useState([]);

  const GetFacetDataById = () => {
    FacetService.getFacetById(productId)
      .then((res) => {
        var FacetData = res?.data;
        if (FacetData?.success) {
          setData(FacetData?.data);
        }
      }).catch((err) => { });
  }

  useEffect(() => {
    GetFacetDataById()
  }, []);

  return (
    <>
      <div className="px-6 py-12 border-b-4 border-neutral-200 last:border-b-0">
        <div className="flex items-center justify-between">
          <div className="block uppercase tracking-wide text-gray-500 text-base font-bold ">
            <div
              className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2"
            >
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

        {(
          <div className="overflow-x-auto max-h-screen mt-4 border-t border-neutral-200">
            <table className="table-auto w-full text-sm text-[#191919] font-semibold">
              <thead className="text-sm font-bold uppercase text-[#b3b3b3] border-b border-neutral-200">
                <tr>
                  <th className="pt-4 py-3">
                    <div className="font-semibold text-left w-screen max-w-sm flex items-center">
                      <span className="first:pl-5">Attribute Name</span>
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
                      <span className="first:pl-5">Attribute Value</span>
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
              <tbody className="col-span-outlined text-left">
                {data.map((value, index) => {
                  return (
                    <tr key={index}>
                      <>
                        <td className="px-4  py-4">
                          <div className="w-full rounded-md border-neutral-200 hover:border-neutral-300 focus:border-neutral-100 focus:ring-neutral-300 focus:shadow-lg">
                            {displayFieldElement(fields, "attributename") && (value?.attributeName)}
                          </div>
                        </td>
                      </>
                      <>
                        <td className="px-4  py-4">
                          <div className="w-full rounded-md border-neutral-200 hover:border-neutral-300 focus:border-neutral-100 focus:ring-neutral-300 focus:shadow-lg">
                            {displayFieldElement(fields, "attributevalue") && (value?.attributevalue)}
                          </div>
                        </td>
                      </>
                      <td className="px-2 first:pl-5 py-3">
                        <div className="relative gap-2 text-left"></div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default FacetView;
