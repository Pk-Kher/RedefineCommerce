/*Component Name: CustomScript
Component Functional Details: User can create or update CustomScript master details from here.
Created By: chandan
Created Date: 02/11/2022
Modified By: chandan
Modified Date: 02/11/2022 */

import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Form as FormikForm, Formik } from "formik";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import CMSConfiguration from "services/admin/cmsConfiguration/CMSConfiguration";
import React, { useEffect, useRef, useState, Fragment, useCallback } from "react";
import Textarea from "components/common/formComponent/Textarea";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const CustomScript = ({ setFormSubmit }) => {

    const formRef = useRef();
    const [id, setId] = useState(0);
    const { storeId } = useParams();
    const [initialValues, setinitialValues] = useState({
        content: {
            googleFonts: "",
            customScript: "",
            customGlobalBodyScript: "",
            customHomeScript: ""
        }
    });
    const dispatch = useDispatch()

    useEffect(() => {
        setFormSubmit(formRef.current);
    }, [formRef, setFormSubmit]);

    const HandleSubmit = (fields) => {
        updateConfiguration(fields)
    }




    const getConfiguration = useCallback(() => {
        dispatch(setAddLoading(true));
        CMSConfiguration.getConfiguration(storeId, "customScript").then((response) => {
            if (response.data.success && response?.data?.data) {
                setinitialValues({ content: JSON.parse(response.data.data.config_value) });
                setId(response.data.data.id);
                console.log(response.data.data.id);
            }
            dispatch(setAddLoading(false));
        }).catch(() => {
            dispatch(setAddLoading(false));
        });
    }, []);

    const updateConfiguration = useCallback((fields) => {
        var jsonData = JSON.stringify(fields.content);
        CMSConfiguration.getConfiguration(storeId, "customScript").then((response) => {
            if (response.data.success) {
                setId(response.data.data.id);
            }
        });
        let menuConfigObj = {
            id: id,
            store_id: storeId,
            config_name: `customScript`,
            config_value: jsonData,
            status: "Y",
        };
        console.log(menuConfigObj);
        CMSConfiguration.updateConfiguration(menuConfigObj).then((response) => {
            if (response.data.success) {
                dispatch(
                    setAlertMessage({
                        view: true,
                        type: "success",
                        message: "Configuration updated successfully",
                    })
                );
            }
            getConfiguration()
        })
    }, [id]);

    useEffect(() => {
        getConfiguration()
    }, [])

    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={initialValues}
                onSubmit={HandleSubmit}
                innerRef={formRef}
                validateOnChange={true}
                validateOnBlur={false}
            >
                {({ values, setFieldValue }) => {
                    return (
                        <FormikForm>
                            <div className="p-6 sm:px-6 lg:px-8 w-full">
                                <div className="overflow-x-auto max-h-screen">
                                    <div className="flex-wrap items-center whitespace-nowrap">
                                        <Fragment>
                                            <div className="m-1.5 ml-0 flex items-center">
                                                <div className="w-1/3 ml-2 ">
                                                    <label className=" text-sm lg:opacity-0 lg:sidebar-expanded:opacity-100 duration-200 font-semibold">{`Google Fonts`}</label>
                                                    <label >{`Will affect to site font`}</label>
                                                </div>
                                                <Textarea name={'content.googleFonts'} type="text" placeholder="" maxLength="160" className="text-gray-700 border-gray-200 rounded focus:outline-none focus:bg-white" rows={1} />
                                            </div>
                                            <div className="m-1.5 ml-0 flex items-center mt-4">
                                                <div className="w-1/3 ml-2 ">
                                                    <label className=" text-sm lg:opacity-0 lg:sidebar-expanded:opacity-100 duration-200 font-semibold">{`Custom Script`}</label>
                                                    <label >{`Inserted before closing head tag`}</label>
                                                </div>
                                                <Textarea name={'content.customScript'} type="text" placeholder="" maxLength="160" className="text-gray-700 border-gray-200 rounded focus:outline-none focus:bg-white" />
                                            </div>
                                            <div className="m-1.5 ml-0 flex items-center  mt-4">
                                                <div className="w-1/3 ml-2 ">
                                                    <label className=" text-sm lg:opacity-0 lg:sidebar-expanded:opacity-100 duration-200 font-semibold">{`Custom Global Body Script`}</label>
                                                    <label >{`Inserted after body tag`}</label>
                                                </div>
                                                <Textarea name={'content.customGlobalBodyScript'} type="text" placeholder="" maxLength="160" className="text-gray-700 border-gray-200 rounded focus:outline-none focus:bg-white" />
                                            </div>
                                            <div className="m-1.5 ml-0 flex items-center  mt-4">
                                                <div className="w-1/3 ml-2 ">
                                                    <label className=" text-sm lg:opacity-0 lg:sidebar-expanded:opacity-100 duration-200 font-semibold">{`Custom Home Script`}</label>
                                                    <label >{`Inserted after body tag`}</label>
                                                </div>
                                                <Textarea name={'content.customHomeScript'} type="text" placeholder="" maxLength="160" className="text-gray-700 border-gray-200 rounded focus:outline-none focus:bg-white" />
                                            </div>
                                        </Fragment>
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

export default CustomScript;
