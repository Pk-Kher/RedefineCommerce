/*Component Name: PricingView.jsx
Component Functional Details: Basic Information tab field display
Created By: Vikas Patel
Created Date: 11-May-2022
Modified By: chandan
Modified Date: 06/07/2022 */
import Select from "components/common/formComponent/Select";
import { CurrencySymbolByCode } from "global/Enum";
import React, { useState, useEffect, useCallback, useRef } from "react";
import DiscountDetailsService from "services/admin/quantityDiscount/DiscountDetailsService";
import DropdownService from "services/common/dropdown/DropdownService";
import { scrollTop } from "services/common/helper/Helper";

const PricingView = ({
  displayFieldElement,
  fetchFieldProperty,
  fields,
  values,
  requiredFields,
  tab,
  setActiveTab,
  index,
}) => {
  const [discountData, setDiscountData] = useState([]);
  let [quantityId, setQuantityId] = useState(values?.quantityDiscountTemplate);
  const [quantityOptions, setQuantityOptions] = useState([])

  const getDiscountsDetails = useCallback(() => {
    if (quantityId) {
      DiscountDetailsService.getDiscountsDetail(quantityId, {
        pageIndex: 0,
        pageSize: 100,
        pagingStrategy: 0,
        sortingOptions: [
          {
            field: "modifiedDate",
            direction: 0,
            priority: 0,
          },
        ],
        filteringOptions: [
          {
            field: "string",
            operator: 0,
            value: "string",
          },
        ],
      })
        .then((response) => {
          if (response.data.success) {

            setDiscountData(response.data.data.items);
          }
        })
        .catch((err) => { });
    }

  }, [quantityId]);

  useEffect(() => {
    getDiscountsDetails();
  }, [quantityId, getDiscountsDetails]);

  useEffect(() => {
    DropdownService.getDropdownValues("quantitydiscount").then((response) => {
      setQuantityOptions(() => {
        return response.data.data;
      });
    });
  }, []);
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


        <div className="px-6 py-12 border-b-2 border-neutral-200 last:border-b-0">
          <div className="mb-6 last:mb-0 grid grid-cols-3 gap-4 items-center">
            <label className="col-span-1 text-xs font-semibold text-gray-500 uppercase">
              Our Cost
              <span className="text-rose-500 text-2xl leading-none">*</span>:
            </label>
            <div className="col-span-2">{values?.ourCost ? CurrencySymbolByCode.USD + values?.ourCost : '-'}</div>
          </div>
          <div className="mb-6 last:mb-0 grid grid-cols-3 gap-4 items-center">
            <label className="col-span-1 text-xs font-semibold text-gray-500 uppercase">
              MSRP <span className="text-rose-500 text-2xl leading-none">*</span>:
            </label>
            <div className="col-span-2">{values?.msrp ? CurrencySymbolByCode.USD + values?.msrp : '-'}</div>
          </div>
          <div className="mb-6 last:mb-0 grid grid-cols-3 gap-4 items-center">
            <label className="col-span-1 text-xs font-semibold text-gray-500 uppercase">
              IMAP <span className="text-rose-500 text-2xl leading-none"></span>:
            </label>
            <div className="col-span-2">{values?.imap ? CurrencySymbolByCode.USD + values?.imap : '-'}</div>
          </div>
          {/* <div className="mb-6 last:mb-0 grid grid-cols-3 gap-4 items-center">
            <label className="col-span-1 text-xs font-semibold text-gray-500 uppercase">  
              Our Price
              <span className="text-rose-500 text-2xl leading-none"></span>:
            </label>
            <div className="col-span-2">{values?.ourPrice ? CurrencySymbolByCode.USD + values?.ourPrice : '-'}</div>
          </div> */}
          <div className="mb-6 last:mb-0 grid grid-cols-3 gap-4 items-center">
            <label className="col-span-1 text-xs font-semibold text-gray-500 uppercase">
              Sale Price
              <span className="text-rose-500 text-2xl leading-none">*</span>:
            </label>
            <div className="col-span-2">{values?.salePrice ? CurrencySymbolByCode.USD + values?.salePrice : '-'}</div>
          </div>
          <div className="mb-6 last:mb-0 grid grid-cols-3 gap-4 items-center">
            <label className="col-span-1 text-xs font-semibold text-gray-500 uppercase">
              Gift Wrap Price
              <span className="text-rose-500 text-2xl leading-none"></span>:
            </label>
            <div className="col-span-2">{values?.giftWrapPrice ? CurrencySymbolByCode.USD + values?.giftWrapPrice : '-'}</div>
          </div>
        </div>
        {displayFieldElement(fields, "quantityDiscountTemplate") && (
          <>
            <div className="w-full mt-6">
              <div className="block text-xs font-semibold text-gray-500 uppercase">
                {fetchFieldProperty("displayname", "quantityDiscountTemplate")}
              </div>
              <div className="flex pt-5">
                <div className="flex grow">
                  <Select
                    isMulti={false}
                    name={fetchFieldProperty("dbfield", "quantityDiscountTemplate")}
                    options={quantityOptions}
                    isSearchable={true}
                    defaultValue={values?.quantityDiscountTemplate}

                    isDisabled={true}
                    className="w-full pr-3"
                  />
                </div>
              </div>

            </div>

            <div className="mt-5">
              <div >
                {discountData.length > 0 && (
                  <table className="table-auto w-full text-sm text-[#191919] font-semibold">
                    <thead className="text-sm font-bold uppercase text-[#b3b3b3] border-b border-neutral-200 border-t">
                      <tr>
                        <th className="px-2 first:pl-5 py-4">
                          <div className="font-semibold text-left max-w-max flex items-center">
                            <span>Low Quantity</span>
                          </div>
                        </th>
                        <th className="px-2 first:pl-5 py-4">
                          <div className="font-semibold text-left max-w-max flex items-center">
                            <span>High Quantity</span>
                          </div>
                        </th>
                        <th className="px-2 first:pl-5 py-4">
                          <div className="font-semibold text-left flex items-center">
                            <span>Discount Percent</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {discountData.map((values, index) => {
                        return (
                          <tr key={index}>
                            <td className="px-2 first:pl-5 py-3">
                              {values.lowQuantity}
                            </td>
                            <td className="px-2 first:pl-5 py-3">
                              {values.highQuantity}
                            </td>
                            <td className="px-2 first:pl-5 py-3">
                              {values.discountPercent}%
                            </td>

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}

              </div>
            </div>
          </>)
        }

      </div>
    </>
  );
};

export default PricingView;
