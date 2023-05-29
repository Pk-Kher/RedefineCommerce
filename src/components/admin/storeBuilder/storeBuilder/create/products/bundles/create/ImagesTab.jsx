import React from 'react'

const ImagesTab = () => {
  
   return (
      <div className="panel-02 tab-content p-6">
         <div className="overflow-x-auto max-h-screen border-t border-neutral-200 mt-6">
            <table className="table-auto w-full text-sm text-[#191919] font-semibold">
            <thead className="text-sm font-bold uppercase text-[#b3b3b3] border-b border-neutral-200 relative">
               <tr>
                  <th className="px-2 first:pl-5 py-4 w-px">
                  <div className="flex items-center">
                     <label className="inline-flex leading-none w-4 h-4 relative z-40">
                        <span className="sr-only">Select all</span>
                        <input id="parent-checkbox" className="form-checkbox" type="checkbox" />
                     </label>
                  </div>
                  </th>
                  <th className="px-2 first:pl-5 py-4">
                  <div className="font-semibold text-left w-40 max-w-sm flex items-center">
                     <span>Media</span>
                  </div>
                  </th>
                  <th className="px-2 first:pl-5 py-4">
                  <div className="font-semibold text-left w-screen max-w-xs flex items-center">
                     <span>Facet Color</span>
                  </div>
                  </th>
                  <th className="px-2 first:pl-5 py-4">
                  <div className="font-semibold text-center max-w-32 flex items-center justify-center">
                     <span>SKU</span>
                  </div>
                  </th>
               </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-200 border-b border-neutral-200">
               <tr className="main-parent">
                  <td className="px-2 first:pl-5 py-3 whitespace-nowrap w-px">
                  <div className="flex items-center">
                     <label className="inline-flex leading-none w-4 h-4">
                        <span className="sr-only">Select</span>
                        <input className="table-item form-checkbox" type="checkbox" />
                     </label>
                     <div className="leading-none ml-2 w-6 h-6 cursor-pointer transition-all variant-arrow" onclick="viewvariants(this)">
                        <span className="material-icons-outlined select-none">remove</span>
                     </div>
                     <span className="sort_icon cursor-pointer material-icons-outlined mr-2">drag_indicator</span>
                  </div>
                  </td>
                  <td className="px-2 first:pl-5 py-3">
                  <div className="flex -space-x-9 items-center relative">
                     <img className="w-20 h-20 rounded-full box-content" src="http://ystore.us/HTML/RedefineCommerce/Admin/images/1043570_25523_BLK.jpg" alt="" />
                     <span className="w-14 h-14 rounded-full box-content bg-neutral-200 inline-flex items-center justify-center">+2</span>
                  </div>
                  </td>
                  <td className="px-2 first:pl-5 py-3">
                  <div className="max-width-350 flex flex-wrap items-center">
                     <div className="inline-flex items-center justify-center mr-2 mb-2 rounded-full border-click w-10 h-10 border-2" style={{background: '#0b6623'}}></div>
                     <div className="inline-flex items-center justify-center mr-2 mb-2 rounded-full border-click w-10 h-10 border-2" style={{background: '#0b12bb'}}></div>
                     <div className="inline-flex items-center justify-center mr-2 mb-2 rounded-full border-click w-10 h-10 border-2" style={{background: '#c6c6c6'}}></div>
                     <div className="inline-flex items-center justify-center mr-2 mb-2 rounded-full border-click w-10 h-10 border-2" style={{background: '#9931ff'}}></div>
                     <div className="inline-flex items-center justify-center mr-2 mb-2 rounded-full border-click w-10 h-10 border-2" style={{background: '#ffbdd0'}}></div>
                     <div className="inline-flex items-center justify-center mr-2 mb-2 rounded-full border-click w-10 h-10 border-2" style={{background: '#000'}}></div>
                     <div className="inline-flex items-center justify-center mr-2 mb-2 rounded-full border-click w-10 h-10 border-2" style={{background: '#ff7f00'}}></div>
                     <div className="inline-flex items-center justify-center mr-2 mb-2 rounded-full border-click w-10 h-10 border-2" style={{background: '#70b6ff'}}></div>
                     <div className="inline-flex items-center justify-center mr-2 mb-2 rounded-full border-click w-10 h-10 border-2" style={{background: '#f4ff39'}}></div>
                     <div className="inline-flex items-center justify-center mr-2 mb-2 rounded-full border-click w-10 h-10 border-2" style={{background: '#964b00'}}></div>
                     <div className="inline-flex items-center justify-center mr-2 mb-2 rounded-full border-click w-10 h-10 border-2" style={{background: '#fff'}}></div>
                     <div className="inline-flex items-center justify-center mr-2 mb-2 rounded-full border-click w-10 h-10 border-2" style={{background: 'red'}}>
                        <span className="material-icons-outlined w-6 h-6 text-white">done</span>
                     </div>
                  </div>
                  </td>
                  <td className="px-2 first:pl-5 py-3">
                  <div>ABSHR1</div>
                  </td>
               </tr>
               <tr className="variants bg-slate-100">
                  <td className="px-2 first:pl-5 py-3" colSpan="4">
                  <div className="grid grid-cols-12 gap-3">
                     <div className="col-span-full lg:col-span-2 border-2 border-neutral-200 rounded-md shadow relative">
                        <img src="http://ystore.us/HTML/RedefineCommerce/Admin/images/1043570_25523_BLK.jpg" alt="" className="rounded-lg h-auto align-middle border-none w-full" />
                        <span className="absolute top-0 left-0 bg-rose-500 rounded text-white p-1">
                        <a href="javascript:void(0);">
                           <svg className="w-4 h-4 fill-current">
                              <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z"> </path>
                           </svg>
                        </a>
                        </span>
                     </div>
                     <div className="col-span-full lg:col-span-2 border-2 border-neutral-200 rounded-md shadow relative">
                        <img src="http://ystore.us/HTML/RedefineCommerce/Admin/images/1040617_25528_BLK.jpg" alt="" className="rounded-lg h-auto align-middle border-none w-full" />
                        <span className="absolute top-0 left-0 bg-rose-500 rounded text-white p-1">
                        <a href="javascript:void(0);">
                           <svg className="w-4 h-4 fill-current">
                              <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z"> </path>
                           </svg>
                        </a>
                        </span>
                     </div>
                     <div className="col-span-full lg:col-span-2 border-2 border-neutral-200 rounded-md shadow relative">
                        <img src="http://ystore.us/HTML/RedefineCommerce/Admin/images/1044671_25887_BLK.jpg" alt="" className="rounded-lg h-auto align-middle border-none w-full" />
                        <span className="absolute top-0 left-0 bg-rose-500 rounded text-white p-1">
                        <a href="javascript:void(0);">
                           <svg className="w-4 h-4 fill-current">
                              <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z"> </path>
                           </svg>
                        </a>
                        </span>
                     </div>
                     <div className="col-span-full lg:col-span-2 border-2 border-dashed border-neutral-200 rounded-md shadow">
                        <label for="add-product-img" className="w-full flex flex-wrap h-full items-center cursor-pointer">
                        <div className="w-full justify-center inset-0">
                           <div className="text-center">
                              <div className="btn bg-indigo-500 text-white justify-center">Add</div>
                              <input type="file" className="sr-only" name="" id="add-product-img" />
                           </div>
                        </div>
                        </label>
                     </div>
                  </div>
                  </td>
               </tr>
            </tbody>
            </table>
         </div> 
      </div>
   )
}

export default ImagesTab