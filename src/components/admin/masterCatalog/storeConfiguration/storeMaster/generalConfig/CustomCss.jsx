import React, { useState, useEffect, useCallback, useRef } from "react";
import { Formik, Form as FormikForm } from "formik";
import Textarea from "components/common/formComponent/Textarea";
import CMSConfiguration from "services/admin/cmsConfiguration/CMSConfiguration";
import { useDispatch } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const CustomCSS = ({ setFormSubmit }) => {
    const CompanyName = useSelector((store) => store?.CompanyConfiguration.data);
    //const FolderPath = `/${CompanyName}/store/`;
    const { storeId } = useParams();
    const [initialValues, setInitialValues] = useState({});
    const formRef = useRef();
    const [id, setId] = useState(0);
    const dispatch = useDispatch();

    useEffect(() => {
        setFormSubmit(formRef.current);
    }, [formRef, setFormSubmit]);



    const getCustomCssConfig = useCallback(() => {
        dispatch(setAddLoading(true));
        CMSConfiguration.getConfiguration(storeId, "custom_css_config").then((response) => {
            if (response.data.success) {
                setInitialValues(JSON.parse(response.data.data.config_value));
                setId(response.data.data.id);
                console.log(response.data.data.id);
            }
            dispatch(setAddLoading(false));
        }).catch(() => {
            dispatch(setAddLoading(false));
        });
    }, []);

    const updateConstomCssConfig = useCallback((data) => {
        var jsonData = JSON.stringify(data);
        let cssConfigObj = {
            storeId: storeId,
            content: data.custom_css_config,
            filename: CompanyName + '/store/' + storeId + '/css/custom.css'
        };

        CMSConfiguration.setThemeConfigVariableFile(cssConfigObj)
            .then((res) => {
                if (res.data.success) {

                }
                //getCustomCssConfig()
            })
            .catch(() => { });

        CMSConfiguration.getConfiguration(storeId, "custom_css_config").then((response) => {
            if (response.data.success) {
                let headerConfigObj = {
                    id: response.data.data?.id || 0,
                    store_id: storeId,
                    config_name: "custom_css_config",
                    config_value: jsonData,
                    status: "Y",
                };
                CMSConfiguration.updateConfiguration(headerConfigObj)
                    .then((res) => {
                        if (res.data.success) {
                            dispatch(
                                setAlertMessage({
                                    view: true,
                                    type: "success",
                                    message: "Configuration updated successfully",
                                })
                            );
                        }
                        getCustomCssConfig()
                    })
                    .catch(() => { });
            }
        });

    }, []);

    function submitHandler(fields, { resetForm }) {
        updateConstomCssConfig(fields);
    }

    useEffect(() => {
        getCustomCssConfig();
    }, []);

    return (
        <>
            <title>Custom CSS</title>

            <Formik
                enableReinitialize={true}
                initialValues={initialValues}
                innerRef={formRef}
                onSubmit={submitHandler}
            >
                {({ errors, setFieldValue, values }) => {
                    return (
                        <FormikForm>
                            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
                                <div className="bg-white shadow-xxl rounded-md mb-8">
                                    <div className="w-full bg-white shadow-xxl rounded-md mb-8 pt-4">
                                        <div className="false w-full rounded-md mb-8 tab-content text-sm">
                                            <div className="p-6 border-b-2 border-slate-200 last:border-b-0">
                                                <div className="mt-2">
                                                    <div className="mb-6 last:mb-0">
                                                        <Textarea
                                                            name={`custom_css_config`}
                                                            id="custom_css_config"
                                                            value={values?.custom_css_config}
                                                            rows="40"
                                                            className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}
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

export default CustomCSS;
