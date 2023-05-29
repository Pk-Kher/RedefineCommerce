import React, { useState, useRef } from 'react'
import BrandsListing from "./create/BrandsListing";
import AddProductsListing from "./create/AddProductsListing";
import StoreProductTab from "./StoreProductTab";
import ProductBundleTab from "./ProductBundleTab";
import { NavLink, useParams } from "react-router-dom";

const Product = ({isAddMode, setFormSubmit, index, activeTab, generalTabData, setactiveTab, setLoading}) => {
   const [displayAddProducts, setDisplayAddProducts] = useState(false);
   const [displayStoreProductTab, setDisplayStoreProductTab] = useState(true);
   const [displayProductBundleTab, setDisplayProductBundleTab] = useState(false);
   const [selectedBrandValues, setSelectedBrandValues] = useState(null);
   const { id } = useParams();
   const parentStoreID = generalTabData.parentid;
   const childRef = useRef(null);

   return (
      <div className="panel-04 tab-content">
         <div className="bg-white rounded-md shadow-xxl p-6 mb-6">
            <div className="w-full">
               <div className="w-full flex flex-wrap sm:auto-cols-max justify-between gap-2">
                  <BrandsListing setDisplayAddProducts={setDisplayAddProducts} parentStoreID={parentStoreID} setSelectedBrandValues={setSelectedBrandValues} />
                  <div className="relative grow">
                     <div className="absolute h-10 mt-0 left-0 top-0 flex items-center">
                        <svg className="h-4 pl-4 fill-current text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                           <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"> </path>
                        </svg>
                     </div>
                     <input type="search" placeholder="search" className="block w-full bg-[#f7f7fa] border-neutral-200 hover:border-neutral-300 focus:border-neutral-100 focus:ring-neutral-300 focus:shadow-lg pl-10 pr-2 py-2 rounded-md" /> 
                  </div>
                  <div className="flex flex-wrap space-x-2">
                     <NavLink to={"/admin/StoreBuilder/"  + id + "/bundle/create"} className="btn bg-indigo-500 hover:bg-indigo-600 text-white">Create Bundle</NavLink>
                  </div>
               </div>
               {displayAddProducts &&
                  <AddProductsListing selectedBrandValues={selectedBrandValues} parentStoreID={parentStoreID} childRef={childRef} setDisplayAddProducts={setDisplayAddProducts} />
               }
            </div>
         </div>
         <div className="bg-white shadow-xxl rounded-md mb-8">
            <div className="w-full bg-white shadow-xxl rounded-md mb-8 pt-8">
               <ul className="w-full flex border-b border-b-neutral-200">
                  <li className="pl-6 cursor-pointer" onClick={
                     () => {
                        setDisplayStoreProductTab(true);
                        setDisplayProductBundleTab(false);
                     }
                  }>
                     {displayStoreProductTab ?
                     <span className="tab py-4 block hover:text-black focus:outline-none text-black border-b-2 font-bold border-red-500">Store Product</span>
                     :
                     <span className="tab bg-transparent text-[#BDBDC2] py-4 block hover:text-red-500 focus:outline-none border-b-2 rounded-sm font-bold border-transparent hover:border-red-500">Store Product</span> 
                     }
                  </li>
                  <li className="pl-6 cursor-pointer" onClick={
                     () => {
                        setDisplayStoreProductTab(false);
                        setDisplayProductBundleTab(true);
                     }
                  }>
                     {displayProductBundleTab ?
                     <span className="tab py-4 block hover:text-black focus:outline-none text-black border-b-2 font-bold border-red-500">Product Bundle</span>
                     :
                     <span className="tab bg-transparent text-[#BDBDC2] py-4 block hover:text-red-500 focus:outline-none border-b-2 rounded-sm font-bold border-transparent hover:border-red-500">Product Bundle</span> 
                     }
                  </li>
               </ul>
               <div className="w-full">
                  {displayStoreProductTab && 
                     <StoreProductTab ref={childRef} parentStoreID={parentStoreID} />
                  }
                  {displayProductBundleTab &&
                  <ProductBundleTab />
                  }
               </div>
            </div>
         </div>
      </div>
   )
}

export default Product