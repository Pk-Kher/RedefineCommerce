/*Component Name: InventoryView.jsx
Component Functional Details: Inventory tab field display
Created By: Vikas Patel
Created Date: 11-May-2022
Modified By: Happy Patel
Modified Date: 10/10/2022*/

import { productType } from 'dummy/Dummy';
import React, { useState, useCallback } from 'react';
import { useEffect } from 'react';
import { Fragment } from 'react';
import MasterInventoryService from 'services/admin/masterCatalog/masterCatalog/products/InventoryService';
import StoreInventoryService from 'services/admin/masterCatalog/store/product/InventoryService';
import { DateTimeFormat, scrollTop } from 'services/common/helper/Helper';
import { defaultImage } from 'global/Enum';

const InventoryView = ({ displayFieldElement, type, productId, readOnly, fields, values, requiredFields, tab, setActiveTab, index }) => {
  const [APIData, setAPIData] = useState([]);
  readOnly = true
  const API = (type == productType.MC ? MasterInventoryService : StoreInventoryService)
  const getInventoryData = useCallback(() => {

    API.getInventory(productId, 0)
      .then((res) => {
        var response = res.data;
        setAPIData(response.data);
      })
      .catch((err) => { });

  }, [productId]);

  useEffect(() => {
    getInventoryData()
  }, [productId])

  const [FutureInventoryLength, setFutureInventoryLength] = useState([]);

  useEffect(() => {
    setFutureInventoryLength(() => {
      var temp = [];
      APIData?.map((value) => {
        value.subRows.map((subRow) => {
          if (temp.length < subRow.futureInventoryList.length) {
            temp = subRow.futureInventoryList;
          }
        });
        return temp;
      });
      return temp.length > 0 ? temp : [1];
    });
  }, [APIData]);

  return (
    <>
      <div className="px-6 py-12 border-b-4 border-neutral-200 last:border-b-0">
        <div className='flex items-center justify-between'>
          <div className='block uppercase tracking-wide text-gray-500 text-base font-bold mb-2'>
            {tab.label}
          </div>
          <div >
            <span className="text-indigo-500 cursor-pointer" onClick={() => { setActiveTab(index); scrollTop(); }}>Edit</span>
          </div>
        </div>

        <div className="pb-5">
          <div className="overflow-auto max-h-[560px] border-t border-neutral-200 mt-5">
            <table className="table-auto w-full text-sm text-[#191919] font-semibold h-px">
              <thead className="text-sm font-bold uppercase text-[#b3b3b3] border-b border-neutral-200">
                <tr className="relative">
                  <th className="h-full">
                    <div className="flex items-center h-full px-2 py-3 border-r border-neutral-200">
                      {" "}
                    </div>
                  </th>

                  <th className=" h-full px-2 py-3 border-r border-neutral-200" colSpan="2">
                    <div className="font-semibold text-left flex w-48 items-center">
                      <span>Variants</span>
                    </div>
                  </th>
                  <th className=" h-full px-2 py-3 border-r border-neutral-200">
                    <div className="font-semibold text-left flex w-48 items-center">
                      <span>SKU</span>
                    </div>
                  </th>
                  <th className="h-full px-2 py-3 border-r border-neutral-200 relative">
                    <div className="font-semibold text-left flex w-48 max-w-md items-center ">
                      {!readOnly && <span
                        onClick={() =>
                          setFutureInventoryLength((prev) => [
                            1,
                            ...prev,
                          ])
                        }
                        className="cursor-pointer absolute -right-2.5 top-0 bg-indigo-500 rounded-md text-white w-5 h-5 inline-flex items-center justify-center"
                      >
                        <span className="material-icons-outlined text-sm">
                          add
                        </span>
                      </span>}
                      <span>QUantity</span>
                    </div>
                  </th>
                  {FutureInventoryLength.map((value, index) => {
                    return (
                      <Fragment key={index}>
                        <th className="h-full px-2 py-3 border-r border-neutral-200">
                          <div className="font-semibold text-left flex w-72 max-w-md items-center ">
                            <span>Future Inventory Date</span>
                          </div>
                        </th>
                        <th className="h-full px-2 py-3 border-r border-neutral-200">
                          <div className="font-semibold text-left flex w-56 max-w-md items-center relative ">
                            <span>Future Inventory</span>
                          </div>
                        </th>
                      </Fragment>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {APIData?.map((inventory, index) => {
                  return (
                    <TR
                      displayFieldElement={displayFieldElement}
                      fields={fields}
                      inventory={inventory}
                      index={index}
                      key={index}
                      defaultImage={defaultImage}
                      FutureInventoryLength={FutureInventoryLength}
                      readOnly={readOnly}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default InventoryView;

const TR = ({
  inventory,
  index,
  FutureInventoryLength,
  SelectedVendor,
  readOnly,
  defaultImage
}) => {
  const [showChild, setShowChild] = useState(false);
  return (
    <>
      <tr role={`row`}>
        <td className="px-2 first:pl-5 py-3">
          <div >
            <div
              className="leading-none w-6 h-6 cursor-pointer transition-all variant-arrow"
              onClick={() => {
                setShowChild((prev) => !prev);
              }}
            >
              <span className="material-icons-outlined select-none">
                {showChild ? "remove" : "add"}
              </span>
            </div>
          </div>
        </td>
        <td className="px-2 first:pl-5 py-3">
          <div className="h-10 w-10 flex items-center justify-center overflow-hidden">
            <img
              className="max-h-full"
              src={inventory.varientImage ? `${process.env.REACT_APP_API_BLOB}${inventory.varientImage}` : { defaultImage }}
            />
          </div>
        </td>
        <td className="px-2 first:pl-5 py-3">
          <div >
            <a href="mc-add-options.html" className="font-medium leading-10">
              {inventory.varientName}
            </a>
          </div>
        </td>

        <td className="px-2 first:pl-5 py-3">
          <div >
            {inventory.sku}
          </div>
        </td>
        <td className="px-2 first:pl-5 py-3">
          <div ></div>
        </td>
        <td className="px-2 first:pl-5 py-3">
          <div ></div>
        </td>
        <td className="px-2 first:pl-5 py-3">
          <div ></div>
        </td>
      </tr>
      {showChild && (
        <>
          {inventory.subRows.map((value, index) => {
            return (
              <>
                <tr key={index}>
                  <td className="px-2 first:pl-5 py-3">
                    {" "}
                    <div > </div>{" "}
                  </td>
                  <td className="px-2 first:pl-5 py-3">
                    <div className="h-10 w-10 flex items-center justify-center overflow-hidden">
                      <img
                        className="max-h-full"
                        src={value.varientImage ? `${process.env.REACT_APP_API_BLOB}${value.varientImage}` : { defaultImage }}
                      />
                    </div>
                  </td>
                  <td className="px-2 first:pl-5 py-3">
                    <div >
                      <span className="font-medium leading-10">
                        {value.varientName}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 first:pl-5 py-3">
                    <span className="font-semibold leading-10">
                      {value.sku}
                    </span>
                  </td>
                  <td className="px-2 first:pl-5 py-3">
                    <div >
                      {readOnly || SelectedVendor == 0 ? (value.quantity) : ''}
                    </div>
                  </td>
                  {FutureInventoryLength.map((v, index) => {
                    return (
                      <Fragment key={index}>
                        <>
                          <td className="px-2 first:pl-5 py-3">
                            <div >
                              {(readOnly && (value.futureInventoryList[index]) ?
                                DateTimeFormat(value.futureInventoryList[index].futureInventryDate) : '').date}
                            </div>
                          </td>
                          <td className="px-2 first:pl-5 py-3">
                            <div >
                              {(readOnly && value.futureInventoryList[index]) &&
                                (value.futureInventoryList[index].futureInventryQty)
                              }
                            </div>
                          </td>

                        </>
                      </Fragment>
                    );
                  })}
                </tr>
              </>
            );
          })}
        </>
      )}
    </>
  );
};
