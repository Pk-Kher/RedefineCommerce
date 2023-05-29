import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { StoreBuilderCreateSteps } from "dummy/Dummy";
import { useParams } from "react-router-dom";

import Setup from "./Setup";
import General from "./general/General";
import PaymentInfo from "./paymentInfo/PaymentInfo";
import Taxes from "./taxes/Taxes";
import Message from "./Message";
import Product from "./products/Product";
import Category from "../create/categories/Category";
//import Sequence from "./Sequence";
import StoreBuilderService from "services/admin/storeBuilder/StoreBuilderService";

import { useSelector } from "react-redux";

const Create = ({ mode }) => {
  const [FormSubmit, setFormSubmit] = useState(null);
  const [activeTab, setactiveTab] = useState(0);
  const [generalTabData, setgeneralTabData] = useState([]);
  const user = useSelector((store) => store.user);
  const { id } = useParams();
  const formRef = useRef();
  const isAddMode = !id;
  const GlobalLoading = useSelector(
    (store) => store?.GlobalLoaderReducer?.toLoad
  );

  const tabContent = {
    setup: Setup,
    general: General,
    paymentInfo: PaymentInfo,
    tax: Taxes,
    message: Message,
    product: Product,
    //sequence: Sequence,
    category: Category,
  };
  useEffect(() => {
    if (!isAddMode) {
      StoreBuilderService.getByStoreID({ storeid: id })
        .then((res) => {
          setgeneralTabData(res.data.data);
        })
        .catch(() => {});
    }
  }, []);

  return (
    <>
      <title>Add Store</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex mb-8 justify-between">
          <div className="flex items-center">
            <NavLink
              to={"/admin/StoreBuilder/store"}
              className="btn border-neutral-200 hover:border-neutral-400 text-gray-500 hover:text-gray-700 flex items-center mr-2"
            >
              <span className="material-icons-outlined">west</span>
            </NavLink>
            <div className="text-2xl md:text-3xl text-gray-800 font-bold">
              Add Store
            </div>
          </div>
          <div className="flex flex-wrap space-x-2">
            {isAddMode ? (
              <button
                className={`btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white`}
                onClick={(e) => FormSubmit.handleSubmit()}
              >
                {GlobalLoading && (
                  <span className="spinner-border spinner-border-sm mr-2"></span>
                )}
                Next
              </button>
            ) : (
              <>
                {activeTab != 0 ? (
                  <button
                    className={`btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white`}
                    onClick={() => setactiveTab((prev) => prev - 1)}
                  >
                    Previous
                  </button>
                ) : (
                  ""
                )}
                {activeTab < StoreBuilderCreateSteps.length - 1 ? (
                  <button
                    className={`btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white`}
                    onClick={(e) => FormSubmit.handleSubmit()}
                  >
                    {GlobalLoading && (
                      <span className="spinner-border spinner-border-sm mr-2"></span>
                    )}
                    Next
                  </button>
                ) : (
                  ""
                )}
                <NavLink
                  to={`/admin/store/configureStore/${id}`}
                  className="btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white"
                >
                  {"Save & Configure Store"}
                </NavLink>
                <NavLink
                  to={`/admin/MasterCatalog/theme/${id}`}
                  className="btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white"
                >
                  {"Save & Configure Theme"}
                </NavLink>
              </>
            )}
          </div>
        </div>
        <div>
          <ol
            role="list"
            className="rounded-md overflow-hidden lg:flex lg:border-l lg:border-r lg:border-gray-200 bg-white shadow-xxl mb-8"
          >
            <Steps activeTab={activeTab} setactiveTab={setactiveTab} />
          </ol>

          <div className="w-full mb-8">
            {StoreBuilderCreateSteps &&
              StoreBuilderCreateSteps.map((value, index) => {
                let Component = tabContent[value.component];
                return (
                  <div
                    className={`${activeTab === value.id ? "" : "hidden"} `}
                    key={index}
                  >
                    <Component
                      id={id}
                      isAddMode={isAddMode}
                      setFormSubmit={setFormSubmit}
                      index={index}
                      activeTab={activeTab}
                      setactiveTab={setactiveTab}
                      setgeneralTabData={setgeneralTabData}
                      generalTabData={generalTabData}
                      user={user}
                      mode={mode}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Create;

const Steps = ({ activeTab, setactiveTab }) => {
  return (
    <>
      {StoreBuilderCreateSteps &&
        StoreBuilderCreateSteps.map((value, index) => {
          return (
            <li className="relative overflow-hidden lg:flex-1" key={index}>
              <div className="border border-gray-200 overflow-hidden lg:border-0">
                <button
                  className="group w-full"
                  onClick={() => {
                    // setactiveTab(value.id);
                    // if(value.id < activeTab)
                  }}
                >
                  <span
                    className={`absolute top-0 left-0 w-1 h-full lg:w-full lg:h-1 lg:bottom-0 lg:top-auto ${
                      activeTab === value.id
                        ? "bg-red-500"
                        : "bg-transparent group-hover:bg-gray-200"
                    }`}
                    aria-hidden="true"
                  ></span>
                  <span className="px-6 py-5 flex items-center text-sm font-medium">
                    <span className="flex-shrink-0">
                      <span
                        className={`w-10 h-10 flex items-center justify-center border-2 rounded-full border-gray-300 ${
                          value.id < activeTab ? "hidden" : ""
                        }`}
                      >
                        <span className="text-gray-500">{value?.step}</span>
                      </span>
                      <span
                        className={`w-10 h-10 flex items-center justify-center border-2 rounded-full border-red-500 bg-red-500 ${
                          value.id < activeTab ? "" : "hidden"
                        }`}
                      >
                        <svg
                          className="w-6 h-6 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </span>
                    </span>
                    <span className="mt-0.5 ml-3 min-w-0 flex flex-col">
                      <span className="text-xs font-semibold tracking-wide uppercase text-gray-500">
                        {value?.label}
                      </span>
                    </span>
                  </span>
                </button>
                {index != 0 ? (
                  <div
                    className="hidden absolute top-0 left-0 w-3 inset-0 lg:block"
                    aria-hidden="true"
                  >
                    <svg
                      className="h-full w-full text-gray-300"
                      viewBox="0 0 12 82"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0.5 0V31L10.5 41L0.5 51V82"
                        stroke="currentcolor"
                        vectorEffect="non-scaling-stroke"
                      ></path>
                    </svg>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </li>
          );
        })}
    </>
  );
};
