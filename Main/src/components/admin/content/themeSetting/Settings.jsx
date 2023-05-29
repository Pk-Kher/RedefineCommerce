import React, { useState, useCallback, useEffect } from "react";
import NestedSettingAttributes from "./NestedSettingAttributes";
import {
  Formik,
  Form as FormikForm,
} from "formik";
import CMSConfiguration from "services/admin/cmsConfiguration/CMSConfiguration";
import { useDispatch, useSelector } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { useParams } from "react-router-dom";

import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const Settings = ({
  onThemeSubmitHandler,
  AttributeData,
  onNestedAttributeClickHandler,
}) => {
  const permission = useSelector(store => store.permission);
  const [initialValues, setInitialValues] = useState({});
  const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);
  const CompanyId = useSelector((store) => store?.CompanyConfiguration.id);
  const { storeid } = useParams();
  const dispatch = useDispatch();
  const [id, setId] = useState(0);

  const getMainThemeConfigData = useCallback(() => {
    CMSConfiguration.getConfiguration(storeid, "main_theme_config")
      .then((res) => {
        setInitialValues(JSON.parse(res.data.data.config_value));

        setId(res.data.data.id);
      })
      .catch((error) => { });
  }, []);

  const updateMainThemeConfigData = useCallback((data) => {

    CMSConfiguration.getConfiguration(storeid, "main_theme_config")
      .then((res) => {
        setId(res.data.data.id);

        var jsonData = JSON.stringify(data);
        let headerConfigObj = {
          id: id,
          store_id: storeid,
          config_name: "main_theme_config",
          config_value: jsonData,
          status: "Y",
        };
        CMSConfiguration.updateConfiguration(headerConfigObj)
          .then((res) => {
            console.log(res.data, "Updated Successfully.");
          })
          .catch(() => { });
      })
      .catch((error) => { });



  }, [id, storeid]);

  const updateThemeVariableFile = useCallback(
    (data) => {
      const filePath = `${CompanyId}/store/${storeid}/css/${storeid}.css`;
      // const filePath = `${CompanyId}/store/22/css/22.css`;
      // const filePath = `${CompanyId}/store/4/css/4.css`;
      // const filePath = `${CompanyId}/store/5/css/5.css`;
      // const filePath = `${CompanyId}/store/23/css/23.css`;
      dispatch(setAddLoading(true))

      CMSConfiguration.setThemeConfigVariableFile({
        storeId: storeid.toString(),
        filename: filePath,
        content: data,
      })
        .then((res) => {
          dispatch(
            setAlertMessage({
              type: "success",
              message: "Theme updated successfully.",
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

  const handleAttribute = (fields, resetForm) => {
    let FinalOutput = ":root{";
    Object.keys(fields).map((key) => {
      console.log(key, ":", fields[key]);
      FinalOutput += key + ":" + fields[key] + ";";
    });
    FinalOutput += "}";
    updateMainThemeConfigData(fields);
    updateThemeVariableFile(FinalOutput);
  };

  useEffect(() => {
    getMainThemeConfigData();
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={handleAttribute}
      >
        {({ setFieldValue, errors, values, isSubmitting, touched }) => {
          return (
            <FormikForm>
              <NestedSettingAttributes
                AttributeData={AttributeData}
                onNestedAttributeClickHandler={onNestedAttributeClickHandler}
                setFieldValue={setFieldValue}
              />
              {(permission?.isEdit || permission?.isDelete) && <div className="p-3">
                <button
                  className={`btn border-indigo-300 hover:border-indigo-400 text-indigo-500 w-full ${GlobalLoading
                    ? "bg-indigo-200 hover:bg-indigo-200"
                    : "cursor-pointer"
                    }`}
                  type="submit"
                  disabled={Object.keys(values).length <= 0}
                >
                  {GlobalLoading && (
                    <span className="spinner-border spinner-border-sm mr-2"></span>
                  )}
                  Apply Theme
                </button>
              </div>}
            </FormikForm>
          );
        }}
      </Formik>
    </>
  );
};

export default Settings;
