/*Component Name: Create.jsx
Component Functional Details: Create/Edit file for product. This file will be common for all store products
Created By: Ankit Sharma
Created Date: 11-15-2022
Modified By: Ankit Sharma
Modified Date: 11-15-2022 */

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
import AllInfo from "./views/AllInfo";
import Product from "./forms/Product";
import { useDispatch, useSelector } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import TableLoading from "components/common/table/TableLoading";
import ProductService from "services/admin/masterCatalog/store/product/ProductService";
import { ValidationMsgs } from "global/ValidationMessages";
import { fillSerchQuery } from "redux/searchQueryForMGS/SearchQueryAction";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const Create = ({ masterTabs, masterCatalogFields = [], listUrl, title, type, getProductById, updateProductStatus, moduleName, ...rest }) => {
  const permission = useSelector(store => store.permission);
  const { id } = useParams();
  const { storeId } = useParams();
  const [ModalInfo, setModalInfo] = useState({});
  const [openBasicModal, setOpenBasicModal] = useState(false);
  const [FormSubmit, setFormSubmit] = useState(null);
  const [data, setData] = useState([]);
  const [ProRedinessData, setProRedinessData] = useState([]);
  const [SEORedinessData, setSEORedinessData] = useState([]);
  //const [PubilshDisabled, setPubilshDisabled] = useState(!ProRedinessData.readyToPublish && !SEORedinessData.readyToPublish ? true : false);
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
  const [saveLoading, setSaveLoading] = useState(false);
  //const [editLoading, setEditLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [AttributeCombinations, setAttributeCombinations] = useState([]);
  const searchQuery = useSelector((store) => store?.SearchQueryReducers?.searchQuery);

  const getProductData = useCallback(() => {
    if (id) {
      //setEditLoading(true);
      dispatch(setAddLoading(true));
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
          //setEditLoading(false);
          dispatch(setAddLoading(false));
        }).catch((error) => {
          dispatch(
            setAlertMessage({
              message: ValidationMsgs.common.productNotFound,
              type: "danger",
            })
          );
          dispatch(setAddLoading(false));
          return navigate(listUrl);
        });

    }
  }, [id]);

  const getProductRedinessData = useCallback(() => {
    if (type === productType.Bundle) {
      dispatch(setAddLoading(true))

      ProductService.getProductRedinessById(id, storeId).then((response) => {
        if (response.data.data) {
          setProRedinessData(response.data.data);
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
  }, [id, setActiveTab])

  const getSEORedinessData = useCallback(() => {
    if (type === productType.Bundle) {
      dispatch(setAddLoading(true))

      ProductService.getSEORedinessById(id, storeId).then((response) => {
        if (response.data.data) {
          setSEORedinessData(response.data.data);
        }
      }).catch((error) => {
        dispatch(
          setAlertMessage({
            message: ValidationMsgs.common.productNotFound,
            type: "danger",
          })
        );
      });
    }
  }, [id, setActiveTab]);

  useEffect(() => {
    getProductData();
    getSEORedinessData();
    getProductRedinessData();
  }, [id, setActiveTab]);

  const onTabClick = (e, index) => {
    e.preventDefault();
    if (!isError) {
      setActiveTab(index);
    } else {
      setModalInfo((prev) => {
        return {
          ...prev,
          message: ValidationMsgs.common.tabValidation,
          module: "Product",
          title: "Form Error",
          ButtonName: "OK",
          displayCancelButton: false,
        };
      });
      setOpenBasicModal((prev) => !prev);
    }
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
  };

  const checkProductStatus = (errors) => {
    if (errors["productstatus"] != undefined) {
      setStatusError(errors.productstatus);
    } else {
      setStatusError("");
    }
  };

  const displayTabs = useMemo(() => {
    return isAddMode
      ? masterTabs.filter((element) => element.componentname != "all")
      : masterTabs
  }, [masterTabs, isAddMode]);

  return (
    <>
      <title>{isAddMode ? "Create" : "Edit"} {title ? title : 'Product'}</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
        {/* Page header */}
        <div className="flex flex-wrap justify-between mb-6 gap-2 sticky top-0 pb-2 pt-2 bg-slate-100 sticky-header z-30">
          <div className="flex items-center">
            <NavLink to={listUrl}
              onClick={() => searchQuery && dispatch(fillSerchQuery(true))}
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
                disabled={saveLoading}
                onClick={() => {
                  FormSubmit.handleSubmit();
                }}
                className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(saveLoading || values.captcha === '') ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}
              >
                <div className={`w-full flex justify-center align-middle `}>
                  {saveLoading && (
                    <span className="spinner-border spinner-border-sm mr-2"></span>
                  )}
                  Save
                </div>
              </button>

              {((type === productType.Bundle) && (ProRedinessData.readyToPublish && SEORedinessData.readyToPublish)) &&
                <button
                  type="button"
                  onClick={() => {
                    // FormSubmit.handlePublish();
                  }}
                  className="btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white"
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
                          return (
                            <div
                              className={`${activeTab !== index && "hidden"
                                } w-full rounded-md mb-8 tab-content text-sm`}
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
                                listUrl={listUrl}
                                setSaveLoading={setSaveLoading}
                                moduleName={moduleName}
                                setAttributeCombinations={setAttributeCombinations}
                                AttributeCombinations={AttributeCombinations}
                                getSEORedinessData={getSEORedinessData}
                                getProductRedinessData={getProductRedinessData}
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
              ProRedinessData={ProRedinessData}
              SEORedinessData={SEORedinessData}
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
            />
          </div>
        </div>
      </div>

      <BasicModal
        openModal={openBasicModal}
        setOpenModal={setOpenBasicModal}
        {...ModalInfo}
      />
    </>
  );
};

export default Create;
