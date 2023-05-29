/*Component Name: List
Component Functional Details: User can create or update List master details from here.
Created By: chandan
Created Date: 01-07-2022
Modified By: chandan
Modified Date: 04-07-2022 */

import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MasterProductStatusTabs } from "dummy/Dummy";
import All from "../views/All";
import Tabs from "components/common/Tabs";
import Messages from "components/common/alerts/messages/Index";
import ProductService from "services/admin/masterCatalog/masterCatalog/products/ProductService";
import { useDispatch, useSelector } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { serverError } from "services/common/helper/Helper";
import { RecStatusValuebyName } from "global/Enum";
import DropdownService from "services/common/dropdown/DropdownService";
import { useEffect } from "react";
import CategoryService from "services/admin/category/CategoryService";
import { ValidationMsgs } from "global/ValidationMessages";
import { addActiveTab } from "redux/searchQueryForMGS/SearchQueryAction"
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import Select from "components/common/formComponent/Select";
import SyncInventoryList from "components/common/others/admin/SyncInventoryList";
import ExportImportInventory from "components/common/others/admin/ExportInventory";

const List = ({ changeTab }) => {
  const permission = useSelector(store => store.permission);
  const { toFill, currentTab } = useSelector((store) => store?.SearchQueryReducers);
  const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(toFill ? currentTab : changeTab);
  const dispatch = useDispatch();
  const displayTabs = MasterProductStatusTabs
  const onTabClick = (e, index) => {
    setActiveTab(index);
    dispatch(addActiveTab(index));
  };
  const [selectedData, setSelectedData] = useState([]);
  const [getDataFunction, setGetDataFunction] = useState();
  const [openAttributeCloneModal, setOpenAttributeCloneModal] = useState(false);

  const [ShowInventoryList, setShowInventoryList] = useState(false);
  const [ShowImportExportInventory, setShowImportExportInventory] = useState(false);
  const [InventoryTypeId, setInventoryTypeId] = useState(false);
  const [InventoryName, setInventoryName] = useState(false);

  const [moreFilterOptions, setMoreFilterOptions] = useState({
    brand: [],
    vendor: [],
    productType: [],
    category: []
  });
  const stores = useSelector((store) => {
    let stores = [];
    if (store?.permission) {
      Object.keys(store?.permission?.allPermission).map((key) => {
        if (store?.permission?.allPermission[key].storeID && key.toLowerCase().endsWith('products') && store?.permission?.allPermission[key].storeName) {
          stores = [...stores, { label: store?.permission?.allPermission[key].storeName, value: key }];
        }
      });
    }
    stores.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : ((b.label.toLowerCase() > a.label.toLowerCase()) ? -1 : 0));
    return stores;
  });

  useEffect(() => {
    DropdownService.getDropdownValues("vendor").then((res) => {
      if (res.data.success && res.data.data) {
        setMoreFilterOptions(prev => {
          return { ...prev, vendor: res.data.data }
        })
      }
    });
    DropdownService.getDropdownValues("brand").then((response) => {
      setMoreFilterOptions(prev => {
        return { ...prev, brand: response.data.data }
      });
    });
    CategoryService.getCategoryDropdownOptions(-1)
      .then((response) => {
        setMoreFilterOptions(prev => {
          return { ...prev, category: response.data.data }
        });
      })
    DropdownService.getDropdownValues("producttype").then((response) => {
      setMoreFilterOptions(prev => {
        return { ...prev, productType: response.data.data }
      });
    });
  }, []);

  const navSyncHandler = () => {
    if (selectedData && selectedData.length <= 0) {
      dispatch(
        setAlertMessage({
          view: true,
          type: "danger",
          message: ValidationMsgs.product.navSyncProductRequired,
        })
      );
    } else {
      dispatch(setAddLoading(true))

      let productId = [];
      selectedData.map((value) => {
        productId = [...productId, value.original.id];
      })
      ProductService.updateNavStatus({
        productId: productId,
        status: RecStatusValuebyName.NavSync
      }).then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              view: true,
              type: "success",
              message: ValidationMsgs.product.navSyncSuccess,
            })
          );
          getDataFunction(1, MasterProductStatusTabs[activeTab].filter);
        } else {
          dispatch(
            setAlertMessage({
              view: true,
              type: "danger",
              message: serverError(response),
            })
          );
          dispatch(setAddLoading(false))
        }
      })
        .catch((errors) => {
          dispatch(
            setAlertMessage({
              view: true,
              type: "danger",
              message: ValidationMsgs.product.navSyncFailed,
            })
          );
          dispatch(setAddLoading(false))
        });
    }
  }
  const attrClone = () => {
    if (selectedData && selectedData.length === 1) {
      setOpenAttributeCloneModal(prev => !prev);
    }
    else {
      dispatch(
        setAlertMessage({
          view: true,
          type: "danger",
          message: ValidationMsgs.product.productCloneRequired,
        })
      );
    }
  }
  return (
    <>
      <title>Master Catalog</title>
      {!ShowInventoryList ?
        <>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              {/* Page Title */}
              <div className="col-span-full w-full flex flex-wrap justify-between items-center">
                {/* Title */}
                <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
                  Master Catalog
                </h1>
                <div className="flex flex-wrap space-x-2 items-center">
                  <Select
                    options={stores}
                    classNames="w-52 -top-1"
                    placeholder="Select Store"
                    name={'store'}
                    defaultValue={""}
                    onChange={(e) => {
                      navigate(e.value, { replace: true });
                    }}

                  />
                  <NavLink to={'export'}
                    className="btn shadow-none text-indigo-500 hover:text-indigo-600 font-semibold mb-2 "
                  >
                    <span >Export</span>
                  </NavLink>
                  {(permission?.isEdit || permission?.isDelete) &&
                    <>
                      <NavLink to='import'
                        type="button"
                        className="btn shadow-none text-indigo-500 hover:text-indigo-600 font-semibold mb-2"
                      >
                        <span >Import</span>
                      </NavLink>
                      {(MasterProductStatusTabs[activeTab].value === 'Synced with NAV' || MasterProductStatusTabs[activeTab].value === 'All') &&
                        <button type="button" className="items-center btn bg-indigo-500 hover:bg-indigo-600 text-white rounded mb-2" onClick={attrClone} >
                          <span className="material-icons-outlined text-[12px]">add</span>
                          Create Listing / Clone
                        </button>
                      }
                      <NavLink to={`/admin/MasterCatalog/MasterCatalog/create`} className="items-center btn bg-indigo-500 hover:bg-indigo-600 text-white rounded mb-2">
                        <span className="material-icons-outlined text-[12px]">add</span>
                        <span className="ml-1">Add Product</span>
                      </NavLink>
                      {(MasterProductStatusTabs[activeTab].value === 'NAVSyncPending' || MasterProductStatusTabs[activeTab].value === 'ResyncwithNAV') &&
                        <button type="button" className="items-center btn bg-indigo-500 hover:bg-indigo-600 text-white rounded mb-2" onClick={navSyncHandler}>
                          Sync with NAV
                        </button>
                      }
                      <button className="items-center btn bg-indigo-500 hover:bg-indigo-600 text-white rounded mb-2" onClick={() => { setShowInventoryList(true); setInventoryTypeId(1); setInventoryName("Sanmar") }}>
                        Sync Sanmar Inventory
                      </button>
                      <button type="button" className="items-center btn bg-indigo-500 hover:bg-indigo-600 text-white rounded mb-2" onClick={() => { setShowInventoryList(true); setInventoryTypeId(2); setInventoryName("Alpha") }}>
                        Sync Alpha Inventory
                      </button>
                      <button type="button" className="items-center btn bg-indigo-500 hover:bg-indigo-600 text-white rounded mb-2" onClick={() => { setShowInventoryList(true); setInventoryTypeId(3); setInventoryName("RepSpark") }}>
                        Sync RepSpark Inventory
                      </button>
                      <button type="button" className="items-center btn bg-indigo-500 hover:bg-indigo-600 text-white rounded mb-2" onClick={() => { setShowInventoryList(true); setInventoryTypeId(4); setInventoryName("NAV") }}>
                        Sync NAV Inventory
                      </button>
                    </>
                  }
                </div>
              </div>
            </div>
            {/* Product Filter */}
            <Messages />
            <>
              <div className="bg-white shadow-xxl rounded-md mb-8">
                <div className="col-span-full w-full bg-white shadow-xxl rounded-md mb-8 relative">

                  <Tabs
                    options={displayTabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onTabClick={onTabClick}
                  />
                  <div className='w-full'>
                    {
                      MasterProductStatusTabs.map((value, index) => {
                        if (index === activeTab) {
                          return (
                            <All key={value.componentname} activeTab={activeTab} tab={value} selectedData={selectedData} setSelectedData={setSelectedData} setGetDataFunction={setGetDataFunction} moreFilterOptions={moreFilterOptions} openAttributeCloneModal={openAttributeCloneModal} setOpenAttributeCloneModal={setOpenAttributeCloneModal} />
                          )
                        } else {
                          return "";
                        }
                      })
                    }
                  </div>
                </div>
              </div>
            </>
          </div>
        </>
        :
        <>
          {ShowImportExportInventory ?
            <ExportImportInventory setShowImportExportInventory={setShowImportExportInventory} setShowInventoryList={setShowInventoryList} InventoryTypeId={InventoryTypeId} InventoryName={InventoryName} />
            :
            <SyncInventoryList setShowInventoryList={setShowInventoryList} InventoryTypeId={InventoryTypeId} InventoryName={InventoryName} setShowImportExportInventory={setShowImportExportInventory} ShowImportExportInventory={ShowImportExportInventory} />
          }
        </>
      }
    </>
  );
};

export default List;

