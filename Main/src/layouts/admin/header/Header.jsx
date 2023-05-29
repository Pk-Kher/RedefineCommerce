import React from "react";

import UserMenu from "layouts/admin/header/UserMenu";
import { useSelector } from "react-redux";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const companyInfo = useSelector(store => store.CompanyConfiguration);
  return (
    <header className="fixed top-0 bg-white border-b border-neutral-200 h-fit w-full shadow-hb z-30">
      <div className="px-4 sm:px-4 lg:px-4">
        <div className="flex items-center justify-between h-16 -mb-px">
          <div className="flex">
            {/* Hamburger button */}
            <button
              className="mr-4 text-gray-500 hover:text-gray-600 lg:hidden"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={() => {
                setSidebarOpen(!sidebarOpen);
              }}
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x={4} y={5} width={16} height={2} />
                <rect x={4} y={11} width={16} height={2} />
                <rect x={4} y={17} width={16} height={2} />
              </svg>
            </button>
          </div>
          {/* Header: Logo */}
          <a className="inline-block lg:ml-10 min-w-[100px]" href="/">
            <img className="h-[48px] max-h-[48px] " src={companyInfo.headerLogo} alt="" />
          </a>
          <div className="relative w-full pr-6 lg:ml-12">
            <div className="absolute h-10 mt-0 left-0 top-0 flex items-center">
              {/* <svg
                className="h-4 pl-4 fill-current text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
              </svg> */}
            </div>
            {/* <input
              type="search"
              placeholder="search"
              className="block w-full bg-[#f7f7fa] border-neutral-200 hover:border-neutral-300 focus:border-neutral-100 focus:ring-neutral-300 focus:shadow-lg pl-10 pr-2 py-2 rounded-md"
            /> */}
          </div>
          {/* Header: Right side */}
          <div className="flex items-center space-x-3">
            {/* Divider */}
            <hr className="w-px h-6 bg-slate-200" />
            {/* User button */}
            <div className="relative inline-flex" x-data="{ open: false }">
              <UserMenu align="right" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
