/*Component Name: General
Component Functional Details: User can create or update General master details from here.
Created By: Happy
Created Date: <Creation Date>
Modified By: Divyesh 
Modified Date: <Modified Date> */

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Form as FormikForm, Formik } from "formik";
import * as Yup from "yup";
import ToggleButton from "components/common/formComponent/ToggleButton";
import Input from "components/common/formComponent/Input";
import { ValidationMsgs } from "global/ValidationMessages";
import Dropdown from "components/common/formComponent/Dropdown";
import Checkbox from "components/common/formComponent/Checkbox";
import Textarea from "components/common/formComponent/Textarea";
import { RecStatusValuebyName } from "global/Enum"

const General = ({ setFormSubmit, setIsError, activeTab, index,submitHandler, data }) => {
    const formRef = useRef();
    const [checkerror, setCheckError] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        if (activeTab == index) {
            setFormSubmit(formRef.current);
        }
    }, [formRef, setFormSubmit, activeTab]);

    useEffect(() => {
        setIsError(checkerror);
    }, [checkerror]);

    const validationSchemaForGeneral = Yup.object({
        pinterestVerificationCode: Yup.string().when('isPinterestVerification', {
            is: (isPinterestVerification) => isPinterestVerification == true,
            then: Yup.string().required(ValidationMsgs.seoConfig.verificationCodeRequired),
            otherwise: Yup.string(),
        }),
        affiliateConversionConnection: Yup.string().when('isAffiliateConversionTracking', {
            is: (isAffiliateConversionTracking) => isAffiliateConversionTracking == true,
            then: Yup.string().required(ValidationMsgs.seoConfig.affiliateConnectionRequired),
            otherwise: Yup.string(),
        }),
    });

    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    storeId: id,
                    id: data?.id || 0,
                    isGoogleAnalytics: data?.isGoogleAnalytics || false,
                    googleAnalyticsConnectionWith: data?.googleAnalyticsConnectionWith || "",
                    googleAnalyticsPropertyId: data?.googleAnalyticsPropertyId || "",
                    isGoogleAnalyticsUseEnhanceEcommerce: data?.isGoogleAnalyticsUseEnhanceEcommerce || false,
                    isGTM: data?.isGTM || false,
                    gtmId: data?.gtmId || "",
                    isFacebookPixel: data?.isFacebookPixel || false,
                    facebookPixelId: data?.facebookPixelId || "",
                    isPinterestVerification: data?.isPinterestVerification || false,
                    pinterestVerificationCode: data?.pinterestVerificationCode || "",
                    isSiteVerificationTags: data?.isSiteVerificationTags || false,
                    siteVerificationTagsHead: data?.siteVerificationTagsHead || "",
                    siteVerificationTagsBody: data?.siteVerificationTagsBody || "",
                    isAffiliateConversionTracking: data?.isAffiliateConversionTracking || false,
                    affiliateConversionConnection: data?.affiliateConversionConnection || "",
                    isOGTags: data?.isOGTags || false,
                    isTwitterCard: data?.isTwitterCard || false,
                    rowVersion: data.rowVersion || "",
                    recStatus: data?.recStatus || RecStatusValuebyName.Active,
                }}
                onSubmit={submitHandler}
                validationSchema={validationSchemaForGeneral}
                innerRef={formRef}
            >
                {({ errors, touched, setFieldValue, values }) => {
                    setCheckError(Object.keys(errors).length ? true : false);
                    return (
                        <FormikForm>
                            <div className="panel-01 tab-content">
                                <div>
                                    <div className="p-6 border-b-2 border-slate-200 last:border-b-0">
                                        <div className="flex items-center justify-between">
                                            <div className="tracking-wide text-gray-500 text-base font-bold">
                                                Google Analytics
                                            </div>
                                            <div>
                                                <div className="flex items-center">
                                                    <div className="w-16 relative">
                                                        <ToggleButton
                                                            id="isGoogleAnalytics"
                                                            onChange={(e) => setFieldValue('isGoogleAnalytics', e.target.checked)}
                                                            defaultValue={values.isGoogleAnalytics}
                                                            name="isGoogleAnalytics"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {values.isGoogleAnalytics &&
                                            <div className="mt-2">
                                                <div className="mb-6 last:mb-0">
                                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                                        Connection with
                                                        <span className="text-rose-500 text-2xl leading-none" />
                                                    </label>
                                                    <Dropdown
                                                        isMulti={false}
                                                        name="googleAnalyticsConnectionWith"
                                                        options={[{ value: 1, label: "Product ID (recommended)" }, { value: 2, label: "Tracking Code" }]}
                                                        defaultValue={values.googleAnalyticsConnectionWith}
                                                    />
                                                </div>
                                                <div className="mb-6 last:mb-0">
                                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                                        PROPERTY ID
                                                        <span className="text-rose-500 text-2xl leading-none" />
                                                    </label>
                                                    <Input name="googleAnalyticsPropertyId" />
                                                </div>
                                                <div className="mb-6 last:mb-0">
                                                    <label className={"flex items-center"}>
                                                        <Checkbox
                                                            name={"isGoogleAnalyticsUseEnhanceEcommerce"}
                                                            onChange={(e) => {
                                                                setFieldValue(
                                                                    `isGoogleAnalyticsUseEnhanceEcommerce`,
                                                                    e.target.checked
                                                                );
                                                            }}
                                                            checked={values.isGoogleAnalyticsUseEnhanceEcommerce}
                                                            defaultValue={values.isGoogleAnalyticsUseEnhanceEcommerce}
                                                            className={"form-checkbox"}
                                                        />
                                                        <span className={"ml-1"}>
                                                            {"Use Enhance Ecommerce"}
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>
                                        }

                                    </div>
                                    <div className="p-6 border-b-2 border-slate-200 last:border-b-0">
                                        <div className="flex items-center justify-between">
                                            <div className="tracking-wide text-gray-500 text-base font-bold">
                                                GTM
                                            </div>
                                            <div>
                                                <div className="flex items-center">
                                                    <div className="w-16 relative">
                                                        <ToggleButton
                                                            id="isGTM"
                                                            onChange={(e) => setFieldValue("isGTM", e.target.checked)}
                                                            defaultValue={values.isGTM}
                                                            name="isGTM"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {values.isGTM &&
                                            <div className="mt-2">
                                                <div className="mb-6 last:mb-0">
                                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                                        GTM ID
                                                        <span className="text-rose-500 text-2xl leading-none" />
                                                    </label>
                                                    <Input name={`gtmId`} id="gtmId" />
                                                </div>
                                            </div>
                                        }

                                    </div>
                                    <div className="p-6 border-b-2 border-slate-200 last:border-b-0">
                                        <div className="flex items-center justify-between">
                                            <div className="tracking-wide text-gray-500 text-base font-bold">
                                                Facebook Pixel
                                            </div>
                                            <div>
                                                <div className="flex items-center">
                                                    <div className="w-16 relative">
                                                        <ToggleButton
                                                            id="facebookPixelId"
                                                            onChange={(e) => setFieldValue("facebookPixelId", e.target.checked)}
                                                            defaultValue={
                                                                values.facebookPixelId
                                                            }
                                                            name="facebookPixelId"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {values.facebookPixelId &&
                                            <div className="mt-2">
                                                <div className="mb-6 last:mb-0">
                                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                                        Pixel ID
                                                        <span className="text-rose-500 text-2xl leading-none"></span>
                                                    </label>
                                                    <Input name={`facebookPixelId`} id="facebookPixelId " />
                                                </div>
                                            </div>
                                        }

                                    </div>
                                    <div className="p-6 border-b-2 border-slate-200 last:border-b-0">
                                        <div className="flex items-center justify-between">
                                            <div className="tracking-wide text-gray-500 text-base font-bold">
                                                Pinterest Verification
                                            </div>
                                            <div>
                                                <div className="flex items-center">
                                                    <div className="w-16 relative">
                                                        <ToggleButton
                                                            id="isPinterestVerification"
                                                            onChange={(e) => setFieldValue("isPinterestVerification", e.target.checked)}
                                                            defaultValue={
                                                                values.isPinterestVerification
                                                            }
                                                            name="isPinterestVerification"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {values.isPinterestVerification &&
                                            <div className={`mt-2`}>
                                                <div className="mb-6 last:mb-0">
                                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                                        Verification Code
                                                        <span className="text-rose-500 text-2xl leading-none">*</span>
                                                    </label>
                                                    <Input name={`pinterestVerificationCode`} id="pinterestVerificationCode" />
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    <div className="p-6 border-b-2 border-slate-200 last:border-b-0">
                                        <div className="flex items-center justify-between">
                                            <div className="tracking-wide text-gray-500 text-base font-bold">
                                                Site Verification Tags
                                            </div>
                                            <div>
                                                <div className="flex items-center">
                                                    <div className="w-16 relative">
                                                        <ToggleButton
                                                            id="isSiteVerificationTags"
                                                            name="isSiteVerificationTags"
                                                            onChange={(e) => { setFieldValue("isSiteVerificationTags", e.target.checked); }}
                                                            defaultValue={values?.isSiteVerificationTags}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {values?.isSiteVerificationTags &&
                                            <div className="mt-2">
                                                <div className="mb-6 last:mb-0">
                                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                                        HTML Verification tags Head
                                                        <span className="text-rose-500 text-2xl leading-none" />
                                                    </label>
                                                    <Textarea
                                                        name={`siteVerificationTagsHead`}
                                                        maxLength="160"
                                                        id="siteVerificationTagsHead"
                                                        defaultValue={values?.siteVerificationTagsHead}
                                                        rows="2"
                                                        className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}
                                                    />
                                                </div>
                                            </div>
                                        }
                                        {values?.isSiteVerificationTags &&
                                            <div className="mb-6 last:mb-0">
                                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                                    HTML Verification tags Body
                                                    <span className="text-rose-500 text-2xl leading-none" />
                                                </label>
                                                <Textarea
                                                    name={`siteVerificationTagsBody`}
                                                    maxLength="160"
                                                    id="siteVerificationTagsBody"
                                                    defaultValue={values?.siteVerificationTagsBody}
                                                    rows="2"
                                                    className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}
                                                />
                                            </div>
                                        }
                                    </div>
                                    <div className="p-6 border-b-2 border-slate-200 last:border-b-0">
                                        <div className="flex items-center justify-between">
                                            <div className="tracking-wide text-gray-500 text-base font-bold">
                                                Affiliate Conversion Tracking
                                            </div>
                                            <div>
                                                <div className="flex items-center">
                                                    <div className="w-16 relative">
                                                        <ToggleButton
                                                            id="isAffiliateConversionTracking"
                                                            onChange={(e) => setFieldValue("isAffiliateConversionTracking", e.target.checked)}
                                                            defaultValue={
                                                                values.isAffiliateConversionTracking
                                                            }
                                                            name="isAffiliateConversionTracking"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {values.isAffiliateConversionTracking &&
                                            <div className={`mt-2`}>
                                                <div className="mb-6 last:mb-0">
                                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                                        Connection
                                                        <span className="text-rose-500 text-2xl leading-none">
                                                            *
                                                        </span>
                                                    </label>
                                                    <Input name="affiliateConversionConnection" />
                                                </div>
                                            </div>
                                        }

                                    </div>
                                    <div className="p-6 border-b-2 border-slate-200 last:border-b-0">
                                        <div className="flex items-center justify-between">
                                            <div className="tracking-wide text-gray-500 text-base font-bold">
                                                OG Tags
                                            </div>
                                            <div>
                                                <div className="flex items-center">
                                                    <div className="w-16 relative">
                                                        <ToggleButton
                                                            id="isOGTags"
                                                            onChange={(e) => setFieldValue("isOGTags", e.target.checked)}
                                                            defaultValue={values.isOGTags}
                                                            name="isOGTags"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 border-b-2 border-slate-200 last:border-b-0">
                                        <div className="flex items-center justify-between">
                                            <div className="tracking-wide text-gray-500 text-base font-bold">
                                                Twitter Card
                                            </div>
                                            <div>
                                                <div className="flex items-center">
                                                    <div className="w-16 relative">
                                                        <ToggleButton
                                                            id="isTwitterCard"
                                                            onChange={(e) => setFieldValue("isTwitterCard", e.target.checked)}
                                                            defaultValue={values.isTwitterCard}
                                                            name="isTwitterCard"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FormikForm>
                    );
                }}
            </Formik>
        </>
    );
};

export default General;
