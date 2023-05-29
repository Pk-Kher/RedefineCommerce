/*Component Name: ProductStatusSidebar.jsx
Component Functional Details: User can create or update Untitled-1 master details from here.
Created By: <Your Name>
Created Date: <Creation Date>
Modified By: chandan
Modified Date: 13-06-2022 */

import React, { useState } from "react";
import { productTilesDetailData, productType } from "dummy/Dummy";
import { Link } from "react-router-dom";
import ProductStatus from "./ProductStatus";
import StatusDetailsTile from "components/common/productTiles/StatusDetailTile";
import ProgressDetailsTile from "components/common/productTiles/ProgressDetailTile";
import { ProductStatusFormOption, GMCProductStatusFormOption, BundleProductStatusFormOption, RecStatusValuebyName } from "global/Enum";
import Select from "components/common/formComponent/Select";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import SidebarStoreList from "components/common/others/admin/Store/SidebarStoreList";
import Tabs from "components/common/Tabs";
import { useCallback } from "react";
import ProductService from "services/admin/masterCatalog/grandMaster/products/ProductService";
import { useDispatch } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { DateTimeFormat, serverError } from "services/common/helper/Helper";
import MasterProductService from "services/admin/masterCatalog/masterCatalog/products/ProductService";
import { ValidationMsgs } from "global/ValidationMessages";
import { async } from "q";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import MasterCatalogCommonService from "services/admin/masterCatalog/MasterCatalogCommonService";

const ProductStatusSidebar = ({
  displayFieldElement,
  fetchFieldProperty,
  fields,
  ProReadinessData,
  SEOReadinessData,
  type,
  data,
  statusError,
  updateProductStatus,
  setProductStatusVal,
  productstatusVal,
  isAddMode,
  activeTab,
  getProductData,
  productId,
  store = {},
  isFilledAllField,
  updateSingleField,
  getValidationForAllFilledFields
}) => {
  const permission = useSelector(store => store.permission);
  const [StatusData, setStatusData] = useState([]);

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
    if (type == productType.MC) {
      getSalesChannelData();
    }
  }, []);

  useEffect(() => {
    if (type == productType.GMC) {
      // if (isFilledAllField) {
      //   // add active option as enable if the api is returning true( all the fields are filled )    
      //   let foundIndex = GMCProductStatusFormOption.findIndex(obj => obj.label === "Active");
      //   GMCProductStatusFormOption[foundIndex]["isDisabled"] = false
      // }
      setStatusData(GMCProductStatusFormOption)
    }

    if (type == productType.MC) {

      // // add active option as enable if the api is returning true( all the fields are filled )
      // if (isFilledAllField) {
      //   // const foundObj = ProductStatusFormOption.find((obj) => obj.label === "Active")
      //   let foundIndex = ProductStatusFormOption.findIndex(obj => obj.label === "Active");

      //   ProductStatusFormOption[foundIndex]["isDisabled"] = false
      // }
      setStatusData(ProductStatusFormOption)
    }

    if ([productType.EcommerceStore, productType.CorporateStore].includes(type)) {
      let ProductStatusFormOptionForStore = [...ProductStatusFormOption]

      // let foundIndex = ProductStatusFormOptionForStore.findIndex(obj => obj.label === "Active");
      // ProductStatusFormOptionForStore[foundIndex]["isDisabled"] = false

      setStatusData(ProductStatusFormOptionForStore)
    }

    if (type == productType.Bundle) {
      setStatusData(BundleProductStatusFormOption)
    }

  }, [type, isFilledAllField]);

  useEffect(() => {
    setRecStatusDisabled(([productType.EcommerceStore, productType.CorporateStore].includes(type) ? (!ProReadinessData.readyToPublish && !SEOReadinessData.readyToPublish ? true : false) : isAddMode))
    setProductStatusValue(ProReadinessData.totalPercentageMatched)
    setSEOStatusValue(SEOReadinessData.totalPercentageMatched)

  }, [ProReadinessData, SEOReadinessData, data])
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

  const handleToggleProductStatus = (e) => {
    if (data?.id && e?.value === 'A') {
      dispatch(setAddLoading(true));
      MasterCatalogCommonService.validateProduct(data?.id, type)
        .then((response) => {
          if (response?.data?.data?.length > 0 && response?.data?.otherData) {
            dispatch(setAlertMessage({
              type: 'danger',
              message: serverError({ data: { errors: response?.data?.otherData } })
            }))
          } else {
            setProductStatusVal(e.value);
            updateSingleField(e.value);
          }


          dispatch(setAddLoading(false));
        }).catch((error) => {
          dispatch(setAddLoading(false))
        });
    } else if (e?.value !== data.recStatus) {
      setProductStatusVal(e ? e.value : '');
      updateSingleField(e ? e.value : '');
    }
  }


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
            onChange={(e) => handleToggleProductStatus(e)}
            name="recStatus"
            defaultValue={productstatusVal}
            isClearable={false}
            isDisabled={(!permission?.isEdit && !permission?.isDelete) || isAddMode}
          />
          <span className="text-red-500">{statusError}</span>
        </div>

        {([productType.EcommerceStore, productType.CorporateStore].includes(type) || type === productType.GMC) &&
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

      {(!isAddMode && ([productType.EcommerceStore, productType.CorporateStore, productType.Bundle].includes(type))) &&
        <>
          <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 mb-6">
            <div className="relative w-full">
              {data && <StatusDetailsTile data={{
                title: 'Last Publish Detail',
                subTitle: (data?.publishDate ? `Last Published on ${DateTimeFormat(data?.publishDate, 'MMM dd,yyyy')?.date + ' - ' + DateTimeFormat(data?.publishDate)?.time} ` : 'Product is not publish yet.'),
                subTitle2: (data?.publishByName ? `Last Published by ${data?.publishByName}. ` : '')
              }} />}
              {data && <StatusDetailsTile data={{
                title: 'Last Save Detail ',
                subTitle: (`Last Saved on  ${(data?.createdDate ? DateTimeFormat((data?.modifiedDate || data?.createdDate), 'MMM dd,yyyy')?.date + ' - ' + DateTimeFormat((data?.modifiedDate || data?.createdDate))?.time : '')} `),
                subTitle2: (`Last Saved by ${data?.modifiedName || data?.createdName}.`)
              }} />}
            </div>
          </div>
          {store?.isProductReadinessAllow && <div className="w-full relative bg-white shadow-lg rounded-md border border-neutral-200 mb-6 p-1">
            <ProgressDetailsTile name={"Product Readiness"} ProgressValue={ProductStatusValue} />
            {ProReadinessData?.errors && <span className="ml-5 mb-2 text-red-500">{serverError({ data: { errors: ProReadinessData?.errors } })}</span>}
          </div>}

          {store?.isSeoReadinessAllow && <div className="w-full relative bg-white shadow-lg rounded-md border border-neutral-200 mb-6 p-1">
            <ProgressDetailsTile name={"SEO Readiness"} ProgressValue={SEOStatusValue} />
            {SEOReadinessData?.errors && <span className="ml-5 mb-2 text-red-500">{serverError({ data: { errors: SEOReadinessData?.errors } })}</span>}
          </div>}
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
                    <Component storeType={storeType.filter((val) => val.type == value.value)[0]?.storeListData || []} />
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
          <ProductStatus data={data} type={type} updateStatus={updateProductStatus} displayFieldElement={displayFieldElement} fetchFieldProperty={fetchFieldProperty} fields={fields} getProductData={getProductData} />
        </>
      }
    </>
  );
};

export default ProductStatusSidebar;
