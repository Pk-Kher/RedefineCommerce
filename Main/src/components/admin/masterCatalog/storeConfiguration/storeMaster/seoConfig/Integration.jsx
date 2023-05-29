/*Component Name: Integration
Component Functional Details: User can create or update Integration master details from here.
Created By: Happy
Created Date: <Creation Date>
Modified By: Divyesh
Modified Date: <Modified Date> */

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Field, Form as FormikForm, Formik } from "formik";
import * as Yup from "yup";
import { ValidationMsgs } from "global/ValidationMessages";
import ToggleButton from "components/common/formComponent/ToggleButton";
import Input from "components/common/formComponent/Input";
import { RecStatusValuebyName } from "global/Enum"

const Integration = ({ setFormSubmit, setIsError,index, submitHandler,activeTab, data }) => {

    const formRef = useRef();
    const [checkerror, setCheckError] = useState(false);
    // const location = useSelector((store) => store?.location);
    // const dispatch = useDispatch();
    const { id } = useParams();

    useEffect(() => {
        if (activeTab == index) {
            setFormSubmit(formRef.current);
        }
    }, [formRef, setFormSubmit, activeTab]);
    
    useEffect(() => {
        setIsError(checkerror);
    }, [checkerror]);

    const validationSchemaForIntegration = Yup.object({
        ApiKey: Yup.string().when('isSemrushintegration', {
            is: (isSemrushintegration) => isSemrushintegration == true,
            then: Yup.string().required(ValidationMsgs.seoConfig.apiKeyRequired),
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
                    isSEMrushIntegration: data?.isSEMrushIntegration || false,
                    seMrushIntegrationAPIKey: data?.seMrushIntegrationAPIKey || "",
                    rowVersion: data.rowVersion || "",
                    recStatus: data?.recStatus || RecStatusValuebyName.Active,
                }}
                onSubmit={submitHandler}
                validationSchema={validationSchemaForIntegration}
                innerRef={formRef}
            >
                {({ errors, touched, setFieldValue, values }) => {
                    setCheckError(Object.keys(errors).length ? true : false);
                    return (
                        <FormikForm>
                            <div className="panel-03 tab-content">
                                <div>
                                    <div className="p-6 border-b-2 border-slate-200 last:border-b-0">
                                        <div className="flex items-center justify-between">
                                            <div className="tracking-wide text-gray-500 text-base font-bold">
                                                SEMrush Integration
                                            </div>
                                            <div>
                                                <div className="flex items-center">
                                                    <div className="w-16 relative">
                                                        <ToggleButton
                                                            id="isSEMrushIntegration"
                                                            onChange={(e) => setFieldValue('isSEMrushIntegration', e.target.checked)}
                                                            defaultValue={values.isSEMrushIntegration}
                                                            name="isSEMrushIntegration"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {values.isSEMrushIntegration && (
                                            <div className={`mt-2`}>
                                                <div className="mb-6 last:mb-0">
                                                    <div className="text-sm">
                                                        To connect to SEMrush you'll need a
                                                        SEMrush Business account with API
                                                        access enabled.
                                                    </div>
                                                    <div className="text-sm">
                                                        You can find your API Key in you
                                                        SEMrush account under
                                                        <br />
                                                        User profile &gt; API &gt; Begin: GET
                                                        API Key (
                                                        <button
                                                            type="button"
                                                            href="https://www.semrush.com/api-use/"
                                                            className="text-indigo-500"
                                                        >
                                                            https://www.semrush.com/api-use/
                                                        </button>
                                                        )
                                                    </div>
                                                    <div className="text-sm my-2">
                                                        <strong>Important!</strong> You will
                                                        be changed SEMrush API units each time
                                                        you gather data for your SEMrush
                                                        dashboard.
                                                    </div>
                                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                                        API Key
                                                        <span className="text-rose-500 text-2xl leading-none">
                                                            *
                                                        </span>
                                                    </label>
                                                    <Input type="text" name="seMrushIntegrationAPIKey" />
                                                </div>
                                            </div>
                                        )}
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

export default Integration;
