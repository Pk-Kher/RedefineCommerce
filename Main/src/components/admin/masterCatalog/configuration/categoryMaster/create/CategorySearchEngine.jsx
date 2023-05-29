import React, { useState } from "react";
// import { NavLink } from "react-router-dom";



const CategorySearchEngine = () => {



  return (
    <>
      <div className="w-full mb-6">
        <div className="flex items-center justify-between">
          <div className="block uppercase tracking-wide text-gray-500 text-base font-bold"> Search engine listing preview </div>
          <div className="flex shrink-0 -space-x-3 -ml-px">
            <a className="text-sm font-medium text-indigo-500 hover:text-indigo-600" href="#0"> Edit website SEO </a>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="flex flex-col h-full">
          <div className="grow mt-2">
            <h2 className="text-sm leading-snug font-semibold">Adeline Dress</h2>
            <a href="http://www.beautyswim.com/products/adeline-dress" className="inline-flex text-green-500 hover:text-green-600 mb-1">http://www.beautyswim.com/products/adeline-dress</a>
            <div className="text-sm">Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts.Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts.Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategorySearchEngine;
