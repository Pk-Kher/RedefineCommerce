import React, { useState, useEffect, useRef } from "react";
import { Formik, Form as FormikForm } from "formik";

import * as Yup from "yup";
import { useFormikContext } from "formik";
import Input from "components/common/formComponent/Input";
import Textarea from "components/common/formComponent/Textarea";
import ImageFile from "components/common/formComponent/ImageFile";
import { ValidationMsgs } from "global/ValidationMessages";
import OpenGraphPopup from "components/common/modals/SEOConfig/OpenGraphPopup";
import RadioButton from "components/common/formComponent/RadioButton";
import ReactTooltip from "react-tooltip";
import { productType } from "dummy/Dummy";
import { useDispatch, useSelector } from "react-redux";
import { serverError } from "services/common/helper/Helper";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import SEOSocial from "components/common/others/admin/SEO/SEOSocial";
import StoreProductService from "services/admin/masterCatalog/store/product/SEOService";
import BundleProductService from "services/admin/masterCatalog/store/bundle/SEOService";
import { useCallback } from "react";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const SEO = ({
  displayFieldElement,
  fetchFieldProperty,
  fields,
  values,
  setFormSubmit,
  setIsError,
  activeTab,
  index,
  type,
  isAddMode,
  setModalInfo,
  setOpenBasicModal,
  requiredFields,
  checkProductStatus,
  productstatusVal,
  readOnly,
  productId,
  moduleName,
  setSaveLoading
}) => {

  const [checkerror, setCheckError] = useState(false);
  const dispatch = useDispatch();
  const [Data, setData] = useState([]);
  const CompanyId = useSelector((store) => store?.CompanyConfiguration.id)
  const location = useSelector((store) => store?.location);
  const API = (type == productType.storeBuilder ? StoreProductService : BundleProductService)
  const regexCode = /(<([^>]+)>)/gi;
  const [loading, setLoading] = useState(false);

  const formRef = useRef();
  useEffect(() => {
    if (activeTab === index) {
      setFormSubmit(formRef.current);
    }
  }, [formRef, setFormSubmit, activeTab]);


  const getSEOById = useCallback(() => {
    let unmounted = false;
    dispatch(setAddLoading(true))
    API.getSEOById(productId)
      .then((stores) => {
        if (stores?.data?.success && !unmounted) {
          setData(stores?.data?.data);
        }
        dispatch(setAddLoading(false))
      })
      .catch((error) => {
        dispatch(setAddLoading(false))
      });
  }, [productId]);

  useEffect(() => {
    getSEOById();
  }, [getSEOById]);

  const schema = Yup.object({
    [fetchFieldProperty("dbfield", "page_url")]:
      displayFieldElement(fields, "page_url") &&
        requiredFields.indexOf("page_url") > -1
        ? Yup.string().required(
          ValidationMsgs.masterCatalog.seo.pagetitleRequired
        )
        : null,
    [fetchFieldProperty("dbfield", "pageTitle")]:
      displayFieldElement(fields, "pageTitle") &&
        requiredFields.indexOf("pageTitle") > -1
        ? Yup.string().required(
          ValidationMsgs.masterCatalog.seo.pagetitleRequired
        )
        : null,
    [fetchFieldProperty("dbfield", "metaDescription")]:
      displayFieldElement(fields, "metaDescription") &&
        requiredFields.indexOf("metaDescription") > -1
        ? Yup.string().required(
          ValidationMsgs.masterCatalog.seo.metadescriptionRequired
        )
        : null,
    [fetchFieldProperty("dbfield", "metaKeywords")]:
      displayFieldElement(fields, "metaKeywords") &&
        requiredFields.indexOf("metaKeywords") > -1
        ? Yup.string().required(
          ValidationMsgs.masterCatalog.seo.metadescriptionRequired
        )
        : null,
  });

  const submitHandler = (fields, { resetForm }) => {
    dispatch(setAddLoading(true))
    if (fields.id === 0) {
      API.createSEO({
        productSeoModel: { ...fields, ...location },
      })
        .then((response) => {
          if (response.data.success) {
            dispatch(
              setAlertMessage({
                type: "success",
                message: ValidationMsgs.masterCatalog.seo.created,
              })
            );
            resetForm({});
            getSEOById();
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
              message: ValidationMsgs.masterCatalog.seo.notCreated,
            })
          );
          dispatch(setAddLoading(false))
        });
    } else {
      API.updateSEO({ productSeoModel: { ...fields, ...location } })
        .then((response) => {
          if (response?.data?.success) {
            dispatch(
              setAlertMessage({
                type: "success",
                message: ValidationMsgs.masterCatalog.seo.updated,
              })
            );
            getSEOById();
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
              message: ValidationMsgs.masterCatalog.seo.notUpdated,
            })
          );
          dispatch(setAddLoading(false))
        });
    }
  }

  const getPageTitleColor = (title = '') => {
    if (title.length <= 10 || (title.length >= 66)) {
      return 'bg-rose-500';
    } else if (title.length >= 11 && title.length <= 55) {
      return 'bg-green-500';
    } else if (title.length >= 56 && title.length <= 65) {
      return 'bg-yellow-500';
    } else {
      return 'bg-gray-300';
    }
  }

  const getMetaDescriptionColor = (title = '') => {
    if (title.length <= 25) {
      return 'bg-rose-500';
    } else if (title.length >= 26 && title.length <= 99) {
      return 'bg-yellow-500';
    } else if (title.length >= 100) {
      return 'bg-green-500';
    } else {
      return 'bg-gray-300';
    }
  }

  const getMetaKeywordsColor = (title = '') => {
    if (title.split(" ").length <= 1) {
      return 'bg-rose-500';
    } else if (title.split(" ").length >= 1 && title.split(" ").length <= 3) {
      return 'bg-yellow-500';
    } else if (title.length >= 4) {
      return 'bg-green-500';
    } else {
      return 'bg-gray-300';
    }
  }
  return (
    <>
      <div className='p-6'>
        <div className="w-full">
          <div>
            <div className="flex items-center justify-between w-full group mb-1">
              <div className="text-lg text-gray-800 font-bold">Meta Data</div>
            </div>
          </div>
          <Formik
            enableReinitialize={true}
            initialValues={{
              id: Data?.id || 0,
              preViewAs: values.preViewAs || "",
              page_url: Data?.page_url || '',
              seName: Data?.seName || '',
              pageTitle: Data?.pageTitle || '',
              metaDescription: Data?.metaDescription || '',
              metaKeywords: Data?.metaKeywords || '',
              roiKeywords: Data?.roiKeywords || '',
              targetedKeywords: Data?.targetedKeywords || '',
              productId: productId,

              // h1: Data?.h1 || '',
              // h2: Data?.h2 || '',
              // h3: Data?.h3 || '',
              // h4: Data?.h4 || '',
              // h5: Data?.h5 || '',
              // h6: Data?.h6 || '',

              openGraphImagePath: Data?.openGraphImagePath || '',
              openGraphTitle: Data?.openGraphTitle || '',
              openGraphDescription: Data?.openGraphDescription || '',

              facebookImagePath: Data?.facebookImagePath || '',
              facebookOpenGraphTitle: Data?.facebookOpenGraphTitle || '',
              facebookOpenGraphDescription: Data?.facebookOpenGraphDescription || '',
              twitterImagePath: Data?.twitterImagePath || '',
              twitterOpenGraphTitle: Data?.twitterOpenGraphTitle || '',
              twitterOpenGraphDescription: Data?.twitterOpenGraphDescription || '',
              linkedinImagePath: Data?.linkedinImagePath || '',
              linkedinOpenGraphTitle: Data?.linkedinOpenGraphTitle || '',
              linkedinOpenGraphDescription: Data?.linkedinOpenGraphDescription || '',
              pinterestImagePath: Data?.pinterestImagePath || '',
              pinterestOpenGraphTitle: Data?.pinterestOpenGraphTitle || '',
              pinterestOpenGraphDescription: Data?.pinterestOpenGraphDescription || '',
              recStatus: Data?.recStatus || productstatusVal,
              rowversion: Data?.rowVersion || null,

            }}
            validationSchema={schema}
            onSubmit={submitHandler}
            innerRef={formRef}
          >
            {({ errors, touched, setFieldValue, values }) => {
              setCheckError(Object.keys(errors).length ? true : false);
              checkProductStatus(errors);
              return (
                <FormikForm>
                  <div>
                    <div className="mt-6">
                      <div className="w-full">
                        <div className="mb-6 w-full">
                          {displayFieldElement(fields, "previewType") && (
                            <div className="flex mb-6">
                              <div className="form-check form-check-inline md:mr-5">
                                <RadioButton
                                  type="radio"
                                  name="previewType"
                                  value="D"
                                  disabled={readOnly}
                                  label={'Desktop Result'}
                                  id={'D'}
                                  onChange={(e) => { setFieldValue('preViewAs', e.target.value); }}
                                  checked={values.preViewAs === 'D' ? true : false}
                                />
                              </div>
                              <div className="form-check form-check-inline md:ml-5">
                                <RadioButton
                                  type="radio"
                                  name="previewType"
                                  value="M"
                                  id={'M'}
                                  disabled={readOnly}
                                  label={'Mobile Result'}
                                  onChange={(e) => { setFieldValue('preViewAs', e.target.value); }}
                                  checked={values.preViewAs === 'M' ? true : false}

                                />
                              </div>
                            </div>)}
                          <div className="mb-6">
                            <div className={`mb-3 text-base bg-white py-4 rounded ${values.previewType === 'D' ? 'w-full' : ' w-2/4'}`}>
                              <div className="text-sm leading-4 text-[#202124] flex py-1 font-arial">
                                <span className="cursor-pointer" title={`https://www.corporategear.com/${values.seName}`}>https://www.corporategear.com › ... <span className="material-icons-outlined text-[15px]">more_vert</span></span>
                              </div>
                              <div className="text-[20px] text-[#1a0dab] font-arial leading-6 py-1"><span className="cursor-pointer" title="">{values?.pageTitle}</span></div>
                              <div className="text-sm text-black leading-6 mb-2">
                                <div className="text-[14px] leading-[22px] text-[#4d5156] mb-2 mr-2 inline-block font-arial">
                                  <span className="font-bold">{values.pageTitle}</span> gives its customers exclusive, direct access to custom branded clothing and accessories from iconic premium sports and lifestyle brands.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {displayFieldElement(fields, "seName") && (
                          <div className="mb-6">
                            <label className="tracking-wide text-gray-700 text-sm font-bold mb-2 flex items-center">
                              Page URL <span className="text-rose-500 text-2xl leading-none">*</span>
                              <span data-tip data-for='page-url-tip' className="material-icons-outlined ml-2 text-sm">info</span>
                              <ReactTooltip id='page-url-tip' type='dark' effect="solid">
                                <span>Internal Name Used For Organization</span>
                              </ReactTooltip>
                            </label>
                            <div className="flex items-center">
                              <div className="md:mr-2">https://www.corporategear.com</div>
                              <div className="grow">
                                <Input name={'seName'} type="text" placeholder="SE Name" className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" disabled={readOnly} />
                              </div>
                            </div>
                          </div>)}
                        {displayFieldElement(fields, "pageTitle") && (
                          <div className="mb-6">
                            <div className="flex items-center justify-between">
                              <label className="tracking-wide text-gray-700 text-sm font-bold mb-2 flex items-center">
                                Page Title <span className="text-rose-500 text-2xl leading-none">*</span>
                              </label>
                              <span className="text-xs"><span x-html="count">{values.pageTitle.length}</span> {/* / <span>160</span> */} Character</span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <div className="grow">
                                <Input name={'pageTitle'} type="text" placeholder="" /* maxLength="160" */ className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                  disabled={readOnly}
                                  onChange={(e) => {
                                    setFieldValue('pageTitle', e.target.value.replace(regexCode, ""));
                                  }}
                                />
                              </div>
                              <div className="flex items-center justify-between gap-1">
                                <div className={`w-4 h-4 rounded-full overflow-hidden ${getPageTitleColor(values.pageTitle)}`}></div>
                                <div className={`w-4 h-4 rounded-full overflow-hidden ${values.pageTitle.length > 10 ? getPageTitleColor(values.pageTitle) : 'bg-gray-300'}`}></div>
                                <div className={`w-4 h-4 rounded-full overflow-hidden ${values.pageTitle.length >= 56 ? getPageTitleColor(values.pageTitle) : 'bg-gray-300'}`}></div>
                              </div>
                            </div>
                          </div>)}
                        {displayFieldElement(fields, "metaDescription") && (<div className="mb-6">
                          <div className="flex items-center justify-between">
                            <label className="tracking-wide text-gray-700 text-sm font-bold mb-2 flex items-center">
                              Meta Description <span className="text-rose-500 text-2xl leading-none">*</span>
                            </label>
                            <span className="text-xs"><span x-html="count">{values.metaDescription.length}</span> {/* / <span>160</span> */} Character</span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <div className="grow">
                              <Textarea name={'metaDescription'} type="text" placeholder="" /* maxLength="160" */ className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" disabled={readOnly} />
                            </div>
                            <div className="flex items-center justify-between gap-1">
                              <div className={`w-4 h-4 rounded-full overflow-hidden ${getMetaDescriptionColor(values.metaDescription)}`}></div>
                              <div className={`w-4 h-4 rounded-full overflow-hidden ${values.metaDescription.length > 25 ? getMetaDescriptionColor(values.metaDescription) : 'bg-gray-300'}`}></div>
                              <div className={`w-4 h-4 rounded-full overflow-hidden ${values.metaDescription.length >= 99 ? getMetaDescriptionColor(values.metaDescription) : 'bg-gray-300'}`}></div>
                            </div>
                          </div>
                        </div>)}
                        {displayFieldElement(fields, "metaKeywords") && (<div className="mb-6">
                          <div className="flex items-center justify-between">
                            <label className="tracking-wide text-gray-700 text-sm font-bold mb-2 flex items-center">
                              Meta Keywords <span className="text-rose-500 text-2xl leading-none">*</span>
                            </label>
                            <span className="text-xs"><span x-html="count">{values.metaKeywords ? values.metaKeywords.split(" ").length : 0}</span> {/* / <span>160</span> */} Words</span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <div className="grow">
                              <Textarea name={'metaKeywords'} type="text" placeholder=""/*  maxLength="160" */ className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" disabled={readOnly}
                              />
                            </div>
                            <div className="flex items-center justify-between gap-1">
                              <div className={`w-4 h-4 rounded-full overflow-hidden ${getMetaKeywordsColor(values.metaKeywords)}`}></div>
                              <div className={`w-4 h-4 rounded-full overflow-hidden ${values.metaKeywords.length > 0 ? getMetaKeywordsColor(values.metaKeywords) : 'bg-gray-300'}`}></div>
                              <div className={`w-4 h-4 rounded-full overflow-hidden ${values.metaKeywords.length >= 3 ? getMetaKeywordsColor(values.metaKeywords) : 'bg-gray-300'}`}></div>
                            </div>
                          </div>
                        </div>)}
                        {displayFieldElement(fields, "roiKeywords") && (<div className="mb-6">
                          <div className="flex items-center justify-between">
                            <label className="tracking-wide text-gray-700 text-sm font-bold mb-2 flex items-center">
                              ROI Keywords
                            </label>
                            <span className="text-xs"><span x-html="count">{values.roiKeywords.length}</span> / <span>160</span> Character</span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <Input name={'roiKeywords'} type="text" placeholder="" maxLength="160" className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" disabled={readOnly} />
                          </div>
                        </div>)}
                        {displayFieldElement(fields, "targetedKeywords") && (<div className="mb-6">
                          <div className="flex items-center justify-between">
                            <label className="tracking-wide text-gray-700 text-sm font-bold mb-2 flex items-center">
                              Targeted Keywords
                            </label>
                            <span className="text-xs"><span x-html="count">{values.targetedKeywords.length}</span> {/* / <span>160</span> */} Character</span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <Input name={'targetedKeywords'} type="text" placeholder="" /* maxLength="160" */ className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" disabled={readOnly} />
                          </div>
                        </div>)}
                        <div className="mb-6">
                          <label className="tracking-wide text-gray-700 text-sm font-bold mb-2 flex items-center"> Header Tags </label>
                          {displayFieldElement(fields, "h1") && (<div className="flex items-center mb-4 gap-2">
                            <label className="w-full md:w-1/4">H1</label>
                            <Input name={'h1'} className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="" disabled={readOnly} />
                            <div className="flex items-center justify-between gap-1">
                              <div className="w-4 h-4 rounded-full overflow-hidden bg-rose-500"></div>
                              <div className="w-4 h-4 rounded-full overflow-hidden bg-gray-300"></div>
                              <div className="w-4 h-4 rounded-full overflow-hidden bg-gray-300"></div>
                            </div>
                          </div>)}
                          {displayFieldElement(fields, "h2") && (<div className="flex items-center mb-4 gap-2">
                            <label className="w-full md:w-1/4">H2</label>
                            <Input name={'h2'} className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="" disabled={readOnly} />
                            <div className="flex items-center justify-between gap-1">
                              <div className="w-4 h-4 rounded-full overflow-hidden bg-rose-500"></div>
                              <div className="w-4 h-4 rounded-full overflow-hidden bg-gray-300"></div>
                              <div className="w-4 h-4 rounded-full overflow-hidden bg-gray-300"></div>
                            </div>
                          </div>)}
                          {displayFieldElement(fields, "h3") && (<div className="flex items-center mb-4 gap-2">
                            <label className="w-full md:w-1/4">H3</label>
                            <Input name={'h3'} className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="" disabled={readOnly} />
                            <div className="flex items-center justify-between gap-1">
                              <div className="w-4 h-4 rounded-full overflow-hidden bg-yellow-500"></div>
                              <div className="w-4 h-4 rounded-full overflow-hidden bg-yellow-500"></div>
                              <div className="w-4 h-4 rounded-full overflow-hidden bg-gray-300"></div>
                            </div>
                          </div>)}
                          {displayFieldElement(fields, "h4") && (<div className="flex items-center mb-4 gap-2">
                            <label className="w-full md:w-1/4">H4</label>
                            <Input name={'h4'} className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="" disabled={readOnly} />
                            <div className="flex items-center justify-between gap-1">
                              <div className="w-4 h-4 rounded-full overflow-hidden bg-yellow-500"></div>
                              <div className="w-4 h-4 rounded-full overflow-hidden bg-yellow-500"></div>
                              <div className="w-4 h-4 rounded-full overflow-hidden bg-gray-300"></div>
                            </div>
                          </div>)}
                          {displayFieldElement(fields, "h5") && (<div className="flex items-center mb-4 gap-2">
                            <label className="w-full md:w-1/4">H5</label>
                            <Input name={'h5'} className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="" disabled={readOnly} />
                            <div className="flex items-center justify-between gap-1">
                              <div className="w-4 h-4 rounded-full overflow-hidden bg-green-500"></div>
                              <div className="w-4 h-4 rounded-full overflow-hidden bg-green-500"></div>
                              <div className="w-4 h-4 rounded-full overflow-hidden bg-green-500"></div>
                            </div>
                          </div>)}
                          {displayFieldElement(fields, "h6") && (<div className="flex items-center mb-4 gap-2">
                            <label className="w-full md:w-1/4">H6</label>
                            <Input name={'h6'} className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="" disabled={readOnly} />
                            <div className="flex items-center justify-between gap-1">
                              <div className="w-4 h-4 rounded-full overflow-hidden bg-green-500"></div>
                              <div className="w-4 h-4 rounded-full overflow-hidden bg-green-500"></div>
                              <div className="w-4 h-4 rounded-full overflow-hidden bg-green-500"></div>
                            </div>
                          </div>)}
                        </div>
                        <div className="mt-10 mb-10"> <hr className="border-neutral-300" /> </div>
                        <SEOSocial values={values} setFieldValue={setFieldValue} displayFieldElement={displayFieldElement} readOnly={readOnly} fields={fields} id={productId} moduleName={moduleName} />
                      </div>

                    </div>
                  </div>
                </FormikForm>
              )
            }}
          </Formik>
        </div >
      </div >
    </>
  );
};

export default SEO;

