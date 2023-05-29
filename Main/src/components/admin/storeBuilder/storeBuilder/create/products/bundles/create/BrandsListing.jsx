import React, { useState, useEffect, useMemo } from 'react';
import StoreBuilderProductsService from "services/admin/storeBuilderProducts/StoreBuilderProductsService";

const BrandsListing = (props) => {
   const parentStoreID = props.parentStoreID;
   const [displayBrandsListing, setDisplayBrandsListing] = useState(false);
   const [brands, setBrands] = useState([]);
   const [search, setSearch] = useState("");
   const [selectedBrands, setSelectedBrands] = useState({ product_brands:[], response:[] });

   useEffect(() => {
      StoreBuilderProductsService.getBrandsByStore(parentStoreID)
      .then((res) => {
         if (res.data.success) {
           setBrands(res.data.data);
         }
      })
   }, [parentStoreID]);
   
   const filteredBrands = useMemo(() => {
      if (search) {
         return brands.filter(
            (brand) => brand.brandName.toLowerCase().indexOf(search.toLocaleLowerCase()) > -1
         );
      }
      return brands;
   });

   function resetBrands() {
      setSelectedBrands({ product_brands:[], response:[] });
      let brandCheckboxes = document.getElementsByClassName("brand-checks");
      if (brandCheckboxes.length > 0) {
         for (let i = 0; i <= brandCheckboxes.length; i++) {
            brandCheckboxes[i].checked = false;
         }
      }
   }

   const getSelectedBrandValues = (e) => {
      // Destructuring
      const { value, checked } = e.target;
      const { product_brands } = selectedBrands;
      
      if (checked) {
         // Case 1 : The user checks the box
         setSelectedBrands({
            product_brands: [...product_brands, value],
            response: [...product_brands, value],
         });
      } else {
         // Case 2 : The user unchecks the box
         setSelectedBrands({
            product_brands: product_brands.filter((e) => e !== value),
            response: product_brands.filter((e) => e !== value),
         });
      }
   };

   const fetchProductsByBrands = () => {
      if (selectedBrands.product_brands.length == 0) {
         alert('Please select atleast one brand to fetch the products');
         return;
      }
      setDisplayBrandsListing(false);
      props.setSelectedBrandValues(selectedBrands.product_brands.toString());
      props.setDisplayAddProducts(true);
      setSelectedBrands({ product_brands:[], response:[] });
   }
   
   return (
      <div className="inline-flex rounded-md shadow-sm" role="group">
         <div className="relative inline-flex">
            <button
            className="flex flex-wrap items-center text-sm px-3 py-2 bg-white border border-neutral-200 text-gray-500 hover:text-gray-700 rounded-md"
            onClick={
               () => setDisplayBrandsListing(!displayBrandsListing)
            }>
               {displayBrandsListing ? (
               <span className="material-icons-outlined">filter_alt_off</span>
               ) : (
               <span className="material-icons-outlined">filter_alt</span>   
               )}
               <span className="ml-1">Select Brand</span>
            </button>
            {displayBrandsListing && (
            <div className="origin-top-left z-30 absolute top-full max-h-96 h-screen overflow-y-auto left-0 min-w-72 bg-white border border-neutral-200 rounded shadow-lg overflow-hidden mt-1">
               <ul className="">
                  <li className="py-1 px-3 sticky top-0 bg-white border-b border-neutral-200">
                     <div className="relative w-full">
                        <div className="absolute h-10 mt-0 left-0 top-0 flex items-center">
                        <svg className="h-4 pl-4 fill-current text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                           <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"> </path>
                        </svg>
                        </div>
                        <input type="search" placeholder="search" value={search}
                        className="block w-full bg-[#f7f7fa] border-neutral-200 hover:border-neutral-300 focus:border-neutral-100 focus:ring-neutral-300 focus:shadow-lg pl-10 pr-2 py-2 rounded-md"
                        onChange={e => setSearch(e.target.value)} />
                     </div>
                  </li>
                  {filteredBrands.length > 0 ? (
                     filteredBrands && filteredBrands.map(
                        brandsListItem => (
                           <li key={brandsListItem.id} className="py-1 px-3">
                              <label className="flex items-center">
                                 <input name="product_brands" type="checkbox"
                                 className="form-checkbox brand-checks"
                                 value={brandsListItem.id}
                                 onChange={getSelectedBrandValues} />
                                 <span className="text-sm font-medium ml-2">{brandsListItem.brandName}</span>
                              </label>
                           </li>
                        )
                     )
                  ) : <li className="py-1 px-3">No brand available</li>}
               </ul>
               <div className="py-2 px-3 border-t border-neutral-200 bg-slate-50 sticky bottom-0">
                  <ul className="flex items-center justify-between">
                     <li>
                        <button
                        className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
                        onClick={resetBrands}>
                           Clear
                        </button>
                     </li>
                     <li>
                        <button
                        className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                        onClick={fetchProductsByBrands}>
                           Apply
                        </button>
                     </li>
                  </ul>
               </div>
            </div>
            )}
         </div>
      </div>
   )
}

export default BrandsListing