import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { storeBuilderTabs } from "global/Enum";
import Tabs from "components/common/Tabs";
import Setup from "../create/Setup";
import General from "../create/general/General";
import PaymentInfo from "../create/paymentInfo/PaymentInfo";
import Taxes from "../create/taxes/Taxes";
import Message from "../create/Message";
import Product from "../create/products/Product";
import Category from "../create/categories/Category";
//import Sequence from "../create/Sequence";
import StoreBuilderService from "services/admin/storeBuilder/StoreBuilderService";
import { useSelector } from "react-redux";

const Edit = ({ mode }) => {
  const [FormSubmit, setFormSubmit] = useState(null);
  const [activeTab, setactiveTab] = useState(0);
  const [generalTabData, setgeneralTabData] = useState([]);
  const user = useSelector((store) => store.user);
  const { id } = useParams();
  const isAddMode = !id;
  const GlobalLoading = useSelector(
    (store) => store?.GlobalLoaderReducer?.toLoad
  );

  const onTabClick = (e, index) => {
    setactiveTab(index);
  };

  useEffect(() => {
    if (!isAddMode) {
      StoreBuilderService.getByStoreID(id)
        .then((res) => {
          setgeneralTabData(res.data.data);
        })
        .catch(() => {});
    }
  }, []);
  const componentsList = {
    setup: Setup,
    general: General,
    paymentInfo: PaymentInfo,
    tax: Taxes,
    message: Message,
    product: Product,
    category: Category,
    //sequence: Sequence,
  };
  return (
    <>
      <title>Edit Store</title>
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
              Edit Store Builder
            </div>
          </div>
          <div className="flex flex-wrap space-x-2">
            <button
            type="button"
              className={`btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white`}
              onClick={(e) => FormSubmit.handleSubmit()}
            >
              {GlobalLoading && (
                <span className="spinner-border spinner-border-sm mr-2"></span>
              )}
              Save
            </button>
          </div>
        </div>
        {/* <Messages /> */}

        {/* <div className="col-span-full w-full bg-white shadow-xxl rounded-md mb-8 pt-8"> */}
        <div>
          <Tabs
            options={storeBuilderTabs}
            activeTab={activeTab}
            setActiveTab={setactiveTab}
            onTabClick={onTabClick}
          />
          <div className="flex flex-col md:flex-row">
            {storeBuilderTabs.map((tab, index) => {
              const Component = componentsList[tab.componentname];

              return (
                <div
                  className={`${
                    activeTab !== index && "hidden"
                  } rounded-md mt-8 tab-content text-sm overflow-x-auto w-full`}
                  key={index}
                >
                  <div className="overflow-x-auto grow">
                    <Component
                      id={id}
                      isAddMode={isAddMode}
                      setFormSubmit={setFormSubmit}
                      index={index}
                      activeTab={activeTab}
                      setactiveTab={setactiveTab}
                      generalTabData={generalTabData}
                      user={user}
                      mode={mode}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Edit;
