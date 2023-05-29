/*Component Name: General
Component Functional Details: User can create or update General master details from here.
Created By: Happy
Created Date: <Creation Date>
Modified By: Divyesh Shah
Modified Date: <Modified Date> */

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Form as FormikForm, Formik } from "formik";
import * as Yup from "yup";
import ToggleButton from "components/common/formComponent/ToggleButton";
import Input from "components/common/formComponent/Input";
import Textarea from "components/common/formComponent/Textarea";
import { RecStatusValuebyName } from "global/Enum"
import { ValidationMsgs } from "global/ValidationMessages";

const General = ({ setFormSubmit, activeTab, index, Data, submitHandler }) => {
    const formRef = useRef();

    useEffect(() => {
        if (activeTab == index) {
            setFormSubmit(formRef.current);
        }
    }, [formRef, setFormSubmit, activeTab]);

    const [toggler, setToggler] = useState({
    });
    const handleToggle = (field) => {
        field = field.target.name;
        setToggler((prevData) => ({
            ...prevData,
            [field]: !toggler[field],
        }));
    };

    const validationSchemaForGeneral = Yup.object({

        headTagCodeGTM: Yup.string().when('isGTM', {
            is: (isGTM) => isGTM == true,
            then: Yup.string().required(ValidationMsgs.seoConfig.headTagCodeGTM),
            otherwise: Yup.string(),
        }),

        bodyTagCodeGTM: Yup.string().when('isGTM', {
            is: (isGTM) => isGTM == true,
            then: Yup.string().required(ValidationMsgs.seoConfig.bodyTagCodeGTM),
            otherwise: Yup.string(),
        }),

        htmlVerificationTagsHead: Yup.string().when('isSiteVerificationTags', {
            is: (isSiteVerificationTags) => isSiteVerificationTags == true,
            then: Yup.string().required(ValidationMsgs.seoConfig.verificationTagsHead),
            otherwise: Yup.string(),
        }),

        htmlVerificationTagsbody: Yup.string().when('isSiteVerificationTags', {
            is: (isSiteVerificationTags) => isSiteVerificationTags == true,
            then: Yup.string().required(ValidationMsgs.seoConfig.verificationTagsBody),
            otherwise: Yup.string(),
        }),

        headTagCodePinterest: Yup.string().when('isPinterest', {
            is: (isPinterest) => isPinterest == true,
            then: Yup.string().required(ValidationMsgs.seoConfig.headTagCodePinterest),
            otherwise: Yup.string(),
        }),

        htmlVerificationBodyPinterest: Yup.string().when('isPinterest', {
            is: (isPinterest) => isPinterest == true,
            then: Yup.string().required(ValidationMsgs.seoConfig.htmlVerificationBodyPinterest),
            otherwise: Yup.string(),
        }),

        affiliateConnection: Yup.string().when('isAffiliateConversionTracking', {
            is: (isAffiliateConversionTracking) => isAffiliateConversionTracking == true,
            then: Yup.string().required(ValidationMsgs.seoConfig.affiliateConnectionRequired),
            otherwise: Yup.string(),
        }),
    });

    const [id, setId] = useState("");

    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    id: Data?.id || 0,
                    headTagCodeGoogle: Data?.headTagCodeGoogle || "",
                    isGTM: Data?.isGTM || false,
                    headTagCodeGTM: Data?.headTagCodeGTM || "",
                    bodyTagCodeGTM: Data?.bodyTagCodeGTM || "",
                    headTagCodeFaceBook: Data?.headTagCodeFaceBook || "",
                    isPinterest: Data?.isPinterest || false,
                    headTagCodePinterest: Data?.headTagCodePinterest || "",
                    htmlVerificationBodyPinterest: Data?.htmlVerificationBodyPinterest || "",
                    isSiteVerificationTags: Data?.isSiteVerificationTags || false,
                    htmlVerificationTagsHead: Data?.htmlVerificationTagsHead || "",
                    htmlVerificationTagsbody: Data?.htmlVerificationTagsbody || "",
                    isAffiliateConversionTracking: Data?.isAffiliateConversionTracking || false,
                    affiliateConnection: Data?.affiliateConnection || false,
                    isOGTags: Data?.isOGTags || false,
                    isTwitterCard: Data?.isTwitterCard || false,
                    rowVersion: Data?.rowVersion || "",
                    recStatus: Data?.recStatus || RecStatusValuebyName.Active,
                }}
                onSubmit={submitHandler}
                validationSchema={validationSchemaForGeneral}
                innerRef={formRef}
            >
                {({ errors, touched, setFieldValue, values }) => {
                    return (
                        <FormikForm>
                            <div className="panel-01 tab-content">
                                <div>
                                    <div className="p-6 border-b-2 border-slate-200 last:border-b-0">
                                        <div className="flex items-center justify-between">
                                            <div className="tracking-wide text-gray-500 text-base font-bold">
                                                Google Analytics
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <div className="mb-6 last:mb-0">
                                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                                    head tag code
                                                </label>

                                                <Textarea
                                                    name={`headTagCodeGoogle`}
                                                    maxLength="160"
                                                    id="headTagCodeGoogle"
                                                    value={values?.headTagCodeGoogle}
                                                    rows="10"
                                                    className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}
                                                />
                                            </div>
                                        </div>

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
                                                            name="isGTM"
                                                            onChange={(e) => { setFieldValue("isGTM", e.target.checked); }}
                                                            defaultValue={values?.isGTM}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {values?.isGTM &&
                                            <div className="mt-2">
                                                <div className="mb-6 last:mb-0">
                                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                                        head tag code
                                                        <span className="text-rose-500 text-2xl leading-none" />
                                                    </label>
                                                    <Textarea
                                                        name={`headTagCodeGTM`}
                                                        maxLength="160"
                                                        id="headTagCodeGTM"
                                                        rows="10"
                                                        defaultValue={values?.GTMHeadcode}
                                                        className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}
                                                    />
                                                </div>
                                                <div className="mb-6 last:mb-0">
                                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                                        body tag code
                                                        <span className="text-rose-500 text-2xl leading-none" />
                                                    </label>
                                                    <Textarea
                                                        name={`bodyTagCodeGTM`}
                                                        maxLength="160"
                                                        id="bodyTagCodeGTM"
                                                        rows="10"
                                                        defaultValue={values?.bodyTagCodeGTM}
                                                        className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}
                                                    />
                                                </div>
                                            </div>
                                        }

                                    </div>
                                    <div className="p-6 border-b-2 border-slate-200 last:border-b-0">
                                        <div className="flex items-center justify-between">
                                            <div className="tracking-wide text-gray-500 text-base font-bold">
                                                Facebook Pixel
                                            </div>

                                        </div>
                                        <div className="mt-2">
                                            <div className="mb-6 last:mb-0">
                                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                                    head tag code
                                                    <span className="text-rose-500 text-2xl leading-none" />
                                                </label>

                                                <Textarea
                                                    name={`headTagCodeFaceBook`}
                                                    id="headTagCodeFaceBook"
                                                    rows="10"
                                                    value={values?.headTagCodeFaceBook}
                                                    className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}
                                                />
                                            </div>
                                        </div>

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
                                                            id="isPinterest"
                                                            onChange={(e) => setFieldValue("isPinterest", e.target.checked)}
                                                            defaultValue={
                                                                values.isPinterest
                                                            }
                                                            name="isPinterest"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {values.isPinterest &&
                                            <div className="mt-2">
                                                <div className="mb-6 last:mb-0">
                                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                                        head tag code
                                                        <span className="text-rose-500 text-2xl leading-none" />
                                                    </label>
                                                    <Textarea
                                                        name={`headTagCodePinterest`}
                                                        maxLength="160"
                                                        id="headTagCodePinterest"
                                                        rows="10"
                                                        defaultValue={values?.headTagCodePinterest}
                                                        className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}
                                                    />
                                                </div>
                                                <div className="mb-6 last:mb-0">
                                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                                        Html Verification Tags Body
                                                        <span className="text-rose-500 text-2xl leading-none" />
                                                    </label>

                                                    <Textarea
                                                        name={`htmlVerificationBodyPinterest`}
                                                        id="htmlVerificationBodyPinterest"
                                                        rows="2"
                                                        value={values.htmlVerificationBodyPinterest}
                                                        className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}
                                                    />
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
                                                        name={`htmlVerificationTagsHead`}
                                                        maxLength="160"
                                                        id="htmlVerificationTagsHead"
                                                        defaultValue={values?.htmlVerificationTagsHead}
                                                        rows="10"
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
                                                    name={`htmlVerificationTagsbody`}
                                                    maxLength="160"
                                                    id="htmlVerificationTagsbody"
                                                    defaultValue={values?.htmlVerificationTagsbody}
                                                    rows="10"
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
                                                            name="isAffiliateConversionTracking"
                                                            onChange={(e) => setFieldValue("isAffiliateConversionTracking", e.target.checked)}
                                                            defaultValue={
                                                                values?.isAffiliateConversionTracking
                                                            }
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
                                                    <Input name="affiliateConnection" />
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
                                                            name="isOGTags"
                                                            onChange={(e) => { setFieldValue("isOGTags", e.target.checked); }}
                                                            defaultValue={values?.isOGTags}
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
