import React from 'react';
import CKEditorFour from "components/common/formComponent/CKEditor";

const BasicInformationTab = () => {
  
   return (
      <div className="panel-01 tab-content p-6">
         <div className="w-full mb-6 last:mb-0">
            <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
            Bundle Name
            <span className="text-rose-500 text-2xl leading-none">*</span>
            </label>
            <input className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md" type="text" placeholder="" value="" />
         </div>
         <div className="mb-6 last:mb-0">
            <div className="mb-6 last:mb-0">
            <label className="text-gray-500 inline-flex items-center">
               <input type="checkbox" className="form-checkbox" id="different_Name" x-model="checked" />
               <span className="ml-2">Our ERP / NAV will have different Name from Above Name</span>
            </label>
            </div>
            <div className="w-full mb-6 last:mb-0 hidden">
            <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
               ERP Name / NAV Name
               <span className="text-rose-500 text-2xl leading-none">*</span>
            </label>
            <input className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md" type="text" value="" />
            </div>
         </div>
         <div className="mb-6 last:mb-0">
            <div className="mb-6 last:mb-0">
            <label className="text-gray-500 inline-flex items-center">
               <input type="checkbox" className="form-checkbox" id="Existing_ID" x-model="checked" />
               <span className="ml-2">This item has and Existing ID in our ERP / NAV</span>
            </label>
            </div>
            <div className="w-full mb-6 last:mb-0 hidden">
            <label className="block up tracking-wide text-gray-500 text-xs font-bold mb-2">ERP / NAV Item ID</label>
            <input className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md" type="text" value="" />
            </div>
         </div>
         <div className="w-full mb-6 last:mb-0">
            <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
            OUR SKU
            <span className="text-rose-500 text-2xl leading-none">*</span>
            </label>
            <input type="text" className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md" value="" />
         </div>
         <div className="w-full mb-6 last:mb-0">
            <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
            Product Type
            <span className="text-rose-500 text-2xl leading-none">*</span>
            </label>
            <select className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md pr-10">
            <option>Select Product Sub Type</option>
            <option>Decorated</option>
            <option>FG</option>
            <option>Blank</option>
            </select>
         </div>
         <div className="w-full mb-6 last:mb-0">
            <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
            Tax Code
            <span className="text-rose-500 text-2xl leading-none">*</span>
            <a href="javascript:void(0);" className="ml-4 normal-case font-normal underline text-xs">Click here to find tax code</a>
            </label>
            <input className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md" type="text" value="" />
         </div>
         <div className="w-full mb-6 last:mb-0 pt-6">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
            Description
            <span className="text-rose-500 text-2xl leading-none">*</span>
            </label>
            <CKEditorFour
               name={"description"}
               defaultValue={"Made of 100% polyester fleece with sweater-knit face, fleece interior and heathered yarns; dyed with a low-impact process that significantly reduces the use of dyestuffs, energy and water compared to conventional dyeing methods Full-zip with zip-through stand-up collar Raglan sleeves for mobility and pack-wearing comfort Zippered left-chest pocket; two zippered handwarmer pockets Shape-holding micropolyester jersey trim at cuffs and bottom hem provides added abrasion resistance Flat-seam construction reduces bulk and helps eliminate seam chafe Hip length"}
            />
         </div>
         <div className="w-full mb-6 last:mb-0">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
            Short Description
            <span className="text-rose-500 text-2xl leading-none"></span>
            </label>
            <textarea name="description01" id="editor" className="bg-gray-500 border border-neutral-200 rounded">
            "Made of 100% polyester fleece with sweater-knit face, fleece interior and heathered yarns; dyed with a low-impact process that significantly reduces the use of dyestuffs, energy and water compared to conventional dyeing methods Full-zip with zip-through stand-up collar Raglan sleeves for mobility and pack-wearing comfort Zippered left-chest pocket; two zippered handwarmer pockets Shape-holding micropolyester jersey trim at cuffs and bottom hem provides added abrasion resistance Flat-seam construction reduces bulk and helps eliminate seam chafe Hip length"
            </textarea>
         </div>
         <div className="pt-6">
            <div className="flex items-center flex-wrap gap-4 mb-6">
            <div className="w-full md:w-auto">
               <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Our Cost
                  <span className="text-rose-500 text-2xl leading-none">*</span>
               </div>
               <div className="relative grow">
                  <div className="absolute w-10 h-10 mt-0 left-0 top-0 flex items-center justify-center">
                  <span className="material-icons-outlined">attach_money</span>
                  </div>
                  <input type="text" placeholder="00.00" className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md pl-10" value="69.50" />
               </div>
            </div>
            <div className="w-full md:w-auto">
               <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  MSRP
                  <span className="text-rose-500 text-2xl leading-none">*</span>
               </div>
               <div className="relative grow">
                  <div className="absolute w-10 h-10 mt-0 left-0 top-0 flex items-center justify-center">
                  <span className="material-icons-outlined">attach_money</span>
                  </div>
                  <input type="text" placeholder="00.00" className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md pl-10" value="139.00" />
               </div>
            </div>
            <div className="w-full md:w-auto">
               <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  IMAP
                  <span className="text-rose-500 text-2xl leading-none"></span>
               </div>
               <div className="relative grow">
                  <div className="absolute w-10 h-10 mt-0 left-0 top-0 flex items-center justify-center">
                  <span className="material-icons-outlined">attach_money</span>
                  </div>
                  <input type="text" placeholder="00.00" className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md pl-10" value="139.00" />
               </div>
            </div>
            <div className="w-full md:w-auto">
               <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Sale Price
                  <span className="text-rose-500 text-2xl leading-none">*</span>
               </div>
               <div className="relative grow">
                  <div className="absolute w-10 h-10 mt-0 left-0 top-0 flex items-center justify-center">
                  <span className="material-icons-outlined">attach_money</span>
                  </div>
                  <input type="text" placeholder="00.00" className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md pl-10" value="139.00" />
               </div>
            </div>
            </div>
            <div className="mb-6">
            <div>
               <label className="text-gray-500 inline-flex items-center">
                  <input type="checkbox" className="form-checkbox" id="" x-model="checked" checked="checked" />
                  <span className="ml-2">Is Gift Wrap</span>
               </label>
            </div>
            <div className="w-full mb-6 last:mb-0">
               <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                  Gift Wrap Price
                  <span className="text-rose-500 text-2xl leading-none">*</span>
               </label>
               <div className="relative grow">
                  <div className="absolute w-10 h-10 mt-0 left-0 top-0 flex items-center justify-center">
                  <span className="material-icons-outlined">attach_money</span>
                  </div>
                  <input className="block max-w-[230px] w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md" type="text" value="" />
               </div>
            </div>
            </div>
            <div className="mb-6">
            <label className="text-gray-500 inline-flex items-center">
               <input type="checkbox" className="form-checkbox" checked="checked" />
               <span className="ml-2">Call for Price</span>
            </label>
            </div>
            <div className="mb-6">
            <label className="text-gray-500 inline-flex items-center">
               <input type="checkbox" className="form-checkbox" checked="checked" />
               <span className="ml-2">Enable (MAP) Minimum Advertised Price</span>
            </label>
            </div>
         </div>
         <div className="mb-6 last:mb-0 pt-6">
            <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Search Dimension Template</div>
            <div className="flex items-center">
            <div className="relative grow">
               <div className="absolute w-10 h-10 mt-0 left-0 top-0 flex items-center justify-center">
                  <span className="material-icons-outlined">search</span>
               </div>
               <input id="search-toggle" type="Search" placeholder="search" className="block w-full bg-[#f7f7fa] border-neutral-200 hover:border-neutral-300 focus:border-neutral-100 focus:ring-neutral-300 focus:shadow-lg pl-10 pr-2 py-2 rounded-md" onkeyup="updateSearchResults(thir.value)" />
            </div>
            </div>
         </div>
         <div className="flex items-center mb-6">
            <div className="relative grow">
            <input type="text" placeholder="" className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md" value="10" />
            </div>
            <div className="mx-2">X</div>
            <div className="relative grow">
            <input type="text" placeholder="" className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md" value="10" />
            </div>
            <div className="mx-2">X</div>
            <div className="relative grow">
            <input type="text" placeholder="" className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md" value="10" />
            </div>
            <div className="mx-2">=</div>
            <div className="relative grow">
            <input type="text" placeholder="" className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md" value="10" />
            </div>
         </div>
         <div className="grid grid-cols-1 lg:grid-cols-2 lg:space-x-6">
            <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
               Weight (LBS)
               <span className="text-rose-500 text-2xl leading-none"></span>
            </label>
            <input className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md" type="text" value="1.0" />
            </div>
            <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
               Ship Weight (LBS)
               <span className="text-rose-500 text-2xl leading-none"></span>
            </label>
            <input className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md" type="text" value="1.0" />
            </div>
         </div>  
      </div>
   )
}

export default BasicInformationTab