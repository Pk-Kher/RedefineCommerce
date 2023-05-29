/*Component Name: Create.jsx
Component Functional Details: Create/Edit file for product. This file will be common for all store products
Created By: Chandan
Created Date: 26-08-2022
Modified By: Chandan
Modified Date: 28-08-2022 */

import React, { useState, useEffect, useCallback, useMemo } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Messages from "components/common/alerts/messages/Index";
import BasicInformation from "./forms/BasicInformation";
import Pricing from "./forms/Pricing";
import Media from "./forms/Media";
import Attributes from "./forms/attributes/Attributes";
import Inventory from "./forms/Inventory";
import SizeChart from "./forms/SizeChart";
import Personalization from "./forms/Personalization";
import Facet from "./forms/Facet";
import VendorSKUMapping from "./forms/vendorSKU/VendorSKUMapping";
import SKUSwap from "./forms/SKUSwap";
import Bundle from "./forms/Bundle";
import SEO from "./forms/SEO";
import OrderHistory from "./forms/OrderHistory";
import CustomerReviews from "./forms/CustomerReviews";
import CustomerFAQ from "./forms/CustomerFAQ";
import LifeCycle from "./forms/LifeCycle";
import { productType } from "dummy/Dummy";
import ProductStatusSidebar from "./ProductStatusSidebar";
import Tabs from "components/common/Tabs";
import BasicModal from "components/common/modals/Basic";
import SaveChangedFieldsModel from "components/common/modals/SaveChangedFields";
import AllInfo from "./views/AllInfo";
import Product from "./forms/Product";
import ProductAndStoreMapping from "./forms/ProductAndStoreMapping";
import { useDispatch, useSelector } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import ProductService from "services/admin/masterCatalog/store/product/ProductService";
import { ValidationMsgs } from "global/ValidationMessages";
import { fillSerchQuery } from "redux/searchQueryForMGS/SearchQueryAction"
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { serverError } from "services/common/helper/Helper";
import SingleFieldUpdateServiceMaster from "services/admin/masterCatalog/masterCatalog/products/SingleFieldUpdateService";
import SingleFieldUpdateServiceGMaster from "services/admin/masterCatalog/grandMaster/products/SingleFieldUpdateService";
import SingleFieldUpdateServiceStore from "services/admin/masterCatalog/store/product/SingleFieldUpdateService";
import CacheService from "services/admin/cache/CacheService";

const Create = ({ masterTabs, masterCatalogFields = [], listUrl, title, type, getProductById, getValidationForAllFilledFields, updateProductStatus, moduleName, ...rest }) => {
  const permission = useSelector(store => store.permission);
  const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

  const { id } = useParams();
  const { storeId } = useParams();
  const [ModalInfo, setModalInfo] = useState({});
  const [openBasicModal, setOpenBasicModal] = useState(false);
  const [FormSubmit, setFormSubmit] = useState(null);
  const [data, setData] = useState([]);
  const [ProReadinessData, setProReadinessData] = useState([]);
  const [SEOReadinessData, setSEORedinessData] = useState([]);
  // const [Publishable, setPublishable] = useState(ProReadinessData.readyToPublish && SEOReadinessData.readyToPublish ? true : false);
  const [isAddMode, setIsAddMode] = useState(!id);

  useEffect(() => {
    setIsAddMode(!id);
  }, [id]);
  const [activeTab, setActiveTab] = useState(0);
  const [fields, setFields] = useState(masterCatalogFields);
  const [isError, setIsError] = useState(false);
  const [values, setValues] = useState({});
  const [statusError, setStatusError] = useState("");
  const [productstatusVal, setProductStatusVal] = useState("D");
  const [formErrors, setFormErrors] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [AttributeCombinations, setAttributeCombinations] = useState([]);
  const [OpenProductAndStoreMapping, setOpenProductAndStoreMapping] = useState(false);
  const [saveUnSavedFields, setsaveUnSavedFields] = useState({
    currentTab: 0,
    currentState: false,
  });
  const [WishedToChangeTab, setWishedToChangeTab] = useState(false);

  const searchQuery = useSelector((store) => store?.SearchQueryReducers?.searchQuery);

  const getProductData = useCallback(() => {
    if (id) {
      dispatch(setAddLoading(true))
      getProductById(id)
        .then((response) => {
          if (response.data.data) {
            setData(response.data.data);
            setProductStatusVal(response?.data?.data?.recStatus);
          } else {
            dispatch(
              setAlertMessage({
                message: ValidationMsgs.common.productNotFound,
                type: "danger",
              })
            );
            return navigate(listUrl);
          }
          dispatch(setAddLoading(false))

        }).catch((error) => {
          dispatch(
            setAlertMessage({
              message: ValidationMsgs.common.productNotFound,
              type: "danger",
            })
          );
          dispatch(setAddLoading(false))

          return navigate(listUrl);
        });

    }
  }, [id]);

  const updateSingleField = useCallback((productStatus) => {
    var SingleFieldUpdateService = [productType.EcommerceStore, productType.CorporateStore, productType.Bundle].includes(type) ? SingleFieldUpdateServiceStore : (type == productType.GMC) ? SingleFieldUpdateServiceGMaster : SingleFieldUpdateServiceMaster;
    const obj = [
      {
        path: `/recStatus`,
        op: "Replace",
        value: productStatus
      }
    ]

    SingleFieldUpdateService.updateSingleField(id, obj).then((response) => {

      if (response.data.success) {
        dispatch(
          setAlertMessage({
            type: "success",
            message: "Status updated successfully",
          })
        );
        getProductReadinessData()
        getProductData();
      } else {
        dispatch(
          setAlertMessage({ type: "danger", message: serverError(response) })
        );
        dispatch(setAddLoading(false))
      }
    }).catch((errors) => {
      dispatch(
        setAlertMessage({
          type: "danger",
          message: ValidationMsgs.product.statusNotUpdated,
        })
      );
      dispatch(setAddLoading(false))

    })

  }, [id, type]);

  const getProductReadinessData = useCallback(() => {
    if ([productType.EcommerceStore, productType.CorporateStore, productType.Bundle].includes(type) && rest?.store?.isProductReadinessAllow) {
      dispatch(setAddLoading(true))
      ProductService.getProductRedinessById(id, storeId).then((response) => {
        if (response.data.data) {
          setProReadinessData({ ...response.data.data });
        } else {
          setProReadinessData({ errors: response.data.errors });
        }
        dispatch(setAddLoading(false))

      }).catch((error) => {
        dispatch(
          setAlertMessage({
            message: ValidationMsgs.common.productNotFound,
            type: "danger",
          })
        );
        dispatch(setAddLoading(false))

      });
    }
  }, [id, setActiveTab, productType, type])

  const getSEOReadinessData = useCallback(() => {
    if ([productType.EcommerceStore, productType.CorporateStore, productType.Bundle].includes(type) && rest?.store?.isSeoReadinessAllow) {
      dispatch(setAddLoading(true))

      ProductService.getSEORedinessById(id, storeId).then((response) => {
        if (response.data.data) {
          setSEORedinessData(response.data.data);
        } else {
          setSEORedinessData({ errors: response.data.errors });
        }
        dispatch(setAddLoading(false));
      }).catch((error) => {
        dispatch(
          setAlertMessage({
            message: ValidationMsgs.common.productNotFound,
            type: "danger",
          })
        );
        dispatch(setAddLoading(false));
      });
    }
  }, [id, setActiveTab, productType, type])

  useEffect(() => {
    getProductData();
  }, [id, setActiveTab]);

  useEffect(() => {
    if (type !== undefined && type !== null) {
      getSEOReadinessData();
      getProductReadinessData();
    }
  }, [type])

  const onTabClick = (e, index) => {
    e.preventDefault();

    if (index === activeTab) {
      return
    }

    setsaveUnSavedFields((prevState) => ({
      ...prevState,
      currentTab: index,
    }))
    if (saveUnSavedFields.currentState) {
      setWishedToChangeTab(true)
    } else {
      setActiveTab(index);
      setWishedToChangeTab(false)
    }
    // if (!isError) {
    //   if (saveUnSavedFields.currentState) {
    //     setWishedToChangeTab(true)
    //   } else {
    //     setActiveTab(index);
    //     setWishedToChangeTab(false)
    //   }
    // } else {
    //   setModalInfo((prev) => {
    //     return {
    //       ...prev,
    //       message: ValidationMsgs.common.tabValidation,
    //       module: "Product",
    //       title: "Form Error",
    //       ButtonName: "OK",
    //       displayCancelButton: false,
    //     };
    //   });
    //   setOpenBasicModal((prev) => !prev);
    // }
  };

  const displayFieldElement = (array, title) => {
    return array.find((element) => {
      return element.mappingname === title;
    });
  };

  const requiredFields = fields
    .filter((element) => {
      return element.required === "Y";
    })
    .map(function ({ mappingname, required, displayname, dbfield }) {
      return mappingname;
    });

  const fetchFieldProperty = (propertyname, mappingname) => {
    const val = fields.find((element) => {
      if (element.mappingname === mappingname) return element[propertyname];
    });
    return val ? val[propertyname] : null;
  };

  const componentsForm = {
    all: AllInfo,
    basic: BasicInformation,
    pricing: Pricing,
    media: Media,
    product: Product,
    attributes: Attributes,
    inventory: Inventory,
    sizechart: SizeChart,
    personalization: Personalization,
    facet: Facet,
    vendorskumapping: VendorSKUMapping,
    skuswap: SKUSwap,
    bundle: Bundle,
    seo: SEO,
    orderhistory: OrderHistory,
    customerreviews: CustomerReviews,
    customerfaq: CustomerFAQ,
    lifecycle: LifeCycle,
    productAndStoreMapping: ProductAndStoreMapping,
  };

  const checkProductStatus = (errors) => {
    setFormErrors(errors)
    if (errors["productstatus"] != undefined) {
      setStatusError(errors.productstatus);
    } else {
      setStatusError("");
    }
  };

  const displayTabs = useMemo(() => {
    return (isAddMode
      ? masterTabs.filter((element) => element.componentname != "all")
      : masterTabs).filter((element) => ((element.componentname === 'seo' && rest?.store?.isSeoMarketing) || element.componentname !== 'seo'))
  }, [masterTabs, isAddMode, rest?.store]);

  const user = useSelector((store) => store?.user);
  const publishProduct = () => {
    dispatch(setAddLoading(true));
    ProductService.publishProduct({
      isPublish: true,
      productId: id,
      publishBy: user?.id
    }).then((response) => {
      if (response?.data?.success) {
        dispatch(setAlertMessage({
          type: 'success',
          message: ValidationMsgs.store.publish
        }));
        getProductData();
      } else {
        dispatch(setAlertMessage({
          type: 'success',
          message: serverError(response)
        }));
      }
      dispatch(setAddLoading(false));
    }).catch(() => {
      dispatch(setAlertMessage({
        type: 'success',
        message: ValidationMsgs.store.notPublish
      }))
      dispatch(setAddLoading(false));
    });
  }


  const handleFormSubmit = () => {
    FormSubmit.handleSubmit();
    if (!isAddMode && saveUnSavedFields.currentState) {
      setActiveTab(saveUnSavedFields.currentTab);
    }
    dispatch(setAlertMessage({ type: "danger", message: serverError({ data: { errors: formErrors } }) }));
  }

  //clear cache for brand and category
  const clearCacheForBrandCategory = (brandId = data?.brandId, categoryId = data?.categoryId, storeId = data?.storeId) => {
    if (![productType.EcommerceStore, productType.CorporateStore].includes(type)) {
      return;
    }
    dispatch(setAddLoading(true));
    Promise.all([
      CacheService.clearBrandCache({
        catcheBrandidList: {
          catcheIDlist: [brandId],
          storeId: storeId
        }
      }), CacheService.clearCategoryCache({
        catchecategoryidList: {
          catcheIDlist: [categoryId],
          storeId: storeId
        }
      })
    ]).then((response) => {
      // console.log(response);
      dispatch(setAddLoading(false));
    }).catch((error) => { dispatch(setAddLoading(false)); });
  }

  return (
    <>
      {/* <title>{isAddMode ? "Create" : "Edit"} Product</title> */}
      <div className="px-4 sm:px-6 lg:px-6 py-8 w-full">
        {/* Page header */}
        <div className="flex flex-wrap justify-between mb-6 gap-2 sticky top-0 pb-2 pt-2 bg-slate-100 sticky-header z-20">
          <div className="flex items-center">
            <NavLink to={listUrl}
              onClick={() => searchQuery && dispatch(fillSerchQuery(true))}
              href="mc-config-vendor-master.html"
              className="btn border-neutral-200 hover:border-neutral-400 text-gray-500 hover:text-gray-700 flex items-center mr-2"
            >
              <span className="material-icons-outlined">west</span>
            </NavLink>
            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
              {isAddMode ? "Create" : "Edit"} {title ? title : 'Product'}
            </h1>
          </div>
          {(((FormSubmit && activeTab !== 0) || isAddMode) && (permission?.isEdit || permission?.isDelete)) && (
            <div className="flex flex-wrap space-x-2">
              <NavLink
                to={listUrl}
                className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
              >
                Cancel
              </NavLink>

              <button
                type="submit"
                disabled={GlobalLoading}
                onClick={() => handleFormSubmit()}
                className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(GlobalLoading || values.captcha === '') ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}
              >
                <div className={`w-full flex justify-center align-middle `}>
                  Save
                </div>
              </button>
              {/* store?.isProductReadinessAllow ProReadinessData?.readyToPublish && SEOReadinessData?.readyToPublish */}
              {(([productType.EcommerceStore, productType.CorporateStore, productType.Bundle].includes(type) && !isAddMode) && (
                (!rest?.store?.isProductReadinessAllow && !rest?.store?.isSeoReadinessAllow) ||
                (rest?.store?.isProductReadinessAllow && rest?.store?.isSeoReadinessAllow && ProReadinessData?.readyToPublish && SEOReadinessData?.readyToPublish) ||
                (rest?.store?.isProductReadinessAllow && ProReadinessData?.readyToPublish && !rest?.store?.isSeoReadinessAllow) ||
                (rest?.store?.isSeoReadinessAllow && SEOReadinessData?.readyToPublish && !rest?.store?.isProductReadinessAllow)
              )) &&
                <button
                  type="button"
                  onClick={publishProduct}
                  className={`btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white`}
                >
                  Publish
                </button>
              }
            </div>
          )}
        </div>
        <Messages />
        {/* Form Part */}
        <div className="grid grid-cols-12 gap-6">
          {/* Information Part */}
          <div className="col-span-full xl:col-span-9 relative min-h-screen">
            <div className="w-full bg-white shadow-xxl rounded-md mb-8">
              <Tabs
                options={displayTabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isAddMode={isAddMode}
                onTabClick={onTabClick}
              />
              <div className="w-full">
                {(
                  <>
                    {displayTabs
                      .filter((element) => (isAddMode ? element.componentname === "basic" : true))
                      .map((tab, index) => {
                        const Component = componentsForm[tab.componentname];
                        if (activeTab === index) {
                          // if (tab.componentname === "productAndStoreMapping") {
                          //   setOpenProductAndStoreMapping(true)
                          // }
                          return (
                            <div
                              className={`${activeTab !== index && "hidden"
                                } w-full rounded-md mb-8 tab-content text-sm ${tab?.value === 'inventory' ? 'overflow-auto' : 'overflow-visible'}`}
                              key={index}
                            >
                              <Component
                                setFormSubmit={setFormSubmit}
                                displayFieldElement={displayFieldElement}
                                fetchFieldProperty={fetchFieldProperty}
                                fields={fields}
                                values={data}
                                type={type}
                                productId={id || 0}
                                isAddMode={isAddMode}
                                activeTab={activeTab}
                                index={index}
                                setIsError={setIsError}
                                requiredFields={requiredFields}
                                checkProductStatus={checkProductStatus}
                                productstatusVal={productstatusVal}
                                readOnly={tab.readOnly ? tab.readOnly : false}
                                setActiveTab={setActiveTab}
                                masterTabs={masterTabs}
                                getProductData={getProductData}
                                // getValidationForAllFilledFieldsFunc={getValidationForAllFilledFieldsFunc}
                                listUrl={listUrl}
                                moduleName={moduleName}
                                setAttributeCombinations={setAttributeCombinations}
                                AttributeCombinations={AttributeCombinations}
                                getSEOReadinessData={getSEOReadinessData}
                                getProductReadinessData={getProductReadinessData}
                                OpenProductAndStoreMapping={OpenProductAndStoreMapping}
                                setOpenProductAndStoreMapping={setOpenProductAndStoreMapping}
                                setsaveUnSavedFields={setsaveUnSavedFields}
                                saveUnSavedFields={saveUnSavedFields}
                                setWishedToChangeTab={setWishedToChangeTab}
                                WishedToChangeTab={WishedToChangeTab}
                                clearCacheForBrandCategory={clearCacheForBrandCategory}
                                {...tab}
                                {...rest}
                              />
                            </div>
                          );
                        }

                      })}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Side bar containing Status, image part */}
          <div className="flex flex-col col-span-full xl:col-span-3">
            <ProductStatusSidebar
              productstatusVal={productstatusVal}
              setProductStatusVal={setProductStatusVal}
              ProReadinessData={ProReadinessData}
              SEOReadinessData={SEOReadinessData}
              statusError={statusError}
              displayFieldElement={displayFieldElement}
              fetchFieldProperty={fetchFieldProperty}
              fields={fields}
              values={values}
              data={data}
              type={type}
              isAddMode={isAddMode}
              AttributeCombinations={AttributeCombinations}
              updateProductStatus={updateProductStatus}
              activeTab={activeTab}
              productId={id || 0}
              getProductData={getProductData}
              store={rest?.store}
              updateSingleField={updateSingleField}
            // getValidationForAllFilledFields={getValidationForAllFilledFields}
            />
          </div>
        </div>
      </div>

      <BasicModal
        openModal={openBasicModal}
        setOpenModal={setOpenBasicModal}
        {...ModalInfo}
      />

      <SaveChangedFieldsModel
        openModal={saveUnSavedFields.currentState && WishedToChangeTab}
        setOpenModal={setWishedToChangeTab}
        message={"Your changes are not saved yet. Do you want to save your current changes?"}
        module={"Product"}
        title={"Please Confirm To move on another tab."}
        ButtonName={"OK"}
        handleConfirmation={handleFormSubmit}
        cancelButtonAction={getProductData}
        setActiveTab={setActiveTab}
        indexOfCurrentTab={saveUnSavedFields.currentTab}
        setsaveUnSavedFields={setsaveUnSavedFields}
      />
    </>
  );
};

export default Create;
