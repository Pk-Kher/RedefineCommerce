/*Component Name: Menu
Component Functional Details: User can create or update Menu master details from here.
Created By: Happy
Created Date: <Creation Date>
Modified By: chandan
Modified Date: <Modified Date> */

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Tabs from "components/common/Tabs";
import MainMenu from "./MainMenu";
import Messages from "components/common/alerts/messages/Index";
import DynamicContent from "./DynamicContent";
import CMSConfiguration from "services/admin/cmsConfiguration/CMSConfiguration";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const Menu = () => {
  const dispatch = useDispatch();

  const { storeId } = useParams();
  const [FormSubmit, setFormSubmit] = useState(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState([]);
  const [values, setValues] = useState({});
  const [SelectedPages, setSelectedPages] = useState([]);
  const [displayTabs, setDisplayTabs] = useState([
    {
      id: 0,
      label: "MainMenu",
      value: "MainMenu",
      componentname: "MainMenu",
    },
  ]);
  const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

  const [menuConfig, setMenuConfig] = useState([]);

  const getMenuConfigData = useCallback(() => {
    let temp = [];
    let temp1 = [];
    CMSConfiguration.getMenuConfigData(storeId)
      .then((res) => {
        var response = res.data;
        if (response.success && response.data.length > 0) {
          temp = response.data;

          //   For Dynamic Menu Tab ===== start
          response.data.map((data, i) => {
            temp1 = [
              ...temp1,
              {
                id: i + 1,
                label: data?.title || "menu " + (i + 1),
                value: data.id,
                componentname: data.id,
              },
            ];
          });
          //   For Dynamic Menu Tab ===== end
        } else {
          temp = [
            {
              id: 0,
              topic_Id: 0,
              type: "",
              store_Id: storeId,
              menu_Info: "",
              category: "",
              se_Name: "",
              open_In_New_Tab: "",
              created_By: "",
              created_Date: "",
              modified_By: "",
              modified_Date: "",
            },
          ];
        }
        setDisplayTabs([...displayTabs, ...temp1]);
        setMenuConfig(temp);
      })
      .catch((err) => { });
  }, []);

  useEffect(() => {
    getMenuConfigData();
  }, []);

  const onTabClick = (e, index) => {
    e.preventDefault();
    if (!isError) {
      setActiveTab(index);
    }
  };

  return (
    <>
      <title>Menu</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-wrap mb-8 justify-between">
          <div className="flex items-center">
            <Link
              to={"/admin/MasterCatalog/Store/"}
              className="btn border-neutral-200 hover:border-neutral-400 text-gray-500 hover:text-gray-700 flex items-center mr-2"
            >
              <span className="material-icons-outlined">west</span>
            </Link>

            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
              Menu
            </h1>
          </div>

          {FormSubmit && (
            <div className="flex flex-wrap space-x-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={GlobalLoading}
                onClick={() => {
                  FormSubmit.handleSubmit();
                }}
                className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${GlobalLoading || values.captcha === ""
                  ? "bg-indigo-200 hover:bg-indigo-200"
                  : "cursor-pointer"
                  }`}
              >
                <div className={`w-full flex justify-center align-middle `}>
                  {GlobalLoading && (
                    <span className="spinner-border spinner-border-sm mr-2"></span>
                  )}
                  Save
                </div>
              </button>
            </div>
          )}
        </div>

        <Messages />
        <div className="bg-white shadow-xxl rounded-md mb-8">
          <div className="w-full bg-white shadow-xxl rounded-md mb-8 pt-4">
            <Tabs
              options={displayTabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onTabClick={onTabClick}
            />
            <div className="w-full">
              {menuConfig?.length > 0 ? (
                <>
                  <div
                    className={`${activeTab === 0 ? "" : "hidden"
                      } w-full rounded-md mb-8 tab-content text-sm`}
                  >
                    <MainMenu
                      data={data}
                      activeTab={activeTab}
                      menuConfig={menuConfig}
                      setIsError={setIsError}
                      displayTabs={displayTabs}
                      setActiveTab={setActiveTab}
                      setFormSubmit={setFormSubmit}
                      SelectedPages={SelectedPages}
                      setDisplayTabs={setDisplayTabs}
                      setSelectedPages={setSelectedPages}
                      getMenuConfigData={getMenuConfigData}
                    />
                  </div>
                  {menuConfig.map((tab, index) => {
                    return (
                      <div
                        className={`${activeTab !== index + 1 && "hidden"
                          } w-full rounded-md mb-8 tab-content text-sm`}
                        key={index}
                      >
                        <DynamicContent
                          tab={tab}
                          index={index + 1}
                          activeTab={activeTab}
                          setIsError={setIsError}
                          displayTabs={displayTabs}
                          setActiveTab={setActiveTab}
                          setFormSubmit={setFormSubmit}
                          SelectedPages={SelectedPages}
                          setDisplayTabs={setDisplayTabs}
                          setSelectedPages={setSelectedPages}
                          menuConfig={menuConfig}
                        />
                      </div>
                    );
                  })}
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;
