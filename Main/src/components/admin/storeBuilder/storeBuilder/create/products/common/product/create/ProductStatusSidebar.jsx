/*Component Name: ProductStatusSidebar.jsx
Component Functional Details: User can create or update Untitled-1 master details from here.
Created By: Ankit Sharma
Created Date: 12/06/2022
Modified By: Ankit Sharma
Modified Date: 12/06/2022 */

import React, { useState, useCallback, useEffect } from "react";
import { productTilesDetailData, productType } from "dummy/Dummy";
import { Link } from "react-router-dom";
import ProductStatus from "./ProductStatus";
import StatusDetailsTile from "components/common/productTiles/StatusDetailTile";
import ProgressDetailsTile from "components/common/productTiles/ProgressDetailTile";
import { ProductStatusFormOption, GMCProductStatusFormOption, BundleProductStatusFormOption, RecStatusValuebyName } from "global/Enum";
import Select from "components/common/formComponent/Select";
import { useSelector } from "react-redux";
import SidebarStoreList from "components/common/others/admin/Store/SidebarStoreList";
import Tabs from "components/common/Tabs";
import ProductService from "services/admin/masterCatalog/grandMaster/products/ProductService";
import { useDispatch } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { serverError } from "services/common/helper/Helper";
import MasterProductService from "services/admin/masterCatalog/masterCatalog/products/ProductService";
import { ValidationMsgs } from "global/ValidationMessages";

const ProductStatusSidebar = ({
  displayFieldElement,
  fetchFieldProperty,
  fields,
  ProRedinessData,
  SEORedinessData,
  type,
  data,
  statusError,
  updateProductStatus,
  setProductStatusVal,
  productstatusVal,
  isAddMode,
  activeTab,
  getProductData,
  productId
}) => {
  const permission = useSelector(store => store.permission);
  const [StatusData, setStatusData] = useState(ProductStatusFormOption);

  const [storeActiveTab, setStoreActiveTab] = useState(0);
  const [displaySidebarStoreTab, setDisplaySidebarStoreTab] = useState([
    {
      id: 0,
      label: "Single",
      value: "Single",
      componentname: "sidebarstorelist",
    },
    {
      id: 1,
      label: "Bundle",
      value: "Bundle",
      componentname: "sidebarstorelist",
    }]);

  const onSidebarTabClick = (e, index) => {
    setStoreActiveTab(index);
  };

  const componentsForm = {
    sidebarstorelist: SidebarStoreList
  }

  const [toggler, setToggler] = useState({
    inventoryAvailable: false,
    isApiAvailable: false,
    isFtpFeedAvailable: false,
  });
  const [RecStatusDisabled, setRecStatusDisabled] = useState();
  const [ProductStatusValue, setProductStatusValue] = useState(0);
  const [SEOStatusValue, setSEOStatusValue] = useState(0);
  const dispatch = useDispatch();
  const [storeType, setStoreType] = useState([]);

  const getSalesChannelData = useCallback(() => {
    // if (productId) {
    MasterProductService.getSalesChannelData(productId)
      .then((response) => {
        if (response.data.success) {
          setStoreType(response?.data?.data);
        }
      }).catch((error) => {
      });
    // }
  }, [productId]);

  useEffect(() => {
    getSalesChannelData();
  }, []);

  useEffect(() => {
    // add active option as disabled if the api is returning 

    if (type == productType.GMC) {
      setStatusData(GMCProductStatusFormOption)
    }

    if (type == productType.EcommerceStore) {
      setStatusData(ProductStatusFormOption)
    }

    if (type == productType.Bundle) {
      setStatusData(BundleProductStatusFormOption)
    }
  }, []);

  useEffect(() => {
    setRecStatusDisabled((type === productType.EcommerceStore ? (!ProRedinessData.readyToPublish && !SEORedinessData.readyToPublish ? true : false) : isAddMode))
    setProductStatusValue(ProRedinessData.totalPercentageMatched)
    setSEOStatusValue(SEORedinessData.totalPercentageMatched)

  }, [ProRedinessData, SEORedinessData, data])
  const handleToggle = (field) => {
    setToggler((prevData) => ({
      ...prevData,
      [field]: !toggler[field],
    }));
  };

  const cloneProductToMaster = useCallback(() => {
    ProductService.cloneProduct([data.id]).then((response) => {
      if (response.data.success) {
        dispatch(
          setAlertMessage({
            type: "success",
            message: ValidationMsgs.product.cloned,
          })
        );
        getProductData();
      } else {
        dispatch(setAlertMessage({ type: "danger", message: serverError(response) }));
      }
    })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.product.notCloned,
          })
        );
      });
  }, [data.id]);

  return (
    <>
      <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 mb-6">
        {(type == productType.GMC && (permission?.isEdit || permission?.isDelete) && (data?.recStatus === RecStatusValuebyName.Active)) &&
          <>
            <div className="border-b-2 border-neutral-200 p-6">
              <button type={'button'} className="btn w-full block bg-green-500 hover:bg-green-600 text-white" onClick={cloneProductToMaster} disabled={data.isCloned}>
                {!data.isCloned ? 'Add Listing / Clone' : 'Product is already cloned in Master Catalog'}
              </button>
            </div>
          </>
        }
        <div className="p-6 border-b-2 border-neutral-200">
          <div className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2">
            Product Status
          </div>
          <Select
            options={StatusData}
            onChange={(e) => {
              if (e) {
                setProductStatusVal(
                  e.value
                );
              }
              else {
                setProductStatusVal("");
              }
            }}
            name="recStatus"
            defaultValue={productstatusVal}
            isClearable={false}
          // isDisabled={activeTab !== 1}

          />
          <span className="text-red-500">{statusError}</span>
        </div>

        {(type === productType.EcommerceStore || type === productType.GMC) &&
          <>
            <div className="store-list  p-6 ">
              <div className="w-full flex justify-between">
                {/* <!-- Title --> */}
                <div className="text-md py-1 text-gray-500">
                  <Link to="/admin/MasterCatalog/MasterCatalog/" className="text-indigo-500 hover:text-indigo-600">Master Catalog</Link>
                </div>
              </div>
            </div>
          </>
        }
      </div>

      {(!isAddMode && (type === productType.EcommerceStore || type === productType.Bundle)) &&
        <>
          <StatusDetailsTile data={productTilesDetailData} />

          <ProgressDetailsTile name={"Product Readiness"} ProgressValue={ProductStatusValue} />

          <ProgressDetailsTile name={"SEO Readiness"} ProgressValue={SEOStatusValue} />
        </>
      }
      {(!isAddMode && type === productType.MC) &&
        <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 mb-6">
          <div>
            <Tabs
              options={displaySidebarStoreTab}
              activeTab={storeActiveTab}
              setActiveTab={setStoreActiveTab}
              onTabClick={onSidebarTabClick}
            />
          </div>
          {
            displaySidebarStoreTab && displaySidebarStoreTab.map((value, index) => {
              const Component = componentsForm[value.componentname];
              return (
                <div className={`${storeActiveTab !== index && "hidden"
                  } w-full rounded-md mb-8 tab-content text-sm`}
                  key={index}
                >
                  <div className="p-5">
                    <Component storeType={() => {
                      let data = storeType.filter((val) => val.type == value.value)[0]?.storeListData || [];
                      if (data.length > 0) {
                        return data;
                      } else {
                        return [];
                      }
                    }} />
                  </div>
                </div>

              )
            })
          }
        </div>
      }
      {(type !== productType.GMC && !isAddMode) &&
        <>

          {/* here we will list down all {Product Title}  with its {toggle button} */}
          <ProductStatus data={data} type={type} updateStatus={updateProductStatus} displayFieldElement={displayFieldElement} fetchFieldProperty={fetchFieldProperty} fields={fields} />
        </>
      }
    </>
  );
};

export default ProductStatusSidebar;
