/*Component Name: ThemeSetting.jsx
Component Functional Details: Customizing Theme Global Settings.
Created By: Keval Takodara
Created Date: 2-Aug-2022
Modified By: -
Modified Date:  */

import React, { useState, useRef } from "react";
import Sidebar from "components/admin/content/common/sidebar/Sidebar";
import Breadcrumbs from "./Breadcrumbs";
import Settings from "./Settings";
import { contentThemeSettingAttributeDate } from "dummy/Dummy";
import { NavLink, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import StoreService from "services/admin/store/StoreService";
import { useDispatch } from "react-redux";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const ThemeSetting = () => {
  const [themeSettingData, setThemeSettingData] = useState(
    contentThemeSettingAttributeDate
  );
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const onThemeSubmitHandler = () => {
    console.log("Save Theme Clicked");
  };

  const onNestedAttributeClickHandler = (attribute) => {
    setBreadcrumbs([...breadcrumbs, attribute]);
    setThemeSettingData([attribute]);
  };
  const { storeid } = useParams();
  const [store, setStore] = useState({});
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setAddLoading(true));
    StoreService.getStoreById(storeid).then((response) => {
      if (response?.data?.success && response?.data?.data) {
        setStore(response?.data?.data);
      }
      dispatch(setAddLoading(false));
    }).catch(() => {
      dispatch(setAddLoading(false));
    })
  }, [storeid]);

  return (
    <>
      <MainHeader store={store} />
      <Sidebar>
        <Breadcrumbs
          setThemeSettingData={setThemeSettingData}
          ThemeData={contentThemeSettingAttributeDate}
          breadcrumbs={breadcrumbs}
          setBreadcrumbs={setBreadcrumbs}
        />
        <div className=" bg-white pt-2">
          <div className="pl-2 pb-2 flex justify-between hover:underline">
            <div className="text-2xl">Theme Setting</div>
          </div>
        </div>
        <Settings
          onThemeSubmitHandler={onThemeSubmitHandler}
          AttributeData={themeSettingData}
          onNestedAttributeClickHandler={onNestedAttributeClickHandler}
        />
      </Sidebar>
    </>
  );
};

export default ThemeSetting;

const MainHeader = ({ store }) => {
  return (
    <>
      <div className="flex py-3 p-4 justify-between items-center bg-slate-800 sticky inset-0 bottom-auto z-50">
        <div className="flex items-center flex-wrap">
          <div className="relative inline-flex">
            <NavLink
              className="flex flex-wrap btn-sm px-4 py-[5px] bg-white hover:bg-indigo-500 text-indigo-500 hover:text-white mr-2"
              to={`/admin/MasterCatalog/Store`}
            >
              <span >Exit</span>
            </NavLink>
            {/* <button className="px-4 py-[5px] btn-sm bg-indigo-500 hover:bg-indigo-600 text-white mr-2">
              Save
            </button> */}
          </div>
        </div>
        <div className="text-white flex items-center text-sm justify-between font-normal">
          {store?.name || ''}
        </div>
        <div >
          {/* <span className="px-4 py-[5px] btn-sm bg-rose-500 hover:bg-rose-600 text-white ml-2">
            Unpublish
          </span>

          <span className="px-4 py-[5px] btn-sm bg-indigo-500 hover:bg-indigo-600 text-white ml-2">
            Update
          </span> */}
        </div>
      </div>
    </>
  );
};
