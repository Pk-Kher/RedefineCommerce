import React, { useState, useEffect, useCallback } from "react";
import { Formik, Form as FormikForm } from "formik";
import Messages from "components/common/alerts/messages/Index";
import Textarea from "components/common/formComponent/Textarea";
import CMSConfiguration from "services/admin/cmsConfiguration/CMSConfiguration";
import { useDispatch, useSelector } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { ValidationMsgs } from "global/ValidationMessages";
import { useParams } from "react-router-dom";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const CustomCSS = () => {
  const { storeid } = useParams();
  const [initialValues, setInitialValues] = useState({});
  const CompanyId = useSelector((store) => store?.CompanyConfiguration.id);
  const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

  const dispatch = useDispatch();
  const getCustomCssConfig = useCallback(() => {
    CMSConfiguration.getConfiguration(storeid, "custom_css_config")
      .then((res) => {
        setInitialValues(JSON.parse(res.data.data.config_value));
      })
      .catch((error) => { });
  }, []);

  const updateConstomCssConfig = useCallback((data) => {
    var jsonData = JSON.stringify(data);
    let headerConfigObj = {
      store_id: storeid,
      config_name: "custom_css_config",
      config_value: jsonData,
      status: "Y",
    };
    CMSConfiguration.updateConfiguration(headerConfigObj)
      .then((res) => { })
      .catch(() => { });
  }, [storeid]);

  const updateCustomCssThemeFile = useCallback(
    (data) => {
      dispatch(setAddLoading(true))

      const filePath = `${CompanyId}/store/${storeid}/css/custom-${storeid}`;
      CMSConfiguration.setThemeConfigVariableFile({
        storeId: storeid.toString(),
        filename: filePath,
        content: data,
      })
        .then((res) => {
          dispatch(
            setAlertMessage({
              type: "success",
              message:
                ValidationMsgs.customCssConfigurationAlertMessage.file_upload,
            })
          );
          dispatch(setAddLoading(false))
        })
        .catch((error) => {
          console.log("catch ", error)

          dispatch(
            setAlertMessage({ type: "danger", message: "Something went wrong" })
          );
          dispatch(setAddLoading(false))
        });
    },
    [CompanyId]
  );

  function submitHandler(fields, { resetForm }) {
    updateConstomCssConfig(fields);
    updateCustomCssThemeFile(fields.custom_css_config);
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
        onSubmit={submitHandler}
      >
        {({ errors, setFieldValue, values }) => {
          return (
            <FormikForm>
              <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
                <div className="sm:flex sm:justify-between sm:items-center mb-8">
                  <div className="grow flex justify-between items-center">
                    <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
                      Custom CSS
                    </h1>
                  </div>

                  <div className="flex flex-wrap space-x-2">
                    <button
                      type={`button`}
                      className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
                    >
                      {`Cancel`}
                    </button>
                    <button
                      className={`px-4 py-[5px] btn-sm bg-indigo-500 hover:bg-indigo-600 text-white mr-2 ${GlobalLoading
                        ? "bg-indigo-200 hover:bg-indigo-200"
                        : "cursor-pointer"
                        }`}
                      type="submit"
                    >
                      {GlobalLoading && (
                        <span className="spinner-border spinner-border-sm mr-2"></span>
                      )}
                      Save
                    </button>
                  </div>
                </div>
                <Messages />
                <div className="bg-white shadow-xxl rounded-md mb-8">
                  <div className="w-full bg-white shadow-xxl rounded-md mb-8 pt-4">
                    <div className="false w-full rounded-md mb-8 tab-content text-sm">
                      <div className="p-6 border-b-2 border-slate-200 last:border-b-0">
                        {/* <div className="flex items-center justify-between">
                                            <div className="tracking-wide text-gray-500 text-base font-bold">
                                                Custom CSS
                                            </div>
                                        </div> */}

                        <div className="mt-2">
                          <div className="mb-6 last:mb-0">
                            {/* <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                                    head tag code
                                                </label> */}

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
