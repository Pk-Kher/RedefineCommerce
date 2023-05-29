import React, { useState } from 'react';
import BrandsListing from "./BrandsListing";
import AddProductsListing from "./AddProductsListing";

const ProductsTab = () => {
   const [displayAddProducts, setDisplayAddProducts] = useState(false);

   return (
      <div className="panel-03 tab-content">
         <div className="p-6" x-data="{filterID: 0}">
            <div className="w-full">
               <div className="w-full flex flex-wrap sm:auto-cols-max justify-between gap-2">
                  <BrandsListing setDisplayAddProducts={setDisplayAddProducts} />
                  <div className="relative grow">
                     <div className="absolute h-10 mt-0 left-0 top-0 flex items-center">
                        <svg className="h-4 pl-4 fill-current text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                           <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"> </path>
                        </svg>
                     </div>
                     <input type="search" placeholder="search" className="block w-full bg-[#f7f7fa] border-neutral-200 hover:border-neutral-300 focus:border-neutral-100 focus:ring-neutral-300 focus:shadow-lg pl-10 pr-2 py-2 rounded-md" /> 
                  </div>
               </div>
               {displayAddProducts &&
               <AddProductsListing />
               }
            </div>
         </div>
         <div className="">
            <div className="overflow-x-auto max-h-screen">
               <table className="table-auto w-full text-sm text-[#191919] font-semibold">
                  <thead className="text-sm font-bold uppercase text-[#b3b3b3] border-b border-neutral-200">
                     <tr>
                        <th className="px-2 first:pl-5 py-4">
                           <div className="font-semibold text-left max-w-20 flex items-center"> <span>Image</span> </div>
                        </th>
                        <th className="px-2 first:pl-5 py-4">
                           <div className="font-semibold text-left w-screen max-w-xs flex items-center">
                              <span>Name</span> 
                              <div className="flex flex-col pl-2"> <span className="material-icons-outlined text-sm h-2 leading-[10px]">keyboard_arrow_up</span> <span className="material-icons-outlined text-sm h-2 leading-[10px]">keyboard_arrow_down</span> </div>
                           </div>
                        </th>
                        <th className="px-2 first:pl-5 py-4">
                           <div className="font-semibold text-center w-28 flex items-center"> <span>QTY</span> </div>
                        </th>
                        <th className="px-2 first:pl-5 py-4">
                           <div className="font-semibold text-center w-28 flex items-center"> <span>Attribute</span> </div>
                        </th>
                        <th className="px-2 first:pl-5 py-4">
                           <div className="font-semibold text-center max-w-40 flex items-center justify-center"> <span>SKU</span> </div>
                        </th>
                        <th className="px-2 first:pl-5 py-4">
                           <div className="font-semibold text-center max-w-40 flex items-center justify-center"> <span>Sale Price</span> </div>
                        </th>
                        <th className="px-2 first:pl-5 py-4">
                           <div className="font-semibold text-center max-w-40 flex items-center justify-center"> <span>MSRP</span> </div>
                        </th>
                        <th className="px-2 first:pl-5 py-4">
                           <div className="font-semibold text-center max-w-32 flex items-center justify-center"> <span>Status</span> </div>
                        </th>
                        <th className="px-2 first:pl-5 py-4">
                           <div className="font-semibold text-center max-w-32 flex items-center justify-center"> <span>Action</span> </div>
                        </th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                     <tr className="">
                        <td className="px-2 first:pl-5 py-3">
                           <div className="flex items-center">
                              <div className="w-16 max-h-16 shrink-0 p-1 border border-neutral-200"> <img src="http://ystore.us/HTML/RedefineCommerce/Admin/images/stonewash.jpg" alt="" className="rounded-lg h-auto align-middle border-none" /> </div>
                           </div>
                        </td>
                        <td className="px-2 first:pl-5 py-3 group">
                           <div className="relative">
                              <div className="">Men's Patagonia Better Sweater Jacket</div>
                           </div>
                        </td>
                        <td className="px-2 first:pl-5 py-3 text-center">
                           <div className=""><input type="text" className="block w-20 bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-1 rounded-md" /></div>
                        </td>
                        <td className="px-2 first:pl-5 py-3">
                           <div className="">Stonewash</div>
                        </td>
                        <td className="px-2 first:pl-5 py-3 text-center">
                           <div className="">25528</div>
                        </td>
                        <td className="px-2 first:pl-5 py-3">
                           <div className="text-center">$139.00</div>
                        </td>
                        <td className="px-2 first:pl-5 py-3">
                           <div className="text-center">$139.00</div>
                        </td>
                        <td className="px-2 first:pl-5 py-3 text-center">
                           <div className="text-xs inline-block font-medium border border-green-300 bg-green-100 text-green-600 rounded-md text-center px-2.5 py-1 w-28">Active</div>
                        </td>
                        <td className="px-2 first:pl-5 py-3 text-center">
                           <div className="text-rose-500"><span className="material-icons-outlined cursor-pointer">close</span></div>
                        </td>
                     </tr>
                     <tr className="">
                        <td className="px-2 first:pl-5 py-3">
                           <div className="flex items-center">
                              <div className="w-16 max-h-16 shrink-0 p-1 border border-neutral-200"> <img src="http://ystore.us/HTML/RedefineCommerce/Admin/images/stonewash.jpg" alt="" className="rounded-lg h-auto align-middle border-none" /> </div>
                           </div>
                        </td>
                        <td className="px-2 first:pl-5 py-3 group">
                           <div className="relative">
                              <div className="">Men's Patagonia Better Sweater Jacket</div>
                           </div>
                        </td>
                        <td className="px-2 first:pl-5 py-3 text-center">
                           <div className=""><input type="text" className="block w-20 bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-1 rounded-md" /></div>
                        </td>
                        <td className="px-2 first:pl-5 py-3">
                           <div className="">Stonewash</div>
                        </td>
                        <td className="px-2 first:pl-5 py-3 text-center">
                           <div className="">25528</div>
                        </td>
                        <td className="px-2 first:pl-5 py-3">
                           <div className="text-center">$139.00</div>
                        </td>
                        <td className="px-2 first:pl-5 py-3">
                           <div className="text-center">$139.00</div>
                        </td>
                        <td className="px-2 first:pl-5 py-3 text-center">
                           <div className="text-xs inline-block font-medium border border-green-300 bg-green-100 text-green-600 rounded-md text-center px-2.5 py-1 w-28">Active</div>
                        </td>
                        <td className="px-2 first:pl-5 py-3 text-center">
                           <div className="text-rose-500"><span className="material-icons-outlined cursor-pointer">close</span></div>
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   )
}

export default ProductsTab