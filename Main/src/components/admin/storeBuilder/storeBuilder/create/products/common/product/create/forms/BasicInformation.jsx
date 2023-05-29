/*Component Name: BasicInformation.jsx
Component Functional Details: Basic Information tab field display
Created By: Ankit Sharma
Created Date: 11-15-2022
Modified By: chandan
Modified Date: 11-15-2022 */
import React, { useState, useEffect, useRef } from "react";
import { Formik, Form as FormikForm } from "formik";

import * as Yup from "yup";
import { Field } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import Dropdown from "components/common/formComponent/Dropdown";
import { productType } from "dummy/Dummy";
import DropdownService from "services/common/dropdown/DropdownService";
import DimensionService from "services/admin/dimension/DimensionService";
import Input from "components/common/formComponent/Input";
import Checkbox from "components/common/formComponent/Checkbox";
import CKEditor from "components/common/formComponent/CKEditor";
import { useDispatch, useSelector } from "react-redux";
import { serverError } from "services/common/helper/Helper";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import MasterProductService from "services/admin/masterCatalog/masterCatalog/products/ProductService";
import GrandMasterProductService from "services/admin/masterCatalog/grandMaster/products/ProductService";
import StoreProductService from "services/admin/masterCatalog/store/product/ProductService";
import BundleProductService from "services/admin/masterCatalog/store/bundle/ProductService";
import CategoryService from "services/admin/category/CategoryService";
import InputNumber from "components/common/formComponent/InputNumber";
import { ValidationMsgs } from "global/ValidationMessages";
import { ProductStatusValuebyName } from "global/Enum";
import StoreBuilderProductsService from "services/admin/storeBuilderProducts/StoreBuilderProductsService";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const BasicInformation = ({
  displayFieldElement,
  fetchFieldProperty,
  fields,
  values,
  type,
  productId,
  setFormSubmit,
  setIsError,
  activeTab,
  isAddMode,
  index,
  requiredFields,
  checkProductStatus,
  productstatusVal,
  readOnly,
  getProductData,
  setSaveLoading
}) => {
  const navigate = useNavigate();
  const formRef = useRef();
  const { storeId } = useParams();
  const [brandList, setBrandList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [dimensionList, setDimensionList] = useState([]);
  const [ProductTypeList, setProductTypeList] = useState([]);
  const [CategoryList, setCategoryList] = useState([]);
  const [SKUList, setSKUList] = useState([]);
  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);
  const API = (type == productType.MC ? MasterProductService : type == productType.GMC ? GrandMasterProductService : type == productType.EcommerceStore ? StoreProductService : BundleProductService);
  useEffect(() => {
    if (activeTab == index) {
      setFormSubmit(formRef.current);
    }
  }, [formRef, setFormSubmit, activeTab]);

  useEffect(() => {
    let brandsDropdownData = [];
    StoreBuilderProductsService.getBrandsByStore(storeId).then((response) => {
      setBrandList(() => {
        response.data.data.forEach(item => {
          brandsDropdownData.push({ 'value': item.id, 'label': item.brandName });
        });
        return brandsDropdownData;
      });
    });

    DropdownService.getDropdownValues(
      "vendor"
    ).then((response) => {
      setVendorList(() => {
        return response.data.data;
      });
    });

    CategoryService.getCategoryDropdownOptions(-1)
      .then((response) => {
        setCategoryList(() => {
          return response.data.data;
        });
      })

    DropdownService.getDropdownValues(
      "dimension"
    ).then((response) => {
      setDimensionList(() => {
        return response.data.data;
      });
    });
    DropdownService.getDropdownValues(
      "producttype"
    ).then((response) => {
      setProductTypeList(() => {
        return response.data.data;
      });
    });
    /*if (type !== productType.Bundle) {
      API.getSKUList(productId).then((response) => {
        if (response?.data?.data?.length > 0) {
          setSKUList(() => {
            return response.data.data;
          });
        }
      }).catch((error) => { })
    }*/
  }, []);

  const [checkerror, setCheckError] = useState(false);

  const schema = Yup.object({
    [fetchFieldProperty("dbfield", "brandId")]:
      displayFieldElement(fields, "brandId") &&
        requiredFields.indexOf("brandId") > -1
        ? Yup.string().required(ValidationMsgs.common.brandIdRequired)
        : null,
    [fetchFieldProperty("dbfield", "bundleName")]:
      displayFieldElement(fields, "bundleName") &&
        requiredFields.indexOf("bundleName") > -1
        ? Yup.string().required(ValidationMsgs.masterCatalog.basicInformation.bundleNameRequired)
        : null,
    [fetchFieldProperty("dbfield", "vendorId")]:
      displayFieldElement(fields, "vendorId") &&
        requiredFields.indexOf("vendorId") > -1
        ? Yup.string().required(ValidationMsgs.common.vendorIdRequired)
        : null,
    [fetchFieldProperty("dbfield", "name")]:
      displayFieldElement(fields, "name") && requiredFields.indexOf("name") > -1
        ? Yup.string().required(ValidationMsgs.masterCatalog.basicInformation.nameRequired)
        : null,
    [fetchFieldProperty("dbfield", "nameInERP")]: Yup.string().when("isNameDifferentfromERP", {
      is: (isNameDifferentfromERP) => isNameDifferentfromERP == true,
      then: Yup.string().required(ValidationMsgs.masterCatalog.basicInformation.nameInERPRequired),
      otherwise: Yup.string(),
    }),
    [fetchFieldProperty("dbfield", "erpItemId")]: Yup.string().when("isERPNameDifferent", {
      is: (isERPNameDifferent) => isERPNameDifferent == true,
      then: Yup.string().required(ValidationMsgs.masterCatalog.basicInformation.erpItemId),
      otherwise: Yup.string(),
    }),
    [fetchFieldProperty("dbfield", "vendorSKU")]:
      displayFieldElement(fields, "vendorSKU") &&
        requiredFields.indexOf("vendorSKU") > -1
        ? Yup.string().required(ValidationMsgs.masterCatalog.basicInformation.vendorSKURequired)
        : null,
    [fetchFieldProperty("dbfield", "ourSKU")]:
      displayFieldElement(fields, "ourSKU") && requiredFields.indexOf("ourSKU") > -1
        ? Yup.string().required(ValidationMsgs.masterCatalog.basicInformation.ourSKURequired)
        : null,
    [fetchFieldProperty("dbfield", "producttypeId")]:
      displayFieldElement(fields, "producttypeId") &&
        requiredFields.indexOf("producttypeId") > -1
        ? Yup.string().required(ValidationMsgs.masterCatalog.basicInformation.producttypeIdRequired)
        : null,
    [fetchFieldProperty("dbfield", "companionProduct")]:
      displayFieldElement(fields, "companionProduct") &&
        requiredFields.indexOf("companionProduct") > -1
        ? Yup.string().required(ValidationMsgs.masterCatalog.basicInformation.companionProductRequired)
        : null,
    [fetchFieldProperty("dbfield", "taxCode")]:
      displayFieldElement(fields, "taxCode") &&
        requiredFields.indexOf("taxCode") > -1
        ? Yup.string().required(ValidationMsgs.masterCatalog.basicInformation.taxCodeRequired)
        : null,
    [fetchFieldProperty("dbfield", "categoryId")]:
      displayFieldElement(fields, "categoryId") &&
        requiredFields.indexOf("categoryId") > -1
        ? Yup.string().required(ValidationMsgs.masterCatalog.basicInformation.categoryIdRequired)
        : null,
    [fetchFieldProperty("dbfield", "description")]:
      displayFieldElement(fields, "description") &&
        requiredFields.indexOf("description") > -1
        ? Yup.string().required(ValidationMsgs.masterCatalog.basicInformation.descriptionRequired)
        : null,
    [fetchFieldProperty("dbfield", "shortDescription")]: type !== productType.GMC ?
      displayFieldElement(fields, "shortDescription") &&
        requiredFields.indexOf("shortDescription") > -1
        ? Yup.string().required(ValidationMsgs.masterCatalog.basicInformation.shortDescriptionRequired)
        : null : Yup.string(),
    [fetchFieldProperty("dbfield", "dimensionTemplateId")]:
      displayFieldElement(fields, "dimensionTemplateId") &&
        requiredFields.indexOf("dimensionTemplateId") > -1
        ? Yup.string().required(ValidationMsgs.masterCatalog.basicInformation.dimensionTemplateIdRequired)
        : null,
    [fetchFieldProperty("dbfield", "width")]:
      displayFieldElement(fields, "width") &&
        requiredFields.indexOf("width") > -1
        ? Yup.string().required(ValidationMsgs.masterCatalog.basicInformation.widthRequired)
        : null,
    [fetchFieldProperty("dbfield", "height")]:
      displayFieldElement(fields, "height") &&
        requiredFields.indexOf("height") > -1
        ? Yup.string().required(ValidationMsgs.masterCatalog.basicInformation.heightRequired)
        : null,
    [fetchFieldProperty("dbfield", "length")]:
      displayFieldElement(fields, "length") &&
        requiredFields.indexOf("length") > -1
        ? Yup.string().required(ValidationMsgs.masterCatalog.basicInformation.lengthRequired)
        : null,
    [fetchFieldProperty("dbfield", "volume")]:
      displayFieldElement(fields, "volume") &&
        requiredFields.indexOf("volume") > -1
        ? Yup.string().required(ValidationMsgs.masterCatalog.basicInformation.volumeRequired)
        : null,
    [fetchFieldProperty("dbfield", "weightInLBS")]:
      displayFieldElement(fields, "weightInLBS") &&
        requiredFields.indexOf("weightInLBS") > -1
        ? Yup.string().required(ValidationMsgs.masterCatalog.basicInformation.weightInLBSRequired)
        : null,
    [fetchFieldProperty("dbfield", "shipWeightinLBS")]:
      displayFieldElement(fields, "shipWeightinLBS") &&
        requiredFields.indexOf("shipWeightinLBS") > -1
        ? Yup.string().required(ValidationMsgs.masterCatalog.basicInformation.shipWeightinLBSRequired)
        : null,
    recStatus: Yup.string().required(ValidationMsgs.common.productstatus),
  });

  useEffect(() => {
    setIsError(checkerror);
  }, [checkerror]);

  const handleDimensionChange = (val, values, setValues) => {
    if (val) {
      DimensionService.getDimensionById(val?.value)
        .then((res) => {
          var response = res.data;

          if (response.success) {
            setValues({
              ...values, length: response.data.length, width: response.data.width, height: response.data.height, volume: response.data.volume,
            });
          }
        })
        .catch((err) => { });
    }
  };

  const submitHandler = (fields, { resetForm }) => {
    dispatch(setAddLoading(true))

    fields = {
      ...fields, erpItemId: (fields.erpItemId && fields.erpItemId !== '' ? fields.erpItemId : 0),
      length: (fields.length && fields.length !== '' ? fields.length : 0),
      height: (fields.height && fields.height !== '' ? fields.height : 0),
      width: (fields.width && fields.width !== '' ? fields.width : 0),
      volume: (fields.volume && fields.volume !== '' ? fields.volume : 0),
      weightInLBS: (fields.weightInLBS && fields.weightInLBS !== '' ? fields.weightInLBS : 0),
      shipWeightinLBS: (fields.shipWeightinLBS && fields.shipWeightinLBS !== '' ? fields.shipWeightinLBS : 0),
    }
    window.scrollTo({ top: 0, left: 0 });
    let moduleName = (type == productType.MC ? "MasterCatalog" : type == productType.GMC ? "GrandMasterCatalog" : type == productType.EcommerceStore ? "Store" : "Bundle");

    if (isAddMode) {
      API.createProduct({
        productModel: { ...fields, ...location },
      })
        .then((response) => {
          if (response.data.success) {
            dispatch(
              setAlertMessage({
                type: "success",
                message: ValidationMsgs.masterCatalog.basicInformation.created,
              })
            );
            resetForm({});
            if (moduleName === "Store" || moduleName === "Bundle") {
              navigate(`/admin/StoreBuilder/store/${storeId}/${moduleName}/edit/${response.data.data.id}`)
            } else {
              navigate(`/admin/StoreBuilder/store/edit/${storeId}`)
            }
          } else {
            dispatch(
              setAlertMessage({ type: "danger", message: serverError(response) })
            );
          }
          dispatch(setAddLoading(false))


        })
        .catch((errors) => {
          dispatch(
            setAlertMessage({
              type: "danger",
              message: ValidationMsgs.masterCatalog.basicInformation.notCreated,
            })
          );
          dispatch(setAddLoading(false))

        });
    } else {
      API.updateProduct({ productBasicInfoModel: { ...fields, ...location } })
        .then((response) => {
          if (response?.data?.success) {
            dispatch(
              setAlertMessage({
                type: "success",
                message: ValidationMsgs.masterCatalog.basicInformation.updated,
              })
            );
            getProductData();
          } else {
            dispatch(
              setAlertMessage({ type: "danger", message: serverError(response) })
            );
          }
          dispatch(setAddLoading(false))

        })
        .catch((errors) => {
          dispatch(
            setAlertMessage({
              type: "danger",
              message: ValidationMsgs.masterCatalog.basicInformation.notUpdated,
            })
          );
          dispatch(setAddLoading(false))

        });
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={!isAddMode}
        initialValues={{
          id: values?.id || 0,
          brandId: values?.brandId || "",
          vendorId: values?.vendorId || "",
          storeId: storeId,
          isBundle: true,
          name: values?.name || "",
          isNameDifferentfromERP: values?.isNameDifferentfromERP || false,
          nameInERP: values?.nameInERP || "",
          isERPNameDifferent: values?.isERPNameDifferent || false,
          erpItemId: values?.erpItemId || 0,
          vendorSKU: values?.vendorSKU || "",
          ourSKU: values?.ourSKU || "",
          producttypeId: values?.producttypeId || "",
          companionProduct: values?.companionProduct || "",
          taxCode: values?.taxCode || "",
          categoryId: values?.categoryId || "",
          description: values.description || "",
          shortDescription: values?.shortDescription || "",
          dimensionTemplateId: values?.dimensionTemplateId || 0,
          length: values?.length || 0,
          height: values?.height || 0,
          width: values?.width || 0,
          volume: values?.volume || 0,
          weightInLBS: values?.weightInLBS || 0,
          shipWeightinLBS: values?.shipWeightinLBS || 0,
          recStatus: values?.productStatus || productstatusVal || ProductStatusValuebyName.Active,
          rowVersion: values?.rowVersion || null
        }}
        validationSchema={schema}
        onSubmit={submitHandler}
        innerRef={formRef}
      >
        {({ errors, touched, setFieldValue, values, resetForm, setValues }) => {
          setCheckError(Object.keys(errors).length ? true : false);
          checkProductStatus(errors);
          return (
            <FormikForm>
              <Field
                type="hidden"
                name="productstatus"
                id="productstatus"
              />
              <div className="panel-01 tab-content p-6">
                {/* Brand Field Display */}
                {displayFieldElement(fields, "brandId") && (
                  <>
                    <div className="mb-6 last:mb-0 pt-6">
                      <label className="text-xs font-semibold text-gray-500 uppercase mb-2">
                        {fetchFieldProperty("displayname", "brandId")}
                        {requiredFields.indexOf("brandId") >= 0 && (
                          <>
                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </>
                        )}
                      </label>

                      <Dropdown
                        label="brand"
                        isMulti={false}
                        name={fetchFieldProperty("dbfield", "brandId")}
                        options={brandList}
                        isSearchable={true}
                        defaultValue={values.brandId}
                        isDisabled={readOnly}
                      />
                    </div>
                  </>
                )}
                {/* Vendor Field Display */}
                {displayFieldElement(fields, "vendorId") && (
                  <>
                    <div className="w-full mb-6 last:mb-0">
                      <label className="text-xs font-semibold text-gray-500 uppercase mb-2">
                        {fetchFieldProperty("displayname", "vendorId")}
                        {requiredFields.indexOf("vendorId") >= 0 && (
                          <>
                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </>
                        )}
                      </label>

                      <Dropdown
                        label="vendor"
                        isMulti={false}
                        name={fetchFieldProperty("dbfield", "vendorId")}
                        options={vendorList}
                        isSearchable={false}
                        defaultValue={values.vendorId}
                        isDisabled={readOnly}
                      />
                    </div>
                  </>
                )}

                {/* Product Name Field Display */}
                {displayFieldElement(fields, "name") && (
                  <>
                    <div className="w-full mb-6 last:mb-0">
                      <label className="text-xs font-semibold text-gray-500 uppercase mb-2">
                        {fetchFieldProperty("displayname", "name")}
                        {requiredFields.indexOf("name") >= 0 && (
                          <>
                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </>
                        )}
                      </label>

                      <Input
                        type={"text"}
                        name={fetchFieldProperty("dbfield", "name")}
                        placeholder=""
                        id="name"
                        maxLength={200}
                        className={` bg-white`}
                        disabled={readOnly}
                      />
                    </div>
                  </>
                )}
                {/* Different ERP Name checkbox display along with Textbox for ERP Name if different than product name */}
                {displayFieldElement(fields, "isNameDifferentfromERP") && (
                  <>
                    <div className="mb-6 last:mb-0">
                      <div className="">
                        <Checkbox
                          label={fetchFieldProperty(
                            "displayname",
                            "isNameDifferentfromERP"
                          )}
                          name={fetchFieldProperty("dbfield", "isNameDifferentfromERP")}
                          onChange={(e) => {
                            setFieldValue(fetchFieldProperty("dbfield", "isNameDifferentfromERP"), e.target.checked);
                          }}
                          value={values.isNameDifferentfromERP}
                          type={"checkbox"}
                          className={"form-checkbox"}
                          checked={values.isNameDifferentfromERP}
                          disabled={readOnly}
                          id={'isNameDifferentfromERP'}
                        />

                      </div>

                      {values.isNameDifferentfromERP && (
                        <>
                          <div className="w-full mb-6 last:mb-0">
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-2">
                              {fetchFieldProperty("displayname", "nameInERP")}
                              {requiredFields.indexOf("nameInERP") > -1 && (
                                <>
                                  <span className="text-rose-500 text-2xl leading-none">
                                    *
                                  </span>
                                </>
                              )}
                            </label>

                            <Input
                              type={"text"}
                              name={fetchFieldProperty("dbfield", "nameInERP")}
                              id="nameInERP"
                              maxLength={200}
                              className={`appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                              disabled={readOnly}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}

                {/* Exist NAV ID field  */}
                {displayFieldElement(fields, "isERPNameDifferent") && (
                  <>
                    <div className="mb-6 last:mb-0">
                      <div className="">
                        <Checkbox
                          label={fetchFieldProperty(
                            "displayname",
                            "isERPNameDifferent"
                          )}
                          name={fetchFieldProperty("dbfield", "isERPNameDifferent")}
                          onChange={(e) => {
                            setFieldValue(fetchFieldProperty("dbfield", "isERPNameDifferent"), !values.isERPNameDifferent);
                          }}
                          value={values.isERPNameDifferent}
                          type={"checkbox"}
                          className={"form-checkbox"}
                          checked={values.isERPNameDifferent}
                          disabled={readOnly}
                          id={'isERPNameDifferent'}
                        />

                      </div>

                      {values.isERPNameDifferent && (
                        <>
                          <div className="w-full mb-6 last:mb-0">
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-2">
                              {fetchFieldProperty(
                                "displayname",
                                "erpItemId"
                              )}
                              {requiredFields.indexOf("erpItemId") > -1 && (
                                <>
                                  <span className="text-rose-500 text-2xl leading-none">
                                    *
                                  </span>
                                </>
                              )}
                            </label>

                            <InputNumber
                              type={"text"}
                              name={fetchFieldProperty("dbfield", `erpItemId`)}
                              placeholder=""
                              id="erpItemId"
                              maxLength={8}
                              className={`appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                              disabled={readOnly}
                              value={values?.erpItemId}
                              decimalScale={0}
                              onChange={(e) => {
                                setFieldValue('erpItemId', e.target.value);
                              }}
                              displayError={true}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}

                {/* Vendor SKU field display */}
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:space-x-6">
                  {displayFieldElement(fields, "vendorSKU") && (
                    <>
                      <div className="mb-6">
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                          {fetchFieldProperty("displayname", "vendorSKU")}
                          {requiredFields.indexOf("vendorSKU") > -1 && (
                            <>
                              <span className="text-rose-500 text-2xl leading-none">
                                *
                              </span>
                            </>
                          )}
                        </label>

                        <Input
                          type={"text"}
                          name={`vendorSKU`}
                          placeholder=""
                          maxLength={100}
                          id="vendorSKU"
                          className={`block w-full border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md bg-gray-200`}
                          disabled={readOnly}
                        />
                      </div>
                    </>
                  )}

                  {/* Product SKU field display */}
                  {displayFieldElement(fields, "ourSKU") && (
                    <>
                      <div className="mb-6">
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                          {fetchFieldProperty("displayname", "ourSKU")}
                          {requiredFields.indexOf("ourSKU") > -1 && (
                            <>
                              <span className="text-rose-500 text-2xl leading-none">
                                *
                              </span>
                            </>
                          )}
                        </label>

                        <Input
                          type={"text"}
                          name={fetchFieldProperty("dbfield", `ourSKU`)}
                          placeholder=""
                          id="ourSKU"
                          maxLength={100}
                          className={`skublock w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}
                          disabled={readOnly}
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:space-x-6">
                  {/* Product Sub Type field display */}
                  {displayFieldElement(fields, "producttypeId") && (
                    <>
                      <div className="mb-6">
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                          {fetchFieldProperty("displayname", "producttypeId")}
                          {requiredFields.indexOf("producttypeId") > -1 && (
                            <>
                              <span className="text-rose-500 text-2xl leading-none">
                                *
                              </span>
                            </>
                          )}
                        </label>

                        <Dropdown
                          label="producttypeId"
                          isMulti={false}
                          name={fetchFieldProperty(
                            "dbfield",
                            "producttypeId"
                          )}
                          options={ProductTypeList}
                          isSearchable={false}
                          defaultValue={values.producttypeId}
                          isDisabled={readOnly}
                        />
                      </div>
                    </>
                  )}
                  {/* Product Sub Type field display */}
                  {displayFieldElement(fields, "companionProduct") && (
                    <>
                      <div className="mb-6">
                        <label className="text-xs font-semibold text-gray-500 uppercase mb-2">
                          {fetchFieldProperty("displayname", "companionProduct")}
                          {requiredFields.indexOf("companionProduct") >= 0 && (
                            <>
                              <span className="text-rose-500 text-2xl leading-none">
                                *
                              </span>
                            </>
                          )}
                        </label>

                        <Dropdown
                          label="Companion Product"
                          isMulti={false}
                          name={fetchFieldProperty("dbfield", "companionProduct")}
                          onChange={(value) => {
                            setFieldValue('companionProduct', (value ? value.value : ""))
                          }}
                          options={SKUList}
                          isSearchable={true}
                          defaultValue={values.companionProduct}
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:space-x-6">
                  {/* Tax Code field display */}
                  {displayFieldElement(fields, "taxCode") && (
                    <>
                      <div className="mb-6">
                        <label className="text-xs font-semibold text-gray-500 uppercase mb-2">
                          {fetchFieldProperty("displayname", "taxCode")}
                          {requiredFields.indexOf("taxCode") > -1 && (
                            <>
                              <span className="text-rose-500 text-2xl leading-none">
                                *
                              </span>
                            </>
                          )}
                          <a href="https://taxcode.avatax.avalara.com/" target={"_blank"}
                            className="ml-4 normal-case font-normal underline text-xs cursor-pointer"
                          >
                            Click here to find tax code
                          </a>
                        </label>

                        <Input
                          type={"text"}
                          name={fetchFieldProperty("dbfield", "taxCode")}
                          placeholder=""
                          maxLength={20}
                          id="taxCode"
                          className={`appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                          disabled={readOnly}
                        />
                      </div>
                    </>
                  )}
                </div>
                {/* {type !== productType.GMC && */}
                <>
                  {displayFieldElement(fields, "categoryId") && (
                    <>
                      <div className="w-full mb-6 last:mb-0">
                        <label className="text-xs font-semibold text-gray-500 uppercase mb-2">
                          {fetchFieldProperty("displayname", "categoryId")}
                          {requiredFields.indexOf("categoryId") >= 0 && (
                            <>
                              <span className="text-rose-500 text-2xl leading-none">
                                *
                              </span>
                            </>
                          )}
                        </label>

                        <Dropdown
                          label="category"
                          isMulti={false}
                          name={fetchFieldProperty("dbfield", "categoryId")}
                          options={CategoryList}
                          isSearchable={true}
                          defaultValue={values.categoryId}
                          isDisabled={readOnly}
                        />
                      </div>
                    </>
                  )}
                </>
                {/* } */}


                {/* Product Description field display */}
                {displayFieldElement(fields, "description") && (
                  <>
                    <div className="w-full mb-6 last:mb-0">
                      <label className="text-xs font-semibold text-gray-500 uppercase mb-2">
                        {fetchFieldProperty("displayname", "description")}
                        {requiredFields.indexOf("description") > -1 && (
                          <>
                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </>
                        )}
                      </label>
                      <CKEditor
                        id="description"
                        name={fetchFieldProperty("dbfield", "description")}
                        defaultValue={values.description}
                        onChange={(value) => {
                          setFieldValue("description", value);
                        }}
                        readOnly={readOnly}
                      />
                    </div>
                  </>
                )}

                {/* Product ShortDescription field display */}
                {type != productType.GMC &&
                  <>
                    {displayFieldElement(fields, "shortDescription") && (
                      <>
                        <div className="w-full mb-6 last:mb-0">
                          <label className="text-xs font-semibold text-gray-500 uppercase mb-2">
                            {fetchFieldProperty("displayname", "shortDescription")}
                            {requiredFields.indexOf("shortDescription") > -1 && (
                              <>
                                <span className="text-rose-500 text-2xl leading-none">
                                  *
                                </span>
                              </>
                            )}
                          </label>
                          {/* <Artists /> */}
                          <CKEditor
                            id="shortDescription"
                            name={fetchFieldProperty("dbfield", "shortDescription")}
                            defaultValue={values?.shortDescription}
                            onChange={(value) => {
                              setFieldValue("shortDescription", value);
                            }}
                            readOnly={readOnly}
                          />


                        </div>
                      </>
                    )}
                  </>
                }
                {/* Product Dimension field display */}
                {displayFieldElement(fields, "dimensionTemplateId") && (
                  <>
                    <div className="w-full mb-6 last:mb-0">
                      <label className="text-xs font-semibold text-gray-500 uppercase mb-2">
                        {fetchFieldProperty("displayname", "dimensionTemplateId")}
                        {requiredFields.indexOf("dimensionTemplateId") > -1 && (
                          <>
                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </>
                        )}
                      </label>


                      <Dropdown
                        label="dimensionTemplateId"
                        name={fetchFieldProperty("dbfield", "dimensionTemplateId")}
                        options={dimensionList}
                        isSearchable={true}
                        defaultValue={values?.dimensionTemplateId}
                        onChange={(value, event) => {
                          setFieldValue('dimensionTemplateId', (value ? value.value : 0));
                          handleDimensionChange(value, { ...values, dimensionTemplateId: value.value }, setValues);
                        }}
                        isDisabled={readOnly}
                        isClearable={true}
                      />
                    </div>
                  </>
                )}
                <div className="flex items-center mb-6">
                  {displayFieldElement(fields, "length") && (
                    <>
                      <div className="relative grow">
                        <label className="text-xs font-semibold text-gray-500 uppercase mb-2">
                          {fetchFieldProperty("displayname", "length")}
                        </label>
                        <InputNumber
                          type={"text"}
                          name={fetchFieldProperty(
                            "dbfield",
                            "length"
                          )}
                          placeholder="length"
                          id="length"
                          onChange={(e) => {
                            setFieldValue(e.target.id, e.target.value)
                            if (!['', null, undefined].includes(e.target.value) && !['', null, undefined].includes(values.width) && !['', null, undefined].includes(values.height)) {
                              setFieldValue('volume', values.width * e.target.value * values.height);
                            } else {
                              setFieldValue('volume', "");
                            }
                          }}
                          disabled={readOnly}
                          value={values.length}
                          // value={dimensionValues?.length || ""}
                          allowNegative={false}
                        />
                      </div>
                    </>
                  )}
                  {displayFieldElement(fields, "width") && (
                    <>
                      <div className="mx-2">X</div>
                      <div className="relative grow">
                        <label className="text-xs font-semibold text-gray-500 uppercase mb-2">
                          {fetchFieldProperty("displayname", "width")}
                        </label>
                        <InputNumber
                          type={"text"}
                          name={fetchFieldProperty(
                            "dbfield",
                            "width"
                          )}
                          placeholder="width"
                          id="width"
                          onChange={(e) => {
                            setFieldValue(e.target.id, e.target.value)
                            if (!['', null, undefined].includes(e.target.value) && !['', null, undefined].includes(values.length) && !['', null, undefined].includes(values.height)) {
                              setFieldValue('volume', values.length * e.target.value * values.height);
                            } else {
                              setFieldValue('volume', "");
                            }
                          }}
                          disabled={readOnly}
                          value={values?.width}
                          allowNegative={false}
                        />
                      </div>
                    </>
                  )}
                  {displayFieldElement(fields, "height") && (
                    <>
                      <div className="mx-2">X</div>
                      <div className="relative grow">
                        <label className="text-xs font-semibold text-gray-500 uppercase mb-2">
                          {fetchFieldProperty("displayname", "height")}
                        </label>
                        <InputNumber
                          type={"text"}
                          name={fetchFieldProperty(
                            "dbfield",
                            "height"
                          )}
                          placeholder="height"
                          id="height"
                          className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}
                          onChange={(e) => {
                            setFieldValue(e.target.id, e.target.value)
                            if (!['', null, undefined].includes(e.target.value) && !['', null, undefined].includes(values.width) && !['', null, undefined].includes(values.length)) {
                              setFieldValue('volume', values.width * e.target.value * values.length);
                            } else {
                              setFieldValue('volume', "");
                            }
                          }}
                          disabled={readOnly}
                          value={values?.height}
                          allowNegative={false}
                        />
                      </div>
                    </>
                  )}
                  {displayFieldElement(fields, "volume") && (
                    <>
                      <div className="mx-2">=</div>
                      <div className="relative grow">
                        <label className="text-xs font-semibold text-gray-500 uppercase mb-2">
                          {fetchFieldProperty("displayname", "volume")}
                        </label>
                        <Input
                          type={"text"}
                          name={fetchFieldProperty(
                            "dbfield",
                            "volume"
                          )}
                          placeholder=""
                          id="volume"
                          className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}
                          readOnly={true}
                        // value={dimensionValues?.volume || ""}
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Product Weight field display */}
                {displayFieldElement(fields, "weightInLBS") && (
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 lg:space-x-6">

                      <div className="mb-6">
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                          {fetchFieldProperty("displayname", "weightInLBS")}
                          {requiredFields.indexOf("weightInLBS") > -1 && (
                            <>
                              <span className="text-rose-500 text-2xl leading-none">
                                *
                              </span>
                            </>
                          )}
                        </label>

                        <InputNumber
                          type={"text"}
                          name={fetchFieldProperty("dbfield", `weightInLBS`)}
                          placeholder=""
                          id="weightInLBS"
                          className={`appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                          disabled={readOnly}
                          onChange={(e) => {
                            setFieldValue('weightInLBS', e.target.value);
                          }}
                          defaultValue={values.weightInLBS}
                        />

                      </div>
                      <div className="mb-6">
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                          {fetchFieldProperty("displayname", "shipWeightinLBS")} (LBS)
                          {requiredFields.indexOf("shipWeightinLBS") > -1 && (
                            <>
                              <span className="text-rose-500 text-2xl leading-none">
                                *
                              </span>
                            </>
                          )}
                        </label>

                        <InputNumber
                          type={"text"}
                          name={`shipWeightinLBS`}
                          placeholder=""
                          id="shipWeightinLBS"
                          className={`appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                          disabled={readOnly}
                          onChange={(e) => {
                            setFieldValue('shipWeightinLBS', e.target.value);
                          }}
                          defaultValue={values.shipWeightinLBS}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </FormikForm>
          );
        }}
      </Formik>
    </>
  );
};

export default BasicInformation;
