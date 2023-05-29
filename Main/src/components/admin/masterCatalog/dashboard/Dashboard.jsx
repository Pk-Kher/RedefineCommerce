/*Component Name: MC Dashboard
Component Functional Details: User can create or update All master details from here.
Created By: Divyesh
Created Date: <Creation Date>
Modified By: chandan
Modified Date: 03/10/2022 */

import React, { useState, useEffect, useCallback } from "react";
import { Link, NavLink } from "react-router-dom";
import DashboardService from "services/admin/masterCatalog/dashboard/DashboardService";
import { useDispatch, useSelector } from "react-redux";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const DashBoard = ({ SetChangeTab }) => {
  const dispatch = useDispatch();

  const [stores, setStores] = useState([]);
  const [GrandMasterData, setGrandMasterData] = useState({});
  const [MasterData, setMasterData] = useState(null);
  const MenuListByUserRoleReducers = useSelector((store) => store?.MenuListByUserRoleReducers);
  const [MenuListByUserRolePermission, SetMenuListByUserRolePermission] = useState([]);

  useEffect(() => {
    const MenuListByUserRolePermissionArray = [];

    const findNestedObject = (userRolePermission) => {
      userRolePermission.map((moduleSubRowName) => {
        MenuListByUserRolePermissionArray.push(moduleSubRowName.name);

        if (moduleSubRowName.subRows && moduleSubRowName.subRows.length > 0) {
          findNestedObject(moduleSubRowName.subRows);
        }
      });
    };

    if (MenuListByUserRoleReducers.data.length > 0) {
      findNestedObject(MenuListByUserRoleReducers.data);
    }
    SetMenuListByUserRolePermission(MenuListByUserRolePermissionArray);
  }, [MenuListByUserRoleReducers]);

  const checkMenuList = (moduleName) =>
    MenuListByUserRolePermission.some((MenuListByUserRolePermission) => {
      return MenuListByUserRolePermission === moduleName;
    });

  const getDashboardData = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true))

      DashboardService.getDashboardData({
        storesearch: "",
        categoryid: 0,
      }).then((stores) => {
        if (stores.data.success) {
          setStores(stores.data.data);
        }

        dispatch(setAddLoading(false))
      }).catch((error) => {
        dispatch(setAddLoading(false))
      });
    }, []);

  const getMasterProductData = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true))

      DashboardService.getMasterProductData({})
        .then((MasterData) => {
          if (MasterData.data.success) {
            setMasterData(MasterData.data.data);
          }

          dispatch(setAddLoading(false))
        })
        .catch((error) => {
          dispatch(setAddLoading(false))
        });
    }, []);

  useEffect(() => {
    getDashboardData()
    getMasterProductData()
    DashboardService.getGrandMasterProductData({})
      .then((GrandMasterData) => {
        if (GrandMasterData.data.success) {
          setGrandMasterData(GrandMasterData.data.data);
        }
      })
      .catch((error) => { });
  }, []);

  return (
    <>
      <title>Master Catalog Dashboard</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
        <div className="grid grid-cols-12 gap-6 max-w-3xl mx-auto mb-6">
          {/* Grand Master Catalog */}
          {checkMenuList("Grand Master Catalog") && (
            <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-6 bg-white shadow-lg rounded-md">
              <div className="text-center item-center block">
                <div className="flex flex-wrap items-center">
                  <div className="relative w-full max-w-full text-center">
                    <Link
                      to="/admin/MasterCatalog/GrandMasterCatalog"
                      onClick={() => SetChangeTab(0)}
                    >
                      <div className="p-3 font-semibold text-xl text-gray-700 border-b-2 border-neutral-200">
                        Grand Master Catalog
                      </div>
                    </Link>
                    <div className="p-3 text-gray-700 uppercase font-bold text-xs flex justify-between border-b border-neutral-200 last:border-b-0">
                      <Link
                        to="/admin/MasterCatalog/GrandMasterCatalog"
                        onClick={() => SetChangeTab(0)}
                      >
                        <div >Product</div>
                      </Link>
                      <div >
                        {GrandMasterData?.totalProducts?.count}
                      </div>
                    </div>
                    <div className="p-3 text-gray-700 uppercase font-bold text-xs flex justify-between border-b border-neutral-200 last:border-b-0">
                      <Link to="/admin/MasterCatalog/Configuration/brand/">
                        <div >Brand</div>
                      </Link>
                      <div >{MasterData?.brands?.count}</div>
                    </div>
                    <div className="p-3 text-gray-700 uppercase font-bold text-xs flex justify-between border-b border-neutral-200 last:border-b-0">
                      <Link to="/admin/MasterCatalog/Configuration/vendor">
                        <div >Vendor</div>
                      </Link>
                      <div >{MasterData?.vendors?.count}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Master Catalog */}
          {checkMenuList("Master Catalog") && (
            <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-6 bg-white shadow-lg rounded-md">
              <div className="text-center item-center block">
                <div className="flex flex-wrap items-center">
                  <div className="relative w-full max-w-full text-center">
                    <Link
                      to="/admin/MasterCatalog/MasterCatalog/"
                      onClick={() => SetChangeTab(0)}
                    >
                      <div className="p-3 font-semibold text-xl text-gray-700 border-b-2 border-neutral-200">
                        Master Catalog
                      </div>
                    </Link>
                    <div className="p-3 text-gray-700 uppercase font-bold text-xs flex justify-between border-b border-neutral-200 last:border-b-0">
                      <Link
                        to="/admin/MasterCatalog/MasterCatalog/"
                        onClick={() => SetChangeTab(0)}
                      >
                        <div >Product</div>
                      </Link>
                      <div >{MasterData?.totalProducts?.count}</div>
                    </div>
                    <div className="p-3 text-gray-700 uppercase font-bold text-xs flex justify-between border-b border-neutral-200 last:border-b-0">
                      <Link to="/admin/MasterCatalog/Configuration/brand">
                        <div >Brand</div>
                      </Link>
                      <div >{MasterData?.brands?.count}</div>
                    </div>
                    <div className="p-3 text-gray-700 uppercase font-bold text-xs flex justify-between border-b border-neutral-200 last:border-b-0">
                      <Link to="/admin/MasterCatalog/Configuration/vendor">
                        <div >Vendor</div>
                      </Link>
                      <div >{MasterData?.vendors?.count}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-12 gap-6">
          {stores &&
            stores.length > 0 &&
            stores.map((storeType, index) => {
              return (
                <div
                  className={`${index === 0
                    ? "flex flex-col col-span-full sm:col-span-12 xl:col-span-12 "
                    : "flex flex-col col-span-12 xl:col-span-6 "
                    } bg-white shadow-lg rounded-md`}
                  key={index}
                >
                  {(checkMenuList(storeType?.storeTypeName)) && (
                    <div className="text-center item-center block">
                      <div className="p-3 font-semibold text-xl text-gray-700 border-b-2 border-neutral-200">
                        {storeType?.storeTypeName}
                      </div>
                      <div
                        className={`${index == 0
                          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 2xl:grid-cols-10 gap-6 p-6"
                          : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 p-6"
                          } `}
                      >
                        {storeType.store.map((storeData, index) => {
                          return (
                            checkMenuList(storeData.name) && (
                              <div
                                className="relative w-full text-center"
                                key={index}
                              >
                                <NavLink
                                  to={`/admin/MasterCatalog/${storeType.storeTypeName.replaceAll(
                                    " ",
                                    ""
                                  )}/${storeData.name.replaceAll(" ", "")}/${storeData.id
                                    }/products`}
                                >
                                  <div className="text-gray-700 text-xs border border-solid border-neutral-300 rounded-lg">
                                    <div className="p-0 h-auto min-h-[7.425vw] flex items-center justify-center">
                                      <img
                                        className=" mx-auto rounded-t-md max-h-[7.352vw]"
                                        src={`${process.env.REACT_APP_API_BLOB}${storeData.logoUrl}`}
                                        alt=""
                                      />
                                    </div>
                                    <div className="p-1 border-t bg-slate-100 flex items-center justify-center min-h-[1.682vw] border-neutral-200 overflow-hidden text-ellipsis rounded-b-md">
                                      {storeData.name}
                                    </div>
                                  </div>
                                </NavLink>
                              </div>
                            )
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

          {/* Statistics */}
          <div className="flex flex-col col-span-full sm:col-span-12 xl:col-span-12">
            <div className="text-center item-center block">
              {/* <div className="p-3 font-semibold text-xl text-gray-700 border-b-2 border-neutral-200">
                Statistics
              </div> */}
              {/* {checkMenuList()} */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6">
                {MasterData &&
                  Object.keys(MasterData).map((item, index) => {
                    if (
                      ![
                        "activeProducts",
                        "inActiveProducts",
                        "totalProducts",
                      ].includes(item) && checkMenuList(MasterData[item]?.name)
                    ) {
                      return (
                        <NavLink
                          to={
                            MasterData[item]?.link?.startsWith("/")
                              ? MasterData[item]?.link
                              : `/` + MasterData[item]?.link
                          }
                          key={index}
                        >
                          <div className="relative w-full text-center">
                            <div className="bg-white rounded-md shadow-md p-6">
                              <div className="flex items-center justify-between flex-wrap">
                                <div >
                                  <h4 className="text-3xl font-bold">
                                    {MasterData[item]?.count}
                                  </h4>
                                  <h6 className="text-muted m-b-0">
                                    {MasterData[item]?.name === 'Category Master' ? 'Total Category' : MasterData[item]?.name}
                                  </h6>
                                </div>
                                <div >
                                  <span className="material-icons-outlined text-6xl">
                                    {MasterData[item]?.menuIcon}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </NavLink>
                      );
                    }
                    return;
                  })}
              </div>
            </div>
          </div>

          {/* Grand Master */}
          {checkMenuList("Grand Master Catalog") && (
            <div className="flex flex-col col-span-full sm:col-span-12 xl:col-span-6">
              <div className="text-center item-center block">
                <div className="p-3 font-semibold text-base lg:text-xl text-gray-700 border-b-2 border-neutral-200 mb-6">
                  Grand Master
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="relative w-full text-center">
                    <div className="text-gray-700 font-bold text-sm bg-white shadow-lg rounded-md">
                      <div className="p-3 h-40 flex items-center justify-center">
                        <span className="material-icons-outlined text-6xl">
                          {GrandMasterData?.activeProducts?.menuIcon}
                        </span>
                      </div>
                      <div className="p-3 border-t border-neutral-200 text-xl">
                        {GrandMasterData?.activeProducts?.count}
                      </div>
                      <Link
                        to={GrandMasterData?.activeProducts?.link}
                        onClick={() => SetChangeTab(1)}
                      >
                        <div className="p-3 border-t border-neutral-200">
                          {GrandMasterData?.activeProducts?.name}
                        </div>
                      </Link>
                    </div>
                  </div>
                  <div className="relative w-full text-center">
                    <div className="text-gray-700 font-bold text-sm bg-white shadow-lg rounded-md">
                      <div className="p-3 h-40 flex items-center justify-center">
                        <span className="material-icons-outlined text-6xl">
                          {GrandMasterData?.inActiveProducts?.menuIcon}
                        </span>
                      </div>
                      <div className="p-3 border-t border-neutral-200 text-xl">
                        {GrandMasterData?.inActiveProducts?.count}
                      </div>
                      <Link
                        to={GrandMasterData?.inActiveProducts?.link}
                        onClick={() => SetChangeTab(2)}
                      >
                        <div className="p-3 border-t border-neutral-200">
                          {GrandMasterData?.inActiveProducts?.name}
                        </div>
                      </Link>
                    </div>
                  </div>
                  <div className="relative w-full text-center">
                    <div className="text-gray-700 font-bold text-sm bg-white shadow-lg rounded-md">
                      <div className="p-3 h-40 flex items-center justify-center">
                        <span className="material-icons-outlined text-6xl">
                          {GrandMasterData?.totalProducts?.menuIcon}
                        </span>
                      </div>
                      <div className="p-3 border-t border-neutral-200 text-xl">
                        {GrandMasterData?.totalProducts?.count}
                      </div>
                      <Link
                        to={GrandMasterData?.totalProducts?.link}
                        onClick={() => SetChangeTab(0)}
                      >
                        <div className="p-3 border-t border-neutral-200">
                          {GrandMasterData?.totalProducts?.name}
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Master */}
          {checkMenuList("Master Catalog") && (
            <div className="flex flex-col col-span-full sm:col-span-12 xl:col-span-6">
              <div className="text-center item-center block">
                <div className="p-3 font-semibold text-base lg:text-xl text-gray-700 border-b-2 border-neutral-200 mb-6">
                  Master
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="relative w-full text-center">
                    <div className="text-gray-700 font-bold text-sm bg-white shadow-lg rounded-md">
                      <div className="p-3 h-40 flex items-center justify-center">
                        <span className="material-icons-outlined text-6xl">
                          {MasterData?.activeProducts?.menuIcon}
                        </span>
                      </div>
                      <div className="p-3 border-t border-neutral-200 text-xl">
                        {MasterData?.activeProducts?.count}
                      </div>
                      <Link
                        to={MasterData?.activeProducts?.link}
                        onClick={() => SetChangeTab(1)}
                      >
                        <div className="p-3 border-t border-neutral-200">
                          {MasterData?.activeProducts?.name}
                        </div>
                      </Link>
                    </div>
                  </div>
                  <div className="relative w-full text-center">
                    <div className="text-gray-700 font-bold text-sm bg-white shadow-lg rounded-md">
                      <div className="p-3 h-40 flex items-center justify-center">
                        <span className="material-icons-outlined text-6xl">
                          {MasterData?.inActiveProducts?.menuIcon}
                        </span>
                      </div>
                      <div className="p-3 border-t border-neutral-200 text-xl">
                        {MasterData?.inActiveProducts?.count}
                      </div>
                      <Link
                        to={MasterData?.inActiveProducts?.link}
                        onClick={() => SetChangeTab(2)}
                      >
                        <div className="p-3 border-t border-neutral-200">
                          {MasterData?.inActiveProducts?.name}
                        </div>
                      </Link>
                    </div>
                  </div>
                  <div className="relative w-full text-center">
                    <div className="text-gray-700 font-bold text-sm bg-white shadow-lg rounded-md">
                      <div className="p-3 h-40 flex items-center justify-center">
                        <span className="material-icons-outlined text-6xl">
                          {MasterData?.totalProducts?.menuIcon}
                        </span>
                      </div>
                      <div className="p-3 border-t border-neutral-200 text-xl">
                        {MasterData?.totalProducts?.count}
                      </div>
                      <Link
                        to={MasterData?.totalProducts?.link}
                        onClick={() => SetChangeTab(0)}
                      >
                        <div className="p-3 border-t border-neutral-200">
                          {MasterData?.totalProducts?.name}
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DashBoard;
